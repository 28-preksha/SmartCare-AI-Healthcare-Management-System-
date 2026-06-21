const { GoogleGenAI } = require('@google/generative-ai');

const generateAIAnalysis = async (symptoms) => {
  if (!process.env.GEMINI_API_KEY) {
    return { 
      condition: "Seasonal Flu (Demo Mode)", 
      urgency: "Medium", 
      suggestion: "Please stay hydrated and consult a doctor if fever rises." 
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `A patient has these symptoms: "${symptoms}". Respond strictly in JSON: {"condition": "name", "urgency": "Low/Medium/High", "suggestion": "advice"}`;
  
  const result = await model.generateContent(prompt);
  const cleanJson = result.response.text().trim().replace(/```json|```/g, "");
  return JSON.parse(cleanJson);
};

module.exports = { generateAIAnalysis };