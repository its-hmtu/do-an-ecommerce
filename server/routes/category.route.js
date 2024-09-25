const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const {
  isAdmin,
  mustBeAuthenticated,
} = require("../middlewares/auth.middleware");
const { setUploadPath } = require("../middlewares/upload.middleware");
const {
  getCategories,
  createCategory,
} = require("../controllers/category.controller");

router.get("/categories", getCategories);
router.post(
  "/categories",
  mustBeAuthenticated,
  isAdmin,
  setUploadPath("./public/images/categories"),
  upload.array("images", 6),
  createCategory
);


module.exports = router;
