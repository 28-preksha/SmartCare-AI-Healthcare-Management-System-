const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicines: { type: String, required: true },
  instructions: { type: String },
  pdfUrl: { type: String } // Cloudinary ya AWS S3 link ke liye
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);