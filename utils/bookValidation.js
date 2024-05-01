const { body, validationResult } = require('express-validator');
const Book = require('../models/bookModel');
const { options } = require('../routes/bookRoute');

const validateCreateBook = 
[
    body('author').notEmpty().withMessage('Author is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('publishedYear').isDate().withMessage('Published year must be a valid date'),
    body('quantity').isNumeric().withMessage('Quantity should be number'),
    body('ISBN').isISBN('number' | { version: '10' || '13' }).withMessage('ISBN should be a valid ISBN number').custom(async value=> {
        const checkISBN = await Book.findOne({ ISBN: value });
            if (checkISBN) throw new Error('This ISBN number already exists');
    }),
    body('isAvailable').notEmpty().withMessage('Availability status is required'),
    (req, res, next)=> {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log(errors.array().map( error => error.msg));
            return res.status(400).json({ error : errors.array().map( error => error.msg) })
        }
        return next();
    }
];

module.exports = validateCreateBook;