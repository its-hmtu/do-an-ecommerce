const { generateOrderId } = require("../utils/helper");

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('orders', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      // autoIncrement: true,
      unique: true,
      defaultValue: generateOrderId(),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'paid',
        'shipped',
        'delivered',
        'canceled'
      ),
      allowNull: false
    },
    tracking_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'addresses',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    tableName: 'orders'
  })

  Order.beforeCreate(async (order) => {
    order.id = generateOrderId();
  })

  Order.associate = (models) => {
    Order.belongsTo(models.User, {onDelete: 'CASCADE', foreignKey: 'user_id'})
    Order.hasMany(models.OrderItem, {foreignKey: 'order_id', onDelete: 'CASCADE'});
    Order.belongsTo(models.Address, {foreignKey: 'address_id'});
  }

  return Order;
}