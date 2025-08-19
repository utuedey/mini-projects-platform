#!/usr/bin/env node

const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const authRouter = require('./routes/auth.router');
const userRouter = require('./routes/user.router');
const projectRouter = require('./routes/project.router');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(cors("*"));

// App Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/projects', projectRouter);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Mini Projects Platform Backend is running!');
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});


// Gracful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

module.exports = server;
