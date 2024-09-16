// var express = require('express');
// var indexController = require('../controllers/index.js');
import express from 'express';
import getIndex from '../controllers/index.js';

const router = express.Router();
/* GET home page. */
router.get('/', getIndex);

export default router;
