import Book from '../models/bookModel.js';

export const getAllBooks = async(req, res, next)=> {
    try {
        const allBooks = await Book.find().sort({ title: 'asc' });
        return res.status(200).json({ message: 'Success', data: allBooks });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
    }
    next();
}

export const getOneBook = async(req, res, next)=> {
    const id = req.params.id;
    try {
        const singleBook = await  Book.findById(id);
        if(singleBook) {
            return res.status(200).json({ message: 'Success', data: singleBook });
        }
        throw new Error(`Book with id ${id} not found.`);
    } catch (err) {
        console.log(err.message);
        res.status(404).json({ error: err.message });
    }
    next();
}

export const createBook= async(req, res, next)=> {
    const { author, title, publishedYear, quantity, ISBN, isAvailable } = req.body;
    try {
        const newBook = await Book.create(req.body);
        return res.status(201).json({ message: 'Success', data: newBook });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
    next();
}

export const removeBook = async(req, res, next)=> {
    const id = req.params.id;
    try {
        const removeBook = await  Book.findByIdAndDelete(id);
        if(removeBook) {
            return res.status(200).json({ message: 'Successfully deleted' });
        }
        throw new Error(`Book with id ${id} not found.`);
    } catch (err) {
        console.log(err.message);
        res.status(404).json({ error: err.message });
    }
    next();
}