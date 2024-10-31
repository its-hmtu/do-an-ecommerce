var logger = require('morgan');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

module.exports = (app) => {
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname,'..','public')));

};