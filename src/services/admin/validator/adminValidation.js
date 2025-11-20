import { body, validationResult } from 'express-validator';
import logger from '../../../logger.js';

const validateAdminLogin = 
[
    body('email').isEmail().withMessage('Email is required'),
    body('password')
    .isAlphanumeric().withMessage('Must be alphanumeric')
    .isStrongPassword({ minLength: 6, minSymbols: 0 }).withMessage('Must be alphanumeric with minimum of 6 characters'),
    (req, res, next)=> {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            logger.error(errors.array().map( error => error.msg));

            req.flash('error', 'Incorrect email or password');
            req.flash('email', req.body.email || '');
            return res.redirect('/api/admins/login');
        //    return res.render('./admin/login', 
        //         {
        //             title: 'Admin Login',
        //             error: req.flash('error', 'Incorrect username or password'),
        //             email: req.body.email || ''
        //         }
        //     );
        }
        return next();
    }
];

const validateAdminEmail = 
[
    body('email').notEmpty().withMessage('Enter a value')
        .isEmail().withMessage('Enter a valid email'),
    (req, res, next)=> {
        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            // const errMsg = errors.array().map( error => error.msg).join(', ')
            logger.error(errors.array().map( error => error.msg));

            req.flash('error', 'Enter a valid email');
            req.flash('email', req.body.email || '');
            return res.redirect('/api/admins/forgotten-password');
        }
        return next();
    }
];

const validateAdminOtp = 
[
    body('otp').notEmpty().isInt(),
    (req, res, next)=> {
        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            logger.error(errors.array().map( error => error.msg));

            req.flash('error', 'Enter a value');
            return res.redirect('/api/admins/forgotten-password-otp');
        }
        return next();
    }
]

const validatePasswordReset = 
[
    body('password').isAlphanumeric().withMessage('Must be alphanumeric').
    isStrongPassword({ minLength: 6, minSymbols: 0 }).withMessage('Password must be alphanumeric with minimum of six(6) characters'),
    (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errMsg = errors.array().map( error => error.msg).join(', ')
            logger.error(errors.array().map( error => error.msg))
            req.flash('error', errMsg)
            return res.redirect('/api/admins/reset-password')
            // return res.status(400).json({ errors: errors.array().map( error => error.msg) });
        }
        return next();
    }
]

export { validatePasswordReset, validateAdminLogin, validateAdminEmail, validateAdminOtp };