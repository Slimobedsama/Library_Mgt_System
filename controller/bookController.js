const Book = require('../models/bookModel');

exports.getAll = async(req, res, next)=> {
    try {
        const allBooks = await Book.find({ title: 'asc' });
        return res.status(200).json({ message: 'Success', data: allBooks });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
    }
}