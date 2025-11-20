import { body, validationResult } from 'express-validator';
import Book from '../model/book.js';
import logger from '../../../logger.js';

const validateCreateBook = 
[
    body('author').trim().notEmpty().isAlpha('en-US', {ignore: ' '}).withMessage('Author is required'),
    body('title').trim().notEmpty().isAlpha('en-US', {ignore: ' '}).withMessage('Title is required'),
    body('publishedYear').isDate().withMessage('Published year must be a valid date'),
    body('quantity').isNumeric().withMessage('Quantity should be number'),
    body('ISBN').isISBN('number' | { version: '10' || '13' }).withMessage('ISBN should be a valid ISBN number').custom(async value=> {
        const checkISBN = await Book.findOne({ ISBN: value });
            if (checkISBN) throw new Error('The ISBN number already exists');
    }),
    (req, res, next)=> {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            logger.error(errors.array().map( error => error.msg))
            return res.status(400).json({ error : errors.array().map( error => error.msg) })
        }
        return next();
    }
];
export default validateCreateBook;