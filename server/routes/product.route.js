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
  deleteProduct,
  deleteProducts,
  updateProduct
} = require('../controllers/product.controller');

router.get("/", getProducts) 
router.post('/', mustBeAuthenticated, isAdmin, setUploadPath("./public/images/products"), upload.array("images", 6), createProduct);
router.delete('/:id', mustBeAuthenticated, isAdmin, deleteProduct);
// delete multiple products
router.delete('/', mustBeAuthenticated, isAdmin, deleteProducts);
router.put('/:id', mustBeAuthenticated, isAdmin, setUploadPath("./public/images/products"), upload.array("images", 6), updateProduct);

module.exports = router;