// const CategoryImage = require('../models');
const { Upload, sequelize } = require('../models');

exports.uploadImages = async (req, res, next) => {
  const { cover_image } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const files = req.files;
    if (!files) {
      const error = new Error('Please choose files');
      res.status(400);
      return next(error);
    }

    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const file_path = file.path.replace(new RegExp("\\\\", "g"), "/").replace("public", "");
      const upload = await Upload.create({
        file_name: file.filename,
        file_path: file_path,
        file_size: file.size,
        original_name: file.originalname,
        mime_type: file.mimetype,
        is_cover_image: cover_image === file.filename,
      }, { transaction });

      results.push(upload);
    }

    await transaction.commit();
    return res.status(201).json({data: results});
  } catch (error) {
    return next(error);
  }
}

exports.deleteImage = async (req, res, next) => {
  const {id} = req.params;
  const transaction = await sequelize.transaction();

  try {
    const upload = await Upload.findByPk(id);
    if (!upload) {
      const error = new Error('Image not found');
      res.status(404);
      return next(error);
    }

    await upload.destroy({transaction});
    await transaction.commit();
    return res.status(200).json({
      message: 'Image deleted successfully',
      success: true,
      id: id
    });
  } catch (error) {
    return next(error);
  }
}