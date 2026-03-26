const express = require('express');
const router = express.Router();

const assuresService = require('../services/assures');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, assuresService.getAllAssures);
router.get('/:id', authMiddleware, assuresService.getAssureById);
router.post('/', authMiddleware, assuresService.createAssure);
router.patch('/:id', authMiddleware, assuresService.updateAssure);

module.exports = router;