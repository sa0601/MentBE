const express = require("express");
const router = express.Router();
const Employee = require("../models/employee"); 
const bcrypt = require("bcrypt");

// SHOW all employees
router.get("/", async (req, res) => {
  try {
    res.json(await Employee.find({}));
  } catch (error) {
    res.status(400).json(error);
  }
});

// SHOW one employee by id
router.get("/:id", async (req, res) => {
  try {
    res.json(await Employee.findById(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

// SIGN UP a new employee
router.post("/signup", async (req, res) => {
  console.log(req.body);
  if (req.body.username && req.body.password) {
    let plainTextPassword = req.body.password;
    bcrypt.hash(plainTextPassword, 10, async (err, hashedPassword) => {
      req.body.password = hashedPassword;
      let newEmployee = await Employee.create(req.body);
      res.json(newEmployee);
    });
  }
});

// LOGIN an employee
router.post("/login", async (req, res) => {
  console.log(req.body);
  let employeeToLogin = await Employee.findOne({ username: req.body.username });
  if (employeeToLogin) {
    bcrypt.compare(req.body.password, employeeToLogin.password, (err, result) => {
      if (result) {
        // Assuming you are using sessions for tracking login status
        req.session.employeeId = employeeToLogin._id;
        req.session.name = employeeToLogin.name;
        res.json("You are logged in");
      } else {
        res.json("Wrong password");
      }
    });
  }
});

// UPDATE an Employee
router.put("/:id", async (req, res) => {
  console.log(req.body);
  try {
    res.json(
      await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json(error);
  }
});

// DELETE an Employee
router.delete("/:id", async (req, res) => {
  try {
    res.json(await Employee.findByIdAndDelete(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
