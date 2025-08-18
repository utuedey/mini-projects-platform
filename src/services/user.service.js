const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient({});

// Get all users for ADMIN role
exports.getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        },
    });
};

// Get a single user by ID
exports.getMe = async (userId) => {
    return await prisma.user.findUnique({
        where: {id: userId},
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        },
    });
};
