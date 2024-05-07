const Book = require('../models/bookModel');
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
        // CHECK FOR BOOK ID FROM THE BOOK DOCUMENT
        let findBookId = await Book.findById(book);
        // CHECKS FOR AVAILABLITY OF BOOK BEFORE CREATING AN ORDER
        if(findBookId.quantity < 1) {
            throw new Error('Out of stock');
        }
        // CREATE A NEW ORDER
        const newOrder = await Order.create(req.body);
        // CHECKS FOR QUANTITY OF BOOKS AND AVAILABILITY
        if(findBookId) {
            // DECREASE QUANTITY BY 1 WHEN ORDER IS CREATED
            findBookId.quantity -= 1;
            if(findBookId.quantity === 0) {
                // SET AVAILABILITY TO FALSE
                findBookId.isAvailable = false;
            }
        }
        await findBookId.save();
        res.status(201).json({ message: 'Success', data: newOrder });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
    next();
}