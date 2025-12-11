const express = require('express');
const router = express.Router();
const coachController = require('../controllers/coachController');

router.get('/', coachController.listCoaches);

module.exports = router;