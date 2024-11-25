const {
  Product,
  Category,
  ProductImage,
  OptionImage,
  Upload,
  Specification,
  Review,
  Option,
  Stock,
  sequelize,
  Series,
} = require("../models");
const fs = require("fs");
const { Op, where } = require("sequelize");
const {
  client: redisClient,
  REDIS_CACHE_5_MINUTES,
} = require("../config/redis");
const { group } = require("console");

exports.getProducts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.limit) || 10;
  const order = req.query.order || "DESC";
  const q = req.query.q || "";
  const category = req.query.category || "";
  const sort = req.query.sort || "createdAt";
  const offset = (page - 1) * pageSize;

  try {
    const whereCondition = {
      product_name: {
        [Op.like]: `%${q.replace("%20", " ")}%`,
      },
    };

    const include = [
      {
        model: Category,
        attributes: ["id", "name"],
        through: {
          attributes: [],
        },
        where: {
          name: {
            [Op.like]: `%${category}%`,
          },
        },
        required: false,
      },
      {
        model: ProductImage,
        as: "images",
        attributes: ["id", "file_path"],
        required: false,
      },
      {
        model: Option,
        as: "options",
        include: [
          {
            model: OptionImage,
            as: "images",
            attributes: ["id", "file_path"],
            required: false,
          },
        ],
        attributes: {
          include: [
            "id",
            "color",
            "price",
            [
              sequelize.literal(
                "(SELECT stock FROM stocks WHERE stocks.option_id = options.id LIMIT 1)"
              ),
              "stock",
            ],
          ],
        },
        required: false,
      },
      {
        model: Specification,
        as: "specification",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        required: false,
      },
    ];

    if (category) {
      include[0].where = { name: category };
    }

    const products = await Product.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [[sort, order.toUpperCase()]],
      where: whereCondition,
      attributes: {
        exclude: ["updatedAt"],
      },
      include: include,
      distinct: true,
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

    products.rows.forEach((product) => {
      let review = reviews.find((item) => product.id === item.product_id);
      if (review != null) {
        product.dataValues.total_reviews = review.get("total_reviews");
        product.dataValues.average_rating = review.get("average_rating");
        console.log(product);
      } else {
        product.dataValues.total_reviews = 0;
        product.dataValues.average_rating = 0;
      }
    });

    let featuredProducts = [];

    const featured = products.rows.filter(
      (product) => product.featured === true
    );

    // format the rows to the featured products based on categories, make the category the key

    for (let i = 0; i < featured.length; i++) {
      let product = featured[i];
      let category = product.categories[0].name;
      let index = featuredProducts.findIndex(
        (item) => item.category === category
      );

      if (index === -1) {
        featuredProducts.push({
          category: category,
          products: [product],
        });
      } else {
        featuredProducts[index].products.push(product);
      }
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

    // await redisClient.setEx(
    //   `products:${page}:${pageSize}:${q}:${category}:${sort}:${order}`,
    //   REDIS_CACHE_5_MINUTES,
    //   JSON.stringify({
    //     ...pagination,
    //     products: products.rows,
    //   })
    // )

    return res.status(200).json({
      data: {
        ...pagination,
        products: products.rows,
        featured: featuredProducts,
      },
    });
  } catch (e) {
    res.status(500);
    return next(e);
  }
};

