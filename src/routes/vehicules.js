const express = require('express');
const router = express.Router();

const vehiculesService = require('../services/vehicules');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, vehiculesService.getAllVehicules);
router.get('/:id', authMiddleware, vehiculesService.getVehiculeById);
router.post('/', authMiddleware, vehiculesService.createVehicule);
router.patch('/:id', authMiddleware, vehiculesService.updateVehicule);

module.exports = router;