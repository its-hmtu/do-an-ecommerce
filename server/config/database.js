require('dotenv').config();
const db = require('../models');
const config = require('./config.json')[process.env.MODE || 'development'];

function connectDB() {
  db.sequelize.authenticate()
    .then(() => {
      console.log('Connected to database: ' + config.database);
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
}

module.exports = connectDB;




