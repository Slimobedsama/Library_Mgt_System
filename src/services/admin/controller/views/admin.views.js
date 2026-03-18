import { getAllLibrarian } from '../../../librarian/factory/librarian.js';
import { resendOtpFactory } from '../../factory/admin.js';

export const loginView = (req, res)=> {
    res.render('auth/login', 
        {
            title: 'Admin Login',
            layout: 'layouts/auth-layout',
            // error: res.locals.error[0], //Not rendered because the use of toastr
            email: req.flash('email')[0] || ''
        }
    );
}

export const dashboardView = async(req, res)=> {
    const admin = res.locals.admin.firstName || '';
    const { librarians, totalLibrarians } = await getAllLibrarian();
    
    res.render('admin/dashboard', 
        { 
            title: 'Admin Dash Board',
            page: 'Home',
            admin,
            librarians,
            totalLibrarians,
            lastName: req.flash('lastName') || '',
            firstName: req.flash('firstName') || '',
            email: req.flash('email') || '' ,
            phone: req.flash('phone') || '',
        }
    );
}

export const forgottenPasswordView = (req, res)=> {
    res.render('auth/forgot', 
        { 
            title: 'Forgotten Password',
            layout: 'layouts/auth-layout',
            email: req.flash('email') || ''

         }
    );
}

export const adminResendOtpController = async(req, res)=> {
    try {
        const { message } = await resendOtpFactory(req.session);

        req.flash('success', message);
        res.redirect('/admin/forgotten-password-otp');
        
    } catch (error) {
        req.flash('error', error.message);
        return res.redirect('/admin/forgotten-password');
    }
}

export const verifyOtpView = (req, res)=> {
    res.render('auth/otp', 
        { 
            title: 'Verify Otp', 
            layout: 'layouts/auth-layout', 
        }
    );
}

export const resetPasswordView = (req, res)=> {
    res.render('auth/reset', 
        { 
            title: 'Reset Password', 
            layout: 'layouts/auth-layout', 
        }
    );
}