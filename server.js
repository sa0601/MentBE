require('dotenv').config();
const express = require('express');
const app = express();
PORT = process.env.PORT || 4000;
const morgan = require('morgan');
const cors = require('cors');
const patController = require('./controller/patController');
const empController = require('./controller/empController');
const newPtController = require('./controller/newPtController');

//MIDDLEWARE
app.use(cors())
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/patients', patController);
app.use('/employees', empController);
app.use('/newpatients', newPtController);


app.get ('/', (req, res) => {
    res.send('Hello World')
});


app.listen(PORT, () => console.log("give me the love on port, " + PORT));