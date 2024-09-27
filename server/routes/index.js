var express = require('express');
var router = express.Router();
var indexController = require('../controllers/index.js');
const { refresh } = require('../controllers/auth.controller');
/* GET home page. */
router.get('/', indexController.getIndex);
router.get('/api/refresh', refresh);
module.exports = router;
