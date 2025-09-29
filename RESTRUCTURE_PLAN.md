# COMPLETE DATABASE RESTRUCTURE PLAN

## Target Structure

```
Enquiries → Leads → Projects → Completed Projects
          (all under Accounts)
```

## Database Models (Final State)

### 1. Account (renamed from Client)
- Main customer entity
- Has enquiries, leads, projects, completed projects
- Renamed from `clients` to `accounts`

### 2. Enquiry (NEW)
- Initial contact/interest
- Can convert to Lead
- Status: NEW, CONTACTED, QUALIFIED, CONVERTED, REJECTED, NURTURING

### 3. Lead (updated)
- Qualified prospects from Enquiries
- Can convert to Project
- References Account instead of Client

### 4. Project (renamed from Deal)
- Active sales opportunities from Leads
- Can convert to Completed Project
- Renamed from `deals` to `projects`

### 5. Completed Project (renamed from Job)
- Won projects being executed
- Actual installation/work management
- Renamed from `jobs` to `completed_projects`

## Frontend Navigation Structure

```
Dashboard
├── Accounts (was Clients)
├── Enquiries (NEW)
├── Leads (existing, updated)
├── Projects (was Deals)
├── Completed Projects (was Jobs)
├── Activities
├── Tasks
└── ...
```

## Implementation Strategy

### Phase 1: Add New Models
1. Add Enquiry model to schema
2. Add new enums (EnquiryStatus, CompletedProjectStatus)
3. Create Enquiry controller/service

### Phase 2: Rename Models
1. Client → Account (+ update all references)
2. Deal → Project (+ update all references)  
3. Job → CompletedProject (+ update all references)

### Phase 3: Update Frontend
1. Update navigation/sidebar
2. Update page titles and components
3. Update API client calls
4. Update all text/labels

### Phase 4: Database Migration
1. Create proper Prisma migrations
2. Migrate existing data
3. Update foreign key relationships

## Current Status
- Started schema changes (needs completion)
- Need to complete User model relationship updates
- Need to create new controllers
- Need to update all frontend references

This is a major breaking change that requires careful planning and testing.
