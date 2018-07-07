module.exports = function(app) {
  console.log('Starting API');

  return Promise.resolve()
    .then(() => require('./config/mongoose')())
    .then(() => require('./config/express')(app))
    .then(() => require('./config/routes')(app))
    .then(() => {
      console.log('API started');
    });
};
