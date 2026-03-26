const express = require('express');
const router = express.Router();

const documentsService = require('../services/documents');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, documentsService.getAllDocuments);
router.get('/:id', authMiddleware, documentsService.getDocumentById);
router.post('/', authMiddleware, documentsService.createDocument);
router.patch('/:id', authMiddleware, documentsService.updateDocument);

module.exports = router;