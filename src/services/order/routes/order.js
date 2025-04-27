import express from 'express';
const Router = express.Router();
import { allOrder, createOrder, getOneOrder, removeOrder } from '../controller/order.js';
import { librarianAuth } from '../../../middleware/auth.js';


Router.get('/', librarianAuth, allOrder);
Router.get('/:id', librarianAuth, getOneOrder);
Router.post('/create', librarianAuth, createOrder);
Router.delete('/:id', librarianAuth, removeOrder);

export default Router;