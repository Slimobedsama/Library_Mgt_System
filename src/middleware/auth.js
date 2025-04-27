import jwt from 'jsonwebtoken';
import Admin from '../services/admin/model/admin.js';
import logger from '../logger.js';
import ApiErrors from '../errors/ApiErrors.js';

// ADMIN AUTH
const adminAuth = (req, res, next)=> {
    const token = req.cookies.admin;
    if(token) {
        jwt.verify(token, process.env.JWT_ADM, (err, decoded)=> {
            if(err) {
                res.redirect('/api/admins/login')
            } else {
                logger.info(`{id: ${decoded.id}, iat: ${decoded.iat}, exp: ${decoded.exp}}`);
                next();
            }
        })
    } else {
        res.redirect('/api/admins/login')
    }
}

// LUBRARIAN AUTH
const librarianAuth = (req, res, next)=> {
    // SET TOKEN REQUEST IN THE COOKIE
    const token = req.cookies.lib;
    if(token) {
        jwt.verify(token, process.env.JWT_LIB, (err, decoded)=> {
            if(err) {
                throw ApiErrors.unathourizedAcess('Unauthorized Access');
            } else {
                logger.info(`id: ${decoded.id}, iat: ${decoded.iat}, exp: ${decoded.exp}`);
                next();
            }
        });
    } else {
        throw ApiErrors.unathourizedAcess('Unauthorized Access');
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