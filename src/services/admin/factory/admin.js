import AdminDao from "../dao/admin.js";
import ApiErrors from '../../../errors/ApiErrors.js';
import bcrypt from 'bcrypt';
import { adminAccessToken, adminRefreshToken } from "../../../utils/genToken.js";
import emailSender from '../../../utils/email.js';
import { createOtpFactory, verifyOtpFactory } from '../../one_time_password/factory/otp.js';
import { refreshTokenFactory } from './refresh.js';

export const loginFactory = async(body)=> {
    const { email, password } = body;
    const admin = await AdminDao.getEmail(email);
    let token;
    let refreshToken;

    if(!admin) {
        throw ApiErrors.badRequest('Incorrect email or password');
    } else {
        const checkPassword = await bcrypt.compare(password, admin.password);
        
        if(!checkPassword) {
            throw ApiErrors.badRequest('Incorrect username or password');
        }
        token = adminAccessToken(admin._id);
        refreshToken = adminRefreshToken(admin._id);
    }

    const data = {
        userId: admin._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    }

    await refreshTokenFactory(data);
    
    return { 
        token, 
        refreshToken, 
        message: 'Login successful', 
        firstName: admin.firstName 
    };
}

export const forgotPasswordFactory = async(body)=> {
    const findEmail = await AdminDao.getEmail(body.email);

    if(!findEmail) {
        throw ApiErrors.notFound('This email is does not exist');
    }

    const { email } = findEmail;
    const otp = await createOtpFactory(email);

    // const adminId = findEmail._id; // RETRIEVES THE ID FROM SAVE EMAIL
    // // GENERATE TOKEN
    // const resetToken = adminResetToken(findEmail._id);
    //  // SEND EMAIL WITH TOKEN
    // await emailSender({
    //     from: `Library Support Team <${process.env.SENDER_EMAIL}>`,
    //     to: `${ findEmail.email }`,
    //     subject: 'Password Reset Link',
    //     html: `<h2>Please Click on the Link For Password Reset. You 10 minutes before it becomes invalid.<br><a href="http://localhost:9000/api/admins/reset-password/${adminId}">${resetToken}</a></h2>`
    // });

    return { message: 'Email sent with otp code', email };
}

export const resendOtpFactory = async(session)=> {
    if(session.email === undefined) {
        throw ApiErrors.badRequest('Session expired. Please start again')
    }

    const findEmail = await AdminDao.getEmail(session.email);

    if(!findEmail) {
        throw ApiErrors.notFound('This email is does not exist');
    }

    const { email } = findEmail;
    await createOtpFactory(email);
    
    return { message: 'Email with new otp has been sent' }
}

export const verifyAdminOtpFactory = async(body)=> {
    const { verifyOtp } = await verifyOtpFactory(body.otp);
    const { email } = verifyOtp;
    const admin = await AdminDao.getEmail(email)

    if(!admin) {
        throw ApiErrors.notFound('User not found')
    }

    const token = adminAccessToken(admin._id);
    
    return { token, message: 'Valid otp' }
}

export const resetPassFactory = async function(body, id) {
    const { password } = body;
    const encryptPassword = await bcrypt.hash(password, 12);
    
    await AdminDao.update(id, { password: encryptPassword });
    
    return { message: 'Password reset successful' };
}