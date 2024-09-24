module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('orders', {
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
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
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

  Order.associate = (models) => {
    Order.belongsTo(models.User, {onDelete: 'CASCADE', foreignKey: 'user_id'})
    Order.hasMany(models.OrderItem);
    Order.belongsTo(models.Address, {foreignKey: 'address_id'})
  }

  return Order;
}