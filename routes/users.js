const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let User = require('../models/user.model');
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
router.route('/:id').get((req, res) => {

});

// Update a user.
// HTTP PUT
router.route('/:id').put((req, res) => {

});

// Remove a user.
// HTTP DELETE
router.route('/:id').delete((req, res) => {

});

// Logging in, returning JWT token if succesful.
router.route('/login').post((req, res, next) => {


});

module.exports = router;