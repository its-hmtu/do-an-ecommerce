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
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    shipping: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'paid',
        'shipped',
        'delivered',
        'canceled',
        'processing',
        'completed'
      ),
      allowNull: false
    },
    tracking_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'addresses',
        key: 'id'
      }
    },
    payment_method: {
      type: DataTypes.ENUM(
        'credit_card',
        'paypal',
        'cash_on_delivery'
      ),
      allowNull: true
    },
    payment_status: {
      type: DataTypes.ENUM(
        'pending',
        'paid',
        'failed'
      ),
      allowNull: true
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ship_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_paid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    guest_email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    guest_first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    guest_last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    guest_phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    guest_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
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
    Order.belongsTo(models.Address, {foreignKey: 'address_id', onDelete: 'CASCADE'});
  }

  return Order;
}