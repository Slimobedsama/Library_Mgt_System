import mongoose from 'mongoose';

const librarianSchema = new mongoose.Schema({
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
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Librarian = mongoose.model('Librarian', librarianSchema);
export default Librarian;