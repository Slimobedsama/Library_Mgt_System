const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const {adminToken} = require('../utils/genToken');

// COOKIE-PARSER EXPIRATION
const EXPIRES = 2 * 60 * 60 * 1000;

// SIGNUP
exports.register = async(req, res)=> {
    const { lastName, firstName, userName, email, password } = req.body;
    try {
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
        const token = adminToken(newAdmin._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: EXPIRES});
        res.status(201).json({message: 'Admin Created...', Admin: newAdmin._id});
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
                const token = adminToken(checkDatas._id);
                res.cookie('jwt', token, {httpOnly: true, maxAge: EXPIRES});
                return res.status(200).json({message: 'Login Successful', Admin: checkDatas._id});
            }
            throw new Error('Incorrect Password');
        }
        throw new Error('Incorrect Email Or Username');
    } catch (err) {
        res.status(400).json({errors: err.message});
    }
}