'use strict';
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const Sequelize = require('sequelize');
require('dotenv').config();

const mode = process.env.NODE_ENV || 'development';
const dialect = process.env.DB_DIALECT || 'mysql';
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 3307;
const database = process.env.DB_NAME || 'do-an-ecommerce';
const username = process.env.DB_USERNAME || 'root';
const password = process.env.DB_PASSWORD || 'root';

const connectObj = {
  host: host,
  dialect: dialect,
  port: port,
  logging: false,
  timezone: '+07:00',
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


// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.endsWith('.model.js') &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize);
//     db[model.name] = model;
//     console.log(`[+] ${model.name} model loaded`);
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

db.User = require('./user.model')(sequelize, Sequelize);
db.UserRole = require('./user_role.model')(sequelize, Sequelize);
db.Role = require('./role.model')(sequelize, Sequelize);

db.Order = require('./order.model')(sequelize, Sequelize);
db.OrderItem = require('./order_item.model')(sequelize, Sequelize);

db.Product = require('./product.model')(sequelize, Sequelize);
db.Option = require('./option.model')(sequelize, Sequelize);
db.Stock = require('./stock.model')(sequelize, Sequelize);
db.Review = require('./review.model')(sequelize, Sequelize);
db.Address = require('./address.model')(sequelize, Sequelize);
db.Upload = require('./upload.model')(sequelize, Sequelize);
db.ProductImage = require('./product_image.model')(sequelize, Sequelize);
db.OptionImage = require('./option_image.model')(sequelize, Sequelize);
db.Brand = require('./brand.model')(sequelize, Sequelize);
db.Specification = require('./specification.model')(sequelize, Sequelize);
db.Discount = require('./discount.model')(sequelize, Sequelize);
db.Series = require('./series.model')(sequelize, Sequelize);

db.Cart = require('./cart.model')(sequelize, Sequelize);
db.CartItem = require('./cart_item.model')(sequelize, Sequelize);

db.Category = require('./category.model')(sequelize, Sequelize);
db.ProductCategory = require('./product_category.model')(sequelize, Sequelize);
db.CategoryImage = require('./category_image.model')(sequelize, Sequelize);

db.User.associate(db);
db.UserRole.associate(db);
db.Role.associate(db);

db.Order.associate(db);
db.OrderItem.associate(db);

db.Product.associate(db);
db.Option.associate(db);
db.Stock.associate(db);
db.Review.associate(db);
db.Address.associate(db);
db.Upload.associate(db);
db.ProductImage.associate(db);
db.OptionImage.associate(db);
db.Brand.associate(db);
db.Specification.associate(db);

db.Cart.associate(db);
db.CartItem.associate(db);

db.Category.associate(db);
db.ProductCategory.associate(db);
db.CategoryImage.associate(db);

module.exports = db;
