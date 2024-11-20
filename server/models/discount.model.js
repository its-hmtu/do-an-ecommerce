module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define('discounts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('PERCENTAGE', 'AMOUNT'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      defaultValue: 'ACTIVE'
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'discounts'
  })

  Discount.associate = function (models) {
    Discount.belongsTo(models.Product, {foreignKey: 'product_id', onDelete: 'SET NULL', onUpdate: 'CASCADE'})
  }

  return Discount;
}