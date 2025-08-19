const express = require('express');
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');
const { isProjectOwner } = require('../middleware/ownership.middleware');

const router = express.Router();

// Public routes for viewing projects
router.route('/')
  .get(projectController.getProjects);

router.route('/:id')
  .get(projectController.getProject);

// All routes below this line require authentication
router.use(authMiddleware.protect);

// Client-specific routes with ownership checks
router.post('/', rbacMiddleware.restrictTo('CLIENT'), projectController.createProject);
router.patch('/:id', rbacMiddleware.restrictTo('CLIENT'), isProjectOwner, projectController.updateProject);
router.delete('/:id', rbacMiddleware.restrictTo('CLIENT'), isProjectOwner, projectController.deleteProject);

// Status transition routes
router.post('/:id/open', rbacMiddleware.restrictTo('CLIENT'), isProjectOwner, projectController.openProject);
router.post('/:id/close', rbacMiddleware.restrictTo('CLIENT', 'ADMIN'), projectController.closeProject);

module.exports = router;
