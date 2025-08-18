const jwt = require('jsonwebtoken');
const {PrismaClient} = require('../../generated/prisma');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient({});

exports.protect = catchAsync( async (req, res, next) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not loged in! Please log in to get access', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check if user still exists
    const currentUser = await prisma.user.findUnique({where: {id: decoded.id}});

    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists.', 401));
    };

    // Grant access to protected route
    req.user = currentUser;
    next();

})
