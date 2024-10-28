const {
  Tag,
  Category,
  TagImage,
  CategoryImage,
  Product,
  sequelize,
} = require("../models");
const fs = require("fs");
const { Op } = require("sequelize");

exports.getCategories = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.limit) || 10;
  const q = req.query.q;
  const offset = (page - 1) * pageSize;

  const where = {};

  if (q) {
    where.name = {
      [Op.like]: `%${q}%`,
    };
  }

  try {
    const categories = await Category.findAndCountAll({
      limit: pageSize,
      offset: offset,
      where: where,
      include: [
        {
          model: CategoryImage,
          as: "images",
          where: {
            category_id: {
              [Op.ne]: null,
            },
          },
          attributes: [
            "file_name",
            "file_path",
            "file_size",
            "original_name",
            "mime_type",
          ],
          // required: false,
        },
      ],
      distinct: true,
    });

    if (!categories) {
      res.status(404);
      return next(new Error("Categories not found"));
    }

    const totalItemCount = categories.count;
    const currentItemCount = categories.rows.length;
    const currentPage = page;
    const totalPages = Math.ceil(totalItemCount / pageSize);
    const prevPage = page > 1 ? page - 1 : null;

    const pagination = {
      total_item_count: totalItemCount,
      current_item_count: currentItemCount,
      total_pages: totalPages,
      current_page: currentPage,
      prev_page: prevPage,
    };

    return res.status(200).json({
      data: {
        ...pagination,
        categories: categories.rows,
      },
    });
  } catch (error) {
    res.status(500);
    return next(error);
  }
};

exports.getSinglecategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id, {
      include: [
        {
          model: CategoryImage,
          as: "images",
          where: {
            category_id: {
              [Op.ne]: null,
            },
          },
          attributes: [
            "file_name",
            "file_path",
            "file_size",
            "original_name",
            "mime_type",
          ],
          required: false,
        },
      ],
    });

    if (!category) {
      res.status(404);
      return next(new Error("Category not found"));
    }

    return res
      .status(200)
      .json({ message: "Category retrieved", success: true, data: category });
  } catch (e) {
    res.status(500);
    return next(e);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: CategoryImage,
          as: "images",
          where: {
            category_id: {
              [Op.ne]: null,
            },
          },
          attributes: [
            "file_name",
            "file_path",
            "file_size",
            "original_name",
            "mime_type",
          ],
          required: false,
        },
      ],
      distinct: true,
    });

    if (!categories) {
      res.status(404);
      return next(new Error("Categories not found"));
    }

    const totalItemCount = categories.length;

    return res.status(200).json({
      total_item_count: totalItemCount,
      data: categories,
      message: "Categories retrieved",
      success: true,
    });
  } catch (error) {
    res.status(500);
    return next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  const { name, description } = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });

  if (name == null || name.length === 0) {
    res.status(400);
    return next(new Error("Category name is required"));
  }

  const existingCategory = await Category.findOne({
    where: {
      name: name,
    },
  });

  if (existingCategory) {
    res.status(400);
    return next(new Error("Category already exists"));
  }

  try {
    const category = await Category.create(
      {
        name: name,
        description: description,
      },
      { transaction }
    );

    let results = [];

    for (let i = 0; req.files !== null && i < req.files.length; i++) {
      let file = req.files[i];
      let file_path = file.path.replace(new RegExp("\\\\", "g"), "/");
      file_path = file_path.replace("public", "");
      const image = await CategoryImage.create(
        {
          category_id: category.id,
          file_name: file.filename,
          file_path: file_path,
          mime_type: file.mimetype,
          original_name: file.originalname,
          file_size: file.size,
        },
        { transaction }
      );

      results.push(image);
    }

    category.images = results;
    await transaction.commit();

    return res
      .status(201)
      .json({ message: "Category created", category: category });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    // remove images from disk
    if (req.files !== null) {
      for (let i = 0; i < req.files.length; i++) {
        fs.unlinkSync(req.files[i].path);
      }
    }
    res.status(500);
    return next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });

  if (name == null || name.length === 0) {
    res.status(400);
    return next(new Error("Category name is required"));
  }

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      await transaction.rollback();
      res.status(404);
      return next(new Error("Category not found"));
    }

    category.name = name || category.name;
    category.description = description || category.description;
    await category.save();
    await transaction.commit();

    return res.status(200).json({ message: "Category updated", category });
  } catch (error) {
    await transaction.rollback();
    res.status(500);
    return next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      await transaction.rollback();
      res.status(404);
      return next(new Error("Category not found"));
    }

    await category.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({ message: "Category deleted", success: true });
  } catch (error) {
    await transaction.rollback();
    res.status(500);
    return next(error);
  }
};

exports.addCategoryToProduct = async (req, res, next) => {
  const { product_id, category_id } = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const category = await Category.findByPk(category_id);
    if (!category) {
      await transaction.rollback();
      res.status(404);
      return next(new Error("Category not found"));
    }

    const product = await Product.findByPk(product_id);
    if (!product) {
      await transaction.rollback();
      res.status(404);
      return next(new Error("Product not found"));
    }

    await product.addCategory(category, { transaction });

    await transaction.commit();

    return res.status(200).json({ message: "Category added to product" });
  } catch (error) {
    await transaction.rollback();
    res.status(500);
    return next(error);
  }
};
