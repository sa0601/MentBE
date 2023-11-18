const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");

//SHOW all appointments for a patient
router.get("/appointments", async (req, res) => {
    try {
        const appointments = await Appointment.find({}).populate('patient', 'name'); // Populate the 'patient' field, retrieving only the 'name'
        // Transform appointments to include patient names
        const transformedAppointments = appointments.map(app => ({
            ...app.toObject(),
            patientName: app.patient.name // Include patient name in each appointment
        }));
        res.json(transformedAppointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
});

// GET a single appointment by ID
router.get("/:appointmentId", async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId)
                                           .populate('patient'); // Populate the entire patient object
        if (appointment) {
            res.json({
                ...appointment.toObject(),
                patient: appointment.patient // Include the full patient object in the response
            });
        } else {
            res.status(404).json({ message: "Appointment not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointment", error: error.message });
    }
});


  
// ADD a new appointment for a patient
router.post("/", async (req, res) => {
    try {
        const newAppointment = new Appointment({
            ...req.body, // Spread the rest of the fields
            startTime: new Date(req.body.startTime), // Ensure startTime is a Date object
            endTime: new Date(req.body.endTime), // Ensure endTime is a Date object
        });
        await newAppointment.save();
        res.json(newAppointment);
    } catch (error) {
        res.status(400).json({ message: "Error creating appointment", error: error.message });
    }
});

  
// UPDATE an existing appointment
router.put("/:appointmentId", async (req, res) => {
    try {
        const updateData = {
            ...req.body,
            startTime: req.body.startTime ? new Date(req.body.startTime) : undefined,
            endTime: req.body.endTime ? new Date(req.body.endTime) : undefined,
        };
        const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.appointmentId, updateData, { new: true });
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