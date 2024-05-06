const Order = require('../models/orderModel');

exports.allOrder = async(req, res, next)=> {
    try {
        const getAllOrders = await Order.find().populate().sort({ lastName: 'asc' });
        return res.status(200).json({ message: 'Success', data: getAllOrders });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
    }
    next();
}