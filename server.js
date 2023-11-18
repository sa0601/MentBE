require('dotenv').config();
const express = require('express');
const app = express();
PORT = process.env.PORT || 4000;
const morgan = require('morgan');
const cors = require('cors');
const patController = require('./controller/patController');
const empController = require('./controller/empController');
const newPtController = require('./controller/newPtController');
const appController = require('./controller/appController');
const session = require('express-session');

//MIDDLEWARE
app.use(cors())
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Set 'secure: true' if using https
  }));

app.use('/patients', patController);
app.use('/employees', empController);
app.use('/newpatients', newPtController);
app.use('/appointments', appController);


app.get ('/', (req, res) => {
    res.send('Hello World')
});


app.listen(PORT, () => console.log("give me the love on port, " + PORT));