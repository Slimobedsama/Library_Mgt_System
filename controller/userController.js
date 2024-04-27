const User = require('../models/userModel');

exports.all = async(req, res, next)=> {
    try {
        const allUsers = await User.find().sort({firstName: 'asc'});
        return res.status(200).json(allUsers);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
    next();
}

exports.register = async(req, res, next)=> {
    const { lastName, firstName, sex, address, phoneNumber, email } = req.body;
    try {
        const newUser = await User.create(req.body);
        return res.status(201).json({ message: 'Success', data: newUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    next();
}

exports.getOne = async(req, res, next)=> {
    const id = req.params.id;
    try {
        const singleUser = await User.findById(id);
        if(singleUser) {
            return res.status(200).json( {message: `Found user with id ${id}`, singleUser });
        }
        throw new Error(`User with id ${id} not found`);
    } catch (err) {
        res.status(404).json({ errors: err.message });
    }
    next();
}

exports.modify = async(req, res, next)=> {
    const id = req.params.id;
    const { address, phoneNumber } = req.body;
    try {
        const updateData = await User.findByIdAndUpdate(id, { address, phoneNumber }, { new: true });
        if(updateData) {
            if(address || phoneNumber) {
                return res.status(201).json({ message: 'Update Successful', data: updateData });
            }
        }
        return res.status(404).json({ errors: `User with id ${id} not found` });
    } catch (err) {
        console.log(err.message)
        res.status(400).json({ errors: err.message });
    }
}

exports.remove = async(req, res, next)=> {
    const id = req.params.id;
    try {
        const removeUser = await User.findByIdAndDelete(id);
        if(!removeUser) {
            throw new Error(`User with id ${id} not found `)
        }
        return res.status(200).json({ message: 'Deleted' });
    } catch (err) {
        console.log(err.message);
        res.status(404).json({ errors: err.message });
    }
}