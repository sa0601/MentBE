const express = require("express");
const router = express.Router();
const Patient = require("../models/patient"); // Include the Patient model
const Ptlogin = require("../models/ptLogin"); // Include the Ptlogin model for login creation
const bcrypt = require("bcrypt");

// SHOW all patients
router.get("/", async (req, res) => {
  try {
    res.json(await Patient.find({}));
  } catch (error) {
    res.status(400).json(error);
  }
});

// SHOW one patient by MongoDB _id
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: "Patient not found" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

// CREATE a new patient
router.post("/register", async (req, res) => {
    try {
      // Extract patient details and login details from req.body
      const patientData = req.body.patient;
      const loginData = req.body.login;
  
      // Hash the password for login
      const hashedPassword = await bcrypt.hash(loginData.password, 10);
  
      // Create the patient's login account
      const newPtLogin = new Ptlogin({
        ...loginData,
        password: hashedPassword,
      });
      const savedLogin = await newPtLogin.save();
  
      // Create the patient record with a reference to the login account
      const newPatient = new Patient({
        ...patientData,
        loginAccount: savedLogin._id, // Link the Ptlogin record
      });
      const savedPatient = await newPatient.save();
  
      res.json(savedPatient);
    } catch (error) {
      res.status(400).json(error);
    }
  });

// UPDATE a Patient
router.put("/:id", async (req, res) => {
  try {
    let updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPatient);
  } catch (error) {
    res.status(400).json(error);
  }
});

// DELETE a Patient
router.delete("/:id", async (req, res) => {
  try {
    let deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    res.json(deletedPatient);
  } catch (error) {
    res.status(400).json(error);
  }
});

// ADD a new appointment for a patient
router.post("/:id/appointments", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (patient) {
      patient.appointments.push(req.body); // Assuming req.body is the appointment object
      await patient.save();
      res.json(patient);
    } else {
      res.status(404).json({ message: "Patient not found" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

// UPDATE an existing appointment for a patient
router.put("/:id/appointments/:appointmentId", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (patient) {
      const appointmentIndex = patient.appointments.findIndex(appointment => appointment._id.toString() === req.params.appointmentId);
      if (appointmentIndex !== -1) {
        patient.appointments[appointmentIndex] = { ...patient.appointments[appointmentIndex], ...req.body };
        await patient.save();
        res.json(patient);
      } else {
        res.status(404).json({ message: "Appointment not found" });
      }
    } else {
      res.status(404).json({ message: "Patient not found" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

// DELETE a specific appointment for a patient
router.delete("/:id/appointments/:appointmentId", async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id);
      if (patient) {
        // Find the index of the appointment to be deleted
        const appointmentIndex = patient.appointments.findIndex(appointment => appointment._id.toString() === req.params.appointmentId);
  
        // If found, remove the appointment
        if (appointmentIndex !== -1) {
          patient.appointments.splice(appointmentIndex, 1);
          await patient.save();
          res.json({ message: "Appointment deleted successfully", patient });
        } else {
          res.status(404).json({ message: "Appointment not found" });
        }
      } else {
        res.status(404).json({ message: "Patient not found" });
      }
    } catch (error) {
      res.status(400).json(error);
    }
  });

module.exports = router;
