module.exports = function (sequelize, DataTypes) {
  const Address = sequelize.define('addresses', {
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
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    district: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ward: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true,
    tableName: 'addresses'
  })

  Address.associate = function (models) {
    Address.belongsTo(models.User, {onDelete: 'CASCADE', foreignKey: 'user_id'})
    Address.hasMany(models.Order, {onDelete: 'CASCADE', foreignKey: 'address_id'})
  }

  return Address;
}