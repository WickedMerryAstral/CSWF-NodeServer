const router = require('express').Router();
let User = require('../models/user.model');
let Event = require('../models/event.model');
let Location = require('../models/location.model');
let Story = require('../models/story.model');
let Character = require('../models/character.model');

// Get all characters
router.route('/').get((req, res) => {
    Character.find()
        .then(result => res.json(result))
        .catch(err => res.status(400).json('error: ' + err))
});

router.route('/story/:storyID/:characterID').get((req, res) => {
    const storyID = req.params.storyID;

    Story.findOne({ _id: storyID })
        .then(result => {
            if (result.author._id.equals(req.user._id) ) {
                const characterID = req.params.characterID;
                Character.findOne({ _id: characterID })
                    .then(result => res.json(result))
                    .catch(err => res.status(400).json('error: ' + err))
            }
            else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(err => res.status(400).json('error: ' + err));
});

// Add character to event
router.route('/story/:storyID/event/:eventID').post((req, res) => {
    const storyID = req.params.storyID;
    const eventID = req.params.eventID;
    const name = req.body.name;
    const pronouns = req.body.pronouns;
    const description = req.body.description;
    const birthdate = req.body.birthdate;

    const c = new Character({ name, pronouns, description, birthdate });

    Story.findOne({ _id: storyID })
        .then(result => {
            if (result.author._id.equals(req.user._id)) {
                Event.findOne({ _id: eventID })
                    .then((result) => {
                        c.save();
                        result.characters
                            .push(c);
                        result.save()
                            .then(() => res.json("Character:'" + c.name + "' has been saved, and added to " + result.title + "."));
                    })
                    .catch(error => res.json("error: " + error));
            }
            else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(err => res.status(400).json('error: ' + err));
});

// Add character to location
router.route('/story/:storyID/location/:locationID').post((req, res) => {
    const storyID = req.params.storyID;
    const locationID = req.params.locationID;
    const name = req.body.name;
    const pronouns = req.body.pronouns;
    const description = req.body.description;
    const birthdate = req.body.birthdate;

    const c = new Character({ name, pronouns, description, birthdate });

    Story.findOne({ _id: storyID })
        .then(result => {
            if (result.author._id.equals(req.user._id)) {
                Location.findOne({ _id: locationID })
                    .then((result) => {
                        c.save();
                        result.characters
                            .push(c);
                        result.save()
                            .then(() => res.json("Character:'" + c.name + "' has been saved, and added to " + result.title + "."));
                    })
                    .catch(error => res.json("error: " + error));
            }
            else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(err => res.status(400).json('error: ' + err));
});

// Get characters by event
router.route('/story/:storyID/event/:eventID').get((req, res) => {
    const storyID = req.params.storyID;
    const eventID = req.params.eventID;

    Story.findOne({ _id: storyID })
        .then(result => {
            if (result.author._id.equals(req.user._id)) {
                Event.findOne({ _id: eventID })
                    .populate('characters')
                    .then((result) => res.json(result.characters))
                    .catch(err => res.status(400).json('error:' + err))
            }
            else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(err => res.status(400).json('error: ' + err));
});

// Get characters by location
router.route('/story/:storyID/location/:locationID').get((req, res) => {
    const locationID = req.params.locationID;
    const storyID = req.params.storyID;

    Story.findOne({ _id: storyID })
        .then(result => {
            if (result.author._id.equals(req.user._id)) {
                Location.findOne({ _id: locationID })
                    .populate('characters')
                    .then((result) => res.json(result.characters))
                    .catch(err => res.status(400).json('error:' + err))
            }
            else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(err => res.status(400).json('error: ' + err));
});

// Update character
router.route('/story/:storyID/:characterID').put((req, res) => {
    const storyID = req.params.storyID;
    const characterID = req.params.characterID;
    const name = req.body.name;
    const pronouns = req.body.pronouns;
    const description = req.body.description;
    const birthdate = req.body.birthdate;

    Story.findOne({ _id: storyID })
        .then(result => {
            if (result.author._id.equals(req.user._id)) {
                Character.findOne({ _id: characterID })
                    .then((result) => {
                        result.name = name;
                        result.pronouns = pronouns;
                        result.description = description;
                        result.birthdate = birthdate;
                        result.save()
                            .then(() => res.json("Character updated succesfully."));
                    })
                    .catch(error => res.json("error: " + error));
            }
            else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(err => res.status(400).json('error: ' + err));
});

// Delete character
router.route('/story/:storyID/:characterID').delete((req, res) => {
    const storyID = req.params.storyID;
    const characterID = req.params.characterID;

    Story.findOne({ _id: storyID })
        .then(result => {
            if (result.author._id.equals(req.user._id)) {
                Character.findOne({ _id: characterID })
                    .deleteOne()
                    .then(() => res.json("Character " + characterID + " has been deleted."))
                    .catch(err => res.status(400).json('error ' + err));
            }
            else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(err => res.status(400).json('error: ' + err));
});

module.exports = router;