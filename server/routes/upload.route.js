const express = require('express');
const router = express.Router();
const { setUploadPath } = require("../middlewares/upload.middleware");
const upload = require("../utils/upload");
const { uploadImages, deleteImage } = require('../controllers/upload.controller');

router.post('/', setUploadPath("./public/images/upload"), upload.array("images", 6), uploadImages);
router.delete('/:id', deleteImage);
module.exports = router;