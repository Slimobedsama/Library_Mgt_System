const express = require('express');
const Router = express.Router();
const adminController = require('../controller/adminController');

Router.post('/is-admin-signup', adminController.register);
Router.post('/login', adminController.access);

module.exports = Router;