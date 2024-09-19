const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date()
    }
  }, {
    timestamps: false,
    tableName: 'users',
    // hooks: {
    //   beforeCreate: (user, options) => {
    //     const salt = bcrypt.genSaltSync(10);
    //     const hash = bcrypt.hashSync(user.password, salt);

    //     user.password = hash;
    //   }
    // }
  });

  User.associate = function(models) {
    User.hasMany(models.Order);
    User.belongsToMany(models.Role, {through: 'users_roles', foreignKey: 'user_id', otherKey: 'role_id'});
    User.hasMany(models.Review);
    User.hasMany(models.Address);
  };

  User.beforeCreate(user => {
    console.log(user)

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);

    user.password = hash;
  })

  User.prototype.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  }

  User.prototype.isAdmin = function() {
    return this.roles != null && this.roles.some(role => role.name === 'ADMIN');
  }

  User.prototype.generateToken = function() {
    return jwt.sign({
      id: this.id,
      user_name: this.user_name,
      email: this.email,
      roles: this.roles.map(role => role.name)
    }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
  }

  return User;
}