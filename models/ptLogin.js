//bring in mongoose thats connected to our db
const mongoose = require('../db/connection.js');

const ptLogSchema = new mongoose.Schema({
    pID: String,
    name: String,
    username: String,
    password: String,
});


const Ptlogin = new mongoose.model('Ptlogin', ptLogSchema);

module.exports = Ptlogin;