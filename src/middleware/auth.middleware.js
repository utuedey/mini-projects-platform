const jwt = require('jsonwebtoken');
const {PrismaClient} = require('../../generated/prisma');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient({});

exports.protect = catchAsync(async (req, res, next) => {
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access', 401));
    }

    
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return next(new AppError('Invalid token. Please log in again.', 401));
    }

    // Check if decoded token has required fields
    if (!decoded.id || !decoded.role) {
        return next(new AppError('Invalid token structure. Please log in again.', 401));
    }

    // Check if user still exists
    const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Verify that the token role matches the user's current role
    if (decoded.role !== currentUser.role) {
        return next(new AppError('User role has changed. Please log in again.', 401));
    }

    // Grant access to protected route
    req.user = currentUser;
    next();

})
