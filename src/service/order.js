import ApiErrors from "../errors/ApiErrors.js";
import Book from "../models/book.js";
import Order from "../models/order.js";

export const findAllOrders = async()=> {
    const findOrders = await Order.find().select('-createdAt -updatedAt')
    .populate('book',['author', 'title'])
    .populate('user',['lastName', 'firstName']);
    if(!findOrders) {
        throw ApiErrors.internalServer('Error fetching orders');
    }

    return findOrders;
}

export const findSingleOrder = async(params)=> {
    const { id } = params;
    const findOneOrder = await Order.findById(id).select('-createdAt -updatedAt')
    .populate('book',['author', 'title'])
    .populate('user',['lastName', 'firstName']);

    if(!findOneOrder) {
        throw ApiErrors.notFound(`Order with id ${ id } not found`);
    }
    return findOneOrder;
}

export const newOrder = async(body, params)=> {
    const { book } = body;
    // CHECK FOR BOOK ID FROM THE BOOK DOCUMENT
    const getBookId = await Book.findById(book);
    // CHECKS FOR AVAILABLITY OF BOOK BEFORE CREATING AN ORDER
    if(getBookId.quantity < 1) {
        throw ApiErrors.notFound('Book is out of stock');
    }
    // CREATE A NEW ORDER
    const newBookOrder = await Order.create(body);
    // CHECKS FOR QUANTITY OF BOOKS AND AVAILABILITY
    if(getBookId) {
         // DECREASE QUANTITY BY 1 WHEN ORDER IS CREATED
        getBookId.quantity -= 1;
        if(getBookId.quantity === 0) {
            // SET AVAILABILITY TO FALSE
            getBookId.isAvailable = false;
        }
    }
    await getBookId.save();
    return {newBookOrder, getBookId};
}

export const deleteOrder = async(params)=> {
    const { id } = params;
    const delOrder = await Order.findByIdAndDelete(id);

    if(!delOrder) {
        throw ApiErrors.notFound(`Order with id ${ id } not found`);
    }
    // CHECKS FOR BOOK ID THROUGH THE DELETE ORDER
    const findBookId = await Book.findById(delOrder.book);

    if(findBookId) {
        // INCREASE QUANTITY BY 1 WHEN ORDER IS DELETED
        findBookId.quantity += 1;
        if(findBookId.quantity > 0) {
            // SET AVAILABILITY TO TRUE
            findBookId.isAvailable = true;
        }
    }
    await findBookId.save();
    return delOrder;
}