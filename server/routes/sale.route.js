const express = require('express');
const router = express.Router();
const {
  getStatistics,
  // getProductRanking
} = require('../controllers/sale.controller');

router.get('/statistics', getStatistics);
// router.get('/ranking/products',  getProductRanking);

module.exports = router;