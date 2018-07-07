const mongoose = require('mongoose');

module.exports = function() {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGO_URI);

    const db = mongoose.connection;

    db.on('error', function(err) {
      console.error(`Failed to connect to ${process.env.MONGO_URI}`);
      reject(err);
    });

    db.once('open', function() {
      console.log(`Mongo connected at ${process.env.MONGO_URI}`);
      resolve(db);
    });
  });
};
