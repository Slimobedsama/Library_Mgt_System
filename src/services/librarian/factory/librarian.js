import ApiErrors from "../../../errors/ApiErrors.js";
import bcrypt from 'bcrypt';
import emailSender from "../../../utils/email.js";
import { librarianToken, libResetToken } from "../../../utils/genToken.js";
import LibrarianDao from "../dao/librarianDao.js";
import Librarian from "../model/librarian.js";


export const getAllLibrarian = async function() {
    const allLibrarian = await LibrarianDao.allLibrian();
    
    if(!allLibrarian) {
        throw ApiErrors.internalServer('Error fetching Librarians');
    }
    
    return allLibrarian;
}

export const getSingleLibrarian = async function(params) {
    const { id } = params;
    const singleLibrarian = await LibrarianDao.getOneLibrarian(id);

    if(!singleLibrarian) {
        throw ApiErrors.notFound(`Librarian with id ${ id } not found`);
    }
    return singleLibrarian;
}

export const signupLibrarian = async function(body) {
    const createLibrarian = await Librarian.create(body);
    const token = librarianToken(createLibrarian._id);

    return { createLibrarian, token };
}

export const signInLibrarian = async function(body) {
    const { email, password} = body;
    const checkEmail = await Librarian.findOne({ email });
    if(checkEmail) {
        const checkPassword = await bcrypt.compare(password, checkEmail.password);
        if(checkPassword) {
            const token = librarianToken(checkEmail._id);    
            return { checkEmail, token };
        }
        throw ApiErrors.notFound('Incorrect password');
    }
    throw ApiErrors.notFound('This email does not exist');
}

export const updateLibrarian = async function(body, params) {
    const { id } = params;
    const { lastName, firstName, phone, password } = body;
    const updatePasswd = await bcrypt.hash(password, 12);
    const updateData = await Librarian.findByIdAndUpdate(id, { lastName, firstName, phone, password: updatePasswd }, { new: true });

    if(!updateData) {
        throw ApiErrors.badRequest('Bad request');
    }
    return updateData;
}

export const deleteLibrarian = async function(params) {
    const { id } = params;
    const delLibrarian = await Librarian.findByIdAndDelete(id);

    if(!delLibrarian) {
        throw ApiErrors.notFound(`Librarian with id ${id} not found.`)
    }
    
    return delLibrarian;
}

export const librarianForgotPasswd = async function(body) {
    const { email } = body;
    const findEmail = await Librarian.findOne({ email });

    if(!findEmail) {
        throw new Error('This email is not found');
    }

    const librarianId = findEmail._id; // RETRIEVES THE ID FROM SAVE EMAIL
    // GENERATE TOKEN
    const resetToken = libResetToken(findEmail._id);
    await emailSender({
        from: `Library Support Team <${process.env.SENDER_EMAIL}>`,
        to: `${ findEmail.email }`,
        subject: 'Password Reset Link',
        html: `<h2>Please Click on the link For rassword Reset<br><a href="http://localhost:9000/api/librarians/reset-password/${ librarianId }">${ resetToken }</a></h2>`
    });

    return { librarianId, resetToken };
}

export const librarianPassReset = async function(body, params, cookies) {
    const { id } = params;
    const { password } = body;
    const { reset } = cookies;
    
    if(!reset) {
        throw ApiErrors.unathourizedAcess('Invalid token');
    }
    
    let findId = await Librarian.findById(id);
    const hashedPassword = await bcrypt.hash(password, 12);
    findId.password = hashedPassword;
    return findId.save();
}