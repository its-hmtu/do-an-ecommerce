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

router.get('/', getOrders);
// get Orders by status
router.get('/user', getUserOrders);
router.post('/', createOrder);
router.get('/status', getOrdersByStatus);
router.get('/check-status', sessionStatus);
router.post('/create-checkout-session', createCheckoutSession);

router.put('/status/:id', updateOrderPaid);
router.put('/ship-order', shipOrder);
router.put('/mass-ship-order', massShipOrder);
router.put('/complete-order', completeOrder);

router.get("/order/:id", getSingleOrder);

router.get('/export', exportOrdersToExcel);

module.exports = router;