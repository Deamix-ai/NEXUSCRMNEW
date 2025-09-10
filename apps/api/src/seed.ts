import { PrismaClient } from '@crm/database/generated';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'admin@bowmanskb.co.uk' },
    update: {},
    create: {
      email: 'admin@bowmanskb.co.uk',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Created user:', user.email);

  // Create test clients
  const client1 = await prisma.client.create({
    data: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '01234 567890',
      addressLine1: '123 Main Street',
      city: 'London',
      postcode: 'SW1A 1AA',
      clientType: 'RESIDENTIAL',
      ownerId: user.id,
    },
  });

  const client2 = await prisma.client.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '01234 567891',
      addressLine1: '456 High Street',
      city: 'Manchester',
      postcode: 'M1 1AA',
      clientType: 'RESIDENTIAL',
      ownerId: user.id,
    },
  });

  console.log('✅ Created clients:', client1.firstName, client2.firstName);

  // Create test leads
  const lead1 = await prisma.lead.create({
    data: {
      title: 'Master Bathroom Renovation',
      description: 'Complete bathroom renovation including walk-in shower',
      status: 'NEW',
      priority: 'HIGH',
      estimatedValue: 12500.00,
      probability: 75,
      source: 'Website',
      clientId: client1.id,
      ownerId: user.id,
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      title: 'Guest Bathroom Upgrade',
      description: 'Simple refresh with new fixtures',
      status: 'QUALIFIED',
      priority: 'MEDIUM',
      estimatedValue: 5500.00,
      probability: 60,
      source: 'Referral',
      clientId: client2.id,
      ownerId: user.id,
    },
  });

  console.log('✅ Created leads:', lead1.title, lead2.title);

  // Create pipeline stages first
  const stage1 = await prisma.pipelineStage.create({
    data: {
      name: 'Proposal Sent',
      description: 'Proposal has been sent to client',
      order: 3,
      probability: 75,
    },
  });

  console.log('✅ Created pipeline stage:', stage1.name);

  // Create test deals
  const deal1 = await prisma.deal.create({
    data: {
      title: 'Luxury Ensuite Project',
      description: 'High-end ensuite renovation',
      value: 18000.00,
      probability: 85,
      expectedCloseDate: new Date('2025-10-15'),
      clientId: client1.id,
      ownerId: user.id,
      stageId: stage1.id,
    },
  });

  console.log('✅ Created deal:', deal1.title);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
