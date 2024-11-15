const express = require('express');
const router = express.Router();
const {
  getStatistics,
  exportReports
} = require('../controllers/sale.controller');

router.get('/statistics', getStatistics);
router.get('/export', exportReports);

module.exports = router;