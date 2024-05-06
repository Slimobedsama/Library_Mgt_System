const express = require('express');
const Router = express.Router();
const orderController = require('../controller/orderController');


Router.get('/', orderController.allOrder);
Router.post('/create', orderController.createOrder);

module.exports = Router;