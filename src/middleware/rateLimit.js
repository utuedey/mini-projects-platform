const rateLimit = require('express-rate-limit');
const AppError = require('../utils/AppError');

const authLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 100,
    message: new AppError(
        'Too many requests from this IP, please try again after 30 minutes!',
        429
    ).message,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: rateLimit.ipKeyGenerator,
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({
            status: 'fail',
            message: options.message
        });
    }
})

module.exports = {
    authLimiter
}