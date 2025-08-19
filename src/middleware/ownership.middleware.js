const { PrismaClient } = require('../../generated/prisma');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const prisma = new PrismaClient({});

exports.isProjectOwner = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    return next(new AppError('Project not found.', 404));
  }

  // Check if the authenticated user's ID matches the project's client ID
  if (req.user.id !== project.clientId) {
    return next(new AppError('You do not have permission to access this project.', 403));
  }

  // Attach the project to the request object for later use in the controller
  req.project = project;
  next();
});
