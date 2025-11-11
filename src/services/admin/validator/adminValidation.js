import { body, validationResult } from 'express-validator';
import logger from '../../../logger.js';

const loginValAdmin = 
[
    body('email').isEmail(),
    body('password')
    .isStrongPassword({ minLength: 6, minSymbols: 0 }),
    (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(errors.array().map( error => error.msg));
            // return res.status(400).json({ errors: errors.array().map( error => error.msg) });
            console.log('error:')
           return res.render('./admin/login', 
                {
                    title: 'Admin Login',
                    error: 'Invalid username or password',
                    email: req.body.email || ''
                }
            );
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