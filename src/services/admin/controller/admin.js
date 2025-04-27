import { signedCookie } from 'cookie-parser';
import { EXPIRES, RESET } from '../../../utils/maxAge.js';
import tryCatch from '../../../utils/tryCatch.js';
import { loginFactory, forgotPasswordFactory, resetPassFactory } from '../factory/admin.js'


// LOGIN
export const accessAdmin = tryCatch(async(req, res)=> {
    const { admin, token } = await loginFactory(req.body);
    res.cookie('admin', token, {
        signed: true,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true, maxAge: EXPIRES,
        sameSite: 'strict'
    });
    res.status(200).json({ message: 'Login successful', Admin: admin._id });
});

// ADMIN FORGOTTEN PASSWORD
export const adminLostPass = tryCatch(async(req, res)=> {
    const { adminId, resetToken } = await forgotPasswordFactory(req.body);
    res.cookie('reset', resetToken, { httpOnly: true, maxAge: RESET});
    return res.status(200).json({ message: 'Check your mail for reset link', adminId });
});

// ADMIN RESET PASSWORD
export const adminRetrievePass = tryCatch(async(req, res)=> {
    const { newPassword, token } = await resetPassFactory(req.body, req.params, req.cookies);
    res.cookie('admin', token, { httpOnly: true, maxAge: EXPIRES });
    return res.status(200).json({message: 'Login Successful', admin: newPassword._id});
});

// LOGOUT
export const adminLogout = (req, res)=> {
    res.clearCookie('admin', '', { maxAge: 1 });
    res.redirect('/api/admins/login');
}

// ADMIN VIEW LOGIC
export const adminViewLogin = (req, res)=> {
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