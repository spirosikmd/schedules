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

function authenticate(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const auth = {
    id: req.user.id,
  };

  const token = createToken(auth);

  return res.status(200).json({
    user: req.user,
    token: token,
  });
}

module.exports = { authenticate };
