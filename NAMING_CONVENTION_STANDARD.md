# CRM-Nexus Naming Convention Standard

## Overview
This document establishes the authoritative naming conventions for CRM-Nexus to eliminate confusion and ensure consistency across database, API, and frontend layers.

## Architectural Principles

### Object-Oriented Entity Design

Our CRM follows object-oriented principles where entities are hierarchical containers with type classifications rather than separate entity types for every variation.

#### Core Design Philosophy:
1. **Entities are containers** - Each main entity (Account, Project, Task, etc.) contains the core data
2. **Types provide classification** - Use enums to categorize rather than creating separate entities
3. **Relationships are explicit** - Clear parent-child relationships through foreign keys
4. **Single responsibility** - Each entity has one clear purpose

#### Entity Hierarchy:
```
Account (Customer/Client Company)
├── Contacts (People within the Account)
├── Enquiries (Initial interest)
│   └── → Lead (Qualified enquiry)
│       ├── Quotes (Pricing proposals)
│       └── → Project (Accepted quote becomes sales order)
│           ├── Type: Kitchen, Bathroom, etc.
│           ├── Active Quote (now Sales Order)
│           ├── Tasks (categorized by TaskType)
│           ├── Appointments (categorized by AppointmentType) 
│           ├── Documents (categorized by DocumentType)
│           ├── Activities (categorized by ActivityType)
│           └── → CompletedProject (Finished work)
```

#### Quote Lifecycle & Business Rules:
1. **Quote Creation**: Only available once Enquiry converts to Lead
2. **Quote Scope**: Multiple quotes per Lead (revisions, alternatives, different rooms)
3. **Quote Status**: `DRAFT` → `SENT` → `ACCEPTED` | `REJECTED` | `EXPIRED`
4. **Quote Conversion**: When accepted, Quote becomes Sales Order and Lead converts to Project
5. **Sales Order**: Quote with `status: ACCEPTED` that belongs to a Project (immutable pricing record)

#### Quote vs Sales Order:
- **Quote**: Proposal pricing (`status: DRAFT | SENT | REJECTED | EXPIRED`)
- **Sales Order**: Accepted quote (`status: ACCEPTED`) that becomes the project contract
- **Same entity, different status** - no separate SalesOrder entity needed

#### Type-Based Classification Benefits:
- **Extensible**: Easy to add new appointment types, task types, etc.
- **Consistent**: All entities follow same pattern of base entity + type enum
- **Maintainable**: Single entity to maintain instead of multiple related entities
- **Queryable**: Simple to filter by type in queries

### Pipeline Flow Clarification

**Business Process:**
1. **Enquiry**: Customer expresses interest ("I'd like a new kitchen")
2. **Lead**: Enquiry is qualified and has sales potential
3. **Quote**: Lead generates pricing proposals (multiple quotes possible)
4. **Project**: Quote acceptance converts Lead to Project (Quote becomes Sales Order)
5. **CompletedProject**: Project is delivered and signed off

**Quote Process:**
- Lead can have multiple Quotes (revisions, alternatives, different scopes)
- Quote acceptance triggers Lead → Project conversion
- Accepted Quote becomes immutable Sales Order record
- Project references the accepted Quote as its pricing basis

**Project Scope:**
- Each Project represents ONE room/space
- Multi-room jobs = Multiple Projects under same Account
- Each Project has its own budget, timeline, and pipeline stage

---

## Entity Naming Standards

### Core Pipeline Entities
| Entity | Singular | Plural | Database Table | API Endpoint | Frontend Route |
|--------|----------|--------|----------------|--------------|----------------|
| Account | `Account` | `Accounts` | `accounts` | `/accounts` | `/accounts` |
| Contact | `Contact` | `Contacts` | `contacts` | `/contacts` | `/contacts` |
| Enquiry | `Enquiry` | `Enquiries` | `enquiries` | `/enquiries` | `/enquiries` |
| Lead | `Lead` | `Leads` | `leads` | `/leads` | `/leads` |
| Quote | `Quote` | `Quotes` | `quotes` | `/quotes` | `/quotes` |
| Project | `Project` | `Projects` | `projects` | `/projects` | `/projects` |
| CompletedProject | `CompletedProject` | `CompletedProjects` | `completed_projects` | `/completed-projects` | `/completed-projects` |
| User | `User` | `Users` | `users` | `/users` | `/users` |

