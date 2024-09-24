

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('roles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'roles'
  });

  Role.associate = function (models) {
    Role.belongsToMany(models.User, { through: models.UserRole, foreignKey: 'role_id', otherKey: 'user_id' });
  }

  return Role;
}