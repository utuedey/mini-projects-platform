const { PrismaClient } = require('../../generated/prisma');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient({});

// service to create a new project.
exports.createProject = async (data, clientId) => {
  try {
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        budgetMin: Number(data.budgetMin),
        budgetMax: Number(data.budgetMax),
        clientId: clientId,
        status: data.status || 'DRAFT'
      }
    });
    return project;
  } catch (err) {
    console.error("Prisma error:", err.message, err.code, err.meta);
    throw new AppError('Error creating project', 500);
  }
};

// service to get single project by Id
exports.getProjectById = async (projectId) => {
    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                client: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return project;
    } catch (error) {
        throw new AppError('Error fetching project', 500);
    }
}

// service to get all projects for a client with filtering, searching and pagination
exports.getProjects = async (filters) => {
    const { status, budgetMin, budgetMax, q, page = 1, pageSize = 10} = filters;
    
    const take = parseInt(pageSize, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    const where = {};
    if (status) {
        where.status = status;
    }
    if (budgetMin) {
        where.budget = {
            gte: parseFloat(budgetMin),
        };
    }
    if (budgetMax) {
        if (where.budget) {
            where.budget.lte = parseFloat(budgetMax);
        } else {
            where.budget = {
                lte: parseFloat(budgetMax),
            };
        }
    }
    if (q) {
        where.OR = [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
        ];
    }
    // Fetch Projects and total count to cal pagination metadata
    const [projects, totalCount] = await prisma.$transaction([
        prisma.project.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
            client: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    }),
    prisma.project.count({ where }),
    ]);

    return {
        projects,
        totalCount,
        page: parseInt(page, 10),
        pageSize: parseInt(pageSize, 10),
        totalPages: Math.ceil(totalCount / take),
    };
};

// Service to update a project
exports.updateProject = async (projectId, data) => {
    try {
        const project = await prisma.project.update({
            where: { id: projectId },
            data,
        });
        return project;
    } catch (error) {
        throw new AppError('Error updating project', 500);
    }
};

// Service to delete a project
exports.deleteProject = async (projectId) => {
    try {
        await prisma.project.delete({
            where: { id: projectId },
        });
    } catch (error) {
        throw new AppError('Error deleting project', 500);
    }
};

// service to transition a project from DRAFT to OPEN.
exports.openProject = async (projectId) => {
    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new AppError('Project not found', 404);
        }
        if (project.status !== 'DRAFT') {
            throw new AppError('Only Projects with DRAFT status can be opened', 400);
        }

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: { status: 'OPEN' },
        });

        return updatedProject;
    } catch (error) {
        throw new AppError('Error opening project', 500);
    }
};


// service to transition a project from OPEN to CLOSED.
exports.closeProject = async (projectId) => {
    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new AppError('Project not found', 404);
        }
        if (project.status !== 'OPEN') {
            throw new AppError('Only Projects with OPEN status can be closed', 400);
        }

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: { status: 'CLOSED' },
        });

        return updatedProject;
    } catch (error) {
        throw new AppError('Error closing project', 500);
    }
};
