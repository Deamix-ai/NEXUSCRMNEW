import { PrismaClient } from './generated';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding simple test data...');

  // Create a test user first
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      passwordHash: 'test-password-hash',
      role: 'ADMIN',
    },
  });

  // Create test accounts
  const account1 = await prisma.account.upsert({
    where: { id: 'test-account-1' },
    update: {},
    create: {
      id: 'test-account-1',
      name: 'Smith Family',
      legalName: 'John & Jane Smith',
      emails: ['john.smith@example.com'],
      phones: ['+44 7700 900123'],
      ownerId: testUser.id,
      status: 'ACTIVE',
    },
  });

  const account2 = await prisma.account.upsert({
    where: { id: 'test-account-2' },
    update: {},
    create: {
      id: 'test-account-2',
      name: 'Jones & Co',
      legalName: 'Jones Construction Limited',
      emails: ['info@jones-co.com'],
      phones: ['+44 7700 900456'],
      ownerId: testUser.id,
      status: 'ACTIVE',
    },
  });

  // Create test projects
  const project1 = await prisma.project.upsert({
    where: { id: 'test-project-1' },
    update: {},
    create: {
      id: 'test-project-1',
      title: 'Kitchen Renovation',
      description: 'Complete kitchen renovation including new units, appliances, and flooring',
      type: 'KITCHEN',
      status: 'PLANNING',
      accountId: account1.id,
      ownerId: testUser.id,
      amountGrossIncVat: 1500000, // £15,000 in pence
      probability: 80,
      source: 'Website Enquiry',
    },
  });

  const project2 = await prisma.project.upsert({
    where: { id: 'test-project-2' },
    update: {},
    create: {
      id: 'test-project-2',
      title: 'Bathroom Refurbishment',
      description: 'Master bathroom complete refurbishment with luxury fixtures',
      type: 'BATHROOM',
      status: 'IN_PROGRESS',
      accountId: account2.id,
      ownerId: testUser.id,
      amountGrossIncVat: 800000, // £8,000 in pence
      probability: 90,
      source: 'Referral',
    },
  });

  console.log('✅ Simple test data seeded successfully');
  console.log(`📊 Created: 1 user, 2 accounts, 2 projects`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