**Note:** `Room` entity removed - `Project` now represents individual rooms/spaces with type classification.

### Supporting Entities with Type Classifications
| Entity | Singular | Plural | Database Table | API Endpoint | Frontend Route |
|--------|----------|--------|----------------|--------------|----------------|
| Activity | `Activity` | `Activities` | `activities` | `/activities` | `/activities` |
| Task | `Task` | `Tasks` | `tasks` | `/tasks` | `/tasks` |
| Appointment | `Appointment` | `Appointments` | `appointments` | `/appointments` | `/appointments` |
| Document | `Document` | `Documents` | `documents` | `/documents` | `/documents` |
| Snag | `Snag` | `Snags` | `snags` | `/snags` | `/snags` |

### Entity Type Classifications

#### Project Types (replaces RoomType)
```typescript
enum ProjectType {
  KITCHEN = 'KITCHEN',
  BATHROOM = 'BATHROOM', 
  CLOAKROOM = 'CLOAKROOM',
  ENSUITE = 'ENSUITE',
  WET_ROOM = 'WET_ROOM',
  OTHER = 'OTHER'
}
```

#### Appointment Types
```typescript
enum AppointmentType {
  DESIGN_CONSULTATION = 'DESIGN_CONSULTATION',
  SITE_SURVEY = 'SITE_SURVEY',
  DESIGN_PRESENTATION = 'DESIGN_PRESENTATION',
  CONTRACT_SIGNING = 'CONTRACT_SIGNING',
  INSTALL_START = 'INSTALL_START',
  PROGRESS_CHECK = 'PROGRESS_CHECK',
  HANDOVER = 'HANDOVER',
  AFTERCARE = 'AFTERCARE',
  FOLLOW_UP = 'FOLLOW_UP'
}
```

#### Task Types
```typescript
enum TaskType {
  FOLLOW_UP_CALL = 'FOLLOW_UP_CALL',
  DESIGN_WORK = 'DESIGN_WORK',
  QUOTE_PREPARATION = 'QUOTE_PREPARATION',
  SITE_SURVEY = 'SITE_SURVEY',
  CONTRACT_PREP = 'CONTRACT_PREP',
  ORDER_MATERIALS = 'ORDER_MATERIALS',
  SCHEDULE_INSTALL = 'SCHEDULE_INSTALL',
  QUALITY_CHECK = 'QUALITY_CHECK',
  INVOICE_PREPARATION = 'INVOICE_PREPARATION',
  CUSTOMER_FEEDBACK = 'CUSTOMER_FEEDBACK'
}
```

#### Activity Types
```typescript
enum ActivityType {
  NOTE = 'NOTE',
  PHONE_CALL = 'PHONE_CALL', 
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  MEETING = 'MEETING',
  SITE_VISIT = 'SITE_VISIT',
  VOICEMAIL = 'VOICEMAIL',
  DOCUMENT_UPLOAD = 'DOCUMENT_UPLOAD',
  FORM_SUBMISSION = 'FORM_SUBMISSION',
  SYSTEM_UPDATE = 'SYSTEM_UPDATE',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  CONTRACT_SIGNED = 'CONTRACT_SIGNED'
}
```

