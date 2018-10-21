const { validationResult } = require('express-validator/check');

function validationErrors() {
  return (req, res, next) => {
    const errors = validationResult(req);

    if (errors && !errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    next();
  };
}

module.exports = { validationErrors };
