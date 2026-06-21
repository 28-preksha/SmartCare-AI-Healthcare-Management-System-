const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patientName: { type: String, required: true },
  location: { type: String, required: true }, // Coordinates ya city name
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Emergency', EmergencySchema);