const express = require('express');
const { register, login, me } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/authValidator');
const { authLimiter } = require('../middleware/rateLimiter');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', protect, me);

module.exports = router;
