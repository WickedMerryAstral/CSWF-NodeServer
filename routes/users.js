const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
let User = require('../models/user.model');
const key = require('../config/jwt')
const saltRounds = 10;

// Get all users
// HTTP GET
router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('error: ' + err))
});

// Adding a new user
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

// Update a user
// HTTP PUT

// Remove a user
// HTTP DELETE

// Logging in, returning JWT token if correct
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
                    jwt.sign({ username: user }, key.getKey(), { expiresIn: "1d" }, function (err, token) {
                        res.status(200);
                        return res.json({ token });
                    })
                }
            });
        }
    })(req, res);
});

module.exports = router;