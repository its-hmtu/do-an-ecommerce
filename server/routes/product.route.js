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
  updateProduct,
  getSingleProduct,
  getProductsByCategory,
  getProductsBySearch
} = require('../controllers/product.controller');

router.get("/", getProducts) 
router.post('/', mustBeAuthenticated, isAdmin, setUploadPath("./public/images/products"), upload.array("images", 6), createProduct);
router.delete('/:id', mustBeAuthenticated, isAdmin, deleteProduct);
// delete multiple products
router.delete('/', mustBeAuthenticated, isAdmin, deleteProducts);
router.put('/:id', mustBeAuthenticated, isAdmin, setUploadPath("./public/images/products"), upload.array("images", 6), updateProduct);
router.get('/:id', getSingleProduct);
router.get('/category/:id', getProductsByCategory);
router.get('/search', getProductsBySearch);
module.exports = router;