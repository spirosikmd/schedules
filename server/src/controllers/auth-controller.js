const jwt = require('jsonwebtoken');
const authService = require('../services/auth-service');

function createToken(options) {
  return jwt.sign(
    {
      id: options.id,
    },
    process.env.JWT_SECRET,
    {
      // This is set from Google login response and it is 1 hour by default.
      expiresIn: options.expiresIn,
    }
  );
}

function getCookieOptions(expiresIn) {
  const secure = process.env.NODE_ENV === 'production';
  // This is set from Google login response and it is 1 hour by default.
  const expires = new Date(Date.now() + expiresIn * 1000);

  return {
    httpOnly: true,
    secure,
    expires,
  };
}

function authenticate(req, res) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const expiresIn = req.query.expires_in || 3600;

  const tokenOptions = {
    id: user.id,
    expiresIn,
  };

  const token = createToken(tokenOptions);

  const userResponse = {
    email: user.email,
    ...(user.firstName && { firstName: user.firstName }),
    ...(user.lastName && { lastName: user.lastName }),
  };

  return res
    .status(200)
    .cookie('token', token, getCookieOptions(expiresIn))
    .json({
      user: userResponse,
    });
}

function register(req, res) {
  const { email, password, confirmPassword } = req.body;

  authService
    .register(email, password, confirmPassword)
    .then(data => res.json(data))
    .catch(error => {
      res.status(400).json({
        message: error,
      });
    });
}

module.exports = { authenticate, register };
