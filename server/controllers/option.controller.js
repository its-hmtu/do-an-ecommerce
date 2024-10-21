exports.getOptions = async (req, res, next ) => {
  const { product_id } = req.params;
  try {
    const options = await Option.findAll({
      where: { product_id },
      include: [
        {
          model: OptionImage,
          as: 'images'
        },
        {
          model: Stock,
          as: 'stock'
        }
      ]
    });

    return res.status(200).json(options);
  } catch (error) {
    res.status(500);
    return next(error);
  }
}