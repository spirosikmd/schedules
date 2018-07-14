const jwt = require('jsonwebtoken');

var createToken = function(auth) {
  return jwt.sign(
    {
      id: auth.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 60 * 120,
    }
  );
};

module.exports = {
  generateToken(req, res, next) {
    req.token = createToken(req.auth);
    return next();
  },
  sendToken(req, res) {
    return res.status(200).json({
      user: req.user,
      token: req.token,
    });
  },
  verifyToken(req, res, next) {
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
  },
};
