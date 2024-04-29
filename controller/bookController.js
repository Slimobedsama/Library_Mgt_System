const Book = require('../models/bookModel');

exports.getAll = async(req, res, next)=> {
    try {
        const allBooks = await Book.find().sort({ title: 'asc' });
        return res.status(200).json({ message: 'Success', data: allBooks });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
    }
}

exports.create = async(req, res, next)=> {
    const { author, title, publishedYear, quantity, ISBN, isAvailable } = req.body;
    try {
        const newBook = await Book.create(req.body);
        return res.status(201).json({ message: 'Success', data: newBook });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
}