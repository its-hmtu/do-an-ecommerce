module.exports = (sequelize, DataTypes) => {
  const ProductTag = sequelize.define('products_tags', {
    product_id: {
      type: DataTypes.INTEGER
    }, 
    tag_id: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'products_tags',
    timestamps: true
  })

  ProductTag.associate = models => {
    ProductTag.belongsTo(models.Product)
    ProductTag.belongsTo(models.Tag, {foreignKey: 'tag_id'})
  }

  return ProductTag
}