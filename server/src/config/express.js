const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');

module.exports = function(app) {
  app.use(passport.initialize());

  app.use(bodyParser.json());

  app.use(cookieParser());

  app.use(express.static(path.join(__dirname, '../../../client/build')));
};
