const jwt = require('jsonwebtoken');

// GENERATES JWT TOKEN
const createToken = (id)=> {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: process.env.EXPIRES_IN });
}

module.exports = createToken;