exports.createProduct = async (req, res, next) => {
  const {
    product_name,
    product_description,
    category_ids,
    options,
    specs,
    product_images_ids,
  } = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });
  // const promises = [];

  try {
    // console.log(Array.isArray(options));
    let base_price = 0;
    let total_in_stock = 0;

    if (Array.isArray(options) && options.length > 0) {
      base_price =
        options.length > 1
          ? Math.min(...options.map((option) => Number(option.price)))
          : Number(options[0].price);
      total_in_stock = options.reduce(
        (acc, variation) => acc + Number(variation.stock),
        0
      );
    }

    const newProduct = await Product.create(
      {
        product_name,
        base_price,
        product_description,
        total_in_stock,
        brand_id: specs.brand,
        main_image_id: product_images_ids[0],
      },
      { transaction }
    );

    if (total_in_stock > 0) {
      newProduct.availability = "in-stock";
    } else {
      newProduct.availability = "out-of-stock";
    }

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
    for (let i = 0; i < product_images_ids.length; i++) {
      const image = await Upload.findByPk(product_images_ids[i], {
        transaction,
      });

      if (image) {
        image.product_id = newProduct.id;
        await image.save({ transaction });
        images.push(image);
      }
    }

    newProduct.images = images;

    if (options != null && options.length > 0) {
      for (let option of options) {
        const newOption = await Option.create(
          {
            product_id: newProduct.id,
            color: option.color,
            price: option.price,
          },
          { transaction }
        );

        const optionImage = await Upload.findByPk(option.image_id, {
          transaction,
        });

        if (optionImage) {
          optionImage.option_id = newOption.id;
          await optionImage.save({ transaction });
        }

        if (option.stock != null) {
          await Stock.create(
            {
              product_id: newProduct.id,
              option_id: newOption.id,
              stock: option.stock,
            },
            { transaction }
          );
        }
      }
    }

    if (specs) {
      const newSpecs = await Specification.create(
        {
          product_id: newProduct.id,
          brand_id: specs.brand,
          storage_capacity: specs.storage_capacity,
          number_of_cameras: specs.number_of_cameras,
          camera_resolution: specs.camera_resolution,
          ram: specs.ram,
          rom: specs.rom,
          battery_capacity: specs.battery_capacity,
          processor: specs.processor,
          screen_size: specs.screen_size,
          operating_system: specs.operating_system,
          dimensions: specs.dimensions,
          cable_type: specs.cable_type,
          sim_type: specs.sim_type,
          manufacture_date: specs.manufacture_date,
          warranty_duration: specs.warranty_duration,
          condition: specs.condition,
          phone_model: specs.phone_model,
        },
        { transaction }
      );

      newProduct.specification = newSpecs;
    }

    await newProduct.save({ transaction });
    await transaction.commit();

    return res
      .status(201)
      .json({ message: "Product created", product: newProduct });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    // if (req.files !== null) {
    //   for (let i = 0; i < req.files.length; i++) {
    //     fs.unlinkSync(req.files[i].path);
    //   }
    // }
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
};

