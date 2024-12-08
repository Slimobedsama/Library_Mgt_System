import Librarian from '../models/librarianModel.js';
import bcrypt from 'bcrypt';
import { librarianToken, libResetToken } from '../utils/genToken.js';
import emailSender from '../utils/email.js';

// COOKIE-PARSER EXPIRATION
const EXPIRES = 2 * 60 * 60 * 1000;

export const getEveryLibrarian = async(req, res, next)=> {
    try {
        const allLibrarian = await Librarian.find().sort({firstName: 'asc'});
        return res.status(200).json(allLibrarian);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
    next();
}

export const getOneLibrarian = async(req, res, next)=> {
    const id = req.params.id;
    try {
        const single = await Librarian.findById(id);
        if(single) {
            return res.status(200).json({message: `Found librarian with id ${id}`, single});
        }
        throw new Error(`Librarian with id ${id} not found`);
    } catch (err) {
        res.status(404).json({errors: err.message});
    }
    next();
}

export const reqisterLibrarian = async(req, res, next)=> {
    const { lastName, firstName, email, phone, password } = req.body;
    try {
        // PASSWORD HASHING
        const encryptedPassword = await bcrypt.hash(password, 12);
        // CREATES A LABRARIAN
        const createLibrarian = await Librarian.create({
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            email: req.body.email,
            phone: req.body.phone,
            password: encryptedPassword
        });
        // CREATES JWT TOKEN
        const token = librarianToken(createLibrarian._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: EXPIRES});
        return res.status(201).json({message: 'Successful Creation', Librarian: createLibrarian._id});
    } catch (err) {Librarian
        res.status(400).json({errors: err.message});
    }
    next();
}


export const accessLibrarian = async(req, res)=> {
    const { email, password } = req.body;
    try {
        const checkEmail = await Librarian.findOne({ email });
        // VALIDATE PASSWORD AND EMAIL
        if(checkEmail) {
            const checkPassword = await bcrypt.compare(password, checkEmail.password);
            if(checkPassword) {
                const token = librarianToken(checkEmail._id);
                res.cookie('jwt', token, {httpOnly: true, maxAge: EXPIRES});
                return res.status(200).json({message: 'Successful Login', Librarian: checkEmail._id});
            }
            throw new Error('Incorrect Password');
        }
        throw new Error('Incorrect email');
    } catch (err) {
        console.log(err)
        res.status(400).json({errors: err.message});
    }
}

export const modifyLabrarian = async(req, res, next)=> {
    const id = req.params.id;
    const { lastName, firstName, phone, password } = req.body;
    try {
        const hidePass = await bcrypt.hash(password, 12);
        const updateData = await Librarian.findByIdAndUpdate(id, { lastName, firstName, phone, password:hidePass }, { new: true });
        if(updateData) {
            if(lastName || firstName || phone || password) {
                return res.status(201).json({message: 'Update Successful', updateData});
            }
        }
        return res.status(404).json({errors: `Librarian with id ${id} not found`});
    } catch (err) {
        console.log(err.message)
        res.status(400).json({errors: err.message});
    }
    next();
}

export const removeLibrarian = async(req, res, next)=> {
    const id = req.params.id;
    try {
        const delLib = await Librarian.findByIdAndDelete(id);
        if(!delLib) {
            throw new Error(`Librarian with id ${id} not found.`);
        } else {
            res.status(200).json({message: `Librarian with id ${id} deleted...`, delLib:delLib._id});
        }
    } catch (err) {
        console.log(err.message)
        res.status(404).json({error: err.message})
    }
    next();
}

export const librarianLostPassword = async(req, res)=> {
    const { email } = req.body;
    try {
        // CHECK FOR EXISTING EMAIL
        const findEmail = await Librarian.findOne({ email });
        if(!findEmail) {
            throw new Error('This Email Is Not Found');
        }
        const id = findEmail._id; // RETRIEVES THE ID FROM SAVE EMAIL
        // GENERATE TOKEN
        const resetToken = libResetToken(findEmail._id);
        res.cookie('jwt', resetToken, { httpOnly: true, maxAge: 10 * 60 * 1000});
        // // SEND EMAIL WITH TOKEN
        await emailSender({
            from: `Library Support Team <${process.env.SENDER_EMAIL}>`,
            to: 'slimobedsama@yahoo.com',
            subject: 'Password Reset Link',
            html: `<h2>Please Click on the Link For Password Reset <a href="http://localhost:9000/api/librarian/reset-password/${id}">${resetToken}</a></h2>`
        })
        return res.status(200).json({ message: 'Email Sent' });
    } catch (err) {
        res.status(404).json({ error: err.message});
    }
}

export const librarianResetPass = async(req, res, next)=> {
    const { password } = req.body;
    const id = req.params.id;
    try {
        // FIND ADMIN ID
        const findId = await Librarian.findById(id);
        // HASH PASSWORD
        const encryptPassword = await bcrypt.hash(password, 12);
        findId.password = encryptPassword;
        findId.save();
        res.status(201).json({ message: 'Password Reset Successful' });
    } catch (err) {
        console.log(err.message)
        res.status(400).json({ error: err.message });
    }
    next();
}