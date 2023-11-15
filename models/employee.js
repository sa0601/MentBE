//bring in mongoose thats connected to our db
const mongoose = require('../db/connection.js');

const employeeSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
});


const Employee = new mongoose.model('Employee', employeeSchema);

module.exports = Employee;