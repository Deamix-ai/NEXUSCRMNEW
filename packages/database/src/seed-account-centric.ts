import { 
  PrismaClient, 
  UserRole, 
  AccountStatus,
  EnquiryStatus,
  LeadStatus, 
  ProjectStatus,
  ProjectType,
  Priority,
  ActivityType
} from '../generated';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CRM-Nexus Account-centric database seed...');

  // Clean existing data (in reverse order of dependencies)
  console.log('🧹 Cleaning existing data...');
  await prisma.activity.deleteMany();
  await prisma.task.deleteMany();
  await prisma.document.deleteMany();
  await prisma.project.deleteMany();
  await prisma.completedProject.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@bowmanskb.co.uk',
      passwordHash: hashedPassword,
      firstName: 'John',
      lastName: 'Bowman',
      phone: '+44 1234 567890',
      role: UserRole.ADMIN,
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Create sales user
  console.log('👤 Creating sales user...');
  const salesPassword = await bcrypt.hash('sales123', 10);
  const salesUser = await prisma.user.create({
    data: {
      email: 'sales@bowmanskb.co.uk',
      passwordHash: salesPassword,
      firstName: 'Sarah',
      lastName: 'Mitchell',
      phone: '+44 1234 567891',
      role: UserRole.SALES,
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Create designer user
  console.log('👤 Creating designer user...');
  const designerPassword = await bcrypt.hash('designer123', 10);
  const designerUser = await prisma.user.create({
    data: {
      email: 'designer@bowmanskb.co.uk',
      passwordHash: designerPassword,
      firstName: 'David',
      lastName: 'Thompson',
      phone: '+44 1234 567892',
      role: UserRole.DESIGNER,
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Create sample accounts
  console.log('🏢 Creating sample accounts...');
  
  const account1 = await prisma.account.create({
    data: {
      name: 'The Smith Family',
      legalName: 'Mr & Mrs Smith',
      emails: ['john.smith@example.com', 'mary.smith@example.com'],
      phones: ['+44 7123 456789', '+44 7987 654321'],
      billingAddress: {
        line1: '123 Oak Street',
        line2: '',
        city: 'Manchester',
        county: 'Greater Manchester',
        postcode: 'M1 2AB',
        country: 'United Kingdom'
      },
      siteAddresses: [{
        line1: '123 Oak Street',
        line2: '',
        city: 'Manchester', 
        county: 'Greater Manchester',
        postcode: 'M1 2AB',
        country: 'United Kingdom',
        isPrimary: true
      }],
      ownerId: salesUser.id,
      status: AccountStatus.ACTIVE,
      designFeePaid: false,
      consentMarketing: true,
    },
  });

  const account2 = await prisma.account.create({
    data: {
      name: 'Johnson Residence',
      legalName: 'Mr & Mrs Johnson',
      emails: ['contact@johnsonhome.com'],
      phones: ['+44 7555 123456'],
      billingAddress: {
        line1: '456 Elm Avenue',
        line2: 'Apartment 3B',
        city: 'Leeds',
        county: 'West Yorkshire',
        postcode: 'LS1 3CD',
        country: 'United Kingdom'
      },
      ownerId: salesUser.id,
      status: AccountStatus.ACTIVE,
      designFeePaid: true,
      consentMarketing: false,
    },
  });

  // Create contacts for accounts
  console.log('👥 Creating contacts...');
  
  const contact1 = await prisma.contact.create({
    data: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+44 7123 456789',
      isPrimary: true,
      accountId: account1.id,
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      name: 'Mary Smith',
      email: 'mary.smith@example.com',
      phone: '+44 7987 654321',
      isPrimary: false,
      accountId: account1.id,
    },
  });

  const contact3 = await prisma.contact.create({
    data: {
      name: 'Robert Johnson',
      email: 'contact@johnsonhome.com',
      phone: '+44 7555 123456',
      isPrimary: true,
      accountId: account2.id,
    },
  });

  // Create enquiries
  console.log('📝 Creating enquiries...');
  
  const enquiry1 = await prisma.enquiry.create({
    data: {
      title: 'Bathroom Renovation Enquiry',
      description: 'Looking for a complete bathroom renovation for our master bedroom en-suite',
      status: EnquiryStatus.NEW,
      priority: Priority.HIGH,
      source: 'Website Contact Form',
      campaign: 'Google Ads - Bathroom Renovation',
      medium: 'Digital',
      estimatedValue: 15000.00,
      contactMethod: 'Email',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '+44 7123 456789',
      message: 'We are looking to renovate our master bathroom completely. We have a budget of around £15,000 and would like to see some modern designs.',
      accountId: account1.id,
      ownerId: salesUser.id,
    },
  });

  // Create leads
  console.log('🎯 Creating leads...');
  
  const lead1 = await prisma.lead.create({
    data: {
      title: 'Smith Family Bathroom Project',
      description: 'Complete master bathroom renovation with modern fixtures',
      status: LeadStatus.QUALIFIED,
      priority: Priority.HIGH,
      source: 'Website',
      estimatedValue: 15000.00,
      accountId: account1.id,
      ownerId: salesUser.id,
      enquiryId: enquiry1.id,
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      title: 'Johnson Kitchen & Bathroom',
      description: 'Kitchen and bathroom renovation project',
      status: LeadStatus.PROPOSAL_SENT,
      priority: Priority.MEDIUM,
      source: 'Referral',
      estimatedValue: 25000.00,
      accountId: account2.id,
      ownerId: designerUser.id,
    },
  });

  // Update enquiry with lead
  await prisma.enquiry.update({
    where: { id: enquiry1.id },
    data: { leadId: lead1.id },
  });

  // Create projects
  console.log('🚧 Creating projects...');
  
  const project1 = await prisma.project.create({
    data: {
      title: 'Smith Master Bathroom Renovation',
      description: 'Complete renovation of master bedroom en-suite bathroom with modern fixtures and fittings',
      type: ProjectType.BATHROOM,
      status: ProjectStatus.DESIGN,
      amountGrossIncVat: 1860000, // £18,600 in pence (£15,500 + 20% VAT)
      vatRate: 0.2,
      probability: 85,
      accountId: account1.id,
      leadId: lead1.id,
      ownerId: designerUser.id,
    },
  });

  // Create activities
  console.log('📋 Creating activities...');
  
  await prisma.activity.createMany({
    data: [
      {
        type: ActivityType.CALL,
        summary: 'Initial consultation call with Mr & Mrs Smith',
        body: 'Discussed requirements and scheduled site survey',
        durations: { minutes: 30 },
        occurredAt: new Date('2025-09-10T10:00:00Z'),
        accountId: account1.id,
        userId: salesUser.id,
      },
      {
        type: ActivityType.EMAIL,
        summary: 'Sent project proposal and initial designs',
        body: 'Proposal sent via email with 3 design options',
        occurredAt: new Date('2025-09-12T14:30:00Z'),
        accountId: account1.id,
        userId: designerUser.id,
      },
      {
        type: ActivityType.MEETING,
        summary: 'Site survey and measurements',
        body: 'Completed detailed measurements and discussed specific requirements',
        durations: { minutes: 90 },
        occurredAt: new Date('2025-09-15T09:00:00Z'),
        accountId: account1.id,
        userId: designerUser.id,
      },
      {
        type: ActivityType.CALL,
        summary: 'Follow-up call with Johnson family',
        body: 'Discussed timeline and material options',
        durations: { minutes: 25 },
        occurredAt: new Date('2025-09-14T16:00:00Z'),
        accountId: account2.id,
        userId: salesUser.id,
      },
    ],
  });

  console.log('✅ Database seed completed successfully!');
  console.log(`
🎉 CRM-Nexus seed data created:
👥 Users: ${adminUser.firstName} ${adminUser.lastName} (Admin), ${salesUser.firstName} ${salesUser.lastName} (Sales), ${designerUser.firstName} ${designerUser.lastName} (Designer)
🏢 Accounts: ${account1.name}, ${account2.name}
👥 Contacts: ${contact1.name}, ${contact2.name}, ${contact3.name}
📝 Enquiries: 1 enquiry
🎯 Leads: 2 leads
🚧 Projects: 1 project
📋 Activities: 4 activities

🔑 Login credentials:
Admin: admin@bowmanskb.co.uk / admin123
Sales: sales@bowmanskb.co.uk / sales123
Designer: designer@bowmanskb.co.uk / designer123
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });