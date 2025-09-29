const { PrismaClient } = require('./packages/database/generated');

const prisma = new PrismaClient();

async function createTestEnquiries() {
  try {
    // First, get some existing accounts
    const accounts = await prisma.account.findMany({
      take: 3,
      select: { id: true, name: true }
    });

    if (accounts.length === 0) {
      console.log('No accounts found. Creating a test account first...');
      
      const testAccount = await prisma.account.create({
        data: {
          name: 'Test Customer',
          emails: ['test@example.com'],
          phones: ['07123456789'],
          ownerId: 'cmfbhlacp0000jdr8iqfhqno2', // Default owner ID
        }
      });
      
      accounts.push(testAccount);
    }

    console.log('Found accounts:', accounts);

    // Get an owner (user)
    const owner = await prisma.user.findFirst({
      select: { id: true, firstName: true, lastName: true }
    });

    if (!owner) {
      console.log('No users found in database');
      return;
    }

    console.log('Using owner:', owner);

    // Create test enquiries
    const testEnquiries = [
      {
        title: 'Bathroom Renovation - Modern Suite',
        description: 'Customer wants to renovate their family bathroom with modern fixtures and tiling',
        status: 'NEW',
        priority: 'HIGH',
        source: 'Website',
        estimatedValue: 8500.00,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '07987654321',
        message: 'Looking for a complete bathroom renovation. Interested in modern designs with walk-in shower.',
        accountId: accounts[0].id,
        ownerId: owner.id,
      },
      {
        title: 'En-suite Installation - Master Bedroom',
        description: 'New en-suite bathroom installation in converted bedroom space',
        status: 'NEW',
        priority: 'MEDIUM',
        source: 'Referral',
        estimatedValue: 12000.00,
        firstName: 'David',
        lastName: 'Williams',
        email: 'david.williams@email.com',
        phone: '07555123456',
        message: 'Converting spare room to master bedroom with en-suite. Need design consultation.',
        accountId: accounts.length > 1 ? accounts[1].id : accounts[0].id,
        ownerId: owner.id,
      },
      {
        title: 'Cloakroom Update - Ground Floor',
        description: 'Small cloakroom refurbishment with new fixtures',
        status: 'CONTACTED',
        priority: 'LOW',
        source: 'Google Ads',
        estimatedValue: 3500.00,
        firstName: 'Emma',
        lastName: 'Davis',
        email: 'emma.davis@email.com',
        phone: '07444987654',
        mobile: '07444987654',
        message: 'Small downstairs toilet needs updating. Looking for space-saving solutions.',
        accountId: accounts.length > 2 ? accounts[2].id : accounts[0].id,
        ownerId: owner.id,
      }
    ];

    console.log('Creating enquiries...');
    
    for (const enquiryData of testEnquiries) {
      const enquiry = await prisma.enquiry.create({
        data: enquiryData,
        include: {
          account: {
            select: { name: true }
          },
          owner: {
            select: { firstName: true, lastName: true }
          }
        }
      });
      
      console.log(`Created enquiry: ${enquiry.title} for account: ${enquiry.account.name}`);
    }

    console.log('\nTest enquiries created successfully!');
    
  } catch (error) {
    console.error('Error creating test enquiries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestEnquiries();