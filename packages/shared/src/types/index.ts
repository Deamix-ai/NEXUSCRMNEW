// Shared TypeScript types

// User roles for role-based access control
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SALES = 'SALES',
  DESIGNER = 'DESIGNER',
  FIELD = 'FIELD',
  INSTALLER_COMPANY_OWNER = 'INSTALLER_COMPANY_OWNER',
  READ_ONLY = 'READ_ONLY',
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchParams {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Field permissions
export interface FieldPermissions {
  read: boolean;
  write: boolean;
  owner?: boolean;
}

export interface RolePermissions {
  [key: string]: FieldPermissions;
}

// Portal types
export interface PortalAccess {
  key: string;
  clientId: string;
  features: PortalFeature[];
  restrictions: PortalRestriction[];
}

export interface PortalFeature {
  name: string;
  enabled: boolean;
  gatedBy?: string; // e.g., 'designFeePaid'
}

export interface PortalRestriction {
  field: string;
  condition: string;
  value: any;
}

// Mobile sync types
export interface SyncQueueItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  status: 'queued' | 'uploading' | 'retrying' | 'synced' | 'error';
  attempts: number;
  lastAttempt?: Date;
  error?: string;
  createdAt: Date;
}

export interface GeofenceLocation {
  latitude: number;
  longitude: number;
  radius: number; // meters
  address?: string;
}

// Communication types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

// Workflow automation
export interface WorkflowTrigger {
  type: 'stage_change' | 'form_submitted' | 'field_updated' | 'date_reached';
  conditions: Record<string, any>;
}

export interface WorkflowAction {
  type: 'create_task' | 'send_email' | 'send_sms' | 'update_field' | 'notify_user';
  config: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
}

// Form builder types
export interface FormField {
  name: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'time' | 'datetime' | 'file' | 'signature';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: Record<string, any>;
  options?: Array<{ label: string; value: string }>;
  conditional?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains';
    value: any;
  };
}

export interface FormSchema {
  fields: FormField[];
  validation?: Record<string, any>;
}

// Timeline types
export interface TimelineEvent {
  id: string;
  type: 'call' | 'email' | 'sms' | 'meeting' | 'note' | 'task' | 'document' | 'payment' | 'status_change';
  title: string;
  description?: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  metadata?: Record<string, any>;
}

// Dashboard types
export interface DashboardMetric {
  label: string;
  value: number;
  previousValue?: number;
  format: 'number' | 'currency' | 'percentage';
  trend?: 'up' | 'down' | 'stable';
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
  }>;
}

// Integration types
export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  subAccounts?: Array<{
    name: string;
    sid: string;
    authToken: string;
    phoneNumber: string;
  }>;
}

export interface DocuSignConfig {
  integrationKey: string;
  userId: string;
  accountId: string;
  basePath: string;
  privateKey: string;
}

export interface XeroConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  scopes: string[];
}

// Calendar integration
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees: Array<{
    email: string;
    name?: string;
    status?: 'accepted' | 'declined' | 'tentative' | 'pending';
  }>;
  isAllDay?: boolean;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    until?: Date;
    count?: number;
  };
}

// PDF parsing types
export interface ParsedPDFResult {
  confidence: number;
  items: Array<{
    text: string;
    category?: string;
    brand?: string;
    model?: string;
    description?: string;
    quantity?: number;
    price?: number;
    page: number;
    lineNumber: number;
    confidence: number;
  }>;
  requiresReview: boolean;
  metadata: {
    pages: number;
    fileName: string;
    fileSize: number;
    processedAt: Date;
  };
}

// Audit trail
export interface AuditLogEntry {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  userId?: string;
  userName?: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}
