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
    try {
      const { username, password } = req.body;
      const employee = await Employee.findOne({ username: username });
  
      if (employee && await bcrypt.compare(password, employee.password)) {
        // Assuming you are using sessions for tracking login status
        req.session.employeeId = employee._id;
        req.session.name = employee.name;
        res.json({ message: "You are logged in", isAuthenticated: true });
      } else {
        res.status(401).json({ message: "Invalid credentials", isAuthenticated: false });
      }
    } catch (error) {
      res.status(500).json({ message: "Error during authentication", error: error.message });
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
