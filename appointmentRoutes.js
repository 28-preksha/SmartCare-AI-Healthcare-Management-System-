const express = require('express');
const router = express.Router();
const { createAppointment, getAppointmentsForUser } = require('../controllers/appointmentController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// Secure Endpoints
router.post('/', protect, authorizeRoles('patient'), createAppointment);
router.get('/', protect, getAppointmentsForUser);

module.exports = router;