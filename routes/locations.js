const router = require('express').Router();
let Story = require('../models/story.model');
let Location = require('../models/location.model');

router.route('/').get((req, res) => {
    Location.find()
        .then(result => res.json(result))
        .catch(err => res.status(400).json('error: ' + err))
});

// Get locations by story ID
router.route('/story/:storyID').get((req, res) => {
    const storyID = req.params.storyID;

    Story.findOne({ _id: storyID })
        .then(result => {
            if (result.author._id.equals(req.user._id)) {
                Story.findOne({ _id: storyID })
                    .populate('locations')
                    .then(result => res.json(result.locations))
                    .catch(err => res.status(400).json('error: ' + err))
            }
            else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(err => res.status(400).json('error: ' + err));
});

router.route('/story/:storyID/:locationID').get((req, res) => {
    const storyID = req.params.storyID;
    const locationID = req.params.locationID;

    Story.findOne({ _id: storyID })
        .then(result => {
            if (result.author._id.equals(req.user._id)) {
                Location.findOne({ _id: locationID })
                    .populate('characters')
                    .then((result) => res.json(result))
                    .catch(err => res.status(400).json('error: ' + err))
            }
            else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(err => res.status(400).json('error: ' + err));
});

// Adding a location to a story, by its ID.
router.route('/story/:storyID').post((req, res) => {
    const storyID = req.params.storyID;

    // Location details
    const title = req.body.title;
    const description = req.body.description;
    const place = req.body.place;

    const l = new Location({ title, description, place})

    Story.findOne({ _id: storyID })
        .then((result) => {
            if (result.author.equals(req.user._id)) {
                l.save();
                result.locations
                    .push(l);
                result.save()
                    .then(() => res.json("Location:'" + l.title + "' has been saved, and added to " + result.title + "."));
            } else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(error => res.json("error: " + error));
});

router.route('/story/:storyID/:locationID').put((req, res) => {
    const storyID = req.params.storyID;
    const locationID = req.params.locationID;
    const title = req.body.title;
    const description = req.body.description;
    const place = req.body.place;

    Story.findOne({ _id: storyID })
        .then(result => {
            if (result.author._id.equals(req.user._id)) {
                Location.findOne({ _id: locationID })
                    .then((result) => {
                        result.title = title;
                        result.description = description;
                        result.place = place;
                        result.save()
                            .then(() => res.json("Location updated succesfully."));
                    })
                    .catch(error => res.json("error: " + error));
            }
            else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(err => res.status(400).json('error: ' + err));
});

router.route('/story/:story:D/:locationID').delete((req, res) => {
    const storyID = req.params.storyID;
    const locationID = req.params.locationID;

    Story.findOne({ _id: storyID })
        .then(result => {
            if (result.author._id.equals(req.user._id)) {
                Location.findOne({ _id: locationID })
                    .deleteOne()
                    .then(() => res.json("Location " + locationID + " has been deleted."))
                    .catch(err => res.status(400).json('error ' + err));
            }
            else {
                res.status(500).json('You are not authorized to access this file.');
            }
        })
        .catch(err => res.status(400).json('error: ' + err));
});

module.exports = router;