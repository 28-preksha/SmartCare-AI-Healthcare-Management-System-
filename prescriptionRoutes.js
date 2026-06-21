const express = require('express');
const router = express.Router();
const { generatePrescriptionPDF } = require('../controllers/prescriptionController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/download', protect, generatePrescriptionPDF);

module.exports = router;