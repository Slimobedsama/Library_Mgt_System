const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    lastName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;