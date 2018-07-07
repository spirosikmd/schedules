const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

module.exports = function(app) {
  app.use(bodyParser.json());

  app.use(express.static(path.join(__dirname, '../../../client/build')));

  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../../../client/build/index.html'));
  });
};
