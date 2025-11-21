import { EXPIRES, RESET } from '../../../utils/maxAge.js';
import tryCatch from '../../../utils/tryCatch.js';
import { loginFactory, forgotPasswordFactory, resendOtpFactory, verifyAdminOtpFactory, resetPassFactory } from '../factory/admin.js';
import setSignedCookie from '../../../utils/cookies.js';


// LOGIN
export const adminLoginController = tryCatch(async(req, res, next)=> {
    try {
        const { token, message, firstName } = await loginFactory(req.body);
        
        setSignedCookie(res, 'admin', token, { maxAge: EXPIRES });
        setSignedCookie(res, 'firstName', firstName, { maxAge: EXPIRES });
        
        req.flash('success', message);
        return res.redirect('dash-board');

    } catch (error) {
        req.flash('error', error.message)
        req.flash('email', req.body.email || '')
        return res.redirect('/api/admins/login');
    }
});

// ADMIN FORGOTTEN PASSWORD
export const adminLostPassController = tryCatch(async(req, res)=> {
    try {
        const { message, email } = await forgotPasswordFactory(req.body);
        
        req.session.email = email;
        req.flash('success', message)
        return res.redirect('/api/admins/forgotten-password-otp');
        
    } catch (error) {
        req.flash('error', error.message)
        req.flash('email', req.body.email || '')
        return res.redirect('/api/admins/forgotten-password');
    }
});

export const adminResendOtpController = tryCatch(async(req, res)=> {
    try {
        const { message } = await resendOtpFactory(req.session);

        req.flash('success', message);
        res.redirect('/api/admins/forgotten-password-otp');
        
    } catch (error) {
        req.flash('error', error.message);
        return res.redirect('/api/admins/forgotten-password');
    }
})

export const adminVerifyOtpController = tryCatch(async(req, res)=> {
    try {
        const { token, message } = await verifyAdminOtpFactory(req.body);
        setSignedCookie(res, 'admin', token, { maxAge: EXPIRES });

        req.flash('success', message);
        return res.redirect('/api/admins/reset-password')

    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/api/admins/forgotten-password-otp')
    }

})

// ADMIN RESET PASSWORD
export const adminResetPasswordController = tryCatch(async(req, res)=> {
    try {
        const { message } = await resetPassFactory(req.body, req.adminId);
        
        req.flash('success', message);
        res.redirect('dash-board');
  
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/api/admins/reset-password')
    }
});

// LOGOUT
export const adminLogoutContoller = (req, res)=> {
    res.clearCookie('admin', '', { maxAge: 1 });
    res.redirect('/api/admins/login');
}

// ADMIN VIEW LOGIC
export const loginView = (req, res)=> {
    res.render('./admin/login', 
        {
            title: 'Admin Login',
            // error: res.locals.error[0], //Not rendered because the use of toastr
            email: req.flash('email') || ''
        }
    );
}

export const dashboardView = (req, res)=> {
    const firstName = req.signedCookies.firstName || '';

    res.render('./admin/dashboard', { title: 'Admin Dash Board', firstName });
}

export const forgottenPasswordView = (req, res)=> {
    res.render('./admin/forgot', 
        { 
            title: 'Forgotten Password',
            email: req.flash('email' || '')

         }
    );
}

export const verifyOtpView = (req, res)=> {
    res.render('./admin/otp', { title: 'Verify Otp' });
}

export const resetPasswordView = (req, res)=> {
    res.render('./admin/reset', { title: 'Reset Password' });
}