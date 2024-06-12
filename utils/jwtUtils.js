const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET must be defined in the environment variables');
}

module.exports = {
  signToken: (payload) => {
    return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
  },
  verifyToken: (token) => {
    return jwt.verify(token, jwtSecret);
  },
};
