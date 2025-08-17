const express = require('express');
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Apply rate limiting to all authentication routes
router.use(authLimiter);

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
