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
    username: {
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
    email_confirm_code: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
  }, {
    timestamps: true,
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
    User.hasMany(models.Order, {foreignKey: 'user_id'});
    User.hasMany(models.OrderItem, {foreignKey: 'user_id'});
    User.belongsToMany(models.Role, {through: 'users_roles', foreignKey: 'user_id', otherKey: 'role_id'});
    User.hasMany(models.Review, {foreignKey: 'user_id'});
    User.hasMany(models.Address, {foreignKey: 'user_id'});
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
      // email: this.email,
      roles: this.roles.map(role => role.name)
    }, process.env.JWT_SECRET, {
      expiresIn: '10m'
    });
  }

  User.prototype.generateRefreshToken = function () {
    return jwt.sign({
      id: this.id,
      user_name: this.user_name,
      email: this.email,
      roles: this.roles.map(role => role.name)
    }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d'
    });
  }

  User.prototype.generateEmailConfirmCode = function() {
    // return 6 characters random string in uppercase with numbers and letters
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.email_confirm_code = result;
    return result;
  }

  return User;
}

// const mongoose = require('mongoose')
// const slug = require('slugify')

// const UserSchema = mongoose.Schema({
//   user_name: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   }, 
//   first_name: {
//     type: String,
//     required: true,
//   },
//   last_name: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6,
//   },
//   phone: {
//     type: String,
//   }
// })