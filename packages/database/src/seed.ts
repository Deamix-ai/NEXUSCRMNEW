import { PrismaClient, UserRole, LeadStatus, JobStatus, RoomType, ClientType } from './generated';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create pipeline stages
  const pipelineStages = await Promise.all([
    prisma.pipelineStage.create({
      data: {
        name: 'New Lead',
        description: 'Initial lead created',
        order: 1,
        probability: 10,
      },
    }),
    prisma.pipelineStage.create({
      data: {
        name: 'Qualified',
        description: 'Lead has been qualified',
        order: 2,
        probability: 25,
      },
    }),
    prisma.pipelineStage.create({
      data: {
        name: 'Survey Booked',
        description: 'Survey appointment scheduled',
        order: 3,
        probability: 40,
      },
    }),
    prisma.pipelineStage.create({
      data: {
        name: 'Quote Sent',
        description: 'Quote has been sent to client',
        order: 4,
        probability: 60,
      },
    }),
    prisma.pipelineStage.create({
      data: {
        name: 'Negotiating',
        description: 'In negotiation with client',
        order: 5,
        probability: 75,
      },
    }),
    prisma.pipelineStage.create({
      data: {
        name: 'Won',
        description: 'Deal won - converting to job',
        order: 6,
        probability: 100,
        isClosedWon: true,
      },
    }),
    prisma.pipelineStage.create({
      data: {
        name: 'Lost',
        description: 'Deal lost',
        order: 7,
        probability: 0,
        isClosedLost: true,
      },
    }),
  ]);

  console.log('✅ Created pipeline stages');

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@bowmanskb.co.uk',
      passwordHash: adminPasswordHash,
      firstName: 'System',
      lastName: 'Administrator',
      role: UserRole.ADMIN,
      emailVerifiedAt: new Date(),
    },
  });

  // Create sample users
  const salesUser = await prisma.user.create({
    data: {
      email: 'sales@bowmanskb.co.uk',
      passwordHash: await bcrypt.hash('Sales123!', 12),
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '01234567890',
      role: UserRole.SALES,
      emailVerifiedAt: new Date(),
      createdById: adminUser.id,
    },
  });

  const designerUser = await prisma.user.create({
    data: {
      email: 'designer@bowmanskb.co.uk',
      passwordHash: await bcrypt.hash('Design123!', 12),
      firstName: 'David',
      lastName: 'Williams',
      phone: '01234567891',
      role: UserRole.DESIGNER,
      emailVerifiedAt: new Date(),
      createdById: adminUser.id,
    },
  });

  const fieldUser = await prisma.user.create({
    data: {
      email: 'field@bowmanskb.co.uk',
      passwordHash: await bcrypt.hash('Field123!', 12),
      firstName: 'Mark',
      lastName: 'Thompson',
      phone: '01234567892',
      role: UserRole.FIELD,
      emailVerifiedAt: new Date(),
      createdById: adminUser.id,
    },
  });

  console.log('✅ Created users');

  // Create sample installer company
  const installerCompany = await prisma.installerCompany.create({
    data: {
      name: 'Premium Installations Ltd',
      contactEmail: 'info@premiuminstalls.co.uk',
      contactPhone: '01234567893',
      address: '123 Trade Park, Birmingham B1 1AA',
      insuranceExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      dbsExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      contractSigned: true,
      contractSignedAt: new Date(),
    },
  });

  // Create sample installer team members
  await prisma.installerTeamMember.createMany({
    data: [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@premiuminstalls.co.uk',
        phone: '07123456789',
        companyId: installerCompany.id,
        dbsExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      {
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike@premiuminstalls.co.uk',
        phone: '07123456790',
        companyId: installerCompany.id,
        dbsExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('✅ Created installer company and team');

  // Create sample clients
  const client1 = await prisma.client.create({
    data: {
      firstName: 'Jane',
      lastName: 'Wilson',
      email: 'jane.wilson@email.com',
      phone: '01234567894',
      mobile: '07123456791',
      addressLine1: '45 Oak Avenue',
      city: 'Birmingham',
      postcode: 'B15 2TT',
      clientType: ClientType.RESIDENTIAL,
      leadSource: 'Website',
      marketingConsent: true,
      marketingConsentDate: new Date(),
      emailConsent: true,
      ownerId: salesUser.id,
      createdById: salesUser.id,
      portalKey: 'portal-' + Math.random().toString(36).substring(2, 15),
    },
  });

  const client2 = await prisma.client.create({
    data: {
      firstName: 'Robert',
      lastName: 'Brown',
      email: 'robert.brown@email.com',
      phone: '01234567895',
      addressLine1: '12 Elm Close',
      city: 'Solihull',
      postcode: 'B91 3HG',
      clientType: ClientType.RESIDENTIAL,
      leadSource: 'Referral',
      referralSource: 'Previous Customer',
      marketingConsent: false,
      emailConsent: true,
      ownerId: salesUser.id,
      createdById: salesUser.id,
      portalKey: 'portal-' + Math.random().toString(36).substring(2, 15),
    },
  });

  console.log('✅ Created sample clients');

  // Create sample rooms
  const room1 = await prisma.room.create({
    data: {
      name: 'Main Bathroom',
      type: RoomType.BATHROOM,
      length: 2500,
      width: 2000,
      height: 2400,
      currentCondition: 'Dated suite, requires full renovation',
      clientId: client1.id,
    },
  });

  const room2 = await prisma.room.create({
    data: {
      name: 'En-suite',
      type: RoomType.EN_SUITE,
      length: 1800,
      width: 1200,
      height: 2400,
      currentCondition: 'Shower cubicle needs replacing',
      clientId: client2.id,
    },
  });

  console.log('✅ Created sample rooms');

  // Create sample leads
  const lead1 = await prisma.lead.create({
    data: {
      title: 'Bathroom renovation enquiry',
      description: 'Customer interested in full bathroom renovation',
      status: LeadStatus.NEW,
      estimatedValue: 8500.00,
      probability: 25,
      source: 'Website Form',
      clientId: client1.id,
      ownerId: salesUser.id,
      createdById: salesUser.id,
    },
  });

  // Create sample deal
  const deal1 = await prisma.deal.create({
    data: {
      title: 'Wilson Bathroom Project',
      description: 'Complete bathroom renovation with premium suite',
      value: 9200.00,
      probability: 75,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      stageId: pipelineStages[4].id, // Negotiating stage
      clientId: client1.id,
      ownerId: salesUser.id,
      createdById: salesUser.id,
    },
  });

  // Link lead to deal
  await prisma.lead.update({
    where: { id: lead1.id },
    data: { dealId: deal1.id },
  });

  console.log('✅ Created sample leads and deals');

  // Create sample job
  const job1 = await prisma.job.create({
    data: {
      jobNumber: 'BWM-2024-001',
      title: 'Wilson Main Bathroom',
      description: 'Full bathroom renovation with walk-in shower',
      status: JobStatus.DESIGNING,
      quotedValue: 9200.00,
      depositAmount: 2000.00,
      depositPaid: true,
      designFeePaid: true,
      clientId: client1.id,
      roomId: room1.id,
      dealId: deal1.id,
      designerId: designerUser.id,
      installerCompanyId: installerCompany.id,
      surveyDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  });

  console.log('✅ Created sample job');

  // Create sample form templates
  const surveyTemplate = await prisma.formTemplate.create({
    data: {
      name: 'Site Survey Form',
      description: 'Standard site survey form for bathroom projects',
      category: 'SURVEY',
      schema: {
        fields: [
          { name: 'accessNotes', type: 'textarea', label: 'Access Notes', required: true },
          { name: 'currentCondition', type: 'textarea', label: 'Current Condition', required: true },
          { name: 'measurements', type: 'object', label: 'Measurements', fields: [
            { name: 'length', type: 'number', label: 'Length (mm)' },
            { name: 'width', type: 'number', label: 'Width (mm)' },
            { name: 'height', type: 'number', label: 'Height (mm)' }
          ]},
          { name: 'photos', type: 'array', label: 'Photos', itemType: 'file' }
        ]
      }
    },
  });

  const dailyLogTemplate = await prisma.formTemplate.create({
    data: {
      name: 'Daily Work Log',
      description: 'Daily progress and work completion form',
      category: 'DAILY_LOG',
      schema: {
        fields: [
          { name: 'workCompleted', type: 'textarea', label: 'Work Completed Today', required: true },
          { name: 'materialsUsed', type: 'textarea', label: 'Materials Used' },
          { name: 'issuesEncountered', type: 'textarea', label: 'Issues Encountered' },
          { name: 'photos', type: 'array', label: 'Progress Photos', itemType: 'file' }
        ]
      }
    },
  });

  console.log('✅ Created form templates');

  // Create sample guides
  const guides = await Promise.all([
    prisma.guide.create({
      data: {
        title: 'Bathroom Maintenance Guide',
        slug: 'bathroom-maintenance-guide',
        content: 'Regular maintenance tips for your new bathroom...',
        category: 'CARE_MAINTENANCE',
        tags: ['maintenance', 'care', 'cleaning'],
        isPublished: true,
        featured: true,
        metaDescription: 'Essential maintenance tips for your Bowmans bathroom',
        publishedAt: new Date(),
      },
    }),
    prisma.guide.create({
      data: {
        title: 'Warranty Information',
        slug: 'warranty-information',
        content: 'Information about your 3-year Bowmans warranty...',
        category: 'WARRANTY',
        tags: ['warranty', 'guarantee', 'coverage'],
        isPublished: true,
        metaDescription: 'Complete warranty information for Bowmans installations',
        publishedAt: new Date(),
      },
    }),
    prisma.guide.create({
      data: {
        title: 'Troubleshooting Common Issues',
        slug: 'troubleshooting-common-issues',
        content: 'Solutions for common bathroom issues...',
        category: 'TROUBLESHOOTING',
        tags: ['troubleshooting', 'problems', 'solutions'],
        isPublished: true,
        metaDescription: 'Quick solutions for common bathroom problems',
        publishedAt: new Date(),
      },
    }),
  ]);

  console.log('✅ Created sample guides');

  // Create sample activities
  await prisma.activity.createMany({
    data: [
      {
        type: 'CALL',
        title: 'Initial consultation call',
        description: 'Discussed requirements and project scope',
        direction: 'OUTBOUND',
        duration: 1200, // 20 minutes
        outcome: 'Positive - customer very interested',
        userId: salesUser.id,
        clientId: client1.id,
        leadId: lead1.id,
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        type: 'EMAIL',
        title: 'Quote sent',
        description: 'Emailed detailed quote for bathroom renovation',
        direction: 'OUTBOUND',
        userId: salesUser.id,
        clientId: client1.id,
        dealId: deal1.id,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        type: 'MEETING',
        title: 'Site survey completed',
        description: 'Conducted site survey and took measurements',
        userId: salesUser.id,
        clientId: client1.id,
        jobId: job1.id,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ],
  });

  console.log('✅ Created sample activities');

  console.log('🎉 Database seeding completed successfully!');
  console.log(`
📊 Created:
- ${pipelineStages.length} pipeline stages
- 4 users (1 admin, 1 sales, 1 designer, 1 field)
- 1 installer company with 2 team members
- 2 clients with contact details
- 2 rooms
- 1 lead and 1 deal
- 1 job in progress
- 2 form templates
- ${guides.length} guides
- 3 sample activities

🔑 Login credentials:
Admin: admin@bowmanskb.co.uk / Admin123!
Sales: sales@bowmanskb.co.uk / Sales123!
Designer: designer@bowmanskb.co.uk / Design123!
Field: field@bowmanskb.co.uk / Field123!
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
