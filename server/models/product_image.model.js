const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define(
    "product_images",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      file_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      file_path: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      file_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      original_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      mime_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    },
    {
      tableName: "uploads",
      defaultScope: {
        where: {
          productId: { [Op.ne]: null },
        },
      },
    });

  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.Product, { onDelete: "cascade" });
  }

  return ProductImage;
};
