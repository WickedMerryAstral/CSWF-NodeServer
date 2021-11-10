const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minLength: 3,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
    },
    stories: [{
        type: Schema.Types.ObjectId,
        ref: "Story",
    }],
}, {
    timestamps: true
});

userSchema.methods.comparePassword = function (plainTextPassword, hash) {
    return bcrypt.compareSync(plainTextPassword, hash);
};

const User = mongoose.model('User', userSchema);
module.exports = User;