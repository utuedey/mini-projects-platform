const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Hashing a default password for all users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create users with different roles
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });

  const clientUser = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      name: 'Client User',
      email: 'client@example.com',
      passwordHash: hashedPassword,
      role: 'CLIENT',
    },
  });

  const freelancerUser = await prisma.user.upsert({
    where: { email: 'freelancer@example.com' },
    update: {},
    create: {
      name: 'Freelancer User',
      email: 'freelancer@example.com',
      passwordHash: hashedPassword,
      role: 'FREELANCER',
    },
  });

  console.log('Created users:', { adminUser, clientUser, freelancerUser });

  // Create projects for the client user, including budgetMin and budgetMax
  const projectsToSeed = [
    {
      title: 'Build a Portfolio Website',
      description: 'A modern, responsive portfolio website for a freelance designer.',
      budgetMin: 1400,
      budgetMax: 1600,
      status: 'OPEN',
      clientId: clientUser.id,
    },
    {
      title: 'Mobile App for a Small Business',
      description: 'Develop an Android/iOS app for a local coffee shop with loyalty features.',
      budgetMin: 4500,
      budgetMax: 5500,
      status: 'DRAFT',
      clientId: clientUser.id,
    },
    {
      title: 'E-commerce Store Development',
      description: 'Create a full-featured e-commerce platform with a payment gateway.',
      budgetMin: 7500,
      budgetMax: 8500,
      status: 'CLOSED',
      clientId: clientUser.id,
    },
  ];

  for (const projectData of projectsToSeed) {
    // Find the project first to check if it already exists
    const existingProject = await prisma.project.findFirst({
      where: { title: projectData.title },
    });

    if (existingProject) {
      // If it exists, update it
      await prisma.project.update({
        where: { id: existingProject.id },
        data: projectData,
      });
      console.log(`Updated project: ${projectData.title}`);
    } else {
      // If it doesn't exist, create a new one
      await prisma.project.create({
        data: projectData,
      });
      console.log(`Created new project: ${projectData.title}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
