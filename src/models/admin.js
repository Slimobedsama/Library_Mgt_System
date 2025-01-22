import mongoose from 'mongoose';

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

adminSchema.index({ email: 1, password: 1 });

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;