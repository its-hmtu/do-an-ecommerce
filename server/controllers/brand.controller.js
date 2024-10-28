const {
  Brand, sequelize
} = require('../models');

exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.findAll();
    return res.status(200).json(brands);
  } catch (error) {
    res.status(500);
    return next(error);
  }
}