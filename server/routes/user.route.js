const router = require('express').Router();
const {
  register,
  login,
  logout,
  getUserData,
  getUserCart,
  addToCart,
  updateCartItem,
} = require('../controllers/user.controller');
const { mustBeAuthenticated } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', mustBeAuthenticated, logout);
router.get('/me', mustBeAuthenticated, getUserData);
router.get('/cart', getUserCart);
router.post('/cart', addToCart);
router.put('/cart', updateCartItem);

module.exports = router;