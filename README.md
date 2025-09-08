# CRM Nexus

**Status: Functional Development** 🟢  
Production-ready CRM system for bathroom industry professionals with React Native field app, public booking, installer compliance, project management, designer workflows, and client portal.

## 🚀 Current Status (September 2025)

### ✅ **Working Features**
- **Dashboard**: Fully functional with real-time statistics and data management
- **Data Layer**: React Context + localStorage with CRUD operations
- **UI System**: Professional responsive design across all pages
- **Navigation**: Working sidebar and page routing
- **TypeScript**: Strict typing throughout the project

### 🟡 **In Development**
- **Forms Integration**: Converting UI pages to use real data layer
- **API Backend**: NestJS server configuration (not connected yet)
- **Mobile Integration**: Connecting React Native app to data layer

### 🎯 **Quick Start**
```bash
# Start the working web application
cd apps/web
npm run dev
# Opens http://localhost:3000/dashboard
```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, TanStack Query
- **Backend**: NestJS, REST APIs with OpenAPI, BullMQ workers
- **Database**: PostgreSQL with Prisma ORM
- **Mobile**: React Native (Expo) with offline-first SQLite sync
- **Authentication**: Auth.js with field-level permissions
- **Infrastructure**: Docker, Nginx, Redis

### Key Features

- 📱 **Mobile Field App**: Offline-first with geofence check-in, compliance tracking
- 🎯 **Lead Management**: Pipeline with drag/drop stages, SLA timers
- 👥 **Client Portal**: Curated access with moodboards, design previews
- 🏗️ **Project Management**: Job tracking with Gantt-style timeline
- 🎨 **Designer Workflow**: Design versions, clash tickets, BTU calculator
- 📋 **Installer Compliance**: Auto-suspend expired docs, team declarations
- 🔐 **Security**: OWASP ASVS L2, UK GDPR/PECR compliant
- 📊 **Reporting**: Pipeline forecasting, compliance tracking

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Development Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd CRM-Nexus
   npm install
   ```

2. **Environment configuration**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database setup**:
   ```bash
   # Start PostgreSQL and Redis (or use Docker)
   docker-compose up postgres redis -d
   
   # Generate Prisma client and run migrations
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

4. **Start development servers**:
   ```bash
   # Terminal 1: API
   npm run dev --workspace=@crm/api
   
   # Terminal 2: Web
   npm run dev --workspace=@crm/web
   
   # Terminal 3: Mobile (optional)
   npm run dev --workspace=@crm/mobile
   ```

5. **Access the applications**:
   - Web App: http://localhost:3000
   - API Docs: http://localhost:3001/api/docs
   - Mobile: Expo Go app with QR code

### Production Deployment

