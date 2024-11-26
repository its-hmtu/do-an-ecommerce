module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('carts_items', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    option_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'carts_items'
  });

  CartItem.associate = function (models) {
    CartItem.belongsTo(models.Cart, {onDelete: 'CASCADE', onUpdate: 'CASCADE', foreignKey: 'cart_id'});
    CartItem.belongsTo(models.Product, {onDelete: 'CASCADE', onUpdate: 'CASCADE', foreignKey: 'product_id'});
    CartItem.belongsTo(models.Option, { foreignKey: 'option_id'});
  }

  return CartItem;
}