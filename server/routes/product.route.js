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
  getSingleProductBySlug,
  getProductsByCategory,
  getProductsBySearch,
  getProductsByBrand,
  createReview,
  getProductsBySeries,
  getProductsWithFeatured
} = require('../controllers/product.controller');
const { trackUniqueViews } = require('../middlewares/product.middleware');
// const checkCache = require('../middlewares/cache.middleware');

router.get("/", getProducts) 
router.post('/', createProduct);

router.delete('/',  deleteProducts);
router.delete('/:id',deleteProduct);
// delete multiple products
router.put('/:id', updateProduct);

router.get('/id/:id', getSingleProduct);

router.get('/category/:category_name', getProductsByCategory);

router.get('/search', getProductsBySearch);

router.get('/slug/:slug', trackUniqueViews, getSingleProductBySlug);

router.get('/brand/:brand_name', getProductsByBrand);

router.get('/series/:series_name', getProductsBySeries);

router.get('/featured', getProductsWithFeatured);

router.post('/review', mustBeAuthenticated, createReview);

module.exports = router;