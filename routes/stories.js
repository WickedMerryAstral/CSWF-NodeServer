const router = require('express').Router();
let Story = require('../models/story.model');

// Get all stories
router.route('/').get((req, res) => {
    Story.find()
        .then(stories => res.json(stories))
        .catch(err => res.status(400).json('error: ' + err))
});

// Add a story
router.route('/add').post((req, res) => {
    const username = req.user.username;
    const title = req.body.title;
    const description = req.body.description;
    const genre = req.body.genre;

    const s = new Story({ title, description, genre })


    User.findOne({ username: userName })
        .then((result) => {
            d.save();
            result.dungeons
                .push(d);
            result.save()
                .then(() => res.json('Dungeon ' + d.title + ' has been saved, and added to ' + userName));
        })
        .catch(error => res.json("error: " + error));
});

// Remove a story
// TODO: Add code


// Update a story
// TODO: Add code