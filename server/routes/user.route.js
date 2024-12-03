const router = require('express').Router();
const {
  register,
  login,
  logout,
  getUserData,
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  updateCartSubtotal,
  emailVerify,
} = require('../controllers/user.controller');
const { mustBeAuthenticated } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/verify-email', emailVerify);
router.post('/login', login);
router.get('/logout', mustBeAuthenticated, logout);
router.get('/me', mustBeAuthenticated, getUserData);
router.get('/cart', getUserCart);
router.post('/cart', addToCart);
router.put('/cart', updateCartItem);
router.put('/cart/subtotal', updateCartSubtotal);
router.delete('/cart', removeFromCart);

module.exports = router;