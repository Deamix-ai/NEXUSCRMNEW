const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'CRM API Server'
  });
});

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication - replace with real auth
  if (email === 'admin@bowmanskb.co.uk' && password === 'admin123') {
    res.json({
      user: {
        id: '1',
        email: 'admin@bowmanskb.co.uk',
        name: 'Admin User',
        role: 'ADMIN'
      },
      token: 'mock-jwt-token-123'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Jobs endpoints
app.get('/api/jobs', (req, res) => {
  res.json([
    {
      id: '1',
      title: 'Bathroom Renovation - Smith',
      status: 'IN_PROGRESS',
      address: '123 Oak Street, Manchester',
      customer: 'John Smith',
      assignedTo: 'Mike Thompson',
      priority: 'HIGH',
      dueDate: '2025-09-15',
      progress: 65,
      description: 'Complete bathroom renovation including new suite and tiling'
    },
    {
      id: '2',
      title: 'Kitchen Installation - Davis',
      status: 'SCHEDULED',
      address: '456 Pine Road, Liverpool',
      customer: 'Emma Davis',
      assignedTo: 'Sarah Wilson',
      priority: 'MEDIUM',
      dueDate: '2025-09-20',
      progress: 25,
      description: 'New kitchen installation with modern appliances'
    }
  ]);
});

app.get('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    title: 'Bathroom Renovation - Smith',
    status: 'IN_PROGRESS',
    address: '123 Oak Street, Manchester',
    customer: 'John Smith',
    phone: '07123 456 789',
    email: 'john.smith@email.com',
    assignedTo: 'Mike Thompson',
    priority: 'HIGH',
    dueDate: '2025-09-15',
    progress: 65,
    description: 'Complete bathroom renovation including new suite and tiling',
    tasks: [
      { id: '1', title: 'Remove old fixtures', completed: true, dueDate: '2025-09-08' },
      { id: '2', title: 'Install new plumbing', completed: true, dueDate: '2025-09-10' },
      { id: '3', title: 'Tile walls and floor', completed: false, dueDate: '2025-09-12' },
      { id: '4', title: 'Install new fixtures', completed: false, dueDate: '2025-09-14' }
    ],
    photos: [
      { id: '1', url: '/api/placeholder/300/200', caption: 'Before renovation', date: '2025-09-05' },
      { id: '2', url: '/api/placeholder/300/200', caption: 'Demolition complete', date: '2025-09-08' },
      { id: '3', url: '/api/placeholder/300/200', caption: 'New plumbing installed', date: '2025-09-10' }
    ]
  });
});

// Leads endpoints
app.get('/api/leads', (req, res) => {
  res.json([
    {
      id: '1',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '07987 654 321',
      source: 'WEBSITE',
      status: 'NEW',
      serviceType: 'Bathroom Renovation',
      budget: '£10,000-£15,000',
      address: '789 Elm Avenue, Birmingham',
      notes: 'Interested in complete bathroom overhaul',
      createdAt: '2025-09-07T10:30:00Z'
    },
    {
      id: '2',
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '07456 789 123',
      source: 'REFERRAL',
      status: 'CONTACTED',
      serviceType: 'Kitchen Installation',
      budget: '£15,000-£20,000',
      address: '321 Maple Street, Leeds',
      notes: 'Referred by previous customer',
      createdAt: '2025-09-06T14:15:00Z'
    }
  ]);
});

// Customers endpoints
app.get('/api/customers', (req, res) => {
  res.json([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '07123 456 789',
      address: '123 Oak Street, Manchester, M1 1AA',
      status: 'ACTIVE',
      projectsCount: 2,
      totalValue: 25000,
      lastContact: '2025-09-07'
    },
    {
      id: '2',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '07987 123 456',
      address: '456 Pine Road, Liverpool, L2 2BB',
      status: 'ACTIVE',
      projectsCount: 1,
      totalValue: 12000,
      lastContact: '2025-09-06'
    }
  ]);
});

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    totalJobs: 24,
    activeJobs: 8,
    completedThisMonth: 12,
    revenue: 145000,
    revenueGrowth: 12.5,
    newLeads: 15,
    conversionRate: 68,
    customerSatisfaction: 4.8,
    upcomingAppointments: 6
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 CRM API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📱 Mobile app can now connect to real data!`);
});
