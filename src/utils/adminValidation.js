import { body, validationResult } from 'express-validator';
import Admin from '../models/adminModel.js';

// ADMIN VALIDATION
const adminSingupVal = 
[
    body('lastName').notEmpty().withMessage('Enter Last Name'),
    body('firstName').notEmpty().withMessage('Enter First Name'),
    body('email').isEmail().withMessage('Enter A Valid Email Address').custom(async value => {
        const checkEmail = await Admin.findOne({ email: value });
        if (checkEmail) throw new Error("This Email Already Exists");
    }),
    body('password').isStrongPassword({ minLength: 6, minSymbols: 0 }).withMessage('Password Must Be A Minimum Of 6 Characters, 1 Uppercase, 1 Lowercase & 1 Number'),
    (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map( error => error.msg) });
        }
        return next();
    }
];

const resetPassValidate = 
[
    body('password').isStrongPassword({ minLength: 6, minSymbols: 0 }).withMessage('Password Must Be A Minimum Of 6 Characters, 1 Uppercase, 1 Lowercase & 1 Number'),
    (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map( error => error.msg) });
        }
        return next();
    }
]

export { adminSingupVal, resetPassValidate };