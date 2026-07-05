const express = require('express');
const authRoutes = require('./authRoutes');
const eventRoutes = require('./eventRoutes');
const registrationRoutes = require('./registrationRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/registrations', registrationRoutes);

module.exports = router;
