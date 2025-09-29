# CRM-Nexus Naming Conventions

## Sales Pipeline Terminology

The CRM follows a clear sales pipeline progression with specific terminology:

### Frontend User Interface
1. **Enquiries** - Initial customer inquiries (NEW status)
2. **Leads** - Qualified prospects (CONTACTED, QUALIFIED, etc.)
3. **Projects** - Active deals/contracts 
4. **Completed** - Finished jobs
5. **Invoices** - Financial records

### Database Schema Mapping
The database schema uses different naming that maps to our frontend terminology:

#### Lead Model (`leads` table)
- **Enquiries**: Leads with `status = "NEW"`
- **Leads**: Leads with `status != "NEW"` (CONTACTED, QUALIFIED, PROPOSAL_SENT, etc.)

#### Deal Model (`deals` table) 
- **Projects**: Active deals that have been signed/agreed
- Maps to "Projects" tab in the frontend
- Contains value, probability, expected close date
- Can be converted to Jobs for actual work execution

#### Job Model (`jobs` table)
- **Active Work**: The actual installation/renovation work
- **Completed**: Finished installations (status = COMPLETED)
- Contains detailed project execution data (dates, payments, etc.)

### API Naming Standards

#### Endpoints
- `/api/leads` - Handles both enquiries and leads
- `/api/deals` - **SHOULD BE** `/api/projects` (needs renaming)
- `/api/jobs` - Handles job execution

#### Controller Names
- `LeadsController` - ✅ Correct
- `DealsController` - ❌ Should be `ProjectsController`
- `JobsController` - ✅ Correct

#### Service Names  
- `LeadsService` - ✅ Correct
- `DealsService` - ❌ Should be `ProjectsService`
- `JobsService` - ✅ Correct

### Frontend Component Names
- `EnquiriesPage` - ✅ Correct
- `LeadsPage` - ✅ Correct  
- `ProjectsPage` - ✅ Correct (but currently fetching from deals API)
- `CompletedPage` - ✅ Correct (shows completed jobs)

### Data Flow
```
Customer Inquiry → Enquiry (Lead with NEW status)
     ↓
Qualify → Lead (Lead with QUALIFIED status)  
     ↓
Convert → Project (Deal with signed agreement)
     ↓  
Execute → Job (Actual work with installers)
     ↓
Complete → Completed Job (Finished work)
     ↓
Invoice → Invoice (Financial record)
```

## Action Items to Fix Naming

### 1. Rename Database Elements
- Consider renaming `Deal` model to `Project` in future migration
- Or maintain Deal model but ensure consistent terminology in code

### 2. Rename API Controllers
- `DealsController` → `ProjectsController`
- `DealsService` → `ProjectsService`
- `/api/deals` → `/api/projects`

### 3. Update Frontend API Calls
- Change all "deals" references to "projects" 
- Update API client methods
- Fix data mapping in components

### 4. Consistent Variable Names
- `deals` → `projects`
- `dealId` → `projectId`
- `deal` → `project`

This document should be referenced whenever adding new features or making changes to ensure consistent terminology throughout the system.
