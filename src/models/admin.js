import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import ApiErrors from '../errors/ApiErrors.js';

const adminSchema = new mongoose.Schema({
    lastName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

// DB INDEXING
adminSchema.index({ email: 1, password: 1 });

// STATIC METHODS
adminSchema.statics.findByEmail = async function(email) {
    return this.findOne({ email });
}

adminSchema.statics.login = async function(email, password) {
    const confirmEmail = await this.findByEmail(email);
    if(confirmEmail) {
        const checkPassword = await bcrypt.compare(password, confirmEmail.password);
        if(checkPassword) {
            return confirmEmail;
        }
        throw ApiErrors.notFound('Incorrect password');
    }
    throw ApiErrors.notFound('Email not found');
}

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;