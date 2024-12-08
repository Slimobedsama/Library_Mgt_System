import jwt from 'jsonwebtoken';

// GENERATES JWT TOKEN
const librarianToken = (id)=> {
    return jwt.sign({ id }, process.env.JWT_LIB, { expiresIn: process.env.EXPIRES_IN });
}

const adminToken = (id)=> {
    return jwt.sign({ id }, process.env.JWT_ADM, { expiresIn: process.env.EXPIRES_IN });
}

const adminResetToken = (id)=> {
    return jwt.sign({ id }, process.env.ADM_RESET, { expiresIn: process.env.PASS_EXPIRES });
}

const libResetToken = (id)=> {
    return jwt.sign({ id }, process.env.LIB_RESET, { expiresIn: process.env.PASS_EXPIRES });
}

export { librarianToken, adminToken, adminResetToken, libResetToken };