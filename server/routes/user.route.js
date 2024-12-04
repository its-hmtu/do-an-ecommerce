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
  setDefaultAddress,
  updateAddress,
  deleteAddress,
  addAddress,
  changeUserInfo,
  changePassword,
  passwordReset
} = require('../controllers/user.controller');
const { mustBeAuthenticated } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/verify-email', emailVerify);
router.post('/login', login);
router.get('/logout', mustBeAuthenticated, logout);

router.get('/password-reset',  passwordReset)

router.get('/me', mustBeAuthenticated, getUserData);
router.put('/me', mustBeAuthenticated, changeUserInfo);
router.put('/me/password', mustBeAuthenticated, changePassword);

router.get('/cart', mustBeAuthenticated, getUserCart);
router.post('/cart', mustBeAuthenticated, addToCart);
router.put('/cart', mustBeAuthenticated, updateCartItem);
router.put('/cart/subtotal', mustBeAuthenticated, updateCartSubtotal);
router.delete('/cart', mustBeAuthenticated, removeFromCart);

router.post('/address', mustBeAuthenticated, addAddress);
router.put('/address/default/:addressId', mustBeAuthenticated, setDefaultAddress);
router.put('/address/:addressId', mustBeAuthenticated, updateAddress);
router.delete('/address/:addressId', mustBeAuthenticated, deleteAddress);

module.exports = router;