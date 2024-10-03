const {
  Product,
  Category,
  ProductImage,
  Review,
  sequelize,
} = require("../models");
const fs = require("fs");
const {Op} = require("sequelize");

exports.getProducts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.limit) || 10;
  const order = req.query.order || "DESC";
  const q = req.query.q || "";
  const sort = req.query.sort || "createdAt";
  const offset = (page - 1) * pageSize;

  try {
    const products = await Product.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [[sort, order.toUpperCase()]],
      where: {
        product_name: {
          [Op.like]: `%${q.replace('%20', ' ')}%`,
        }
      },
      attributes: {
        exclude: ["updatedAt"],
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "file_path"],
          // required: false,
        }
      ],
      distinct: true
    });

    if (!products) {
      res.status(404);
      return next(new Error("Products not found"));
    }

    // GET REVIEWS FOR EACH PRODUCT
    const productIds = products.rows.map((product) => product.id);
    const reviews = await Review.findAll({
      where: {
        product_id: productIds,
      },
      attributes: [
        "product_id",
        [sequelize.fn("AVG", sequelize.col("rating")), "average_rating"],
        [sequelize.fn("COUNT", sequelize.col("id")), "total_reviews"],
      ],
      group: "product_id",
    });

    products.rows.forEach(product => {
      let review = reviews.find(item => product.id === item.product_id);
      if (review != null) {
        product.dataValues.total_reviews = review.get("total_reviews");
        product.dataValues.average_rating = review.get("average_rating");
        console.log(product)
      } else {
        product.dataValues.total_reviews = 0;
        product.dataValues.average_rating = 0;
      }
    })

    const totalItemCount = products.count;
    const currentItemCount = products.rows.length;
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
        products: products.rows,
      },
    });
  } catch (e) {
    res.status(500);
    return next(e);
  }
};

exports.createProduct = async (req, res, next) => {
  const { product_name, price, product_description, stock, category_ids } =
    req.body;
  const transaction = await sequelize.transaction({ autocommit: false });
  // const promises = [];

  try {
    const newProduct = await Product.create(
      {
        product_name,
        price,
        product_description,
        stock,
      },
      { transaction }
    );

    if (category_ids != null && category_ids.length > 0) {
      const categories = await Category.findAll({
        where: {
          id: category_ids,
        },
        transaction,
      });

      await newProduct.addCategories(categories, { transaction });
    }

    const images = [];
    for (let i = 0; req.files != null && i < req.files.length; i++) {
      let file = req.files[i];
      let filePath = file.path.replace(new RegExp("\\\\", "g"), "/");
      filePath = filePath.replace("public", "");
      const image = await ProductImage.create(
        {
          product_id: newProduct.id,
          file_name: file.filename,
          file_path: filePath,
          file_size: file.size,
          original_name: file.originalname,
          mime_type: file.mimetype,
        },
        { transaction }
      );

      images.push(image);
    }

    newProduct.images = images;
    newProduct.main_image_id = images[0].id;
    await transaction.commit();

    return res
      .status(201)
      .json({ message: "Product created", product: newProduct });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    if (req.files !== null) {
      for (let i = 0; i < req.files.length; i++) {
        fs.unlinkSync(req.files[i].path);
      }
    }
    res.status(500);
    return next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const product = await Product.findByPk(id, { transaction });

    if (!product) {
      res.status(404);
      return next(new Error("Product not found"));
    }

    await product.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    await transaction.rollback();
    res.status(500);
    return next(error);
  }
}

// delete multiple products
exports.deleteProducts = async (req, res, next) => {
  const { product_ids } = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });
  console.log(product_ids)
  if (!Array.isArray(product_ids) || product_ids.length === 0) {
    res.status(400);
    return next(new Error("Product ids are required"));
  }
  try {
    const products = await Product.findAll({
      where: {
        id: product_ids
      },
      transaction
    });

    if (products.length !== product_ids.length) {
      res.status(404);
      return next(new Error("Some products not found"));
    }

    for (let product of products) {
      await product.destroy({ transaction });
    }

    await transaction.commit();

    return res.status(200).json({ message: "Products deleted" });
  } catch (error) {
    await transaction.rollback();
    res.status(500);
    return next(error);
  }
}

exports.updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const {rm_images, rm_categories } = req.query;
  const { product_name, price, product_description, stock, categories_name } = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const product = await Product.findByPk(id, { transaction });

    if (!product) {
      res.status(404);
      return next(new Error("Product not found"));
    }

    await product.update(
      {
        product_name: product_name || product.product_name, 
        price: price || product.price,
        product_description: product_description || product.product_description,
        stock: stock || product.stock,
      },
      { transaction }
    );

    // remove images if included in rm_images
    if (rm_images != null) {
      const images = await ProductImage.findAll({
        where: {
          id: rm_images.split("%2C"),
        },
        attributes: {
          exclude: ['productId']
        },
        transaction
      });

      for (let image of images) {
        fs.unlinkSync(`public${image.file_path}`);
        await image.destroy({ transaction });
      }
    }

    // remove categories if included in rm_categories
    if (rm_categories != null) {
      const categories = await Category.findAll({
        where: {
          name: rm_categories.split("%2C")
        },
        transaction
      });

      await product.removeCategories(categories, { transaction });
    }

    await transaction.commit();

    return res.status(200).json({ message: "Product updated" });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500);
    return next(error);
  }
}

exports.getSingleProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id, {
      attributes: {
        exclude: ["updatedAt"],
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "file_path"],
        },
        {
          model: Review,
          attributes: ["id", "comment", "rating"],
        }
      ]
    });

    if (!product) {
      res.status(404);
      return next(new Error("Product not found"));
    }

    return res.status(200).json({ product });
  } catch (error) {
    res.status(500);
    return next(error);
  }
}

exports.getProductsByCategory = async (req, res, next) => {
  const { category_name } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const products = await Product.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["updatedAt"],
      },
      include: [
        {
          model: Category,
          where: {
            name: category_name,
          },
          attributes: ["id", "name"],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "file_path"],
        }
      ]
    });

    if (!products) {
      res.status(404);
      return next(new Error("Products not found"));
    }

    const totalItemCount = products.count;
    const currentItemCount = products.rows.length;
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
        products: products.rows,
      },
      message: `Products under ${category_name} category`,
      success: true
    });
  } catch (err) {
    res.status(500);
    return next(err);
  }
}

exports.getProductsBySearch = async (req, res, next) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const products = await Product.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["updatedAt"],
      },
      where: {
        product_name: {
          [Op.like]: `%${q.replace('%20', ' ')}%`,
        },
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "file_path"],
        }
      ]
    });

    if (!products) {
      res.status(404);
      return next(new Error("Products not found"));
    }

    const totalItemCount = products.count;
    const currentItemCount = products.rows.length;
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
        products: products.rows,
      },
      message: `Products with search term: ${q.replace('%20', ' ')}`,
      success: true
    });
  } catch (err) {
    res.status(500);
    return next(err);
  }
}
