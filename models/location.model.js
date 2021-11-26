const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    characters: [{
        type: Schema.Types.ObjectId,
        ref: "Character"
    }]
});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;