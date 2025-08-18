const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');

const router = express.Router();

// Protect user routes
router.use(authMiddleware.protect);

router.get('/me', userController.getMe);
router.get('/', rbacMiddleware.restrictTo('ADMIN'), userController.getAllUsers);

module.exports = router;