#### Quote Types
```typescript
enum QuoteStatus {
  DRAFT = 'DRAFT',           // Being prepared
  SENT = 'SENT',            // Sent to customer
  UNDER_REVIEW = 'UNDER_REVIEW', // Customer reviewing
  ACCEPTED = 'ACCEPTED',     // Becomes Sales Order
  REJECTED = 'REJECTED',     // Customer declined
  EXPIRED = 'EXPIRED',       // Time limit passed
  SUPERSEDED = 'SUPERSEDED'  // Replaced by newer version
}

enum QuoteType {
  INITIAL = 'INITIAL',       // First quote for the lead
  REVISION = 'REVISION',     // Updated pricing/scope
  ALTERNATIVE = 'ALTERNATIVE', // Different approach/products
  ADDITIONAL = 'ADDITIONAL'   // Extra work/rooms
}
```
enum DocumentType {
  DESIGN_DRAWING = 'DESIGN_DRAWING',
  TECHNICAL_DRAWING = 'TECHNICAL_DRAWING', 
  SITE_SURVEY = 'SITE_SURVEY',
  PRODUCT_SPECIFICATION = 'PRODUCT_SPECIFICATION',
  QUOTATION = 'QUOTATION',
  CONTRACT = 'CONTRACT',
  INVOICE = 'INVOICE',
  PHOTO_BEFORE = 'PHOTO_BEFORE',
  PHOTO_PROGRESS = 'PHOTO_PROGRESS',
  PHOTO_COMPLETION = 'PHOTO_COMPLETION',
  CERTIFICATE = 'CERTIFICATE',
  WARRANTY = 'WARRANTY',
  RENDER_3D = 'RENDER_3D',
  FLOOR_PLAN = 'FLOOR_PLAN',
  OTHER = 'OTHER'
}
```

---

## Field Naming Standards

### Primary Keys
- **Always use `id`** for primary keys
- **Type: `string` (cuid)**

### Foreign Keys
| Relationship | Field Name | Points To | Required |
|--------------|------------|-----------|----------|
| Account | `accountId` | `accounts.id` | Yes |
| User (Owner) | `ownerId` | `users.id` | Yes |
| User (Assignee) | `assigneeId` | `users.id` | No |
| Project | `projectId` | `projects.id` | No |
| Lead | `leadId` | `leads.id` | No |
| Quote | `quoteId` | `quotes.id` | No |
| Pipeline Stage | `stageId` | `pipeline_stages.id` | No |

**Note:** `roomId` removed as `Project` now encompasses room functionality.

### Common Fields
| Field | Type | Description | Standard Format |
|-------|------|-------------|-----------------|
| `createdAt` | `DateTime` | Creation timestamp | `@default(now())` |
| `updatedAt` | `DateTime` | Update timestamp | `@updatedAt` |
| `deletedAt` | `DateTime?` | Soft delete timestamp | Optional |
| `status` | `Enum` | Entity status | EntityStatus enum |
| `priority` | `Priority` | Priority level | `LOW\|MEDIUM\|HIGH\|URGENT` |

---

## API Naming Standards

### Endpoints
- **Use plural nouns**: `/accounts`, `/leads`, `/projects`
- **Use kebab-case for compound words**: `/completed-projects`
- **RESTful operations**:
  - `GET /leads` - List all leads
  - `GET /leads/:id` - Get specific lead
  - `POST /leads` - Create new lead
  - `PATCH /leads/:id` - Update lead
  - `DELETE /leads/:id` - Delete lead

### Conversion Endpoints
| From | To | Endpoint | Method |
|------|----|---------| -------|
| Enquiry | Lead | `/enquiries/:id/convert-to-lead` | `POST` |
| Lead | Quote | `/leads/:id/create-quote` | `POST` |
| Quote | Project | `/quotes/:id/accept` | `POST` |
| Project | CompletedProject | `/projects/:id/complete` | `POST` |

**Business Rules:**
- Quote acceptance automatically converts parent Lead to Project
- Accepted Quote becomes immutable Sales Order
- Only one Quote per Lead can be accepted

### DTO Naming
| Operation | DTO Name | Example |
|-----------|----------|---------|
| Create | `Create{Entity}Dto` | `CreateLeadDto` |
| Update | `Update{Entity}Dto` | `UpdateLeadDto` |
| Convert | `Convert{Entity}To{Target}Dto` | `ConvertLeadToProjectDto` |

---

## Frontend Naming Standards

### Routes
- **Use plural nouns**: `/accounts`, `/enquiries`, `/leads`
- **Match API endpoints exactly**
- **Use kebab-case**: `/completed-projects`

### Components
| Type | Naming Pattern | Example |
|------|----------------|---------|
| Page Components | `{Entity}Page` | `LeadsPage` |
| List Components | `{Entity}List` | `LeadsList` |
| Form Components | `{Entity}Form` | `LeadForm` |
| Modal Components | `{Action}{Entity}Modal` | `AddLeadModal` |
| Detail Components | `{Entity}Details` | `LeadDetails` |

### API Client Methods
| Operation | Method Name | Example |
|-----------|-------------|---------|
| List | `get{Entities}` | `getLeads()` |
| Get | `get{Entity}` | `getLead(id)` |
| Create | `create{Entity}` | `createLead(data)` |
| Update | `update{Entity}` | `updateLead(id, data)` |
| Delete | `delete{Entity}` | `deleteLead(id)` |
| Convert | `convert{Entity}To{Target}` | `convertLeadToProject(id, data)` |

---

## Database Standards

### Table Names
- **Use snake_case**: `completed_projects`, `pipeline_stages`
- **Use plural nouns**: `accounts`, `leads`, `projects`

### Column Names
- **Use camelCase in Prisma schema**: `accountId`, `createdAt`
- **Postgres will convert to snake_case**: `account_id`, `created_at`

### Indexes
- **Always index foreign keys**
- **Index commonly queried fields**: `status`, `ownerId`
- **Composite indexes for complex queries**

---

## Validation Standards

### Required Fields
| Entity | Required Fields |
|--------|-----------------|
| Account | `name`, `ownerId` |
| Enquiry | `title`, `ownerId` |
| Lead | `title`, `accountId`, `ownerId` |
| Quote | `title`, `leadId`, `accountId`, `ownerId`, `totalAmount`, `validUntil` |
| Project | `title`, `type`, `accountId`, `ownerId`, `stageId`, `acceptedQuoteId` |
| Task | `title`, `type`, `assigneeId` |
| Appointment | `title`, `type`, `startTime`, `endTime`, `accountId` |
| Document | `filename`, `type`, `fileUrl`, `accountId` |

### Optional Fields with Auto-Assignment
- **Make `ownerId` optional in DTOs** with automatic assignment to current user
- **Make `accountId` auto-resolved** from parent Lead/Project where applicable
- **Quote versioning** handled automatically with `version` field

---

## Implementation Guidelines

### Phase 1: Database Alignment
1. ✅ **Database schema is already correct**
2. Verify all foreign key constraints

### Phase 2: API Alignment
1. **Update all DTOs** to use correct field names
2. **Fix conversion endpoints** to match database entities
3. **Update service methods** to use consistent naming
4. **Update controller endpoints** to use standard naming

### Phase 3: Frontend Alignment
1. **Update API client methods** to match new endpoints
2. **Fix component prop names** to match API responses
3. **Update route names** to match API endpoints
4. **Standardize component naming**

### Phase 4: Testing & Validation
1. **Update all tests** to use new naming
2. **Verify end-to-end workflows**
3. **Update documentation**

---

## Deprecated Terms

### ❌ DO NOT USE
- `Client` → Use `Account`
- `Deal` → Use `Project`  
- `Job` → Use `CompletedProject`
- `clientId` → Use `accountId`
- `convertToDeal` → Use `convertToProject`

### ✅ CORRECT TERMS
- `Account` (not Client)
- `Project` (not Deal)
- `CompletedProject` (not Job)
- `accountId` (not clientId)
- `convertToProject` (not convertToDeal)

---

## Additional Clarifications Needed

### 1. Multi-Room Projects
**Question**: How should we handle when a customer wants both a kitchen AND bathroom?

**Proposed Solution**: 
- Create **separate Projects** for each room under the same Account
- Each Project has its own pipeline stage, budget, timeline
- Link Projects using a `projectGroupId` if they need to be managed together
- Benefits: Individual room tracking, separate quotes, different timelines

### 2. Project Lifecycle States
**Question**: Should CompletedProject be a separate entity or just a status?

**Current Approach**: Separate entity for historical archiving
**Alternative**: Use `ProjectStatus` enum with `COMPLETED` state

**Recommendation**: Keep separate CompletedProject entity for:
- Historical data preservation
- Performance (completed projects don't clutter active queries)
- Different data requirements (completion certificates, final photos, etc.)

### 3. Contact vs User Distinction
**Clarification Needed**:
- **User**: CRM system users (employees, staff)
- **Contact**: Customer contacts (decision makers, occupants)
- **Account**: The business entity/household

### 4. Document Organization
**Question**: How should documents be organized?

**Proposed Structure**:
```
Account Documents (contracts, legal)
└── Project Documents
    ├── Design Phase (drawings, specifications)
    ├── Quote Phase (quotations, revisions)
    ├── Installation Phase (progress photos, certificates)
    └── Completion Phase (final photos, warranties)
