require('dotenv').config();
var viewConfig = require('./config/view');
var errorConfig = require('./config/error');
var utilitiesConfig = require('./config/utilities');
var routesConfig = require('./config/routes');
const connectDB = require('./config/database');
const cors = require('cors');
var express = require('express');
var app = express();

app.use(cors());

connectDB();
viewConfig(app);
utilitiesConfig(app);
routesConfig(app);
errorConfig(app);

module.exports = app;
