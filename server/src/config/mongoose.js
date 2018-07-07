const mongoose = require('mongoose');

const {
  NODE_ENV,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;

let MONGO_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

if (NODE_ENV === 'production') {
  MONGO_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

module.exports = function() {
  return new Promise((resolve, reject) => {
    mongoose.connect(MONGO_URI);

    const db = mongoose.connection;

    db.on('error', function(err) {
      console.error(`Failed to connect to ${MONGO_URI}`);
      reject(err);
    });

    db.once('open', function() {
      console.log(`Mongo connected at ${MONGO_URI}`);
      resolve(db);
    });
  });
};
