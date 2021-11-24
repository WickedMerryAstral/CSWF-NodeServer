const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.all("/api/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    return next();
});

// Add the other routers later.
const userRouter = require('./routes/users');
const storyRouter = require('./routes/stories');

// Add authentication later.
app.use('/api/users', userRouter);
app.use('/api/stories', storyRouter);

const URI = 'mongodb://127.0.0.1/StoryManager';
mongoose.connect(URI);
mongoose.connection.once('open', function () {
    console.log('CONNECTED TO: ' + URI);
}).on('error', function (error) {
    console.log('CONNECTION ERROR: ', error);
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});