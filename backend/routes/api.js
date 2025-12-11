const express = require('express');
const router = express.Router();

const courtRoutes = require('./courtRoutes');
const coachRoutes = require('./coachRoutes');
const bookingRoutes = require('./bookingRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/courts', courtRoutes);
router.use('/coaches', coachRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);

module.exports = router;