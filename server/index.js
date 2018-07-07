require('dotenv-safe').load();

const express = require('express');

const app = express();

require('./src/start')(app)
  .then(() => {
    return new Promise(resolve => app.listen(process.env.PORT, resolve));
  })
  .then(() => {
    console.log(`Listening on port ${process.env.PORT}`);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
