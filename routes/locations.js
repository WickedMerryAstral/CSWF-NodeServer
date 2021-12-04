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
        .populate('locations')
        .then(result => res.json(result.locations))
        .catch(err => res.status(400).json('error: ' + err))
});

router.route('/:locationID').get((req, res) => {
    const locationID = req.params.locationID;

    Location.findOne({ _id: locationID })
        .populate('characters')
        .then((result) => res.json(result))
        .catch(err => res.status(400).json('error: ' + err))
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
            l.save();
            result.locations
                .push(l);
            result.save()
                .then(() => res.json("Location:'" + l.title + "' has been saved, and added to " + result.title + "."));
        })
        .catch(error => res.json("error: " + error));
});

router.route('/:locationID').put((req, res) => {
    const locationID = req.params.locationID;
    const title = req.body.title;
    const description = req.body.description;
    const place = req.body.place;

    Location.findOne({ _id: locationID })
        .then((result) => {
            result.title = title;
            result.description = description;
            result.place = place;
            result.save()
                .then(() => res.json("Location updated succesfully."));
        })
        .catch(error => res.json("error: " + error));
});

router.route('/:locationID').delete((req, res) => {
    const locationID = req.params.locationID;

    Location.findOne({ _id: locationID })
        .deleteOne()
        .then(() => res.json("Location " + locationID + " has been deleted."))
        .catch(err => res.status(400).json('error ' + err));
});

module.exports = router;