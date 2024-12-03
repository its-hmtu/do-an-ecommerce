module.exports = (sequelize, DataTypes) => {
  const ProductView = sequelize.define('product_views', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    session_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
  }, {
    tableName: 'product_views',
    timestamps: true,
  })

  ProductView.associate = function (models) {
    ProductView.belongsTo(models.Product, {
      foreignKey: 'product_id',
      onDelete: 'cascade',
      opUpdate: 'cascade'
    })
  }

  return ProductView
}