const express = require('express');
const Router = express.Router();
const adminController = require('../controller/adminController');
const { adminSingupVal } = require('../utils/dataValidation');

Router.post('/is-admin-signup', adminSingupVal, adminController.register);
Router.post('/login', adminController.access);

module.exports = Router;