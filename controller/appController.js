const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");

// SHOW all appointments
router.get("/", async (req, res) => {
    try {
        const appointments = await Appointment.find({}).populate('patient', 'name');
        // You can add more fields to populate if needed
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
});

  
// ADD a new appointment for a patient
router.post("/", async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.json(newAppointment);
    } catch (error) {
        res.status(400).json({ message: "Error creating appointment", error: error.message });
    }
});

  
// UPDATE an existing appointment
router.put("/:appointmentId", async (req, res) => {
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.appointmentId, req.body, { new: true });
        if (updatedAppointment) {
            res.json(updatedAppointment);
        } else {
            res.status(404).json({ message: "Appointment not found" });
        }
    } catch (error) {
        res.status(400).json({ message: "Error updating appointment", error: error.message });
    }
});

  
// DELETE a specific appointment
router.delete("/:appointmentId", async (req, res) => {
    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(req.params.appointmentId);
        if (deletedAppointment) {
            res.json({ message: "Appointment deleted successfully" });
        } else {
            res.status(404).json({ message: "Appointment not found" });
        }
    } catch (error) {
        res.status(400).json({ message: "Error deleting appointment", error: error.message });
    }
});

    module.exports = router;