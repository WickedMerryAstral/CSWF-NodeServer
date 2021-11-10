const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true,
    },

    description: {
        type: String,
        required: false,
    },

    genre: {
        type: String,
        required: false,
    },
});

const Story = mongoose.model('Story', StorySchema);
module.exports = Story;