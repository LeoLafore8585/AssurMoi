const express = require('express');
const router = express.Router();
const authService = require('../services/auth');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', authService.login);
router.post('/verify-2fa', authService.verify2FA);
router.post('/forgot-password', authService.forgotPassword);
router.post('/reset-password', authService.resetPassword);
router.get('/me', authMiddleware, authService.me);

module.exports = router;