1. **Docker deployment**:
   ```bash
   # Configure environment
   cp .env.example .env.production
   # Edit production environment variables
   
   # Build and start services
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

2. **Manual deployment**:
   ```bash
   # Build applications
   npm run build
   
   # Run database migrations
   npm run db:migrate
   
   # Start services
   npm run start --workspace=@crm/api
   npm run start --workspace=@crm/web
   ```

## 🗂️ Project Structure

```
CRM-Nexus/
├── apps/
│   ├── web/                    # Next.js web application
│   ├── api/                    # NestJS API server
│   └── mobile/                 # React Native Expo app
├── packages/
│   ├── shared/                 # Shared types and utilities
│   ├── ui/                     # Shared UI components
│   └── database/               # Prisma schema and migrations
├── nginx/                      # Nginx configuration
├── scripts/                    # Deployment and utility scripts
└── docs/                       # Documentation
```

## 🔐 Authentication & Authorization

### User Roles

- **Admin**: Full system access
- **Manager**: Team oversight, reporting
- **Sales**: Lead and deal management
- **Designer**: Design workflows, client interaction
- **Field**: Mobile app, job day logs
- **Installer Company Owner**: Team management
- **Read Only**: View-only access

### Field-Level Permissions

- Financial data restricted to Admin/Manager
- Client contact info hidden from installers
- Compliance data limited to authorized roles

## 📱 Mobile Application

### Features

- **Offline-First**: SQLite sync with queue management
- **Geofence Check-in**: GPS validation for job sites
- **Compliance Tracking**: Mandatory forms and team declarations
- **Photo Upload**: Progress photos with GPS EXIF data
- **Push Notifications**: Job updates and schedule changes

### Security

- Biometric unlock
- Remote wipe capability
- Data encryption at rest

## 🎨 Client Portal

### Features

- **Moodboards**: Client can pin comments on images
- **Design Previews**: Watermarked renders, gated by design fee
- **Progress Gallery**: Curated photos only
- **Guides**: Searchable care and help documentation
- **Handover Pack**: Completion certificates and warranties

### Access Control

- Long random key access (no login required)
- Gated content based on payment status
- Audit logging for all visibility changes

## 🔌 Integrations

### Core Integrations

- **Twilio**: Voice calling, SMS, recording
- **DocuSign**: Contract signing with webhooks
- **Xero**: Customer/invoice sync, installer billing
- **Outlook/M365**: Calendar sync, email threading
- **S3**: File storage with virus scanning

### Webhook Support

- Lead created/updated
- Deal stage changes
- Job status updates
- Payment received
- Document signed

## 📊 Performance & Monitoring

### Service Level Objectives (SLOs)

- Search response: <150ms (p95)
- Lead view: <800ms (p95)
- Dialer load: <1s (p95)
- API response: <200ms (p95)

### Monitoring

- OpenTelemetry instrumentation
- Health check endpoints
- Error tracking and alerting
- Performance metrics dashboard

## 🔒 Security

### Standards Compliance

- **OWASP ASVS Level 2** security verification
- **UK GDPR/PECR** privacy compliance
- **PCI DSS** considerations for payment data

### Security Features

- HTTPS/HSTS enforcement
- CSRF protection
- Rate limiting
- Admin IP allowlists
- bcrypt password hashing
- TOTP 2FA
- Session management
- Input validation/sanitization

### Privacy Features

- Consent tracking and management
- Right of access/erasure
- PII access logging
- Data retention policies
- DND hours enforcement (20:00-08:00)

## 📋 Compliance & GDPR

### Data Protection

- Explicit consent for marketing/recording
- Consent withdrawal mechanisms
- Data subject rights implementation
- Privacy impact assessments

### Audit Trail

- All data changes logged
- User action tracking
- Access logging for sensitive data
- 7-year audit retention

## 🚀 Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database backups configured
- [ ] Monitoring alerts set up
- [ ] Security headers enabled
- [ ] GDPR compliance verified
- [ ] Performance baselines established

### Backup & Recovery

- **Database**: Daily encrypted backups with PITR
- **Files**: S3 cross-region replication
- **Testing**: Monthly restore validation
- **Retention**: 90-day backup retention

### Infrastructure

- **Hosting**: Krystal VPS, Ubuntu 22.04
- **Reverse Proxy**: Nginx with Let's Encrypt
- **Load Balancing**: Nginx upstream
- **Caching**: Redis for sessions and queues

## 🧪 Testing

### Test Coverage

- **Unit Tests**: Vitest for models and utilities
- **API Tests**: Jest/Supertest for endpoints
- **E2E Tests**: Playwright for web workflows
- **Mobile Tests**: Detox for React Native

### Critical Test Scenarios

- Pipeline management and deal progression
- Client portal access and permissions
- Mobile offline sync and compliance
- Integration webhooks and data sync
- GDPR consent and data handling

## 📚 API Documentation

Comprehensive API documentation available at `/api/docs` with:

- OpenAPI 3.0 specification
- Interactive request testing
- Authentication examples
- Webhook payload schemas
- Rate limiting guidelines

## 🤝 Contributing

### Development Guidelines

- Strict TypeScript enforcement
- ESLint + Prettier configuration
- Conventional commit messages
- Pull request reviews required
- Automated testing in CI/CD

### Code Organization

- Feature-based module structure
- Shared utilities in packages
- Type-safe API contracts
- Reusable UI components

## 📞 Support

### Business Information

- **Company**: Bowman Bathrooms Ltd
- **Trading As**: Bowmans Kitchens & Bathrooms
- **VAT**: GB435232714
- **Company Reg**: 14004226
- **Domains**: bowmanskb.co.uk, bowmanbathrooms.co.uk

### Technical Support

- Documentation: `/docs`
- API Status: `/health`
- Performance: `/metrics`
- Logs: Application and audit trails

## 📄 License

Proprietary software - All rights reserved by Bowman Bathrooms Ltd.

---

*Built with ❤️ for the bathroom industry*
