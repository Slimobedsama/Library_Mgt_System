const jwt = require('jsonwebtoken');

// GENERATES JWT TOKEN
const librarianToken = (id)=> {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: process.env.EXPIRES_IN });
}

const adminToken = (id)=> {
    return jwt.sign({ id }, process.env.JWT_SECRETE, { expiresIn: process.env.EXPIRES_IN });
}

const passToken = (id)=> {
    return jwt.sign({ id }, process.env.JWT_PASS, { expiresIn: process.env.PASS_EXPIRES });
}

module.exports = { librarianToken, adminToken, passToken };