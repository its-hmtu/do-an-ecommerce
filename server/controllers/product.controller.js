const {
  Product,
  Tag,
  Category,
  ProductImage,
  Review,
  sequelize,
} = require("../models");
const fs = require("fs")

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
      // include: [
      //   {
      //     model: Tag,
      //     exclude: ["id", "description", "createdAt", "updatedAt"],
      //   },
      //   {
      //     model: Category,
      //     exclude: ["id", "description", "createdAt", "updatedAt"],
      //   },
      //   {
      //     model: ProductImage,
      //     as: "images",
      //     attributes: ["id", "file_path"],
      //   }
      // ]
    });
  
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }
  
    // GET REVIEWS FOR EACH PRODUCT
    // const productIds = products.rows.map((product) => product.id);
    // const reviews = await Review.findAll({
    //   where: {
    //     product_id: productIds,
    //   },
    //   attributes: [
    //     "product_id",
    //     [sequelize.fn("AVG", sequelize.col("rating")), "average_rating"],
    //     [sequelize.fn("COUNT", sequelize.col("id")), "total_reviews"],
    //   ],
    //   group: "product_id",
    // });
  
    // products.forEach(product => {
    //   let review = reviews.find(item => product.id === item.product_id);
    //   if (review != null) {
    //     product.total_reviews = review.get("total_reviews");
    //     product.average_rating = review.get("average_rating");
    //   } else {
    //     product.total_reviews = 0;
    //     product.average_rating = 0;
    //   }
    // })

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
  const { product_name, price, product_description, stock, tags, categories } = req.body;
  const transaction = await sequelize.transaction({ autocommit: false });
  const promises = [];

  try {
    Object.keys(tags).forEach(tag => {
      promises.push(Tag.findOrCreate({
        where: {
          name: tag,
          defaults: {description: tags[tag]}
        }
      }));
    });
  
    Object.keys(categories).forEach(category => {
      promises.push(Category.findOrCreate({
        where: {
          name: category,
          defaults: {description: categories[category]}
        }
      }));
    });
  
    const newProduct = await Product.create({
      product_name,
      price,
      product_description,
      stock
    }, {transaction});
  
    const results = await Promise.all(promises)
    promises.length = 0;
    const product = results.pop();
    const tagsArr = [];
    const categoriesArr = [];
    results.forEach(result => {
      if (result[0].constructor.getTableName() === 'tags') {
        tagsArr.push(result[0]);
      }
      if (result[0].constructor.getTableName() === 'categories') {
        categoriesArr.push(result[0])
      }
    })
  
    promises.push(product.setTags(tagsArr, {transaction}));
    promises.push(product.setCategories(categoriesArr, {transaction}));
  
  
    const images = []
    for (let i = 0; req.files != null && i < req.files.length; i++) {
      let file = req.files[i];
      let filePath = file.path.replace(new RegExp('\\\\', 'g'), '/');
      filePath = filePath.replace('public', '');
      const image = await ProductImage.create({
        file_name: file.filename,
        file_path: filePath,
        file_size: file.size,
        original_name: file.originalname,
        mime_type: file.mimetype
      },  {transaction});
  
      images.push(image);
    }
  
    newProduct.images = images;
    await transaction.commit();

    return res.status(201).json({message: 'Product created', product: newProduct});
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    if (req.files !== null) {
      for (let i = 0; i < req.files.length; i++) {
        fs.unlinkSync(req.files[i].path);
      }
    }
    return res.status(400).json({message: 'Product not created'});
  }
}
