const projectService = require('../services/project.service');
const catchAsync = require('../utils/catchAsync');

// Create a project
exports.createProject = async (req, res, next) => {
  try {
    const clientId = req.user.id;
    const project = await projectService.createProject(req.body, clientId);
    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
};

// Get all projects (public)
exports.getProjects = catchAsync(async (req, res) => {
    const projects = await projectService.getProjects(req.query);

    res.status(200).json({
        status: 'success',
        results: projects.totalCount,
        data: {
            projects: projects.projects,
            pagination: {
                page: projects.page,
                pageSize: projects.pageSize,
                totalPages:  projects.totalPages,
                totalCount: projects.totalCount,
            },
        },
    });
});

// Get a single Project (public)
exports.getProject = catchAsync(async (req, res) => {
    const { id } = req.params;
    const project = await projectService.getProjectById(id);

    res.status(200).json({
        status: 'success',
        data: { project },
    });
});

// Update a project (owner only)
exports.updateProject = catchAsync(async (req, res) => {
    const { id } = req.params;

    const project = await projectService.updateProject(id, req.body);

    res.status(200).json({
        status: 'success',
        data: { project },
    });
});

// Delete a Project (owner only)
exports.deleteProject = catchAsync(async (req, res) => {
    const { id } = req.params
    const results = await projectService.deleteProject(id);

    res.status(200).json({
        status: 'success',
        data: null
    });
});

// Open a project (owner only).
exports.openProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const project = await projectService.openProject(id);

  res.status(200).json({
    status: 'success',
    data: { project },
  });
});

// Close a project (owner or ADMIN).
exports.closeProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const project = await projectService.closeProject(id);

  res.status(200).json({
    status: 'success',
    data: { project },
  });
});
