const express = require('express');
const router = express.Router();
// Dono functions ko yahan cleanly destructure karke import karo
const { checkSymptoms, getDoctorQueue } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

// 🧑‍🦽 Patient Route
router.post('/symptom-check', protect, checkSymptoms);

// 🧑‍⚕️ Doctor Queue Route
router.get('/doctor-queue', protect, getDoctorQueue);

module.exports = router;