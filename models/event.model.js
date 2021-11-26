const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true
    },
    characters: [{
        type: Schema.Types.ObjectId,
        ref: "Character"
    }]
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;