const express = require('express');
const router = express.Router();

const dossiersService = require('../services/dossiers');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, dossiersService.getAllDossiers);
router.get('/:id', authMiddleware, dossiersService.getDossierById);
router.post('/', authMiddleware, dossiersService.createDossier);
router.patch('/:id', authMiddleware, dossiersService.updateDossier);
router.patch('/:id/statut', authMiddleware, dossiersService.updateDossierStatus);

module.exports = router;