const express = require('express');
const router = express.Router();
const checkCache = require('../middlewares/cache.middleware');
const {
  getOrders,
  getUserOrders,
  createOrder,
  updateOrderPaid,
  sessionStatus,
  createCheckoutSession,
  getSingleOrder,
  shipOrder,
  completeOrder,
  massShipOrder,
  getOrdersByStatus,
  exportOrdersToExcel
} = require('../controllers/order.controller');
const { mustBeAuthenticated } = require('../middlewares/auth.middleware');

router.get('/', getOrders);
// get Orders by status
router.post('/', mustBeAuthenticated, createOrder);

router.get('/user', mustBeAuthenticated, getUserOrders);

router.get('/check-status', mustBeAuthenticated, sessionStatus);
router.post('/create-checkout-session', mustBeAuthenticated, createCheckoutSession);

router.get('/status', getOrdersByStatus);

router.put('/status/:id', updateOrderPaid);
router.put('/ship-order', shipOrder);
router.put('/mass-ship-order', massShipOrder);
router.put('/complete-order', completeOrder);

router.get("/order/:id", getSingleOrder);

router.get('/export', exportOrdersToExcel);

module.exports = router;