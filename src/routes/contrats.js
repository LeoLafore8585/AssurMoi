const express = require('express');
const router = express.Router();

const contratsService = require('../services/contrats');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, contratsService.getAllContrats);
router.get('/:id', authMiddleware, contratsService.getContratById);
router.post('/', authMiddleware, contratsService.createContrat);
router.patch('/:id', authMiddleware, contratsService.updateContrat);

module.exports = router;