const { ProductView, Product} = require('../models')
const { v4: uuidv4 } = require('uuid');

exports.trackUniqueViews = async (req, res, next) => {
  try {
    const { slug } = req.params
    const userId = req.user?.id
    let sessionId = req.cookies.session_id

    if (!userId) {
      if (!sessionId) {
        sessionId = uuidv4();
        res.cookie('session_id', sessionId, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // expires in 24 hours
      }
    }

    const product = await Product.findOne({ where: { slug }})
    const productId = product.id
    // Check if the product has already been viewed
    const alreadyViewed = await ProductView.findOne({
      where: userId
        ? { product_id: productId, user_id: userId }
        : { product_id: productId, session_id: sessionId },
    });

    if (!alreadyViewed) {
      await ProductView.create(
        userId
          ? { product_id: productId, user_id: userId }
          : { product_id: productId, session_id: sessionId }
      );
      await product.increment('views');
    }

    next();
  } catch (e) {
    next(e)
  }
}