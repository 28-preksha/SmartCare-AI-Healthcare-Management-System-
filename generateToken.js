const jwt = require('jsonwebtoken');

const generateToken = (id, role, name) => {
  return jwt.sign(
    { id, role, name }, 
    process.env.JWT_SECRET || "JWT_SECRET_KEY", 
    { expiresIn: '1d' }
  );
};

module.exports = generateToken;