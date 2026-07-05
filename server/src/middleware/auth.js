const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(401, 'Not authorized, no token provided');
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) throw new ApiError(401, 'User no longer exists');

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Invalid or expired token'));
    }
    next(err);
  }
};

// Restricts a route to organizers only. Use after `protect`.
const organizerOnly = (req, res, next) => {
  if (req.user.role !== 'organizer') {
    return next(new ApiError(403, 'Organizer access required'));
  }
  next();
};

module.exports = { protect, organizerOnly };
