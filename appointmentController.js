const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.body;
    // req.user check protect middleware se aata hai
    const patientId = req.user.id; 

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      timeSlot,
      status: 'Pending'
    });

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAppointmentsForUser = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'patient') query.patientId = req.user.id;
    if (req.user.role === 'doctor') query.doctorId = req.user.id;

    // Relational pipeline checks via .populate()
    const data = await Appointment.find(query)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};