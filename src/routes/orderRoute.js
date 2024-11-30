import express from 'express';
const Router = express.Router();
import { allOrder, createOrder, removeOrder } from '../controller/orderController.js';


Router.get('/', allOrder);
Router.post('/create', createOrder);
Router.delete('/:id', removeOrder);

export default Router;