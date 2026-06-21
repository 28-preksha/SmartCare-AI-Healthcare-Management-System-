// Ensure model name matches exactly with your file
const SymptomReport = require('../models/SymptomReport'); 

exports.checkSymptoms = async (req, res) => {
  const { symptoms } = req.body;
  
  if (!symptoms) {
    return res.status(400).json({ error: "Symptoms fields cannot be empty" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY.trim();
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `A patient has described these health symptoms: "${symptoms}". 
    Act as an expert medical assistant. Analyze structural issues and respond strictly in a valid JSON format. 
    Do not include any markdown fences or extra explanations. 
    The JSON structure must be exactly: 
    {
      "condition": "Likely Medical Condition Name",
      "urgency": "Low or Medium or High",
      "suggestion": "Professional medical advice and next actions"
    }`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
    }

    let responseText = data.candidates[0].content.parts[0].text.trim();
    
    // Ultimate clean fallback for JSON strings
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(responseText);

    // Dynamic Auth Check with robust fallback
    const patientId = req.user && req.user._id ? req.user._id : "60d0fe4f5311236168a10001";
    const patientName = req.user && req.user.name ? req.user.name : "Anonymous Patient";

    const newReport = new SymptomReport({
      patientId: patientId, 
      patientName: patientName,
      rawSymptoms: symptoms,
      aiCondition: parsedData.condition,
      urgency: parsedData.urgency || "Medium",
      suggestion: parsedData.suggestion,
      status: 'pending'
    });

    await newReport.save();

    res.json({
      ...parsedData,
      reportId: newReport._id
    });

  } catch (error) {
    console.error("CRITICAL AI PIPELINE ERROR:", error.message);
    res.status(500).json({ 
      error: "AI Engine busy. Real-time diagnostic protocol failed.", 
      details: error.message 
    });
  }
};

exports.getDoctorQueue = async (req, res) => {
  try {
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied. Only doctors can view the queue." });
    }

    const queue = await SymptomReport.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.status(200).json(queue);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch triage queue", details: error.message });
  }
};