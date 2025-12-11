const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const pricingController = require('../controllers/pricingController');
const { auth } = require('../middleware/auth');

router.post('/', bookingController.createBooking);
router.post('/price-check', pricingController.getPriceCheck);
router.get('/', auth, bookingController.listBookings);

module.exports = router;