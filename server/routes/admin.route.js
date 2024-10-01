const express = require('express');
const router = express.Router();
const {
  mustBeAuthenticated,
  isAdmin
} = require('../middlewares/auth.middleware');
const {
  login,
  getCurrentAdmin,
  getRoles,
  createRole,
  updateRole
} = require('../controllers/admin.controller');

router.post('/login', login);
router.get('/me', mustBeAuthenticated, getCurrentAdmin);
router.get('/roles', mustBeAuthenticated, isAdmin, getRoles);
router.post('/roles', mustBeAuthenticated, isAdmin, createRole);
router.put('/roles/:id', mustBeAuthenticated, isAdmin, updateRole);

module.exports = router;