```

### 5. Pipeline Stage Flexibility
**Question**: Should different Project types have different pipeline stages?

**Recommendation**: 
- **Universal stages** that apply to all project types
- **Stage-specific tasks** that vary by project type
- Example: "Design" stage has different tasks for Kitchen vs Bathroom

### 6. Activity vs Task Distinction
**Clarification**:
- **Activity**: Record of what happened (call made, email sent, meeting held)
- **Task**: Action item that needs to be done (make call, send email, schedule meeting)
- **Relationship**: Completing a Task can generate an Activity record

### 7. Enquiry Source Tracking
**Question**: How detailed should source tracking be?

**Proposed Fields**:
```typescript
interface EnquirySource {
  source: string;        // 'website', 'referral', 'advertising'
  medium: string;        // 'organic', 'paid', 'word-of-mouth'
  campaign: string;      // specific campaign name
  referrer?: string;     // who referred them
  landingPage?: string;  // first page visited
}
```

### 8. Appointment Scheduling
**Question**: How should recurring appointments work?

**Proposed Solution**:
- Single Appointment entity
- Add `recurringPattern` JSON field for repeat schedules
- Generate individual appointment instances
- Link via `parentAppointmentId` for series management

### 9. Quote/Estimate Handling
**✅ RESOLVED**: Quote entity added to model

**Quote Business Rules**:
- **Quote Creation**: Only after Enquiry → Lead conversion
- **Multiple Quotes**: Lead can have multiple quotes (revisions, alternatives)
- **Quote Acceptance**: Converts Lead to Project, Quote becomes Sales Order
- **Sales Order**: Accepted quote (immutable pricing record for project)
- **Versioning**: Automatic version numbering for quote revisions

**Quote Entity Structure**:
```typescript
interface Quote {
  id: string;
  leadId: string;          // Parent lead
  accountId: string;       // For reporting/filtering
  ownerId: string;         // Sales person
  title: string;           // "Kitchen Renovation Quote"
  description?: string;
  type: QuoteType;         // INITIAL, REVISION, ALTERNATIVE
  status: QuoteStatus;     // DRAFT, SENT, ACCEPTED, etc.
  version: number;         // Auto-incremented
  totalAmount: number;     // Total quote value
  validUntil: Date;        // Expiry date
  lineItems: QuoteLineItem[]; // Detailed pricing
  terms?: string;          // Terms and conditions
  notes?: string;          // Internal notes
  
