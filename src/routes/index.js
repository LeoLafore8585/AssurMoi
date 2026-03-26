const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/assures', require('./assures'));
router.use('/contrats', require('./contrats'));
router.use('/vehicules', require('./vehicules'));
router.use('/sinistres', require('./sinistres'));
router.use('/dossiers', require('./dossiers'));
router.use('/documents', require('./documents'));

module.exports = router;