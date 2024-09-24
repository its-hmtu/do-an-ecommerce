const express = require('express');
const router = express.Router();
const {
  mustBeAuthenticated, 
  isAdmin
} = require('../middlewares/auth.middleware');
const { setUploadPath } = require("../middlewares/upload.middleware");
const upload = require("../utils/upload");
const {
  getProducts,
  createProduct,
} = require('../controllers/product.controller');

router.get("/", getProducts) 
router.post('/', mustBeAuthenticated, isAdmin, setUploadPath("./public/images/products"), upload.array("images", 6), createProduct);

module.exports = router;