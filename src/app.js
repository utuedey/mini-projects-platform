const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('../generated/prisma');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const authRouter = require('./routes/auth.router');
const userRouter = require('./routes/user.router');
const projectRouter = require('./routes/project.router');
const applicationRouter = require('./routes/application.router');

const prisma = new PrismaClient();
const app = express();

let swaggerDocument = {};
try {
  swaggerDocument = YAML.load('./src/swagger.yaml');
} catch (err) {
  console.error("Could not load swagger.yaml:", err.message);
}

app.use(express.json());
app.use(cors("*"));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/applications', applicationRouter);

app.get('/', (req, res) => {
  res.send('Mini Projects Platform Backend is running!');
});

module.exports = { app, prisma };
