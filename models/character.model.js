const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const characterSchema = new Schema({


});

const Character = mongoose.model('Character', characterSchema);
module.exports = Character;