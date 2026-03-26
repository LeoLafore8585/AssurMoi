const express = require('express');
const router = express.Router();

const sinistresService = require('../services/sinistres');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, sinistresService.getAllSinistres);
router.get('/:id', authMiddleware, sinistresService.getSinistreById);
router.post('/', authMiddleware, sinistresService.createSinistre);
router.patch('/:id', authMiddleware, sinistresService.updateSinistre);

module.exports = router;