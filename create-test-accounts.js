const { PrismaClient } = require('./packages/database/generated');

const prisma = new PrismaClient();

async function createTestAccounts() {
  try {
    console.log('Creating test accounts...');
    
    // Get first user to be the owner
    const users = await prisma.user.findMany({ take: 1 });
    if (users.length === 0) {
      console.error('No users found. Create a user first.');
      return;
    }
    const ownerId = users[0].id;
    console.log('Using user as owner:', users[0].email);
    
    // Create test accounts
    const account1 = await prisma.account.create({
      data: {
        name: 'John Smith',
        legalName: 'John Smith Ltd',
        status: 'ACTIVE',
        ownerId: ownerId,
        emails: ['john.smith@example.com'],
        phones: ['01234 567890'],
        billingAddress: {
          street: '123 High Street',
          city: 'London',
          county: 'Greater London',
          postcode: 'SW1A 1AA',
          country: 'GB'
        }
      }
    });

    const account2 = await prisma.account.create({
      data: {
        name: 'Sarah Johnson',
        legalName: 'Johnson Properties Ltd',
        status: 'ACTIVE',
        ownerId: ownerId,
        emails: ['sarah@johnsonproperties.com', 'admin@johnsonproperties.com'],
        phones: ['01234 567891', '07890 123456'],
        billingAddress: {
          street: '456 Business Park',
          city: 'Manchester',
          county: 'Greater Manchester',
          postcode: 'M1 1AA',
          country: 'GB'
        }
      }
    });

    const account3 = await prisma.account.create({
      data: {
        name: 'David Wilson',
        status: 'ACTIVE',
        ownerId: ownerId,
        emails: ['d.wilson@email.co.uk'],
        phones: ['01234 567892'],
        billingAddress: {
          street: '789 Oak Avenue',
          city: 'Birmingham',
          county: 'West Midlands',
          postcode: 'B1 1AA',
          country: 'GB'
        }
      }
    });

    const account4 = await prisma.account.create({
      data: {
        name: 'Emma Thompson',
        legalName: 'Thompson Construction Services',
        status: 'ACTIVE',
        ownerId: ownerId,
        emails: ['emma@thompson-construction.co.uk'],
        phones: ['01234 567893'],
        billingAddress: {
          street: '321 Industrial Estate',
          city: 'Leeds',
          county: 'West Yorkshire',
          postcode: 'LS1 1AA',
          country: 'GB'
        }
      }
    });

    const account5 = await prisma.account.create({
      data: {
        name: 'Michael Brown',
        status: 'ARCHIVED',
        ownerId: ownerId,
        emails: ['mike.brown@gmail.com'],
        phones: ['01234 567894'],
        billingAddress: {
          street: '654 Residential Close',
          city: 'Bristol',
          county: 'Somerset',
          postcode: 'BS1 1AA',
          country: 'GB'
        }
      }
    });

    console.log('Test accounts created successfully:');
    console.log('- John Smith (Active)');
    console.log('- Sarah Johnson (Active)');
    console.log('- David Wilson (Active)');
    console.log('- Emma Thompson (Active)');
    console.log('- Michael Brown (Archived)');
    
  } catch (error) {
    console.error('Error creating test accounts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestAccounts();