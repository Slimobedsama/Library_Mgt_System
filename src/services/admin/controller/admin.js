import { EXPIRES, RESET } from '../../../utils/maxAge.js';
import tryCatch from '../../../utils/tryCatch.js';
import { loginFactory, forgotPasswordFactory, resetPassFactory } from '../factory/admin.js';
import setSignedCookie from '../../../utils/cookies.js';


// LOGIN
export const accessAdmin = tryCatch(async(req, res, next)=> {
    try {
        const { token } = await loginFactory(req.body);
        
        setSignedCookie(res, 'admin', token, { maxAge: EXPIRES });
        req.flash('success', 'Login successful')
        
        return res.redirect('dash-board');
    } catch (error) {
        req.flash('error', error.message)
        req.flash('email', req.body.email || '')
        return res.redirect('/api/admins/login');
    }
});

// ADMIN FORGOTTEN PASSWORD
export const adminLostPass = tryCatch(async(req, res)=> {
    try {
        const { message } = await forgotPasswordFactory(req.body);
        
        req.flash('success', message)
        // return res.redirect('/api/admins/forgotten-password');
        
    } catch (error) {
        console.error({error})
        req.flash('error', error.message)
        req.flash('email', req.body.email || '')
        return res.redirect('/api/admins/forgotten-password');
    }
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
    res.render('./admin/login', 
        {
            title: 'Admin Login',
            // error: res.locals.error[0], //Not rendered because the use of toastr
            email: req.flash('email') || ''
        }
    );
}

export const dashBoardAdmin = (req, res)=> {
    res.render('./admin/dashboard', { title: 'Admin Dash Board' });
}

export const lostPassword = (req, res)=> {
    res.render('./admin/forgot', 
        { 
            title: 'Forgotten Password',
            email: req.flash('email' || '')

         }
    );
}

export const resetPassword = (req, res)=> {
    res.render('./admin/reset', { title: 'Reset Password' });
}