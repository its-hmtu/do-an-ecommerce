const express = require('express');
const router = express.Router();
const {
  mustBeAuthenticated,
  isAdmin
} = require('../middlewares/auth.middleware');
const {
  login,
  logout,
  getCurrentAdmin,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/admin.controller');

router.post('/login', login);
router.post('/logout', mustBeAuthenticated, logout);
router.get('/me', mustBeAuthenticated, getCurrentAdmin);
router.get('/roles', mustBeAuthenticated, isAdmin, getRoles);
router.post('/roles', mustBeAuthenticated, isAdmin, createRole);
router.put('/roles/:id', mustBeAuthenticated, isAdmin, updateRole);
router.delete('/roles/:id', mustBeAuthenticated, isAdmin, deleteRole);

module.exports = router;