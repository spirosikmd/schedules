const jwt = require('jsonwebtoken');

function createToken(auth) {
  return jwt.sign(
    {
      id: auth.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 60 * 120,
    }
  );
}

function getCookieOptions() {
  const secure = process.env.NODE_ENV === 'production' ? true : false;

  return { httpOnly: true, secure };
}

function authenticate(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const auth = {
    id: req.user.id,
  };

  const token = createToken(auth);

  return res
    .status(200)
    .cookie('token', token, getCookieOptions())
    .json({
      user: req.user,
    });
}

module.exports = { authenticate };
