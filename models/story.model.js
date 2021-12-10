const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({

    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: false,
    },

    events: [{
        type: Schema.Types.ObjectId,
        ref: "Event"
    }],

    locations: [{
        type: Schema.Types.ObjectId,
        ref: "Location"
    }],
    imgURL: {
        type: String,
        required: false,
    }
});

StorySchema.methods.isAuthor = function (userID) {
    return userID === this.author._id;
}
const Story = mongoose.model('Story', StorySchema);
module.exports = Story;