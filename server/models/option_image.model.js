const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const OptionImage = sequelize.define('option_images', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    option_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    original_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    mime_type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    is_cover_image: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: true,
    tableName: 'uploads',
    defaultScope: {
      where: {
        option_id: {[Op.ne]: null}
      }
    }
  });

  OptionImage.associate = (models) => {
    OptionImage.belongsTo(models.Option, {onDelete: 'cascade'});
  }

  return OptionImage;
}