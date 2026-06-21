const mongoose = require('mongoose');

const SymptomReportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true },
  rawSymptoms: { type: String, required: true },
  aiCondition: { type: String, required: true }, // Gemini se aane wali condition
  urgency: { type: String, enum: ['Low', 'Medium', 'High'], required: true }, // Gemini ki urgency
  suggestion: { type: String }, // Gemini ke clinical actions
  status: { type: String, enum: ['pending', 'treated'], default: 'pending' }, // Doctor queue handle karne ke liye
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SymptomReport', SymptomReportSchema);