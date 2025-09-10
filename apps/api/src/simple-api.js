const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@crm/database/generated');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [
      totalLeads,
      newLeads,
      totalClients,
      totalDeals,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.client.count(),
      prisma.deal.count(),
    ]);

    const stats = {
      leads: {
        total: totalLeads,
        new: newLeads,
      },
      clients: {
        total: totalClients,
      },
      deals: {
        total: totalDeals,
      },
      jobs: {
        active: 0, // Will implement later
      },
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Leads endpoints
app.get('/api/leads', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          client: true,
          owner: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit),
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({
      leads,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/leads/stats', async (req, res) => {
  try {
    const [total, newLeads, qualified, lost] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.lead.count({ where: { status: 'QUALIFIED' } }),
      prisma.lead.count({ where: { status: 'LOST' } }),
    ]);

    res.json({ total, new: newLeads, qualified, lost });
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clients endpoints
app.get('/api/clients', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        include: {
          owner: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit),
      }),
      prisma.client.count({ where }),
    ]);

    res.json({
      clients,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/clients/stats', async (req, res) => {
  try {
    const [total, residential, commercial, trade] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { clientType: 'RESIDENTIAL' } }),
      prisma.client.count({ where: { clientType: 'COMMERCIAL' } }),
      prisma.client.count({ where: { clientType: 'TRADE' } }),
    ]);

    res.json({ total, residential, commercial, trade });
  } catch (error) {
    console.error('Error fetching client stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`🚀 API server running on http://localhost:${port}`);
  console.log(`📚 Health check: http://localhost:${port}/health`);
  console.log(`📊 Dashboard stats: http://localhost:${port}/api/dashboard/stats`);
  console.log(`💾 Database connected successfully`);
});
