const express = require("express");
const router = express.Router();
const Patient = require("../models/patient"); // Include the Patient model
const Ptlogin = require("../models/ptLogin"); // Include the Ptlogin model
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
  console.log(req.body);
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
      console.error("Error creating patient:", error);
      res.status(500).json({ error: error.toString() });
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


module.exports = router;
