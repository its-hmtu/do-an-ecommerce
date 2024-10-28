const {
  Review,
  Product,
} = require('../models');


exports.getReviews = async (req, res, next) => {

}

exports.getProductReviews = async (req, res, next) => {
  const { product_id } = req.params;
  try {
    const product = await Product.findByPk(product_id);
    if (!product) {
      res.status(404);
      return next(new Error("Product not found"));
    }

    const reviews = await Review.findAll({
      where: {
        product_id,
      },
    });

    return res.status(200).json({ reviews });
  } catch (error) {
    res.status(500);
    return next(error);
  }
}