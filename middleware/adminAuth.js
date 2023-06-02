const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next)=> {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, process.env.JWT_KEY, (err, decoded)=> {
            if(err) {
                res.status(401).json({error: 'Unauthorized Access'});
            } else {
                console.log(decoded);
                next();
            }
        })
    } else {
        res.status(403).json({error: 'Forbidden'});
    }
}

module.exports = adminAuth;