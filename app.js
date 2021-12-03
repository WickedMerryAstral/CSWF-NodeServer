const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
var fs = require('fs');
var path = require('path');
var multer = require('multer');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });

require('dotenv').config();
require('./config/passport.js')

const app = express();
const port = process.env.PORT || 5000;

app.use(passport.initialize());
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use(express.json());
app.use(cors());

// Image support
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");


app.all("/api/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    return next();
});

// Add the other routers later.
const userRouter = require('./routes/users');
const storyRouter = require('./routes/stories');
const locationRouter = require('./routes/locations');
const eventRouter = require('./routes/events');
const characterRouter = require('./routes/characters');
const imageRouter = require('./routes/images');

// Add authentication later.
app.use('/api/users', userRouter);
app.use('/api/stories', storyRouter);
app.use('/api/locations', locationRouter);
app.use('/api/events', eventRouter);
app.use('/api/characters', characterRouter);
app.use('/api/images', imageRouter);

// TODO: DYNAMIC URL SWITCHING
// MONGODB 4.0 LOCAL
// const URI = "mongodb://127.0.0.1/StoryManagerLocal"
// MONGO ATLAS
const URI = 'mongodb+srv://CodeShark:Nibbles%40Bytes@storymanagercluster.k6p2h.mongodb.net/StoryManager?retryWrites=true&w=majority';

mongoose.connect(URI);
mongoose.connection.once('open', function () {
    console.log('CONNECTED TO: ' + URI);
}).on('error', function (error) {
    console.log('CONNECTION ERROR: ', error);
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});