const router = require('express').Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

let User = require('../models/user.model');
let Story = require('../models/story.model');

// Get all stories
// HTTP Get
router.route('/').get((req, res) => {
    Story.find()
        .populate('author')
        .populate('locations')
        .populate('events')
        .then(result => res.json(result))
        .catch(err => res.status(400).json('error: ' + err))
});

// Get specific story
// HTTP Get
router.route('/:storyID').get((req, res) => {
    const storyID = req.params.storyID;

    Story.findOne({ _id: storyID })
        .then((result) => res.json(result))
        .catch(err => res.status(400).json('error: ' + err))
});

// Get story by user
// HTTP Get
router.route('/user/:userID').get((req, res) => {
    const userID = req.user._id;

    User.findOne({ _id: userID })
        .populate('stories')
        .then((result) => res.json(result.stories))
        .catch(err => res.status(400).json('error:' + err))
});

// Add a story to a user, using MongoDB generated ID.
// HTTP Post
router.route('/').post((req, res) => {
    //const userID = req.body.userID;
    console.log(req.user);

    const userID = req.user._id;
    const title = req.body.title;
    const description = req.body.description;

    const s = new Story({ title, description })

    User.findOne({ _id: userID})
        .then((result) => {
            s.author = result;
            s.save();
            result.stories
                .push(s);
            result.save()
                .then(() => res.json("Story:'" + s.title + "' has been saved, and added to " + result.username + "."));
        })
        .catch(error => res.json("error: " + error));
});

// Add a story to a user, using URL parameters, using MongoDB generated ID.
// HTTP Post
router.route('/user/:userID').post((req, res) => {
    const userID = req.params.userID;
    const title = req.body.title;
    const description = req.body.description;

    const s = new Story({ title, description })

    User.findOne({ _id: userID })
        .then((result) => {
            s.author = result;
            s.save();
            result.stories
                .push(s);
            result.save()
                .then(() => res.json("Story:'" + s.title + "' has been saved, and added to " + result.username + "."));
        })
        .catch(error => res.json("error: " + error));
});

// Update a story
// HTTP PUT
router.route('/:storyID').put((req, res) => {
    const storyID = req.params.storyID;
    const title = req.body.title;
    const description = req.body.description;

    Story.findOne({ _id: storyID })
        .then((result) => {
            result.title = title;
            result.description = description;
            result.save()
                .then(() => res.json("Story updated succesfully."));
        })
        .catch(error => res.json("error: " + error));
});

// Remove a story
// HTTP DELETE
router.route('/:storyID').delete((req, res) => {
    const storyID = req.params.storyID;

    Story.findOne({ _id: storyID })
        .deleteOne()
        .then(() => res.json("Story " + storyID + " has been deleted."))
        .catch(err => res.status(400).json('error ' + err));
});

// Get author by story ID.
// HTTP GET
router.route('/story:ID/author').get((req, res) => {
    const storyID = req.params.storyID;

    Story.findOne({ _id: storyID })
        .populate('author')
        .then(result => res.json(result.author))
        .catch(err => res.status(400).json('error: ' + err))
});

module.exports = router;