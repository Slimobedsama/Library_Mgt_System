const { body, validationResult } = require('express-validator');
const User = require('../models/userModel');
const userSignupVal = 
[
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('sex').notEmpty().withMessage('Sex is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('phoneNumber').isMobilePhone('en-NG').withMessage('Enter a valid Nigerian mobile number').custom(async value=> {
        const checkMobile = await User.findOne({ phoneNumber: value });
        if (checkMobile) throw new Error ('Phone number has already been registered')
    }),
    body('email').isEmail().withMessage('Enter a valid email').custom(async value=> {
        const checkEmail = await User.findOne({ email: value });
        if (checkEmail) throw new Error ('Email has already been registered')
    }),
    (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array().map( error => error.msg));
            return res.status(400).json({ errors: errors.array().map( error => error.msg) });
        }
        return next();
    }
];

module.exports = userSignupVal;