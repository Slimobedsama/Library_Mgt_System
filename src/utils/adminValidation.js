import { body, validationResult } from 'express-validator';
import Admin from '../models/admin.js';
import logger from '../logger.js';

// ADMIN VALIDATION
const adminSingupVal = 
[
    body('lastName').trim().notEmpty().isAlpha().withMessage('Enter last name'),
    body('firstName').trim().notEmpty().isAlpha().withMessage('Enter first name'),
    body('email').isEmail().withMessage('Enter a valid email address').custom(async value => {
        const checkEmail = await Admin.findOne({ email: value });
        if (checkEmail) throw new Error("This email already exists");
    }),
    body('password').isStrongPassword({ minLength: 6, minSymbols: 0 }).withMessage('Password must be minimum of 6 characters, 1 uppercase, 1 lowercase & 1 number'),
    (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(errors.array().map( error => error.msg))
            return res.status(400).json({ errors: errors.array().map( error => error.msg) });
        }
        return next();
    }
];

const loginValAdmin = 
[
    body('email').notEmpty().withMessage('Email is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(errors.array().map( error => error.msg));
            return res.status(400).json({ errors: errors.array().map( error => error.msg) });
        }
        return next();
    }
]

const resetPassValidate = 
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

export { adminSingupVal, resetPassValidate, loginValAdmin };