const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const characterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    pronouns: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    birthdate: {
        type: Date,
        required: true
    }
});

const Character = mongoose.model('Character', characterSchema);
module.exports = Character;