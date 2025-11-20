import { deleteOrder, findAllOrders, findSingleOrder, newOrder } from '../factory/order.js';
import tryCatch from '../../../utils/tryCatch.js';

export const allOrder = tryCatch(async(req, res)=> {
    const findOrders = await findAllOrders();
    return res.status(200).json({ message: 'Success', data: findOrders });
});

export const getOneOrder = tryCatch(async(req, res)=> {
    const findOneOrder = await findSingleOrder(req.params);
    return res.status(200).json({ message: 'Success', data: findOneOrder });
});

export const createOrder = tryCatch(async(req, res)=> {
    const newBookOrder = await newOrder(req.body);
    res.status(201).json({ message: 'Success', data: newBookOrder });
});

export const removeOrder = tryCatch(async(req, res)=> {
    const delOrder = await deleteOrder(req.params);
    return res.status(200).json({ message: 'Successfully deleted' });
});