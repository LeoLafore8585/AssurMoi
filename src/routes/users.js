const express = require('express');
const router = express.Router();

const usersService = require('../services/users');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(['ADMINISTRATEUR']), usersService.getAllUsers);
router.get('/:id', authMiddleware, usersService.getUserById);
router.post('/', authMiddleware, roleMiddleware(['ADMINISTRATEUR']), usersService.createUser);
router.patch('/:id', authMiddleware, roleMiddleware(['ADMINISTRATEUR']), usersService.updateUser);
router.patch('/:id/status', authMiddleware, roleMiddleware(['ADMINISTRATEUR']), usersService.updateUserStatus);

module.exports = router;