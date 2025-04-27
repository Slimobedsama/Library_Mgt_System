import AdminDao from "../dao/admin.js";
import ApiErrors from '../../../errors/ApiErrors.js';
import bcrypt from 'bcrypt';
import { adminToken, adminResetToken } from "../../../utils/genToken.js";
import emailSender from '../../../utils/email.js';

export const loginFactory = async(body)=> {
    const { email, password } = body;
    const admin = await AdminDao.login(email, password);
    const token = adminToken(admin._id);
    return { admin, token };
}

export const forgotPasswordFactory = async(body)=> {
    const { email } = body;
    
    if(email === '') {
        throw ApiErrors.badRequest('Email is required');
    }

    const findEmail = await AdminDao.getEmail(email);

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

export const resetPassFactory = async function(body, params, cookies) {
    const { password } = body;
    const { id } = params;
    const { reset } = cookies
    // CHECKS FOR TOKEN
    if(!reset) {
            throw ApiErrors.unathourizedAcess('Invalid token');
        }
    // HASHES PASSWORD
    const encryptPassword = await bcrypt.hash(password, 12);
    // FIND BY ID AND UPDATES NEW PASSWORD
    const newPassword = await AdminDao.update(id, encryptPassword);
    // CREATES A LOGIN TOKEN FOR AUTO LOGIN AFTER SUCCESSFUL PASSWORD RESET
    const token = adminToken(newPassword._id);
    return { newPassword, token };
}