const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const { adminToken, passToken } = require('../utils/genToken');
const emailSender = require('../utils/email');

// COOKIE-PARSER EXPIRATION
const EXPIRES = 2 * 60 * 60 * 1000;

// ALL ADMIN
exports.allAdmin = async(req, res, next)=> {
    try {
        const getAllAdmin = await Admin.find().sort({lastName: 'asc'});
        return res.status(200).json(getAllAdmin);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({error: err.message});
    }
    next();
}

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
        await emailSender({
            from: `Library Support Team <${process.env.SENDER_EMAIL}>`,
            to: 'slimobedsama@yahoo.com',
            subject: 'Email Verification Link',
            html: `<h2> Welcome ${ lastName } ${ firstName }. Please verify your email with the link <a href="http://localhost:9000/api/admin">${token}</a></h2>`
        })
        res.status(201).json({message: 'Admin Created...', Admin: newAdmin._id});
    } catch (err) {
        console.log(err.message)
        res.status(400).json({errors: err.message});
    }
}

// LOGIN
exports.access = async(req, res)=> {
    const { email, password } = req.body;
    try {
        // LOGIN VALIDATION
        const checkMail = await Admin.findOne({email});
        if(checkMail) {
            const checkPassword = await bcrypt.compare(password, checkMail.password);
            if(checkPassword) {
                const token = adminToken(checkMail._id);
                res.cookie('jwt', token, {httpOnly: true, maxAge: EXPIRES});
                return res.status(200).json({message: 'Login Successful', Admin: checkMail._id});
            }
            throw new Error('Incorrect Password');
        }
        throw new Error('This Email Is Not Found');
    } catch (err) {
        res.status(400).json({errors: err.message});
    }
}

// ADMIN FORGOTTEN PASSWORD
exports.lostPass = async(req, res)=> {
    const { email } = req.body;
    try {
        // CHECK FOR EXISTING EMAIL
        const findEmail = await Admin.findOne({ email });
        if(!findEmail) {
            throw new Error('This Email Is Not Found');
        }
        // GENERATE TOKEN
        const resetToken = passToken(findEmail._id);
        res.cookie('jwt', resetToken, { httpOnly: true, maxAge: 10 * 60 * 1000});
        // SEND EMAIL WITH TOKEN
        await emailSender({
            from: `Library Support Team <${process.env.SENDER_EMAIL}>`,
            to: 'slimobedsama@yahoo.com',
            subject: 'Password Reset Link',
            html: `<h2>Please Click on the Link For Password Reset <a href="http://localhost:9000/api/admin/reset-password">${resetToken}</a></h2>`
        })
        return res.status(200).json({ message: 'Email Sent' });
    } catch (err) {
        res.status(404).json({ error: err.message});
    }
}

// ADMIN RESET PASSWORD
exports.retrievePass = async(req, res, next)=> {
    const { password } = req.body;
    const id = req.params.id;
    try {
        // FIND ADMIN ID
        const findId = await Admin.findOne({ id });
        // HASH PASSWORD
        const encryptPassword = await bcrypt.hash(password, 12);
        findId.password = encryptPassword;
        res.status(201).json({ message: 'Password Reset Successful' });
    } catch (err) {
        console.log(err.message)
        res.status(400).json({ error: err.message });
    }
    next();
}