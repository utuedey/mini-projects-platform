const { body, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

// Middleware to check for validation errors and throw a custom AppError
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  // Log a more informative message to the console for developers
  console.error('Validation Error:', JSON.stringify(errors.array(), null, 2));

  // Extract a clean message for the client
  const extractedErrors = errors.array().map(err => `${err.msg}`);
  return next(new AppError(extractedErrors.join('; '), 400));
};

// Validation chain for user registration
exports.registerValidation = [
  body('name')
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long.')
    .trim(),
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
  body('role')
    .notEmpty().withMessage('Role is required.')
    .isIn(['CLIENT', 'FREELANCER', 'ADMIN']).withMessage('Invalid user role provided.'),
  validate
];

// Validation chain for user login
exports.loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
  validate
];
