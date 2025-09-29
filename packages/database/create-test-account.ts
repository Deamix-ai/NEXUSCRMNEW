import { PrismaClient, UserRole, ClientType, RoomType, JobStatus } from './generated';

const prisma = new PrismaClient();

async function createTestAccount() {
  console.log('🌱 Creating test account...');

  // Try to find existing user or create a new one
  let testUser = await prisma.user.findUnique({
    where: { email: 'john.doe@example.com' }
  });

  if (!testUser) {
    testUser = await prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.SALES,
        passwordHash: 'dummy-hash', // In real app this would be properly hashed
      },
    });
  }

  // Create test client/account
  const testClient = await prisma.client.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      companyName: 'Johnson Bathrooms Ltd',
      email: 'sarah@johnsonbathrooms.co.uk',
      phone: '+44 20 7123 4567',
      mobile: '+44 7700 123456',
      addressLine1: '123 Victoria Street',
      addressLine2: 'Apartment 4B',
      city: 'London',
      county: 'Greater London',
      postcode: 'SW1E 6DE',
      clientType: ClientType.COMMERCIAL,
      leadSource: 'Website',
      referralSource: 'Google Search',
      marketingConsent: true,
      emailConsent: true,
      ownerId: testUser.id,
      createdById: testUser.id,
    },
  });

  // Create a contact for the client
  await prisma.contact.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@johnsonbathrooms.co.uk',
      phone: '+44 20 7123 4567',
      mobile: '+44 7700 123456',
      jobTitle: 'Director',
      isPrimary: true,
      clientId: testClient.id,
    },
  });

  // Create a room/project container
  const mainBathroom = await prisma.room.create({
    data: {
      name: 'Executive Bathroom',
      type: RoomType.BATHROOM,
      length: 3500,
      width: 2800,
      height: 2600,
      currentCondition: 'High-end renovation required for executive suite',
      accessNotes: 'Access via main lobby, requires key card',
      clientId: testClient.id,
    },
  });

  // Create a project/job within the account
  const project = await prisma.job.create({
    data: {
      jobNumber: `JOB-2025-${Date.now()}`,
      title: 'Executive Bathroom Renovation',
      description: 'Complete renovation of executive bathroom suite with premium fixtures',
      status: JobStatus.DESIGNING,
      startDate: new Date('2025-10-01'),
      expectedEndDate: new Date('2025-11-15'),
      quotedValue: 45000.00,
      finalValue: 45000.00,
      depositAmount: 5000.00,
      depositPaid: true,
      designFeePaid: true,
      balancePaid: false,
      clientId: testClient.id,
      roomId: mainBathroom.id,
      designerId: testUser.id,
    },
  });

  // Create some activities within the account
  await prisma.activity.createMany({
    data: [
      {
        type: 'CALL',
        title: 'Initial Consultation',
        description: 'Initial consultation call - discussed project requirements and timeline',
        clientId: testClient.id,
        userId: testUser.id,
        createdAt: new Date('2025-09-01'),
      },
      {
        type: 'EMAIL',
        title: 'Project Proposal Sent',
        description: 'Sent project proposal and design brief',
        clientId: testClient.id,
        userId: testUser.id,
        createdAt: new Date('2025-09-03'),
      },
      {
        type: 'MEETING',
        title: 'Site Visit Completed',
        description: 'Site visit completed - measurements taken and design brief finalized',
        clientId: testClient.id,
        userId: testUser.id,
        createdAt: new Date('2025-09-08'),
      },
    ],
  });

  console.log('✅ Test account created successfully!');
  console.log(`📧 Client: ${testClient.firstName} ${testClient.lastName} (${testClient.companyName})`);
  console.log(`🏠 Project: ${project.title}`);
  console.log(`💰 Value: £${project.quotedValue}`);
  console.log(`🔗 Account ID: ${testClient.id}`);
}

createTestAccount()
  .catch((e) => {
    console.error('❌ Error creating test account:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
