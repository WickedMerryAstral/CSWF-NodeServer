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

router.route('/:characterID').get((req, res) => {
    const characterID = req.params.characterID;
    Character.findOne({ _id: characterID })
        .then(result => res.json(result))
        .catch(err => res.status(400).json('error: ' + err))
});


// Add character to event
router.route('/event/:eventID').post((req, res) => {
    const eventID = req.params.eventID;

    const name = req.body.name;
    const pronouns = req.body.pronouns;
    const description = req.body.description;
    const birthdate = req.body.birthdate;

    const c = new Character({ name, pronouns, description, birthdate });

    Event.findOne({ _id: eventID })
        .then((result) => {
            c.save();
            result.characters
                .push(c);
            result.save()
                .then(() => res.json("Character:'" + c.name + "' has been saved, and added to " + result.title + "."));
        })
        .catch(error => res.json("error: " + error));
});

// Add character to location
router.route('/location/:locationID').post((req, res) => {
    const locationID = req.params.locationID;

    const name = req.body.name;
    const pronouns = req.body.pronouns;
    const description = req.body.description;
    const birthdate = req.body.birthdate;

    const c = new Character({ name, pronouns, description, birthdate });

    Location.findOne({ _id: locationID })
        .then((result) => {
            c.save();
            result.characters
                .push(c);
            result.save()
                .then(() => res.json("Character:'" + c.name + "' has been saved, and added to " + result.title + "."));
        })
        .catch(error => res.json("error: " + error));
});

// Get characters by event
router.route('/event/:eventID').get((req, res) => {
    const eventID = req.params.eventID;

    Event.findOne({ _id: eventID })
        .populate('characters')
        .then((result) => res.json(result.characters))
        .catch(err => res.status(400).json('error:' + err))
});

// Get characters by location
router.route('/location/:locationID').get((req, res) => {
    const locationID = req.params.locationID;

    Location.findOne({ _id: locationID })
        .populate('characters')
        .then((result) => res.json(result.characters))
        .catch(err => res.status(400).json('error:' + err))
});

// Update character
router.route('/:characterID').put((req, res) => {
    const characterID = req.params.characterID;

    const name = req.body.name;
    const pronouns = req.body.pronouns;
    const description = req.body.description;
    const birthdate = req.body.birthdate;

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
});

// Delete character
router.route('/:characterID').delete((req, res) => {
    const characterID = req.params.characterID;

    Character.findOne({ _id: characterID })
        .deleteOne()
        .then(() => res.json("Character " + characterID + " has been deleted."))
        .catch(err => res.status(400).json('error ' + err));
});

module.exports = router;