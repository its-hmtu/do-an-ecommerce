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

router.get("/categories", getCategories);

router.get("/categories/all", getAll);

router.post(
  "/categories",
  mustBeAuthenticated,
  isAdmin,
  setUploadPath("./public/images/categories"),
  upload.array("images", 6),
  createCategory
);

router.get("/categories/:id", getSinglecategory);

router.delete("/categories/:id", mustBeAuthenticated, isAdmin, deleteCategory);

module.exports = router;
