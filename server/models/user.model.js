const bcrypt = require('bcryptjs');

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'users',
    hooks: {
      beforeCreate: (user, options) => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);

        user.password = hash;
      }
    }
  });

  User.associate = function(models) {
    User.hasMany(models.Order);
    User.belongsToMany(models.Role, {through: 'users_roles', foreignKey: 'user_id', otherKey: 'role_id'});
    User.hasMany(models.Review);
    User.hasMany(models.Address);
  };

  User.prototype.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  }

  return User;
}