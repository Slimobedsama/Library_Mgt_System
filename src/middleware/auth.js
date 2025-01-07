import jwt from 'jsonwebtoken';

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

export { adminAuth, librarianAuth  };