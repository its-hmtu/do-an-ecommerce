require('dotenv').config();
var viewConfig = require('./config/view');
var errorConfig = require('./config/error');
var utilitiesConfig = require('./config/utilities');
var routesConfig = require('./config/routes');
const connectDB = require('./config/database');
const cors = require('cors');
var express = require('express');
const {
  orderToDeliveredUpdater,
  orderToCompleteUpdater
} = require('./jobs/orderStatusUpdater');
var app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
]

app.use(cors(
  {
    origin: function(origin, cb) {
      if (!origin) return cb(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return cb(new Error(msg), false);
      }

      return cb(null, true)
    },
    credentials: true
  }
));

connectDB();
// orderToDeliveredUpdater.start();
// orderToCompleteUpdater.start();
viewConfig(app);
utilitiesConfig(app);
routesConfig(app);
errorConfig(app);

module.exports = app;
