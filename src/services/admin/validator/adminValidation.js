import { body, validationResult } from 'express-validator';
import logger from '../../../logger.js';

const loginValAdmin = 
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

export { resetPassValidate, loginValAdmin };