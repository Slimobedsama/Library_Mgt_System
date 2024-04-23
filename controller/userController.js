const User = require('../models/userModel');

exports.register = async(req, res, next)=> {
    const { lastName, firstName, address, sex, email } = req.body;
    try {
        const newUser = await User.create(req.body);
        return res.status(201).json({ message: 'Success', data: newUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    next();
}