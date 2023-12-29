const express = require('express');
const Router = express.Router();
const adminController = require('../controller/adminController');
const { adminSingupVal } = require('../utils/dataValidation');
const { resetAuth } = require('../middleware/auth');

Router.get('/', adminController.allAdmin);
Router.post('/is-admin-signup', adminSingupVal, adminController.register);
Router.post('/login', adminController.access);
Router.post('/forgotten-password', adminController.lostPass);
Router.post('/reset-password', resetAuth, adminController.retrievePass);

module.exports = Router;