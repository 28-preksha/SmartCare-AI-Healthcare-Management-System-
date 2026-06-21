const PDFDocument = require('pdfkit');
const Appointment = require('../models/Appointment');
// 🔥 MAJOR PROJECT UPDATE: SymptomReport model ko import kiya status update karne ke liye
const SymptomReport = require('../models/SymptomReport');

exports.generatePrescriptionPDF = async (req, res) => {
  try {
    const { appointmentId, medicines, instructions } = req.body;

    // Create a pipeline buffer for PDF download streams
    const doc = new PDFDocument({ margin: 50 });
    
    // HTTP Headers setup for browser direct download stream
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=prescription_${appointmentId}.pdf`);
    
    doc.pipe(res);

    // --- PDF Layout Structure ---
    doc.fillColor('#007bff').fontSize(24).text('SMARTCARE AI ECOSYSTEM', { align: 'center' });
    doc.fillColor('#333333').fontSize(10).text('Digital Health Passport & Prescription', { align: 'center' });
    doc.moveDown(2);

    doc.strokeColor('#aaaaaa').moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(2);

    doc.fontSize(14).fillColor('#111111').text(`Appointment Identity Reference: ${appointmentId}`);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown(2);

    doc.fontSize(16).fillColor('#007bff').text('Rx (Medicines Directed):');
    doc.fontSize(12).fillColor('#333333').text(medicines || "No special dosage provided.");
    doc.moveDown(1.5);

    doc.fontSize(16).fillColor('#007bff').text('Special Clinical Instructions:');
    doc.fontSize(12).fillColor('#333333').text(instructions || "Rest and schedule normal follow-up.");
    
    doc.moveDown(4);
    doc.strokeColor('#dddddd').moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);
    doc.fontSize(10).fillColor('#999999').text('This is an automated encrypted digital document. Signature not required.', { align: 'center' });

    // 🔥 MAJOR PROJECT UPDATE: Status ko 'treated' update karo taaki doctor queue update ho sake
    if (appointmentId) {
      await SymptomReport.findByIdAndUpdate(appointmentId, { status: 'treated' });
    }

    doc.end(); // File transmission finish
  } catch (error) {
    console.error("Prescription Error Detailed:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "PDF structural engine failed", details: error.message });
    }
  }
};