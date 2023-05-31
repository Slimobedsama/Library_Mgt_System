const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const createToken = require('../utils/genToken');

// SIGNUP
exports.register = async(req, res)=> {
    const { lastName, firstName, userName, email, password } = req.body;
    try {
        // ADMIN VALIDATIONS
        const checkMail = await Admin.findOne({email});
        const checkUserName = await Admin.findOne({userName});
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
        } else if(!validator.isStrongPassword(password, {minLength: 6, minSymbols: 0})) {
            throw new Error('Password Is Weak, Must Be A minimum Of 6 Characters, 1 Uppercase, 1 Lowercase & 1 Number');
        }
        // PASSWORD ENCRYPTION
        const hashPassword = await bcrypt.hash(password, 12)
        // ADMIN CREATION
        const newAdmin = await Admin.create({
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            userName: req.body.userName,
            email: req.body.email,
            password: hashPassword
        });
        const token = createToken(newAdmin._id);
        res.status(201).json({message: 'Admin Created...', Admin: newAdmin._id, token});
    } catch (err) {
        console.log(err.message)
        res.status(400).json({errors: err.message});
    }
}

// LOGIN
exports.access = async(req, res)=> {
    const { userName, email, password } = req.body;
    try {
        // LOGIN VALIDATION
        const checkMail = await Admin.findOne({email});
        const checkUserName = await Admin.findOne({userName});
        const checkDatas = checkMail || checkUserName;
        if(checkDatas) {
            const checkPassword = await bcrypt.compare(password, checkDatas.password);
            if(checkPassword) {
                const token = createToken(checkDatas._id);
                return res.status(200).json({message: 'Login Successful', Admin: checkDatas._id, token});
            }
            throw new Error('Incorrect Password');
        }
        throw new Error('Incorrect Email Or Username');
    } catch (err) {
        res.status(400).json({errors: err.message});
    }
}