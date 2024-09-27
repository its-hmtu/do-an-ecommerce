const express = require('express');
const router = express.Router();
const {
  mustBeAuthenticated,
  isAdmin
} = require('../middlewares/auth.middleware');
const {
  login,
  getRoles,
  createRole
} = require('../controllers/admin.controller');

router.post('/login', login);
router.get('/roles', mustBeAuthenticated, isAdmin, getRoles);
router.post('/roles', mustBeAuthenticated, isAdmin, createRole);

module.exports = router;