const { PrismaClient } = require('../../generated/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient({});

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.registerUser = async (name, email, password, role)  => {
    // validate role
    const validRoles = ['CLIENT', 'FREELANCER', 'ADMIN'];
    if (!validRoles.includes(role)) {
        throw new AppError("Invalid user role provided.", 400);
    }

    // check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: email }});
    if (existingUser) {
        throw new AppError('User with this email already exists', 409)
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new User
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash: hashedPassword,
            role,
        },
    });

    const token = generateToken(newUser.id)

    // Return user data
    const { passwordHash, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token };
}

exports.loginUser = async (email, password) =>{
    // check if user exists and password is provided
    if (!email || !password) {
        throw new AppError('Please provide email and password.', 400);
    }

    const user = await prisma.user.findUnique({ 
        where: { email: email }
    });
    const confirmPassword = await bcrypt.compare(password, user.passwordHash)

    if (!user || !confirmPassword) {
        throw new AppError("Incorrect email or password.", 401)
    }

    const token = generateToken(user.id)

    // Return logged in user token
    return { token }


}


