module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('order_items', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    }, 
    order_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'order_items'
  })
  
  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: 'order_id', onDelete: 'CASCADE' });
    OrderItem.belongsTo(models.Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });
    OrderItem.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    OrderItem.belongsTo(models.Option, { foreignKey: 'option_id', onDelete: 'CASCADE' });
  }

  return OrderItem;
}