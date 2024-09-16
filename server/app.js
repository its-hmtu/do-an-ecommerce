// var viewConfig = require('./config/view');
// var errorConfig = require('./config/error');
// var utilitiesConfig = require('./config/utilities');
// var routesConfig = require('./config/routes');
// const redis = require('redis');
// const express = require('express');
// const dotenv = require('dotenv');
// const connectDb = require('./config/db');
// const cors = require('cors');

import viewConfig from './config/view.js';
import errorConfig from './config/error.js';
import utilitiesConfig from './config/utilities.js';
import routesConfig from './config/routes.js';
import redis from 'redis';
import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import cors from 'cors';

dotenv.config();

const app = express();
const client = redis.createClient(process.env.REDIS_PORT);
app.use(cors());
connectDb();

viewConfig(app);
utilitiesConfig(app, client);
routesConfig(app);
errorConfig(app);

export default app;
