const Sequelize = require('sequelize');

const mode = process.env.NODE_ENV || 'development';
const dialect = process.env.DB_DIALECT || 'mysql';
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 3306;
const database = process.env.DB_NAME || 'do-an-ecommerce';
const username = process.env.DB_USERNAME || 'admin';
const password = process.env.DB_PASSWORD || 'do_an2024';

const connectObj = {
  host: host,
  dialect: dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 30000
  }
}

const sequelize = new Sequelize(database, username, password, connectObj);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('../models/user.model')(sequelize, Sequelize);
db.UserRole = require('../models/user_role.model')(sequelize, Sequelize);
db.Role = require('../models/role.model')(sequelize, Sequelize);
db.Order = require('../models/order.model')(sequelize, Sequelize);
db.OrderItem = require('../models/order_item.model')(sequelize, Sequelize);
db.Product = require('../models/product.model')(sequelize, Sequelize);
db.Review = require('../models/review.model')(sequelize, Sequelize);
db.Address = require('../models/address.model')(sequelize, Sequelize);

module.exports = db;


