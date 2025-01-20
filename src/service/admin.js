import bcrypt from 'bcrypt';
import Admin from "../models/adminModel.js";
import { adminToken, adminResetToken } from "../utils/genToken.js";
import emailSender from '../utils/email.js';
import ApiErrors from '../errors/ApiErrors.js';

export const findAllAdmin = async()=> {
    const getAdmins = await Admin.find();

    if(!getAdmins) {
        throw ApiErrors.internalServer('Error fetching admins');
    }

    return getAdmins;
}

export const adminSignup = async(body)=> {
    const { lastName, firstName, email, password } = body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const createAdmin = await Admin.create({
        lastName: lastName,
        firstName: firstName,
        email: email,
        password: hashedPassword
    });
    const token = adminToken(createAdmin._id);
    await emailSender({
        from: `Library Support Team <${process.env.SENDER_EMAIL}>`,
        to: `${ createAdmin.email }`,
        subject: 'Email Verification Link',
        html: `<h2> Welcome ${ lastName } ${ firstName }. Please verify your email with the link <a href="http://localhost:9000/api/admins/dash-board">${token}</a></h2>`
    });
    return { createAdmin, token }
}

export const signIn = async(body)=> {
    const { email, password } = body;
    // CHECKS FOR EMAIL
    const checkMail = await Admin.findOne({ email });
    
    if(checkMail) {
        const checkPassword = await bcrypt.compare(password, checkMail.password);
        if(checkPassword) {
            const token = adminToken(checkMail._id);
            return { checkMail, token };
        }
        throw ApiErrors.badRequest('Incorrect password');
    }
    throw ApiErrors.notFound('This email does not exist');
}

export const adminForgotPass = async(body)=> {
    const { email } = body;
    if(email === '') {
        throw ApiErrors.badRequest('Email is required');
    }

    const findEmail = await Admin.findOne({ email });
    if(!findEmail) {
        throw ApiErrors.notFound('This email is not found');
    }
    const adminId = findEmail._id; // RETRIEVES THE ID FROM SAVE EMAIL
    // GENERATE TOKEN
    const resetToken = adminResetToken(findEmail._id);
     // SEND EMAIL WITH TOKEN
    await emailSender({
        from: `Library Support Team <${process.env.SENDER_EMAIL}>`,
        to: `${ findEmail.email }`,
        subject: 'Password Reset Link',
        html: `<h2>Please Click on the Link For Password Reset. You 10 minutes before it becomes invalid.<br><a href="http://localhost:9000/api/admins/reset-password/${adminId}">${resetToken}</a></h2>`
    });
    return { adminId, resetToken };
}

export const adminResetPass = async function(body, params, cookies) {
    const { password } = body;
    const { reset } = cookies
    // CHECKS FOR TOKEN
    if(!reset) {
            throw ApiErrors.unathourizedAcess('Invalid token');
        }
    // HASHES PASSWORD
    const encryptPassword = await bcrypt.hash(password, 12);
    // FIND BY ID AND UPDATES NEW PASSWORD
    const newPassword = await Admin.findByIdAndUpdate(params.id, { password: encryptPassword }, { new: true });
    // CREATES A LOGIN TOKEN FOR AUTO LOGIN AFTER SUCCESSFUL PASSWORD RESET
    const token = adminToken(newPassword._id);
    return { newPassword, token };
}