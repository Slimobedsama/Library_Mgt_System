import jwt from 'jsonwebtoken';
import Admin from '../services/admin/model/admin.js';
import logger from '../logger.js';
import ApiErrors from '../errors/ApiErrors.js';
import RefreshToken from '../services/admin/model/refresh.js';
import { adminAccessToken, adminRefreshToken } from '../utils/genToken.js';
import setSignedCookie from '../utils/cookies.js';
import { EXPIRES, REFRESH_EXPIRES } from '../utils/maxAge.js';

// ADMIN AUTH
const adminAuth = async(req, res, next)=> {
    //CROSS PLATFORM(MOBILE & WEB)
    const token = req.headers.authorization || req.signedCookies.admin; 
    const refreshToken = req.headers['x-refresh-token'] || req.signedCookies.adminRefresh;

    try {

        if(token) {
            const decoded = jwt.verify(token, process.env.JWT_ADM);
            req.adminId = decoded.id
            logger.info(`{id: ${decoded.id}, iat: ${decoded.iat}, exp: ${decoded.exp}}`);
            return next();
        }
    } catch (error) {} //Handling token expire(error) would prevent refresh token

    if(!refreshToken) {
        req.flash('error', 'Please login');
        return res.redirect('/api/admins/login');
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.ADM_REFRESH);
        const getRefreshToken = await RefreshToken.findOne({
            userId: decoded.id,
            token: refreshToken,
            blacklisted: false
        });

        if(!getRefreshToken) {
            req.flash('error', 'Expired refresh token');
            return res.redirect('/api/admins/login');
        }

        const newToken = adminAccessToken(decoded.id)
        const newRefreshToken = adminRefreshToken(decoded.id);

        getRefreshToken.blacklisted = true;
        await getRefreshToken.save();

        await RefreshToken.create({
            userId: decoded.id,
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 3 * 60 * 1000),
        });

        setSignedCookie(res, 'admin', newToken, { maxAge: EXPIRES });
        setSignedCookie(res, 'adminRefresh', newRefreshToken, { maxAge: REFRESH_EXPIRES });

        req.adminId = decoded.id;
        logger.info(`{id: ${decoded.id}}`);

        return next();
        
    } catch (error) {
        req.flash('error', 'Session expired');
        return res.redirect('/api/admins/login');
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