  // Conversion tracking
  acceptedAt?: Date;       // When became sales order
  projectId?: string;      // Created project (if accepted)
  
  // Audit fields
  createdAt: Date;
  updatedAt: Date;
}
```

### 10. Snag/Issue Tracking
**Question**: Should Snags be separate from Tasks?

**Current**: Separate Snag entity
**Rationale**: Snags are issues found, Tasks are work to be done
**Relationship**: Snag can generate Tasks for resolution

---

## Enforcement & Implementation

### Code Review Checklist
- [ ] All new code uses standard naming conventions
- [ ] No deprecated terms introduced
- [ ] Foreign keys follow naming standards
- [ ] API endpoints follow RESTful patterns
- [ ] Component names follow standards
- [ ] Type enums used instead of separate entities where appropriate

### Automated Checks
- ESLint rules for naming conventions
- Database migration validation
- TypeScript strict type checking
- API endpoint validation tests
- Enum usage validation

### Database Migration Strategy for Room Removal

#### Step 1: Data Migration
```sql
-- Migrate Room data into Projects
INSERT INTO projects (
  id, accountId, type, title, stageId, ownerId, 
  budgetLow, budgetHigh, siteAddress, status,
  createdAt, updatedAt
)
SELECT 
  r.id, r.accountId, r.type, r.nickname as title, 
  r.pipelineStageId, '${defaultOwnerId}', 
  r.budgetLow, r.budgetHigh, r.siteAddress,
  CASE r.status 
    WHEN 'ACTIVE' THEN 'IN_PROGRESS'
    WHEN 'WON' THEN 'COMPLETED' 
    WHEN 'LOST' THEN 'CANCELLED'
    ELSE 'IN_PROGRESS'
  END,
  r.createdAt, r.updatedAt
