const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.register = catchAsync(async (req, res, next) => {

    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
        return next(new AppError('Please provide name, email, password, and role.', 400));
    }
    const {user, token} = await authService.registerUser(name, email, password, role);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user,
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password){
        return next(new AppError('Please provide email and password.', 400));
    }

    const { token } = await authService.loginUser(email, password);

    res.status(200).json({
        token,
    })
});
