const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');

// Get the current authenticated user's profile
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await userService.getMe(req.user.id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Get all users (Admin only)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.getAllUsers();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});