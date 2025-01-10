import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';

// ADMIN AUTH
const adminAuth = (req, res, next)=> {
    const token = req.cookies.admin;
    if(token) {
        jwt.verify(token, process.env.JWT_ADM, (err, decoded)=> {
            if(err) {
                // res.status(401).json({error: 'Unauthorized Access'});
                res.redirect('/api/admins/login')
            } else {
                console.log(decoded);
                next();
            }
        })
    } else {
        // res.status(403).json({error: 'Forbidden'});
        res.redirect('/api/admins/login')
    }
}

// LUBRARIAN AUTH
const librarianAuth = (req, res, next)=> {
    // SET TOKEN REQUEST IN THE COOKIE
    const token = req.cookies.lib;
    if(token) {
        jwt.verify(token, process.env.JWT_KEY, (err, decoded)=> {
            if(err) {
                return res.status(401).json({error: 'Unauthorized Access'});
            } else {
                console.log(decoded);
                next();
            }
        });
    } else {
        return res.status(401).json({error: 'Unauthorized Access'});
    }
}

// CHECK FOR CURRENT ADMIN
const checkAdmin = (req, res, next)=> {
    const token = req.cookies.admin;
    if(token) {
        jwt.verify(token, process.env.JWT_ADM, async(err, decoded)=> {
            if(err) {
                res.locals.admin = null;
                next();
            } else {
                let admin = await Admin.findById(decoded.id);
                res.locals.admin = admin;
                next();
            }
        })
    } else {
        res.locals.admin = null;
        next();
    }
}

export { adminAuth, librarianAuth, checkAdmin };