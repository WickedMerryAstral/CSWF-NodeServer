const router = require('express').Router();
const bcrypt = require('bcrypt');

// Model
let User = require('../models/user.model');

// Auth
var passport = require('passport')
const jwt = require('jsonwebtoken');
const key = require('../config/jwt')
const saltRounds = 10;

// Get all users.
// HTTP GET
router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('error: ' + err))
});

// Adding a new user.
// HTTP POST
router.route('/').post((req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    bcrypt.hash(password, saltRounds, function (err, hash) {
        password = hash;
        const newUser = new User({ username, password });
        newUser.save()
            .then(() => res.json('User ' + username + ' has been added!'))
            .catch(err => res.status(400).json('error' + err));
    });
});

// Get a specific user.
// HTTP GET
router.route('/:userID').get((req, res) => {
    const userID = req.params.userID;

    User.findOne({ _id : userID })
        .then((result) => res.json(result))
        .catch(err => res.status(400).json('error ' + err));
});

// Update a user.
// HTTP PUT
router.route('/:userID').put((req, res) => {
    const userID = req.params.userID;
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ _id: userID })
        .then((result) => {
            result.username = username;
            result.password = password;
            result.save()
            res.json("User has been updated!")
        })
        .catch(err => res.status(400).json('error ' + err));
});

// Remove a user.
// HTTP DELETE
router.route('/:userID').delete((req, res) => {
    const userID = req.params.userID;

    User.findOne({ _id: userID })
        .deleteOne()
        .then(() => res.json("User " + userID + " has been deleted."))
        .catch(err => res.status(400).json('error ' + err));
});

// Logging in
// HTTP POST
router.route('/login').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = {
        username,
        password
    }

    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            res.status(400);
            return res.json(info);
        } else {
            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.status(400);
                    console.log(err);
                } else {
                    // Sending back token, username, and userid for front-end functionality.
                    jwt.sign({ username: user }, key.getKey(), { expiresIn: "1d" }, function (err, token) {
                        res.status(200);
                        return res.json({
                            'token': token,
                            'username': user.username,
                            'userid' : user._id
                        });
                    })
                }
            });
        }
    })(req, res);
});

module.exports = router;