const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({
      message: 'User not authenticated',
    });
  }

  const parsedToken = token.replace('Bearer ', '');

  jwt.verify(parsedToken, process.env.JWT_SECRET, function(err, user) {
    if (err) {
      return res.status(401).json({
        message: 'User not authenticated',
      });
    }

    req.user = user;

    next();
  });
}

module.exports = { verifyToken };
