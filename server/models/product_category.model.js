module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define('products_categories', {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    timestamps: false,
    tableName: 'products_categories'
  });

  ProductCategory.associate = (models) => {
    ProductCategory.belongsTo(models.Product, {as: 'product', foreignKey: 'product_id'});
    ProductCategory.belongsTo(models.Category, {as: 'category', foreignKey: 'category_id'});
  }

  return ProductCategory;
}