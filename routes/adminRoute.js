const express = require('express');
const Router = express.Router();
const adminController = require('../controller/adminController');
const { resetAuth } = require('../middleware/auth');
const { adminSingupVal, resetPassValidate } = require('../utils/dataValidation');

Router.get('/', adminController.allAdmin);
Router.post('/is-admin-signup', adminSingupVal, adminController.register);
Router.post('/login', adminController.access);
Router.post('/forgotten-password', adminController.lostPass);
Router.post('/reset-password/:id', resetAuth, resetPassValidate, adminController.retrievePass);

module.exports = Router;