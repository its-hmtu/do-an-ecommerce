// const express = require('express');
// const userController = require('../controllers/user.controller');
import express from 'express';
import {getUser} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getUser);

export default router;
