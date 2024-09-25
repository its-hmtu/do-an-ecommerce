const {
  Product,
  Tag,
  Category,
  ProductImage,
  Review,
  sequelize,
} = require("../models");
const fs = require("fs");

exports.getProducts = async (req, res, next) => {
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
      return res.status(404).json({ message: "Products not found" });
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
    return res.status(500).json({ message: e.message });
  }
};

exports.createProduct = async (req, res, next) => {
  const { product_name, price, product_description, stock, categories_name } =
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

    // if categories_name is an array of categories then we can use this to set this product can belong to multiple categories
    if (categories_name != null && categories_name.length > 0 && Array.isArray(categories_name)) {
      const categories = [];
      for (let name of categories_name) {
        const [category] = await Category.findOrCreate({
          where: { name },
          transaction,
        });
        categories.push(category);
      }

      await newProduct.setCategories(categories, { transaction });
    }
    // else if categories_name is only a string (or only one category name) then we can use this to set this product can belong to only one category
    else if (categories_name != null && typeof categories_name === "string") {
      const category = await Category.findOrCreate({
        where: { name: categories_name },
        transaction,
      });

      await newProduct.addCategory(category, { transaction });
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
    return res.status(400).json({ message: "Product not created" });
  }
};

exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const product = await Product.findByPk(id, { transaction });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: error.message });
  }
}

// delete multiple products
exports.deleteProducts = async (req, res, next) => {
  const { product_ids } = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });
  console.log(product_ids)
  if (!Array.isArray(product_ids) || product_ids.length === 0) {
    return res.status(400).json({ message: "Product ids are required" });
  }
  try {
    const products = await Product.findAll({
      where: {
        id: product_ids
      },
      transaction
    });

    if (products.length !== product_ids.length) {
      return res.status(404).json({ message: "Some products not found" });
    }

    for (let product of products) {
      await product.destroy({ transaction });
    }

    await transaction.commit();

    return res.status(200).json({ message: "Products deleted" });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: error.message });
  }
}

exports.updateProduct = async (req, res, next) => {
  const { id, rm_images, rm_categories } = req.params;
  const { product_name, price, product_description, stock, categories_name } = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const product = await Product.findByPk(id, { transaction });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
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
          id: rm_images.split(",")
        },
        transaction
      });

      for (let image of images) {
        fs.unlinkSync(`public${image.file_path}`);
        await image.destroy({ transaction });
      }
    }

    await transaction.commit();

    return res.status(200).json({ message: "Product updated" });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: error.message });
  }
}
