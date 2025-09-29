#!/usr/bin/env node

const { PrismaClient } = require('../packages/database/generated');

const prisma = new PrismaClient();

async function viewData() {
  try {
    console.log('🏢 ACCOUNTS:');
    const accounts = await prisma.account.findMany({
      include: {
        contacts: true,
        owner: {
          select: { firstName: true, lastName: true, email: true }
        },
        _count: {
          select: { enquiries: true, leads: true, projects: true }
        }
      }
    });
    console.log(JSON.stringify(accounts, null, 2));
    
    console.log('\n👥 LEADS:');
    const leads = await prisma.lead.findMany({
      include: {
        account: {
          select: { name: true }
        },
        owner: {
          select: { firstName: true, lastName: true }
        }
      }
    });
    console.log(JSON.stringify(leads, null, 2));
    
    console.log('\n📋 ENQUIRIES:');
    const enquiries = await prisma.enquiry.findMany({
      include: {
        account: {
          select: { name: true }
        },
        rooms: true
      }
    });
    console.log(JSON.stringify(enquiries, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

viewData();