const express = require('express');
const Router = express.Router();
const orderController = require('../controller/orderController');


Router.get('/', orderController.allOrder);

module.exports = Router;