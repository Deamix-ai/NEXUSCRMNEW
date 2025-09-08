# Quick Start Guide for CRM-Nexus Development
**Date:** 8 September 2025

## TL;DR - What's Working Right Now

✅ **WORKING:** Dashboard with real data, functional "New Lead" button, localStorage persistence  
🟡 **PARTIAL:** Other pages have UI but need data integration  
❌ **BROKEN:** API server, monorepo dev command, mobile data integration

## Immediate Development Commands

### Start the Working Application
```bash
cd /Users/jonathonbarclay/Projects/CRM-Nexus/apps/web
npm run dev
```
- Opens on http://localhost:3000-3003
- Dashboard fully functional with real data
- Other pages accessible but use mock data

### Test Current Functionality
1. Navigate to http://localhost:3000-3003/dashboard
2. Click "New Lead" button → See stats update
3. Refresh page → Data persists via localStorage
4. Navigate to other pages → UI works, data is static

## Current State Summary

### What Actually Works
- **Dashboard page:** Full CRUD with localStorage
- **Layout system:** Working navigation between all pages
- **Data persistence:** localStorage integration working
- **TypeScript:** All compilation errors resolved
- **UI components:** Professional design system implemented

### What Needs Immediate Attention
1. **Leads page integration:** Replace mock data with useCRM hook
2. **Form functionality:** Add working forms for lead creation/editing
3. **Modal dialogs:** Implement proper add/edit modals
4. **CRUD operations:** Extend to all entity types

## Key Files to Understand

### Primary Files (Fully Functional)
```
apps/web/src/contexts/CRMContext.tsx     # ✅ Complete data management
apps/web/src/app/dashboard/page.tsx      # ✅ Working dashboard
apps/web/src/app/providers.tsx           # ✅ Provider setup
```

### Secondary Files (Need Integration)
```
apps/web/src/app/leads/page.tsx          # 🟡 UI complete, needs context
apps/web/src/app/clients/page.tsx        # 🟡 UI complete, needs context
apps/web/src/app/jobs/page.tsx           # 🟡 UI complete, needs context
```

### Layout Files (Working)
```
apps/web/src/components/layout/dashboard-layout.tsx  # ✅ Main wrapper
apps/web/src/components/layout/Sidebar.tsx           # ✅ Navigation
```

## Development Priorities (In Order)

### Priority 1: Complete Leads Page Integration
**Goal:** Make `/leads` page functional like dashboard

**Steps:**
1. Open `apps/web/src/app/leads/page.tsx`
2. Replace mock data imports with `useCRM` hook
3. Connect form submissions to `addLead` function
4. Test add/edit/delete operations

**Expected Impact:** Leads page becomes fully functional

### Priority 2: Add Working Forms
**Goal:** Proper form components with validation

**Steps:**
1. Create reusable form components
2. Add form validation with Zod schemas
3. Implement modal dialogs for data entry
4. Add loading states and error handling

**Expected Impact:** Professional data entry experience

### Priority 3: Extend to All Entity Types
**Goal:** Clients and Jobs pages functional

**Steps:**
1. Apply same pattern to clients page
2. Apply same pattern to jobs page
3. Add inter-entity relationships (Job → Client)
4. Implement calendar integration

**Expected Impact:** Complete CRM functionality

### Priority 4: API Integration
**Goal:** Replace localStorage with real backend

**Steps:**
1. Fix API server implementation
2. Create RESTful endpoints
3. Replace localStorage calls with API calls
4. Add authentication system

**Expected Impact:** Production-ready backend

## Common Development Patterns

### Adding New Functionality
```typescript
// 1. Use the CRM hook
const { leads, addLead, updateLead, deleteLead } = useCRM();

// 2. Create handler functions
const handleSubmit = (formData) => {
  addLead(formData);
  // UI automatically updates via context
};

// 3. Connect to UI
<button onClick={handleSubmit}>Add Lead</button>
```

### Debugging Data Issues
```typescript
// Check localStorage in browser console
localStorage.getItem('crm-leads')
localStorage.getItem('crm-clients')
localStorage.getItem('crm-jobs')

// Clear data if needed
localStorage.clear()
```

### TypeScript Patterns
```typescript
// All interfaces are defined in CRMContext.tsx
import { Lead, Client, Job } from '@/contexts/CRMContext';

// Use proper status enums
const newLead: Partial<Lead> = {
  status: 'NEW', // ✅ Correct
  // status: 'new', // ❌ Wrong
};
```

## Known Issues & Workarounds

### Issue: Monorepo Dev Command Fails
```bash
# ❌ This doesn't work
npm run dev

# ✅ Use this instead
cd apps/web && npm run dev
```

### Issue: React Native Type Errors
- These are warnings in shared packages
- Don't affect web app functionality
- Can be ignored during web development

### Issue: API Server Not Working
- Multiple server file attempts exist
- Focus on web app development first
- localStorage provides temporary persistence

## Project Context for AI Assistant

### Business Domain
- **Industry:** Bathroom installation and renovation
- **Primary Users:** Sales staff, project managers, installers
- **Core Entities:** Leads (prospects), Clients (customers), Jobs (projects)
- **Workflow:** Lead → Client → Job → Completion

### Technical Approach
- **Frontend-First Development:** Build working UI with localStorage
- **Incremental Improvement:** Add backend and advanced features later
- **TypeScript Everywhere:** Strict typing for reliability
- **Component Reusability:** Shared design system

### Current Architecture
- **Data Layer:** React Context + localStorage (working)
- **UI Layer:** Next.js + Tailwind CSS (working)
- **API Layer:** Planned but not implemented
- **Mobile Layer:** UI complete, not connected

## Quick Reference

### Key Commands
```bash
# Start development
cd apps/web && npm run dev

# Check current errors
npm run type-check

# Database operations (if needed)
cd packages/database && npx prisma generate
```

### Important URLs
- Dashboard (working): http://localhost:3000-3003/dashboard
- Leads (needs work): http://localhost:3000-3003/leads
- Documentation: See PROJECT_STATUS.md and TECHNICAL_ARCHITECTURE.md

### Data Models Quick Reference
```typescript
Lead: { id, name, email, phone, status, value, source, ... }
Client: { id, name, email, phone, address, status, totalValue, ... }
Job: { id, title, clientId, status, priority, value, dates, ... }
```

This quick start guide should provide everything needed to jump back into development efficiently.
