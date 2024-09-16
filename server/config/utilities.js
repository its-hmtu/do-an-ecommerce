// const logger = require('morgan');
// const express = require('express');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const cache = require('../middlewares/cache.middlewares');

import logger from 'morgan';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cache from '../middlewares/cache.middlewares.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilitiesConfig = (app, client) => {
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname,'..','public')));
    // app.use(cache(client));
  };

export default utilitiesConfig;