//LOGIN ROUTES FOR A PATIENT -- pTLogin.js
const express = require("express");
const router = express.Router();
const Ptlogin = require("../models/ptLogin"); // Adjusted to Ptlogin model
const bcrypt = require("bcrypt");

// SHOW all patient logins
router.get("/", async (req, res) => {
  try {
    res.json(await Ptlogin.find({}));
  } catch (error) {
    res.status(400).json(error);
  }
});

// SHOW one patient login by id
router.get("/:id", async (req, res) => {
  try {
    res.json(await Ptlogin.findById(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

// SIGN UP a new patient login -- only needed if you're having patients independenly make their own logins
// router.post("/signup", async (req, res) => {
//   try {
//     let plainTextPassword = req.body.password;
//     let hashedPassword = await bcrypt.hash(plainTextPassword, 10);
//     req.body.password = hashedPassword;
//     let newPtlogin = await Ptlogin.create(req.body);
//     res.json(newPtlogin);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

// In your patient registration route - already being handled in newPtController.js
// router.post("/register", async (req, res) => {
//     try {
//       const newPtLogin = new Ptlogin({
//         // set username, password, etc.
//       });
//       const savedLogin = await newPtLogin.save();
  
//       const newPatient = new Patient({
//         // set patient details...
//         loginAccount: savedLogin._id,
//       });
//       const savedPatient = await newPatient.save();
  
//       res.json(savedPatient);
//     } catch (error) {
//       res.status(400).json(error);
//     }
//   });

// LOGIN a patient
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const patientLogin = await Ptlogin.findOne({ username: username });

        if (patientLogin && await bcrypt.compare(password, patientLogin.password)) {
            // Assuming you are using sessions for tracking login status
            req.session.patientId = patientLogin._id;
            req.session.name = patientLogin.name;
            res.json({ message: "You are logged in", isAuthenticated: true });
        } else {
            res.status(401).json({ message: "Invalid credentials", isAuthenticated: false });
        }
    } catch (error) {
        res.status(500).json({ message: "Error during authentication", error: error.message });
    }
});


// UPDATE a Patient Login
router.put("/:id", async (req, res) => {
    try {
      const { password, ...updateData } = req.body;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
      let updatedPtlogin = await Ptlogin.findByIdAndUpdate(req.params.id, updateData, { new: true });
      res.json(updatedPtlogin);
    } catch (error) {
      res.status(400).json(error);
    }
  });

// DELETE a Patient Login
router.delete("/:id", async (req, res) => {
  try {
    let deletedPtlogin = await Ptlogin.findByIdAndDelete(req.params.id);
    res.json(deletedPtlogin);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
