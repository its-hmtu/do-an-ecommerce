require('dotenv').config();
var viewConfig = require('./config/view');
var errorConfig = require('./config/error');
var utilitiesConfig = require('./config/utilities');
var routesConfig = require('./config/routes');
// var Sequelize = require('sequelize');
const db = require('./config/database');
const cors = require('cors');
var express = require('express');
var app = express();

app.use(cors());

db.sequelize.authenticate()
  .then(() =>{
    console.log('Connected to database: ' + process.env.DB_DATABASE);
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

viewConfig(app);
utilitiesConfig(app);
routesConfig(app);
errorConfig(app);

module.exports = app;
