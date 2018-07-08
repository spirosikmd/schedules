const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

module.exports = function() {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      MONGO_URI,
      { useNewUrlParser: true }
    );

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
