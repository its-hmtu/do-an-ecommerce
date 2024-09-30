module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('carts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    }, 
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_items: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    tableName: 'carts'
  });

  Cart.associate = function (models) {
    Cart.belongsTo(models.User, {onDelete: 'CASCADE', foreignKey: 'user_id'});
    Cart.hasMany(models.CartItem, {as: 'items', foreignKey: 'cart_id'});
  }

  return Cart;
}