const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema({


});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;