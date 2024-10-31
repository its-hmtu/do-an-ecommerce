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
router.post('/', createProduct);

router.delete('/',  deleteProducts);
router.delete('/:id',deleteProduct);
// delete multiple products
router.put('/:id', updateProduct);
router.get('/:id', getSingleProduct);
router.get('/category/:id', getProductsByCategory);
router.get('/search', getProductsBySearch);
module.exports = router;