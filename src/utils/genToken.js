import jwt from 'jsonwebtoken';

// GENERATES JWT TOKEN
const librarianAccessToken = (id)=> {
    return jwt.sign({ id }, process.env.JWT_LIB, { expiresIn: process.env.EXPIRES_IN });
}

const librarianRefreshToken = (id)=> {
    return jwt.sign({ id }, process.env.LIB_REFRESH, { expiresIn: process.env.EXPIRES_IN });
}

const adminAccessToken = (id)=> {
    return jwt.sign({ id }, process.env.JWT_ADM, { expiresIn: process.env.EXPIRES_IN });
}

const adminRefreshToken = (id)=> {
    return jwt.sign({ id }, process.env.ADM_REFRESH, { expiresIn: process.env.REFRESH_EXPIRES });
}

const libResetToken = (id)=> {
    return jwt.sign({ id }, process.env.LIB_RESET, { expiresIn: process.env.PASS_EXPIRES });
}

export { librarianAccessToken, librarianRefreshToken, adminAccessToken, adminRefreshToken, libResetToken };