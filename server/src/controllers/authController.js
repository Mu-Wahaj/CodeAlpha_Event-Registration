const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const signAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m'
  });

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) throw new ApiError(409, 'Email already registered');

    const user = await User.create({ name, email, password, role: role || 'attendee' });
    const accessToken = signAccessToken(user);

    res.status(201).json({
      success: true,
      data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const accessToken = signAccessToken(user);
    res.json({
      success: true,
      data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken }
    });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res) => {
  res.json({ success: true, data: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
};

module.exports = { register, login, me };
