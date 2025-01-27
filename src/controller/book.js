import { bookCreation, delBook, findAllBooks, findSingleBook } from '../service/book.js';
import tryCatch from '../utils/tryCatch.js';

export const getAllBooks = tryCatch(async(req, res)=> {
    const findBooks = await findAllBooks(req.query);
    return res.status(200).json({ message: 'Success', data: findBooks });
});

export const getOneBook = tryCatch(async(req, res)=> {
    const findOneBook = await findSingleBook(req.params);
    return res.status(200).json({ message: 'Success', data: findOneBook });
});

export const createBook= tryCatch(async(req, res)=> {
    const newBook = await bookCreation(req.body);
    return res.status(201).json({ message: 'Success', data: newBook });
});

export const removeBook = tryCatch(async(req, res)=> {
    const removeBook = await delBook(req.params);
    return res.status(200).json({ message: 'Successfully deleted', data: removeBook._id });
});