# CRM Database Migration Plan

## Current State → Target State

### 1. ACCOUNTS (rename from Clients)
**Current:** `clients` table
**Target:** `accounts` table
- Rename model Client → Account
- Update all relationships and references
- Update table mapping from "clients" → "accounts"

### 2. ENQUIRIES (new table)
**Current:** No enquiries table
**Target:** `enquiries` table
- Initial contact/interest stage
- Basic contact info and enquiry details
- Links to Account when created
- Can convert to Lead

### 3. LEADS (update existing)
**Current:** `leads` table ✅
**Target:** `leads` table (keep mostly same)
- Update relationship from clientId → accountId
- Update foreign key references

### 4. PROJECTS (rename from Deals)
**Current:** `deals` table  
**Target:** `projects` table
- Rename model Deal → Project
- Update all relationships and references
- Update table mapping from "deals" → "projects"

### 5. COMPLETED PROJECTS (rename from Jobs)
**Current:** `jobs` table
**Target:** `completed_projects` table
- Rename model Job → CompletedProject
- Update all relationships and references
- Update table mapping from "jobs" → "completed_projects"

## Flow:
Enquiries → Leads → Projects → Completed Projects
(all under Accounts)

## Implementation Order:
1. Create Enquiries model
2. Rename Client → Account 
3. Rename Deal → Project
4. Rename Job → CompletedProject
5. Update all relationships
6. Create migration files
7. Update backend controllers
8. Update frontend components