// delete multiple products
exports.deleteProducts = async (req, res, next) => {
  const { ids } = req.query;
  const transaction = await sequelize.transaction({ autocommit: false });
  console.log(ids);

  if (!ids) {
    res.status(400);
    return next(new Error("Product ids required"));
  }

  const product_ids = ids.split("%2C");
  // ids is a string of comma separated values

  try {
    const products = await Product.findAll({
      where: {
        id: {
          [Op.in]: product_ids,
        },
      },
      transaction,
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
};

exports.updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const {
    product_name,
    product_description,
    category_ids,
    options,
    specs,
    product_images_ids,
  } = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });

  try {
    const product = await Product.findByPk(id, { transaction });

    if (!product) {
      res.status(404);
      return next(new Error("Product not found"));
    }

    let base_price = 0;
    let total_in_stock = 0;

    if (Array.isArray(options) && options.length > 0) {
      base_price =
        options.length > 1
          ? Math.min(...options.map((option) => Number(option.price)))
          : Number(options[0].price);

      total_in_stock = options.reduce(
        (acc, variation) => acc + Number(variation.stock),
        0
      );
    }

    console.log(req.body);

    await product.update(
      {
        product_name: product_name || product.product_name,
        product_description: product_description || product.product_description,
        base_price: base_price || product.base_price,
        total_in_stock: total_in_stock || product.total_in_stock,
        brand_id: specs.brand || product.brand_id,
        main_image_id: product_images_ids[0] || product.main_image_id,
      },
      { transaction }
    );

    if (total_in_stock > 0) {
      product.availability = "in-stock";
    } else {
      product.availability = "out-of-stock";
    }

    if (category_ids != null && category_ids.length > 0) {
      const categories = await Category.findAll({
        where: {
          id: category_ids,
        },
        transaction,
      });

      await product.setCategories(categories, { transaction });
    }

    // update product images and remove the difference

    const images = [];
    const currentImages = await Upload.findAll({
      where: {
        product_id: product.id,
      },
      transaction,
    });

    for (let i = 0; i < product_images_ids.length; i++) {
      const image = await Upload.findByPk(product_images_ids[i], {
        transaction,
      });

      if (image) {
        image.product_id = product.id;
        await image.save({ transaction });
        images.push(image);
      }
    }

    for (let i = 0; i < currentImages.length; i++) {
      if (!product_images_ids.includes(currentImages[i].id)) {
        currentImages[i].product_id = null;
        await currentImages[i].save({ transaction });
      }
    }

    product.images = images;

    // update options and remove the difference
    const currentOptions = await Option.findAll({
      where: {
        product_id: product.id,
      },
      transaction,
    });

    // compare the current options with the new options, only update if there is a difference

    for (let i = 0; i < options.length; i++) {
      if (options[i].id) {
        const currentOption = currentOptions.find(
          (option) => option.id === options[i].id
        );
        if (currentOption) {
          currentOption.color = options[i].color || currentOption.color;
          currentOption.price = options[i].price || currentOption.price;
          await currentOption.save({ transaction });

          const optionImage = await Upload.findByPk(options[i].image_id, {
            transaction,
          });

          if (optionImage) {
            optionImage.option_id = currentOption.id;
            await optionImage.save({ transaction });
          }

          if (options[i].stock != null) {
            const stock = await Stock.findOne({
              where: {
                product_id: product.id,
                option_id: currentOption.id,
              },
              transaction,
            });

            if (stock) {
              stock.stock = options[i].stock;
              await stock.save({ transaction });
            } else {
              await Stock.create(
                {
                  product_id: product.id,
                  option_id: currentOption.id,
                  stock: options[i].stock,
                },
                { transaction }
              );
            }
          }
        }
      } else {
        const newOption = await Option.create(
          {
            product_id: product.id,
            color: options[i].color,
            price: options[i].price,
          },
          { transaction }
        );

        const optionImage = await Upload.findByPk(options[i].image_id, {
          transaction,
        });

        if (optionImage) {
          optionImage.option_id = newOption.id;
          await optionImage.save({ transaction });
        }

        if (options[i].stock != null) {
          await Stock.create(
            {
              product_id: product.id,
              option_id: newOption.id,
              stock: options[i].stock,
            },
            { transaction }
          );
        }
      }
    }

    for (let i = 0; i < currentOptions.length; i++) {
      if (!options.map((option) => option.id).includes(currentOptions[i].id)) {
        await currentOptions[i].destroy({ transaction });
      }
    }
    // update specs

    const currentSpecs = await Specification.findOne({
      where: {
        product_id: product.id,
      },
      transaction,
    });

    if (currentSpecs) {
      currentSpecs.brand_id = specs.brand || currentSpecs.brand_id;
      currentSpecs.storage_capacity =
        specs.storage_capacity || currentSpecs.storage_capacity;
      currentSpecs.number_of_cameras =
        specs.number_of_cameras || currentSpecs.number_of_cameras;
      currentSpecs.camera_resolution =
        specs.camera_resolution || currentSpecs.camera_resolution;
      currentSpecs.ram = specs.ram || currentSpecs.ram;
      currentSpecs.rom = specs.rom || currentSpecs.rom;
      currentSpecs.battery_capacity =
        specs.battery_capacity || currentSpecs.battery_capacity;
      currentSpecs.processor = specs.processor || currentSpecs.processor;
      currentSpecs.screen_size = specs.screen_size || currentSpecs.screen_size;
      currentSpecs.operating_system =
        specs.operating_system || currentSpecs.operating_system;
      currentSpecs.dimensions = specs.dimensions || currentSpecs.dimensions;
      currentSpecs.cable_type = specs.cable_type || currentSpecs.cable_type;
      currentSpecs.sim_type = specs.sim_type || currentSpecs.sim_type;
      currentSpecs.manufacture_date =
        specs.manufacture_date || currentSpecs.manufacture_date;
      currentSpecs.warranty_duration =
        specs.warranty_duration || currentSpecs.warranty_duration;
      currentSpecs.condition = specs.condition || currentSpecs.condition;
      currentSpecs.phone_model = specs.phone_model || currentSpecs.phone_model;

      await currentSpecs.save({ transaction });
    }

    await product.save({ transaction });
    await transaction.commit();

    return res.status(200).json({ message: "Product updated" });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500);
    return next(error);
  }
};

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
          required: false,
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "file_path", "file_size"],
          required: false,
        },
        {
          model: Review,
          attributes: ["id", "rating", "comment", "createdAt"],
        },
        {
          model: Option,
          as: "options",
          include: [
            {
              model: OptionImage,
              as: "images",
              attributes: ["id", "file_path"],
              required: false,
            },
          ],
          attributes: {
            include: [
              "id",
              "color",
              "price",
              [
                sequelize.literal(
                  "(SELECT stock FROM stocks WHERE stocks.option_id = options.id LIMIT 1)"
                ),
                "stock",
              ],
            ],
          },
          required: false,
        },
        {
          model: Specification,
          as: "specification",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          required: false,
        },
      ],
    });

    if (!product) {
      res.status(404);
      return next(new Error("Product not found"));
    }

    return res
      .status(200)
      .json({ data: product, message: "Product found", success: true });
  } catch (error) {
    res.status(500);
    return next(error);
  }
};

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
        },
      ],
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
      success: true,
    });
  } catch (err) {
    res.status(500);
    return next(err);
  }
};

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
          [Op.like]: `%${q.replace("%20", " ")}%`,
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
        },
      ],
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
      message: `Products with search term: ${q.replace("%20", " ")}`,
      success: true,
    });
  } catch (err) {
    res.status(500);
    return next(err);
  }
};

