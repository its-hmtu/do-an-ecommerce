module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define('options', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    }, 
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    special_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    special_price_percentage: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    timestamps: true,
    tableName: 'options',
    indexes: [
      {
        fields: ['product_id']
      }
    ]
  })

  Option.associate = (models) => {
    Option.belongsTo(models.Product, {foreignKey: 'product_id', onDelete: 'cascade', onUpdate: 'cascade'}); 
    Option.hasMany(models.Stock, {as: 'stock', foreignKey: 'option_id', onDelete: 'cascade', onUpdate: 'cascade'});
    Option.hasMany(models.OptionImage, {as: 'images', foreignKey: 'option_id', onDelete: 'cascade', onUpdate: 'cascade'});
    Option.hasMany(models.OrderItem, {as: 'order_items', foreignKey: 'option_id', onDelete: 'cascade', onUpdate: 'cascade'});
    Option.hasMany(models.CartItem, {foreignKey: 'option_id'});
  }

  return Option;
}