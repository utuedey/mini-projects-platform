const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/rbac.middleware');
const applicationController = require('../controllers/application.controller');

const router = express.Router();

router.use(protect);

// GET /me/applications - FREELANCER can view their own applications
router.get('/me', restrictTo('FREELANCER'), applicationController.getApplicationsByFreelancer);

// POST /applications/:id/accept - CLIENT can accept an application
router.post('/:id/accept', restrictTo('CLIENT'), applicationController.acceptApplication);

module.exports = router;
