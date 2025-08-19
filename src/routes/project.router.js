const express = require('express');
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middleware');
const { isProjectOwner } = require('../middleware/ownership.middleware');
const applicationController = require('../controllers/application.controller');

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

// POST /projects/:id/applications - FREELANCER can apply
router.post('/:id/applications', rbacMiddleware.restrictTo('FREELANCER'), applicationController.createApplication);

// GET /projects/:id/applications - CLIENT can list applications for their project
router.get('/:id/applications', rbacMiddleware.restrictTo('CLIENT', 'ADMIN'), applicationController.getApplicationsByProject);

module.exports = router;
