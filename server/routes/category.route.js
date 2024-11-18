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
  getAll,
  createCategory,
  getSinglecategory,
  deleteCategory
} = require("../controllers/category.controller");
const checkCache = require("../middlewares/cache.middleware");

router.get("/", getCategories);

router.get("/all", getAll);

router.post(
  "/",
  setUploadPath("./public/images/categories"),
  upload.array("images", 6),
  createCategory
);

router.get("/:id", getSinglecategory);

router.delete("/:id", deleteCategory);

module.exports = router;
