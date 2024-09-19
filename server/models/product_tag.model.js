module.exports = (sequelize, DataTypes) => {
  const ProductTag = sequelize.define('products_tags', {
    product_id: {
      type: DataTypes.INTEGER
    }, 
    tag_id: {
      type: DataTypes.INTEGER
    },
    create_at: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    }, 
    update_at: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  }, {
    tableName: 'products_tags',
    timestamps: false
  })

  ProductTag.associate = models => {
    ProductTag.belongsTo(models.Product)
    ProductTag.belongsTo(models.Tag)
  }

  return ProductTag
}