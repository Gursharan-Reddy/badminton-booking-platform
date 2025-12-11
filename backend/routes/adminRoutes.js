const express = require('express');
const router = express.Router();
const { isAdmin, auth } = require('../middleware/auth');
const courtController = require('../controllers/courtController');
const coachController = require('../controllers/coachController');
const equipmentController = require('../controllers/equipmentController');
const pricingController = require('../controllers/pricingController');

router.use(auth, isAdmin); 

// Court Management
router.post('/courts', courtController.addCourt);
router.put('/courts/:id', courtController.updateCourt);

// Coach Management
router.post('/coaches', coachController.addCoach);
router.put('/coaches/:id', coachController.updateCoach);

// Equipment/Inventory Management
router.get('/equipment', equipmentController.listEquipment);
router.put('/equipment/:name', equipmentController.updateEquipmentStock);

// Pricing Rule Management 
router.post('/rules', pricingController.addRule);
router.put('/rules/:id', pricingController.updateRule);

module.exports = router;