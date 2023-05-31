const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');

router.get('/is-admin/signup', adminController.register);

module.exports = router;