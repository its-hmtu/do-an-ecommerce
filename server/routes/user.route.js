const router = require('express').Router();
const {
  register,
  login,
  logout,
  getUserData
} = require('../controllers/user.controller');
const { mustBeAuthenticated } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', mustBeAuthenticated, logout);
router.get('/me', mustBeAuthenticated, getUserData);

module.exports = router;