const jwt = require('jsonwebtoken');

function verifyToken() {
  return (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: 'User not authenticated',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
      if (err) {
        return res.status(401).json({
          message: 'User not authenticated',
        });
      }

      req.user = user;

      next();
    });
  };
}

module.exports = { verifyToken };
