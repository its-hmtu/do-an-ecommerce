const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const {isAdmin, mustBeAuthenticated} = require('../middlewares/auth.middleware');
const {setUploadPath} = require('../middlewares/upload.middleware');
const {
  getTags
} = require('../controllers/tag_category.controller');

router.get('/categories', )
router.get('/tags', getTags);
router.post('/categories', mustBeAuthenticated, isAdmin, setUploadPath('./public/images/categories'), upload.array('images', 6), );
router.post('/tags', mustBeAuthenticated, isAdmin, setUploadPath('./public/images/tags'), upload.array('images', 6), );

module.exports = router;