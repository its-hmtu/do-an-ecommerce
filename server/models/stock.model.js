module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('stocks', {
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
    option_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'stocks',
    indexes: [
      {
        fields: ['product_id']
      }
    ]
  })

  Stock.associate = (models) => {
    Stock.belongsTo(models.Product, {foreignKey: 'product_id', onDelete: 'cascade', onUpdate: 'cascade'});
    Stock.belongsTo(models.Option, {foreignKey: 'option_id', onDelete: 'cascade', onUpdate: 'cascade'});
  }

  return Stock;
}