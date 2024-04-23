const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    lastName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User