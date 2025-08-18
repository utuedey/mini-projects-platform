const express = require('express');
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimit');
const { registerValidation, loginValidation } = require('../validators/auth.validation');

const router = express.Router();

// Apply rate limiting to all authentication routes
router.use(authLimiter);

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

module.exports = router;
