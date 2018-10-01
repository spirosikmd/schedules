require('dotenv-safe').config({
  allowEmptyValues: true,
});

const MONGO_URI = process.env.MONGO_URI;

console.log(`Running migration against ${MONGO_URI}`);

module.exports = {
  url: MONGO_URI,
  directory: './migrations',
};
