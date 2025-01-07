import Admin from '../models/adminModel.js';
import bcrypt from 'bcrypt';
import { adminToken, adminResetToken } from '../utils/genToken.js';
import { EXPIRES, RESET } from '../utils/maxAge.js';
import emailSender from '../utils/email.js';
import ApiErrors from '../errors/ApiErrors.js';

// ALL ADMIN
export const allAdmin = async(req, res, next)=> {
    try {
        const getAllAdmin = await Admin.find().sort({lastName: 'asc'});
        return res.status(200).json(getAllAdmin);
    } catch (err) {
        next(err);
    }
}

// SIGNUP
export const registerAdmin = async(req, res, next)=> {
    const { lastName, firstName, email, password } = req.body;
    try {
        // PASSWORD ENCRYPTION
        const hashPassword = await bcrypt.hash(password, 12)
        // ADMIN CREATION
        const newAdmin = await Admin.create({
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            email: req.body.email,
            password: hashPassword
        });
        const token = adminToken(newAdmin._id);
        res.cookie('admin', token, {httpOnly: true, maxAge: EXPIRES});
        await emailSender({
            from: `Library Support Team <${process.env.SENDER_EMAIL}>`,
            to: `${ newAdmin.email }`,
            subject: 'Email Verification Link',
            html: `<h2> Welcome ${ lastName } ${ firstName }. Please verify your email with the link <a href="http://localhost:9000/api/admin">${token}</a></h2>`
        })
        res.status(201).json({message: 'Admin Created...', Admin: newAdmin._id, mail: 'Email sent'});
    } catch (err) {
        next(err)
    }
}

// LOGIN
export const accessAdmin = async(req, res, next)=> {
    const { email, password } = req.body;
    try {
        // LOGIN VALIDATION
        const checkMail = await Admin.findOne({email});
        
        if(checkMail) {
            const checkPassword = await bcrypt.compare(password, checkMail.password);
            console.log(checkPassword);
            if(checkPassword) {
                const token = adminToken(checkMail._id);
                res.cookie('admin', token, {httpOnly: true, maxAge: EXPIRES});
                return res.status(200).json({message: 'Login Successful', Admin: checkMail._id});
            }
           throw ApiErrors.badRequest('Incorrect password');
        }
       throw ApiErrors.notFound('This email does not exist');
    } catch (err) {
        next(err);
    }
}

// ADMIN FORGOTTEN PASSWORD
export const adminLostPass = async(req, res, next)=> {
    const { email } = req.body;
    try {
        // CHECK FOR EXISTING EMAIL
        if(email === '') {
            throw ApiErrors.badRequest('Email is required');
        }

        const findEmail = await Admin.findOne({ email });
        if(!findEmail) {
            throw ApiErrors.notFound('This email is not found');
        }
        const userId = findEmail._id; // RETRIEVES THE ID FROM SAVE EMAIL
        // GENERATE TOKEN
        const resetToken = adminResetToken(findEmail._id);
        res.cookie('reset', resetToken, { httpOnly: true, maxAge: RESET});
        // // SEND EMAIL WITH TOKEN
        await emailSender({
            from: `Library Support Team <${process.env.SENDER_EMAIL}>`,
            to: `${ findEmail.email }`,
            subject: 'Password Reset Link',
            html: `<h2>Please Click on the Link For Password Reset. You 10 minutes before it becomes invalid.<br><a href="http://localhost:9000/api/admins/reset-password/${userId}">${resetToken}</a></h2>`
        });
        return res.status(200).json({ message: 'Check your mail for reset link', userId });
    } catch (err) {
        next(err);
    }
}

// ADMIN RESET PASSWORD
export const adminRetrievePass = async(req, res, next)=> {
    const { password } = req.body;
    const { id } = req.params;
    const { reset } = req.cookies;
    try {
        // HASHES PASSWORD
        const encryptPassword = await bcrypt.hash(password, 12);
        // FIND BY ID AND UPDATES NEW PASSWORD
        if(!reset) {
            throw ApiErrors.unathourizedAcess('Invalid token');
        }
        const newPassword = await Admin.findByIdAndUpdate(id, { password: encryptPassword }, { new: true });
        // CREATES A LOGIN TOKEN AUTO LOGIN AFTER SUCCESSFUL PASSWORD RESET
        const token = adminToken(newPassword._id);
        res.cookie('admin', token, {httpOnly: true, maxAge: EXPIRES});
        return res.status(200).json({message: 'Login Successful', admin: newPassword._id});
    } catch (err) {
        next(err);
    }
}

// ADMIN VIEW LOGIC
export const adminViewLogin = async(req, res)=> {
    res.render('./admin/login', { title: 'Admin Login' });
}

export const dashBoardAdmin = (req, res)=> {
    res.render('./admin/dashboard', { title: 'Admin Dash Board' });
}

export const lostPassword = (req, res)=> {
    res.render('./admin/forgot', { title: 'Forgotten Password' });
}

export const resetPassword = (req, res)=> {
    res.render('./admin/reset', { title: 'Reset Password' });
}