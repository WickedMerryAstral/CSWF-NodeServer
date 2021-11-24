const router = require('express').Router();
let Story = require('../models/story.model');

// Get all stories
router.route('/').get((req, res) => {
    Story.find()
        .then(stories => res.json(stories))
        .catch(err => res.status(400).json('error: ' + err))
});

// Add a story
router.route('/').post((req, res) => {
    const username = req.user.username;
    const title = req.body.title;
    const description = req.body.description;
    const genre = req.body.genre;

    const s = new Story({ title, description, genre })


    User.findOne({ username: userName })
        .then((result) => {
            s.save();
            result.stories
                .push(s);
            result.save()
                .then(() => res.json("Story " + s.title + " has been saved, and added to " + username + "."));
        })
        .catch(error => res.json("error: " + error));
});


// Update a story
// HTTP PUT
// TODO: Add code

// Remove a story
// HTTP DELETE
// TODO: Add code

module.exports = router;