const Librarian = require('../models/librarianModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const createToken = require('../utils/genToken');

// COOKIE-PARSER EXPIRATION
const EXPIRES = 2 * 60 * 60 * 1000;

exports.create = async(req, res)=> {
    const { lastName, firstName, userName, email, phone, password } = req.body;
    try {
        const checkMail = await Admin.findOne({email});
        const checkUserName = await Admin.findOne({userName});
        // LIBRARIAN VALIDATION
        if(checkMail) {
            throw new Error('Email Exists');
        } else if(checkUserName) {
            throw new Error('Username Exists');
        } else if(validator.isEmpty(lastName)) {
            throw new Error('Last Name Is Required');
        } else if(validator.isEmpty(firstName)) {
            throw new Error('First Name Is Required');
        } else if(validator.isEmpty(userName)) {
            throw new Error('Username Is Required');
        } else if(validator.isEmpty(email)) {
            throw new Error('Email Is Required');
        } else if(!validator.isEmail(email)) {
            throw new Error('Email Is Invalid');
        } else if(!validator.isMobilePhone(phone, ['en-NG'])) {
            throw new Error('Invalid Mobile Number');
        } else if(!validator.isStrongPassword(password, {minLength: 6, minSymbols: 0})) {
            throw new Error('Password Is Weak, Must Be A minimum Of 6 Characters, 1 Uppercase, 1 Lowercase & 1 Number');
        }
        // PASSWORD HASHING
        const encryptedPassword = bcrypt.hash(password, 12);
        // CREATES A LABRARIAN
        const createLibrarian = await Librarian.create({
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            userName: req.body.userName,
            email: req.body.email,
            phone: req.body.phone,
            password: encryptedPassword
        });
        // CREATES JWT TOKEN
        const token = createToken(createLibrarian._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: EXPIRES});
        return res.status(201).json({message: 'Successful Creation', Librarian: createLibrarian._id});
    } catch (err) {
        res.status(400).json({errors: err.message});
    }
}