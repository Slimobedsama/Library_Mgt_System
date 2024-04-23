const Librarian = require('../models/librarianModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const {librarianToken} = require('../utils/genToken');

// COOKIE-PARSER EXPIRATION
const EXPIRES = 2 * 60 * 60 * 1000;

exports.all = async(req, res, next)=> {
    try {
        const allLibrarian = await Librarian.find().sort({firstName: 'asc'});
        return res.status(200).json(allLibrarian);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
    next();
}

exports.getOne = async(req, res, next)=> {
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

exports.create = async(req, res, next)=> {
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


exports.gainAccess = async(req, res)=> {
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

exports.modify = async(req, res, next)=> {
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

exports.remove = async(req, res, next)=> {
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