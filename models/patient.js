const mongoose = require('../db/connection.js');

const patientSchema = new mongoose.Schema({
    pID: String,
    name: String,
    age: String,
    appointments: [{
      date: Date,
      exam: String,
      status: String,
    }],
    insurance: String,
    phone: String,
    email: String,
    loginAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ptlogin'
      }
});

const Patient = new mongoose.model('Patient', patientSchema);

module.exports = Patient;

