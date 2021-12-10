const router = require('express').Router();
let Story = require('../models/story.model');
let Event = require('../models/event.model');

// Get all Events
router.route('/').get((req, res) => {
    Event.find()
        .then(result => res.json(result))
        .catch(err => res.status(400).json('error: ' + err))
});

// Get Events by story ID
router.route('/story/:storyID').get((req, res) => {
    const storyID = req.params.storyID;

    Story.findOne({ _id: storyID })
        .then(result => {
            if (result.author._id.equals(req.user._id)) {
                Story.findOne({ _id: storyID })
                    .populate('events')
                    .then(result => res.json(result.events))
                    .catch(err => res.status(400).json('error: ' + err))
            }
            else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(err => res.status(400).json('error: ' + err));
});

// Getting a specific event
router.route('/story/:storyID/:eventID').get((req, res) => {
    const storyID = req.params.storyID;
    const eventID = req.params.eventID;

    Event.findOne({ _id: eventID })
        .populate('characters')
        .then((result) => res.json(result))
        .catch(err => res.status(400).json('error: ' + err))
});

// Adding an event to a story, by its ID.
router.route('/story/:storyID').post((req, res) => {
    const storyID = req.params.storyID;

    // Location details
    const title = req.body.title;
    const description = req.body.description;
    const date = req.body.date;

    const e = new Event({ title, description, date })

    Story.findOne({ _id: storyID })
        .then(result => {
            if (result.author._id.equals(req.user._id)) {
                Story.findOne({ _id: storyID })
                    .then((result) => {
                        e.save();
                        result.events
                            .push(e);
                        result.save()
                            .then(() => res.json("Event:'" + e.title + "' has been saved, and added to " + result.title + "."));
                    })
                    .catch(error => res.json("error: " + error));
            }
            else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(err => res.status(400).json('error: ' + err));
});

// Update event
router.route('/story/:storyID/:eventID').put((req, res) => {
    const storyID = req.params.storyID;
    const eventID = req.params.eventID;
    const title = req.body.title;
    const description = req.body.description;
    const date = req.body.date;

    Story.findOne({ _id: storyID })
        .then(result => {
            if (result.author._id.equals(req.user._id)) {
                Event.findOne({ _id: eventID })
                    .then((result) => {
                        result.title = title;
                        result.description = description;
                        result.date = date;
                        result.save()
                            .then(() => res.json("Event updated succesfully."));
                    })
                    .catch(error => res.json("error: " + error));
            }
            else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(err => res.status(400).json('error: ' + err));
});

// Delete event
router.route('/story/:storyID/:eventID').delete((req, res) => {
    const storyID = req.params.storyID;
    const eventID = req.params.eventID;

    Story.findOne({ _id: storyID })
        .then(result => {
            if (result.author._id.equals(req.user._id)) {
                Event.findOne({ _id: eventID })
                    .deleteOne()
                    .then(() => res.json("Event " + eventID + " has been deleted."))
                    .catch(err => res.status(400).json('error ' + err));
            }
            else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(err => res.status(400).json('error: ' + err));
});

module.exports = router;