import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../src/app.module'
import { PrismaClient } from '@crm/database'

describe('Leads API (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaClient
  let testAccountId: string
  let testUserId: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    prisma = new PrismaClient()

    // Create test user and account
    const testUser = await prisma.user.create({
      data: {
        email: 'test-e2e@example.com',
        firstName: 'E2E',
        lastName: 'Test',
        role: 'SALES'
      }
    })
    testUserId = testUser.id

    const testAccount = await prisma.account.create({
      data: {
        name: 'E2E Test Account',
        ownerId: testUserId,
        emails: ['test@example.com'],
        phones: ['+44 1234 567890']
      }
    })
    testAccountId = testAccount.id

    await app.init()
  })

  afterAll(async () => {
    // Clean up test data
    await prisma.lead.deleteMany({
      where: {
        title: {
          contains: 'E2E Test'
        }
      }
    })

    await prisma.account.deleteMany({
      where: {
        name: {
          contains: 'E2E Test'
        }
      }
    })

    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test-e2e'
        }
      }
    })

    await prisma.$disconnect()
    await app.close()
  })

  beforeEach(async () => {
    // Clean up leads before each test
    await prisma.lead.deleteMany({
      where: {
        title: {
          contains: 'E2E Test'
        }
      }
    })
  })

  describe('/api/leads (GET)', () => {
    it('should return leads with pagination', async () => {
      // Create test lead
      const testLead = await prisma.lead.create({
        data: {
          title: 'E2E Test Lead',
          description: 'Test description',
          status: 'NEW',
          priority: 'MEDIUM',
          estimatedValue: 5000,
          probability: 70,
          expectedCloseDate: new Date('2024-12-31'),
          source: 'Website',
          accountId: testAccountId,
          ownerId: testUserId
        },
        include: {
          account: true,
          owner: true
        }
      })

      const response = await request(app.getHttpServer())
        .get('/api/leads')
        .expect(200)

      expect(response.body).toHaveProperty('leads')
      expect(response.body).toHaveProperty('pagination')
      expect(Array.isArray(response.body.leads)).toBe(true)
      expect(response.body.pagination).toHaveProperty('total')
      expect(response.body.pagination).toHaveProperty('page')
      expect(response.body.pagination).toHaveProperty('limit')

      // Check if our test lead is in the results
      const foundLead = response.body.leads.find((lead: any) => lead.id === testLead.id)
      expect(foundLead).toBeDefined()
      expect(foundLead.title).toBe('E2E Test Lead')
    })

    it('should filter leads by status', async () => {
      // Create test leads with different statuses
      await prisma.lead.createMany({
        data: [
          {
            title: 'E2E Test Lead 1',
            description: 'Test description',
            status: 'NEW',
            estimatedValue: 3000,
            probability: 50,
            expectedCloseDate: new Date('2024-12-31'),
            source: 'Website',
            accountId: testAccountId,
            ownerId: testUserId
          },
          {
            title: 'E2E Test Lead 2',
            description: 'Test description',
            status: 'QUALIFIED',
            estimatedValue: 7000,
            probability: 80,
            expectedCloseDate: new Date('2024-12-31'),
            source: 'Referral',
            accountId: testAccountId,
            ownerId: testUserId
          }
        ]
      })

      const response = await request(app.getHttpServer())
        .get('/api/leads?status=NEW')
        .expect(200)

      expect(response.body.leads.length).toBeGreaterThan(0)
      response.body.leads.forEach((lead: any) => {
        expect(lead.status).toBe('NEW')
      })
    })

    it('should handle pagination correctly', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/leads?page=1&limit=5')
        .expect(200)

      expect(response.body.pagination.page).toBe(1)
      expect(response.body.pagination.limit).toBe(5)
      expect(response.body.leads.length).toBeLessThanOrEqual(5)
    })
  })

  describe('/api/leads (POST)', () => {
    it('should create a new lead', async () => {
      const leadData = {
        title: 'E2E Test New Lead',
        description: 'New lead description',
        accountId: testAccountId,
        ownerId: testUserId,
        estimatedValue: 4000,
        probability: 60,
        expectedCloseDate: '2024-12-31',
        source: 'Website'
      }

      const response = await request(app.getHttpServer())
        .post('/api/leads')
        .send(leadData)
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.title).toBe('E2E Test New Lead')
      expect(response.body.estimatedValue).toBe('4000.00')
      expect(response.body.status).toBe('NEW')
      expect(response.body).toHaveProperty('createdAt')

      // Verify the lead was actually created in the database
      const createdLead = await prisma.lead.findUnique({
        where: { id: response.body.id }
      })
      expect(createdLead).toBeDefined()
      expect(createdLead?.title).toBe('E2E Test New Lead')
    })

    it('should validate required fields', async () => {
      const invalidLeadData = {
        description: 'Missing required fields'
      }

      const response = await request(app.getHttpServer())
        .post('/api/leads')
        .send(invalidLeadData)
        .expect(400)

      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toContain('title')
    })

    it('should validate account exists', async () => {
      const leadData = {
        title: 'E2E Test Lead with Invalid Account',
        description: 'Test description',
        accountId: 'non-existent-account-id',
        ownerId: testUserId,
        estimatedValue: 3000,
        probability: 50,
        expectedCloseDate: '2024-12-31',
        source: 'Website'
      }

      await request(app.getHttpServer())
        .post('/api/leads')
        .send(leadData)
        .expect(400)
    })
  })

  describe('/api/leads/:id (GET)', () => {
    it('should return a specific lead', async () => {
      // Create test lead
      const testLead = await prisma.lead.create({
        data: {
          title: 'E2E Test Specific Lead',
          description: 'Test description',
          status: 'NEW',
          estimatedValue: 5000,
          probability: 70,
          expectedCloseDate: new Date('2024-12-31'),
          source: 'Website',
          accountId: testAccountId,
          ownerId: testUserId
        },
        include: {
          account: true,
          owner: true
        }
      })

      const response = await request(app.getHttpServer())
        .get(`/api/leads/${testLead.id}`)
        .expect(200)

      expect(response.body.id).toBe(testLead.id)
      expect(response.body.title).toBe('E2E Test Specific Lead')
      expect(response.body.account).toBeDefined()
      expect(response.body.account.name).toBe('E2E Test Account')
    })

    it('should return 404 for non-existent lead', async () => {
      const nonExistentId = 'cltest123456789012345'
      
      await request(app.getHttpServer())
        .get(`/api/leads/${nonExistentId}`)
        .expect(404)
    })
  })

  describe('/api/leads/:id (PUT)', () => {
    it('should update a lead', async () => {
      // Create test lead
      const testLead = await prisma.lead.create({
        data: {
          title: 'E2E Test Lead to Update',
          description: 'Original description',
          status: 'NEW',
          estimatedValue: 3000,
          probability: 50,
          expectedCloseDate: new Date('2024-12-31'),
          source: 'Website',
          accountId: testAccountId,
          ownerId: testUserId
        }
      })

      const updateData = {
        title: 'E2E Test Lead Updated',
        estimatedValue: 6000,
        probability: 80
      }

      const response = await request(app.getHttpServer())
        .put(`/api/leads/${testLead.id}`)
        .send(updateData)
        .expect(200)

      expect(response.body.title).toBe('E2E Test Lead Updated')
      expect(response.body.estimatedValue).toBe('6000.00')
      expect(response.body.probability).toBe(80)
      expect(response.body.status).toBe('NEW') // Should remain unchanged

      // Verify in database
      const updatedLead = await prisma.lead.findUnique({
        where: { id: testLead.id }
      })
      expect(updatedLead?.title).toBe('E2E Test Lead Updated')
      expect(Number(updatedLead?.estimatedValue)).toBe(6000)
    })

    it('should return 404 for non-existent lead', async () => {
      const nonExistentId = 'cltest123456789012345'
      const updateData = { title: 'Updated Title' }
      
      await request(app.getHttpServer())
        .put(`/api/leads/${nonExistentId}`)
        .send(updateData)
        .expect(404)
    })
  })

  describe('/api/leads/:id (DELETE)', () => {
    it('should delete a lead', async () => {
      // Create test lead
      const testLead = await prisma.lead.create({
        data: {
          title: 'E2E Test Lead to Delete',
          description: 'Test description',
          status: 'NEW',
          estimatedValue: 2000,
          probability: 30,
          expectedCloseDate: new Date('2024-12-31'),
          source: 'Website',
          accountId: testAccountId,
          ownerId: testUserId
        }
      })

      const response = await request(app.getHttpServer())
        .delete(`/api/leads/${testLead.id}`)
        .expect(200)

      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toContain('deleted')

      // Verify lead is deleted
      const deletedLead = await prisma.lead.findUnique({
        where: { id: testLead.id }
      })
      expect(deletedLead).toBeNull()
    })

    it('should return 404 for non-existent lead', async () => {
      const nonExistentId = 'cltest123456789012345'
      
      await request(app.getHttpServer())
        .delete(`/api/leads/${nonExistentId}`)
        .expect(404)
    })
  })

  describe('/api/leads/:id/status (PATCH)', () => {
    it('should update lead status', async () => {
      // Create test lead
      const testLead = await prisma.lead.create({
        data: {
          title: 'E2E Test Lead Status Update',
          description: 'Test description',
          status: 'NEW',
          estimatedValue: 4000,
          probability: 60,
          expectedCloseDate: new Date('2024-12-31'),
          source: 'Website',
          accountId: testAccountId,
          ownerId: testUserId
        }
      })

      const response = await request(app.getHttpServer())
        .patch(`/api/leads/${testLead.id}/status`)
        .send({ status: 'QUALIFIED' })
        .expect(200)

      expect(response.body.status).toBe('QUALIFIED')
      expect(response.body.id).toBe(testLead.id)

      // Verify in database
      const updatedLead = await prisma.lead.findUnique({
        where: { id: testLead.id }
      })
      expect(updatedLead?.status).toBe('QUALIFIED')
    })

    it('should validate status values', async () => {
      // Create test lead
      const testLead = await prisma.lead.create({
        data: {
          title: 'E2E Test Lead Invalid Status',
          description: 'Test description',
          status: 'NEW',
          estimatedValue: 3000,
          probability: 50,
          expectedCloseDate: new Date('2024-12-31'),
          source: 'Website',
          accountId: testAccountId,
          ownerId: testUserId
        }
      })

      await request(app.getHttpServer())
        .patch(`/api/leads/${testLead.id}/status`)
        .send({ status: 'INVALID_STATUS' })
        .expect(400)
    })
  })

  describe('/api/leads/metrics (GET)', () => {
    it('should return lead metrics', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/leads/metrics')
        .expect(200)

      expect(response.body).toHaveProperty('totalLeads')
      expect(response.body).toHaveProperty('newLeads')
      expect(response.body).toHaveProperty('qualifiedLeads')
      expect(response.body).toHaveProperty('convertedLeads')
      expect(response.body).toHaveProperty('conversionRate')
      expect(response.body).toHaveProperty('averageValue')
      expect(response.body).toHaveProperty('totalValue')

      expect(typeof response.body.totalLeads).toBe('number')
      expect(typeof response.body.conversionRate).toBe('number')
      expect(typeof response.body.averageValue).toBe('number')
    })
  })
})