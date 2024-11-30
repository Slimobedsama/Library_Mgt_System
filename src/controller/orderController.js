import Book from '../models/bookModel.js';
import Order from '../models/orderModel.js';

export const allOrder = async(req, res, next)=> {
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

export const createOrder = async(req, res, next)=> {
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

export const removeOrder = async(req, res, next)=> {
    const id = req.params.id;
    const { book } = req.body;
    try {
        const removeOrder = await Order.findByIdAndDelete(id);
        if(!removeOrder) {
            throw new Error(`No order with id ${ id } was found`);
        }
        // FIND THE BOOK ID THROUGH THE REMOVED ORDER
        const findBookId = await Book.findById(removeOrder.book);
        // CHECK FOR QUANTITY AND AVAILABILITY
        if(findBookId) {
            // INCREMENT QUANTITY BY 1 AFTER DELETING ORDER
            findBookId.quantity += 1;
            if(findBookId.quantity > 0) {
                // SET AVAILABLE TRUE
                findBookId.isAvailable = true;
            }
        }
        await findBookId.save();
        return res.status(200).json({ message: 'Successfully deleted' });
    } catch (err) {
        console.log(err.message);
        res.status(404).json({ error: err.message });
    }
}