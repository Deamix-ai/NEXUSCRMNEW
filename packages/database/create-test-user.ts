import { PrismaClient } from './generated';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'test@bowmanskb.co.uk',
        firstName: 'Test',
        lastName: 'User',
        role: 'ADMIN',
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    console.log('Test user created:', user);
    console.log('Use this ownerId for accounts:', user.id);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
