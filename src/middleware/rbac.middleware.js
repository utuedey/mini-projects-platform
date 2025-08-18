const AppError = require('../utils/AppError');

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // Check if user role is included in the allowed roles
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
