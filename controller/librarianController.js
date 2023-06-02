const Librarian = require('../models/librarianModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const createToken = require('../utils/genToken');

// COOKIE-PARSER EXPIRATION
const EXPIRES = 2 * 60 * 60 * 1000;

exports.create = async(req, res, next)=> {
    const { lastName, firstName, userName, email, phone, password } = req.body;
    try {
        const checkMail = await Librarian.findOne({email});
        const checkUserName = await Librarian.findOne({userName});
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
        const encryptedPassword = await bcrypt.hash(password, 12);
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
    } catch (err) {Librarian
        res.status(400).json({errors: err.message});
    }
    next();
}

exports.all = async(req, res, next)=> {
    try {
        const allLibrarian = await Librarian.find().sort({firstName: 'asc'});
        res.status(200).json(allLibrarian);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

exports.gainAccess = async(req, res)=> {
    const { userName, phone, password } = req.body;
    try {
        const checkUserName = await Librarian.findOne({userName});
        const checkPhone = await Librarian.findOne({phone});
        const checkData = checkUserName || checkPhone;
        // VALIDATE PASSWORD AND DATAS
        if(checkData) {
            const checkPassword = await bcrypt.compare(password, checkData.password);
            if(checkPassword) {
                const token = createToken(checkData._id);
                res.cookie('jwt', token, {httpOnly: true, maxAge: EXPIRES});
                return res.status(200).json({message: 'Successful Login', Librarian: checkData._id});
            }
            throw new Error('Incorrect Password');
        }
        throw new Error('Incorrect Username or Mobile Number');
    } catch (err) {
        console.log(err)
        res.status(400).json({errors: err.message});
    }
}