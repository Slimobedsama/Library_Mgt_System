const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    author: { type: String, required: true },
    title: { type: String, required: true },
    publishedYear: { type: Date, required },
    quantity: { type: Number, required: true, default: 0 },
    ISBN: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

const  Book = mongoose.model('Book', bookSchema);
module.exports = Book;