const jwt = require('jsonwebtoken');

function createToken(auth) {
  return jwt.sign(
    {
      id: auth.id,
    },
    process.env.JWT_SECRET,
    {
      // This is set from Google login response and it is 1 hour by default.
      expiresIn: auth.expiresIn,
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
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const expiresIn = req.query.expires_in;

  const auth = {
    id: req.user.id,
    expiresIn,
  };

  const token = createToken(auth);

  return res
    .status(200)
    .cookie('token', token, getCookieOptions(expiresIn))
    .json({
      user: req.user,
    });
}

module.exports = { authenticate };
