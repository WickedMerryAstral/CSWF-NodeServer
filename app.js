const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/passport.js');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(`mongodb://localhost/storymanager`);
const connection = mongoose.connection;

connection.once('open', () => {
    console.log(`MongoDB connection established`)
});

app.use(cors());

app.all("/api/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    return next();
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});