const Order = require('../models/orderModel');

exports.allOrder = async(req, res, next)=> {
    try {
        const getAllOrders = await Order.find().populate('book')
        .populate('user');
        return res.status(200).json({ message: 'Success', data: getAllOrders });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
    }
    next();
}

exports.createOrder = async(req, res, next)=> {
    let { book, user } = req.body;
    try {
        const newOrder = await Order.create(req.body);
        res.status(201).json({ message: 'Success', data: newOrder });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
    next();
}