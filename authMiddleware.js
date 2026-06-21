const jwt = require('jsonwebtoken');

// 1. Token Check Middleware
const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer')) {
    try {
      token = token.split(' ')[1];
      // Token verify karke user ka data extract karna
      const decoded = jwt.verify(token, "JWT_SECRET_KEY");
      req.user = decoded; // Isme user id, role, aur name hoga
      next(); // Agle function (controller) par bhejo
    } catch (error) {
      return res.status(401).json({ error: 'Not authorized, token validation failed' });
    }
  } else {
    return res.status(401).json({ error: 'No token found, access denied' });
  }
};

// 2. Role Check Middleware (RBAC)
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Agar user ka role allowed roles me nahi hai toh block karo
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Role (${req.user.role}) is not authorized to access this resource` });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };