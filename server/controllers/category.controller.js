const {
  Tag,
  Category,
  TagImage,
  CategoryImage,
  sequelize,
} = require("../models");
const fs = require("fs");
const { Op } = require("sequelize");

exports.getCategories = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;
  const offset = (page - 1) * pageSize;

  const categories = await Category.findAndCountAll({
    limit: pageSize,
    offset: offset,
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
      },
    ],
  });

  if (!categories) {
    return res.status(404).json({ message: "Categories not found" });
  }

  const totalItemCount = categories.count;
  const currentItemCount = categories.rows.length;
  const currentPage = page;
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const pagination = {
    total_item_count: totalItemCount,
    current_item_count: currentItemCount,
    total_pages: totalPages,
    current_page: currentPage,
  };

  return res.status(200).json({
    data: {
      ...pagination,
      categories: categories.rows,
    },
  });
};

exports.createCategory = async (req, res, next) => {
  const { name, description } = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });

  if (name == null || name.length === 0) {
    return res.status(400).json({ message: "Name is required" });
  } 

  const existingCategory = await Category.findOne({
    where: {
      name: name,
    },
  });

  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
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
    return res.status(400).json({ message: "Category not created" });
  }
};
