import { body, validationResult } from 'express-validator';
import LibrarianDao from '../dao/librarianDao.js';
import logger from '../../../logger.js';

// LIBRARIAN VALIDATION
export const librarianSingupVal = 
[
    body('lastName').trim().notEmpty().isAlpha().withMessage('Enter last name'),
    body('firstName').trim().notEmpty().isAlpha().withMessage('Enter first name'),
    body('email').isEmail().withMessage('Enter a valid email address').custom(async value => {
        const checkEmail = await LibrarianDao.getEmail(value);
        if (checkEmail) throw new Error("This email already exist");
    }),
    body('phone').isMobilePhone('en-NG').withMessage('Enter a valid nigerian mobile number'),
    body('password').notEmpty().withMessage('Password is required')
    .isStrongPassword({ minLength: 6, minSymbols: 0 }).withMessage('Password must be minimum of 6 Characters, 1 uppercase, 1 lowercase & 1 number'),
    (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(errors.array().map( error => error.msg))
            return res.status(400).json({ errors: errors.array().map( error => error.msg) });
        }
        return next();
    }
];

export const librarianLoginVal = 
[
    body('email').notEmpty().withMessage('Email is required'),
    body('password')
    .isStrongPassword({ minLength: 6, minSymbols: 0 }).withMessage('Password must be minimum of 6 characters, 1 uppercase, 1 lowercase & 1 number')
    .notEmpty().withMessage('Password is required'),
    (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(errors.array().map( error => error.msg));
            return res.status(400).json({ errors: errors.array().map( error => error.msg) });
        }
        return next();
    }
]

export const librarianUpdateVal = 
[
    body('lastName').trim().notEmpty().isAlpha().withMessage('Enter last name'),
    body('firstName').trim().notEmpty().isAlpha().withMessage('Enter firstnName'),
    body('phone').isMobilePhone('en-NG').withMessage('Enter a valid nigerian mobile number'),
    body('password').notEmpty().withMessage('Password is required')
    .isStrongPassword({ minLength: 6, minSymbols: 0 }).withMessage('Password must be minimum of 6 Characters, 1 uppercase, 1 lowercase & 1 number'),
    (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(errors.array().map( error => error.msg))
            return res.status(400).json({ errors: errors.array().map( error => error.msg) });
        }
        return next();
        
    }
];

export const resetPassValidate = 
[
    body('password').isStrongPassword({ minLength: 6, minSymbols: 0 }).withMessage('Password must be minimum of 6 characters, 1 uppercase, 1 lowercase & 1 number'),
    (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(errors.array().map( error => error.msg))
            return res.status(400).json({ errors: errors.array().map( error => error.msg) });
        }
        return next();
    }
]