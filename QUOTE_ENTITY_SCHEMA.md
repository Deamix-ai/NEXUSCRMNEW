# Quote Entity Schema Addition

## Prisma Schema for Quote Entity

Add this to the schema.prisma file:

```prisma
model Quote {
  id               String      @id @default(cuid())
  leadId           String      
  lead             Lead        @relation(fields: [leadId], references: [id], onDelete: Cascade)
  accountId        String
  account          Account     @relation(fields: [accountId], references: [id], onDelete: Cascade)
  ownerId          String
  owner            User        @relation("QuoteOwner", fields: [ownerId], references: [id])
  
  title            String
  description      String?
  type             QuoteType   @default(INITIAL)
  status           QuoteStatus @default(DRAFT)
  version          Int         @default(1)
  
  // Pricing
  subtotal         Decimal     @db.Decimal(10, 2)
  vatRate          Float       @default(0.2)
  vatAmount        Decimal     @db.Decimal(10, 2)
  totalAmount      Decimal     @db.Decimal(10, 2)
  
  // Validity
  validUntil       DateTime
  validityDays     Int         @default(30)
  
  // Content
  lineItems        Json        // QuoteLineItem[]
  terms            String?
  notes            String?     // Internal notes
  customerNotes    String?     // Notes for customer
  
  // Conversion tracking
  acceptedAt       DateTime?
  rejectedAt       DateTime?
  sentAt           DateTime?
  viewedAt         DateTime?   // When customer first viewed
  
  // Relations
  projectId        String?     @unique
  project          Project?    @relation("AcceptedQuote", fields: [projectId], references: [id])
  
  activities       Activity[]
  documents        Document[]
  
  // Audit fields
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
  createdById      String?
  updatedById      String?

  @@index([leadId])
  @@index([accountId])
  @@index([ownerId])
  @@index([status])
  @@index([validUntil])
  @@map("quotes")
}

enum QuoteType {
  INITIAL
  REVISION
  ALTERNATIVE
  ADDITIONAL
}

enum QuoteStatus {
  DRAFT
  SENT
  UNDER_REVIEW
  ACCEPTED
  REJECTED
  EXPIRED
  SUPERSEDED
}
```

## Related Model Updates

### Update Lead Model
Add to Lead model:
```prisma
model Lead {
  // ... existing fields
  quotes           Quote[]
  acceptedQuoteId  String?     @unique
  acceptedQuote    Quote?      @relation("AcceptedQuote", fields: [acceptedQuoteId], references: [id])
}
```

### Update Project Model
Add to Project model:
```prisma
model Project {
  // ... existing fields
  acceptedQuoteId  String      @unique
  acceptedQuote    Quote       @relation("AcceptedQuote", fields: [acceptedQuoteId], references: [id])
}
```

### Update Account Model
Add to Account model:
```prisma
model Account {
  // ... existing fields
  quotes           Quote[]
}
```

### Update User Model
Add to User model:
```prisma
model User {
  // ... existing fields
  ownedQuotes      Quote[]     @relation("QuoteOwner")
}
```

## Quote Line Item Structure

```typescript
interface QuoteLineItem {
  id: string;
  description: string;
  category: 'LABOUR' | 'MATERIALS' | 'FIXTURES' | 'APPLIANCES' | 'OTHER';
  quantity: number;
  unit: string;           // 'each', 'm2', 'linear m', etc.
  unitPrice: number;      // Price per unit
  totalPrice: number;     // quantity * unitPrice
  notes?: string;
  supplierCode?: string;
  leadTime?: number;      // days
}
```

## API Endpoints for Quotes

### Quote CRUD Operations
- `GET /quotes` - List quotes with filtering
- `GET /quotes/:id` - Get specific quote
- `POST /quotes` - Create new quote
- `PATCH /quotes/:id` - Update quote
- `DELETE /quotes/:id` - Delete quote

### Quote Actions
- `POST /quotes/:id/send` - Send quote to customer
- `POST /quotes/:id/accept` - Accept quote (converts to project)
- `POST /quotes/:id/reject` - Reject quote
- `POST /quotes/:id/duplicate` - Create copy for revision
- `GET /quotes/:id/pdf` - Generate PDF version

### Lead-Related Quote Operations
- `GET /leads/:id/quotes` - Get all quotes for a lead
- `POST /leads/:id/quotes` - Create quote for lead

## Business Logic Rules

### Quote Creation Rules
1. Can only create quotes for Leads (not Enquiries)
2. Lead must be in appropriate status (QUALIFIED, PROPOSAL_STAGE)
3. Auto-assign version number (highest existing + 1)
4. Set default validity period (30 days)

### Quote Acceptance Rules
1. Only one quote per lead can be accepted
2. Accepting a quote:
   - Sets quote status to ACCEPTED
   - Sets acceptedAt timestamp
   - Converts Lead to Project
   - Links Project to accepted Quote
   - Sets all other quotes for that Lead to SUPERSEDED

### Quote Expiry Rules
1. Automatically mark quotes as EXPIRED after validUntil date
2. Expired quotes cannot be accepted
3. Can extend validity by creating new version

### Version Control Rules
1. Updating sent quote creates new version
2. Previous version marked as SUPERSEDED
3. Customer always sees latest version
4. Historical versions preserved for audit

This comprehensive Quote system handles the entire quotation lifecycle from creation through to conversion to sales orders.
