# Naming Convention Fix Implementation Plan

## Current Issues Identified

### 1. **API vs Database Mismatch**
- ❌ API: `convertToDeal` → ✅ Should be: `convertToProject`
- ❌ API: `ConvertLeadToDealDto` → ✅ Should be: `ConvertLeadToProjectDto`
- ❌ Mixed: `clientId` vs `accountId`

### 2. **Frontend vs API Mismatch**
- ❌ Frontend: `convertToProject` → ❌ API: `convertToDeal`
- ❌ Some components use `clientId`, others use `accountId`

### 3. **Database Inconsistencies**
- ❌ Some models still reference `Client` instead of `Account`
- ❌ Some foreign keys use `clientId` instead of `accountId`

## Implementation Steps

### Phase 1: Fix API Layer (Priority 1 - Critical)

#### Step 1.1: Update Lead DTOs
```bash
apps/api/src/modules/leads/dto/lead.dto.ts
```
- Rename: `ConvertLeadToDealDto` → `ConvertLeadToProjectDto`
- Update all references to use `accountId` instead of `clientId`

#### Step 1.2: Update Lead Service
```bash
apps/api/src/modules/leads/leads.service.ts
```
- Rename: `convertToDeal` → `convertToProject`
- Update method to create Project entity instead of Deal
- Fix all field mappings to use correct names

#### Step 1.3: Update Lead Controller
```bash
apps/api/src/modules/leads/leads.controller.ts
```
- Rename: `convertToDeal` → `convertToProject`
- Update endpoint documentation
- Update import statements

### Phase 2: Fix Database Schema Issues

#### Step 2.1: Fix Remaining Client References
```bash
packages/database/schema.prisma
```
- Find and replace any remaining `Client` references with `Account`
- Ensure all foreign keys use `accountId`

#### Step 2.2: Generate New Migration
```bash
npx prisma db push
```

### Phase 3: Fix Frontend Layer

#### Step 3.1: Update API Client
```bash
apps/web/src/lib/api-client.ts
```
- Ensure all methods use consistent naming
- Fix any remaining `clientId` references
- Update conversion method names

#### Step 3.2: Update Components
```bash
apps/web/src/app/enquiries/page.tsx
apps/web/src/app/leads/page.tsx
```
- Ensure all props use `accountId`
- Fix any component naming inconsistencies

### Phase 4: Update Supporting Files

#### Step 4.1: Shared Types
```bash
packages/shared/src/types/index.ts
```
- Add standardized type definitions
- Export consistent interfaces

#### Step 4.2: Test Files
- Update all test files to use new naming conventions
- Verify test coverage for new method names

## Files to Modify

### Critical Files (Immediate Fix Needed)
1. `apps/api/src/modules/leads/dto/lead.dto.ts`
2. `apps/api/src/modules/leads/leads.service.ts`
3. `apps/api/src/modules/leads/leads.controller.ts`
4. `packages/database/schema.prisma`
5. `apps/web/src/lib/api-client.ts`

### Secondary Files (Follow-up)
1. `apps/web/src/app/enquiries/page.tsx`
2. `apps/web/src/app/leads/page.tsx`
3. `packages/shared/src/types/index.ts`
4. All test files

## Validation Checklist

### API Validation
- [ ] `/leads/:id/convert` endpoint creates Project (not Deal)
- [ ] All DTOs use `accountId` (not `clientId`)
- [ ] Method names match database entities
- [ ] Swagger documentation updated

### Frontend Validation
- [ ] `convertToProject` method exists and works
- [ ] All forms submit with correct field names
- [ ] Components receive correct prop names
- [ ] No more `clientId` references

### Database Validation
- [ ] No `Client` model references remain
- [ ] All foreign keys use standard naming
- [ ] Relationships are correctly defined
- [ ] Indexes are properly named

## Testing Strategy

### Unit Tests
- Test all renamed methods
- Verify DTO validation
- Test database operations

### Integration Tests
- Test complete enquiry → lead → project flow
- Verify API endpoint responses
- Test frontend form submissions

### End-to-End Tests
- Complete user workflow testing
- Cross-system data consistency
- Error handling validation

## Rollback Plan

### If Issues Arise
1. Keep backup of current working code
2. Implement changes incrementally
3. Test each layer separately
4. Have rollback scripts ready

### Git Strategy
```bash
# Create feature branch
git checkout -b fix/naming-conventions

# Make changes incrementally
git commit -m "fix: update lead DTOs naming"
git commit -m "fix: update lead service methods"
git commit -m "fix: update lead controller endpoints"

# Merge when all tests pass
git checkout main
git merge fix/naming-conventions
```

## Success Criteria

### Immediate Goals
- [ ] No more API method mismatches
- [ ] All conversion endpoints work correctly
- [ ] Frontend can create/convert entities successfully

### Long-term Goals
- [ ] Consistent naming across entire codebase
- [ ] Developer onboarding clarity
- [ ] Reduced debugging time
- [ ] Maintainable architecture

This plan will systematically eliminate all naming inconsistencies and establish the foundation for consistent development going forward.
