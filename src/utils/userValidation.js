import { body, validationResult } from 'express-validator';
import logger from '../logger.js';
import User from '../models/user.js';

const userSignupVal = 
[
    body('lastName').trim().notEmpty().isAlpha().withMessage('Last name is required'),
    body('firstName').trim().notEmpty().isAlpha().withMessage('First name is required'),
    body('sex').trim().notEmpty().isAlpha().withMessage('Sex is required'),
    body('address').trim().notEmpty().isAlphanumeric('en-GB', {ignore: ' '}).withMessage('Address is required'),
    body('phoneNumber').isMobilePhone(['en-NG', 'en-US']).withMessage('Enter a valid Nigerian mobile number').custom(async value=> {
        const checkMobile = await User.findOne({ phoneNumber: value });
        if (checkMobile) throw new Error ('Phone number has already been registered')
    }),
    body('email').isEmail().withMessage('Enter a valid email address').custom(async value=> {
        const checkEmail = await User.findOne({ email: value });
        if (checkEmail) throw new Error ('Email has already been registered')
    }),
    (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(errors.array().map( error => error.msg));
            return res.status(400).json({ errors: errors.array().map( error => error.msg) });
        }
        return next();
    }
];

const userEditVal = 
[
    body('address').trim().notEmpty().isAlphanumeric('en-GB', {ignore: ' '}).withMessage('Enter an address'),
    body('phoneNumber').isMobilePhone('en-NG').withMessage('Enter a valid nigerian mobile number'),
    (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(errors.array().map( error => error.msg));
            return res.status(400).json({ errors: errors.array().map( error => error.msg) });
        }
        return next();
    }
]

export { userSignupVal, userEditVal };