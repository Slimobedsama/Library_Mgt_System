import { EXPIRES, REFRESH_EXPIRES } from '../../../utils/maxAge.js';
import tryCatch from '../../../utils/tryCatch.js';
import { loginFactory, forgotPasswordFactory, verifyAdminOtpFactory, resetPassFactory } from '../factory/admin.js';
import setSignedCookie from '../../../utils/cookies.js';
import RefreshToken from '../model/refresh.js';


// LOGIN
export const adminLoginController = tryCatch(async(req, res, next)=> {
    try {
        const { token, refreshToken, message, firstName } = await loginFactory(req.body);
        
        setSignedCookie(res, 'admin', token, { maxAge: EXPIRES });
        setSignedCookie(res, 'adminRefresh', refreshToken, { maxAge: REFRESH_EXPIRES });
        setSignedCookie(res, 'firstName', firstName, { maxAge: EXPIRES });
        
        req.flash('success', message);
        return res.redirect('/admin/dash-board');

    } catch (error) {
        req.flash('error', error.message)
        return res.redirect('/admin/login');
    }
});

// ADMIN FORGOTTEN PASSWORD
export const adminLostPassController = tryCatch(async(req, res)=> {
    try {
        const { message, email } = await forgotPasswordFactory(req.body);
        
        req.session.email = email;
        req.flash('success', message)
        return res.redirect('/admin/forgotten-password-otp');
        
    } catch (error) {
        req.flash('error', error.message)
        req.flash('email', req.body.email || '')
        return res.redirect('/admin/forgotten-password');
    }
});

export const adminVerifyOtpController = tryCatch(async(req, res)=> {
    try {
        const { token, message } = await verifyAdminOtpFactory(req.body);
        setSignedCookie(res, 'admin', token, { maxAge: EXPIRES });

        req.flash('success', message);
        return res.redirect('/admin/reset-password')

    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/admin/forgotten-password-otp')
    }

})

// ADMIN RESET PASSWORD
export const adminResetPasswordController = tryCatch(async(req, res)=> {
    try {
        const { message } = await resetPassFactory(req.body, req.adminId);
        
        req.flash('success', message);
        res.redirect('/admin/dash-board');
  
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/admin/reset-password')
    }
});

// LOGOUT
export const adminLogoutContoller = async(req, res)=> {
    const refreshToken = req.signedCookies.adminRefresh
    
    if(refreshToken) {
        await RefreshToken.findOneAndDelete({ token: refreshToken });
    }

    res.clearCookie('admin');
    res.clearCookie('adminRefresh');
    res.clearCookie('firstName');

    res.redirect('/admin/login');
}