import { PrismaClient } from './generated';

const prisma = new PrismaClient();

async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log('Existing users:');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Email: ${user.email}, Name: ${user.firstName} ${user.lastName}`);
    });
    
    if (users.length > 0) {
      console.log('\nUse this ownerId for account creation:', users[0].id);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getUsers();
