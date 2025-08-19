const applicationService = require('../services/application.service');
const catchAsync = require('../utils/catchAsync');

// Controller for freelancers to apply to a project
exports.createApplication = catchAsync(async (req, res) => {
  const { id: projectId } = req.params;
  const { coverLetter, bidAmount } = req.body;
  const freelancerId = req.user.id;

  const newApplication = await applicationService.createApplication(
    projectId,
    freelancerId,
    { coverLetter, bidAmount }
  );

  res.status(201).json({
    status: 'success',
    data: { application: newApplication },
  });
});

// Controller for clients to list applications for their own project
exports.getApplicationsByProject = catchAsync(async (req, res) => {
  const { id: projectId } = req.params;
  const clientId = req.user.id;

  const applications = await applicationService.getApplicationsByProject(projectId, clientId);

  res.status(200).json({
    status: 'success',
    results: applications.length,
    data: { applications },
  });
});

// Controller for a freelancer to view their own applications
exports.getApplicationsByFreelancer = catchAsync(async (req, res) => {
  const freelancerId = req.user.id;

  const applications = await applicationService.getApplicationsByFreelancer(freelancerId);

  res.status(200).json({
    status: 'success',
    results: applications.length,
    data: { applications },
  });
});

// Controller for a client to accept an application
exports.acceptApplication = catchAsync(async (req, res) => {
  const { id: applicationId } = req.params;
  const clientId = req.user.id;

  const acceptedApplication = await applicationService.acceptApplication(applicationId, clientId);

  res.status(200).json({
    status: 'success',
    data: { application: acceptedApplication },
  });
});