exports.getSingleProductBySlug = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const product = await Product.findOne({
      where: {
        slug: slug,
      },
      attributes: {
        exclude: ["updatedAt"],
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "file_path", "file_size"],
          required: false,
        },
        {
          model: Option,
          as: "options",
          include: [
            {
              model: OptionImage,
              as: "images",
              attributes: ["id", "file_path"],
              required: false,
            },
          ],
          attributes: {
            include: [
              "id",
              "color",
              "price",
              [
                sequelize.literal(
                  "(SELECT stock FROM stocks WHERE stocks.option_id = options.id LIMIT 1)"
                ),
                "stock",
              ],
            ],
          },
          required: false,
        },
        {
          model: Specification,
          as: "specification",
          attributes: {
            exclude: ["createdAt", "updatedAt", "id", "product_id", "brand_id"],
          },
          required: false,
        },
        {
          model: Review,
          attributes: [
            "id",
            "rating",
            "review",
            "createdAt",
          ],
          required: false,
        },
        {
          model: Series,
          attributes: ["id", "series_name"],
          as: "product_series",
          required: false,
        }
      ],
    });

    const reviews = await Review.findAll({
      where: {
        product_id: product.id,
      },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("rating")), "average_rating"],
        [sequelize.fn("COUNT", sequelize.col("id")), "total_reviews"],
      ],
      group: ["product_id"],
    });

    if (reviews.length > 0) {
      product.dataValues.average_rating = reviews[0].get("average_rating");
      product.dataValues.total_reviews = reviews[0].get("total_reviews");
    } else {
      product.dataValues.average_rating = 0;
      product.dataValues.total_reviews = 0;
    }

    const options = await Option.findAll({
      where: {
        product_id: product.id,
      },
      attributes: ["id", "color", "price"],
      include: [
        {
          model: OptionImage,
          as: "images",
          attributes: ["id", "file_path"],
        },
      ],
    })

    options.forEach(option => {
      product.dataValues.images.push(option.images[0]);
    })

    const seriesProducts = await Product.findAll({
      where: {
        series_id: product.series_id,
      },
      attributes: ["id", "product_name", "slug", "base_price", "special_base_price"],
      include: [
        {
          model: Specification,
          as: "specification",
          attributes: ["id", "storage_capacity"],
        }
      ]
    });

    const relatedProudcts = await Product.findAll({
      where: {
        brand_id: product.brand_id,
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "file_path", "file_size"],
          required: false,
        },
        {
          model: Option,
          as: "options",
          include: [
            {
              model: OptionImage,
              as: "images",
              attributes: ["id", "file_path"],
              required: false,
            },
          ],
          attributes: {
            include: [
              "id",
              "color",
              "price",
              [
                sequelize.literal(
                  "(SELECT stock FROM stocks WHERE stocks.option_id = options.id LIMIT 1)"
                ),
                "stock",
              ],
            ],
          },
          required: false,
        },
        {
          model: Specification,
          as: "specification",
          attributes: {
            exclude: ["createdAt", "updatedAt", "id", "product_id", "brand_id"],
          },
          required: false,
        },
        {
          model: Review,
          attributes: [
            "id",
            "rating",
            "review",
            "createdAt",
          ],
          required: false,
        },
        {
          model: Series,
          attributes: ["id", "series_name"],
          as: "product_series",
          required: false,
        },
      ]
    })

    product.dataValues.series_products = seriesProducts;
    product.dataValues.related_products = relatedProudcts.filter(item => {
      return item.categories[0].id === product.categories[0].id && item.id !== product.id;
    }); 

    if (!product) {
      res.status(404);
      return next(new Error("Product not found"));
    }

    return res.status(200).json({
      data: product,
      message: "Product found",
      success: true,
    });
  } catch (error) {
    res.status(500);
    return next(error);
  }
};
