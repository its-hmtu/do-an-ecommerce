module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('users_roles', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'users_roles'
  });

  UserRole.associate = function (models) {

  }

  return UserRole;
}