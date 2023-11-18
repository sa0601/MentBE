const mongoose = require('mongoose');
const Patient = require('./patient');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    exam: String,
    status: String
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
