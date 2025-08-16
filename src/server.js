#!/usr/bin/env node

const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const dotenv = require('dotenv')

dotenv.config();

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json())

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Mini Projects Platform Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});


// Gracful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
