const express = require('express');
const { protect } = require('../middleware/auth');
const { getMyRegistrations, cancelRegistration } = require('../controllers/registrationController');

const router = express.Router();

router.use(protect);
router.get('/me', getMyRegistrations);
router.patch('/:id/cancel', cancelRegistration);

module.exports = router;
