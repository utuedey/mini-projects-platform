const { PrismaClient } = require('../../generated/prisma');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient({});

// Service for a freelancer to apply to an OPEN project
exports.createApplication = async (projectId, freelancerId, data) => {
  // Check if the project exists and is OPEN
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.status !== 'OPEN') {
    throw new AppError('Cannot apply to this project. It may not exist or is not open for applications.', 400);
  }

  // Prevent duplicate applications from the same freelancer
  const existingApplication = await prisma.application.findUnique({
    where: {
      freelancerId_projectId: {
        freelancerId,
        projectId,
      },
    },
  });

  if (existingApplication) {
    throw new AppError('You have already applied to this project.', 400);
  }

  // Create new application
  return prisma.application.create({
    data: {
      ...data,
      projectId,
      freelancerId,
    },
  });
};

// Service for a client to list applications for their project
exports.getApplicationsByProject = async (projectId, clientId) => {
  // Check if the authenticated user is the project owner
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  // If the user is not the owner, deny access
  if (project.clientId !== clientId) {
    throw new AppError('You are not authorized to view applications for this project.', 403);
  }

  return prisma.application.findMany({
    where: { projectId },
    include: {
      freelancer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
};

// Service for an ADMIN to list all applications on the platform
exports.getAllApplications = async () => {
  return prisma.application.findMany({
    include: {
      freelancer: {
        select: {
          name: true,
          email: true,
        },
      },
      project: {
        select: {
          title: true,
          client: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

// Service for a freelancer to list their own applications
exports.getApplicationsByFreelancer = async (freelancerId) => {
  return prisma.application.findMany({
    where: { freelancerId },
    include: {
      project: {
        select: {
          title: true,
          description: true,
          status: true,
        },
      },
    },
  });
};

// Service for a client to accept an application
exports.acceptApplication = async (applicationId, clientId) => {
  // 1. Find the application and its related project
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      project: true,
    },
  });

  if (!application) {
    throw new AppError('Application not found.', 404);
  }

  const project = application.project;

  // Check if the authenticated user is the project owner
  if (project.clientId !== clientId) {
    throw new AppError('You are not authorized to accept this application.', 403);
  }

  // Check if the project is already closed
  if (project.status === 'CLOSED') {
    throw new AppError('This project is already closed.', 400);
  }

  return prisma.$transaction(async (prisma) => {
    // Accept the selected application
    const acceptedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'ACCEPTED' },
    });

    // Reject all other applications for the same project
    await prisma.application.updateMany({
      where: {
        projectId: project.id,
        id: { not: applicationId },
      },
      data: { status: 'REJECTED' },
    });

    // Mark the project as CLOSED
    await prisma.project.update({
      where: { id: project.id },
      data: { status: 'CLOSED' },
    });

    return acceptedApplication;
  });
};