FROM rooms r
WHERE NOT EXISTS (SELECT 1 FROM projects p WHERE p.roomId = r.id);
```

#### Step 2: Update Foreign Keys
```sql
-- Update all roomId references to projectId
UPDATE tasks SET projectId = roomId WHERE roomId IS NOT NULL;
UPDATE appointments SET projectId = roomId WHERE roomId IS NOT NULL;
UPDATE documents SET projectId = roomId WHERE roomId IS NOT NULL;
-- etc for all related tables
```

#### Step 3: Drop Room Tables
```sql
DROP TABLE rooms CASCADE;
```

---

## Final Decisions Summary

### ✅ Confirmed Architectural Decisions

1. **✅ Remove Room Entity**: Project now represents individual rooms/spaces
2. **✅ Quote Entity Added**: Essential for sales process with proper lifecycle
3. **✅ Type-Based Classification**: Use enums for variations (TaskType, AppointmentType, etc.)
4. **✅ Object-Oriented Hierarchy**: Clear parent-child relationships
5. **✅ Quote → Sales Order Flow**: Accepted quotes become immutable sales orders

### ✅ Entity Relationships Finalized
```
Account
├── Contacts (people within account)
├── Enquiries → Leads → Projects (main pipeline)
│   └── Quotes (pricing proposals under Leads)
│       └── → Sales Orders (accepted quotes under Projects)
└── Supporting entities (Tasks, Appointments, Documents, Activities)
    └── All classified with type enums
```

### ✅ Business Process Flow
1. **Enquiry**: Initial customer interest
2. **Lead**: Qualified enquiry with sales potential  
3. **Quote**: Pricing proposal(s) for the lead
4. **Project**: Accepted quote becomes project with sales order
5. **CompletedProject**: Delivered and signed off work

### ✅ Multi-Room Handling
- **Multiple Projects per Account** for different rooms
- Each Project = One room/space with specific type
- Quote can cover multiple Projects if needed
- Separate pipeline tracking per Project

### ✅ Quote Lifecycle
- **Creation**: Only after Enquiry → Lead conversion
- **Versioning**: Automatic versioning for revisions
- **Status Tracking**: DRAFT → SENT → ACCEPTED/REJECTED/EXPIRED
- **Conversion**: Accepted Quote → Project + Sales Order

## Implementation Priority

### Phase 1: Critical Naming Fixes (Immediate)
1. Fix API `convertToDeal` → `convertToProject`
2. Standardize `clientId` → `accountId` everywhere
3. Update all DTOs and service methods

### Phase 2: Quote Entity Implementation
1. Add Quote entity to Prisma schema
2. Create Quote API endpoints and services
3. Build Quote management UI components
4. Implement quote → project conversion logic

### Phase 3: Room Entity Removal
1. Migrate existing Room data to Projects
2. Update all Room foreign key references
3. Remove Room entity and related code
4. Update frontend routes and components

### Phase 4: Type System Enhancement
1. Implement comprehensive type enums
2. Update existing data to use new types
3. Add type-based filtering and reporting
4. Enhance UI with type-specific features

## Success Criteria
- [ ] No more API/frontend naming mismatches
- [ ] Complete quote-to-project workflow functional
- [ ] Simplified entity model without Room duplication
- [ ] Consistent type-based classification system
- [ ] Clear audit trail from enquiry to completion

---

## Migration Strategy

This document serves as the blueprint for the comprehensive naming standardization that will be implemented across the entire codebase to eliminate confusion and ensure consistent terminology.
