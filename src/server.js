#!/usr/bin/env node
const dotenv = require('dotenv');
dotenv.config();

const { app, prisma } = require('./app');

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Closing server...`);
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed. Prisma disconnected.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = server;

