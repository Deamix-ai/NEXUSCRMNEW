// Application constants
export const APP_NAME = 'CRM Nexus';
export const COMPANY_NAME = 'Bowman Bathrooms Ltd';
export const COMPANY_TRADING_NAME = 'Bowmans Kitchens & Bathrooms';
export const COMPANY_VAT = 'GB435232714';
export const COMPANY_REGISTRATION = '14004226';
export const COMPANY_DOMAINS = ['bowmanskb.co.uk', 'bowmanbathrooms.co.uk'];

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

// Business Rules
export const BUSINESS_HOURS = {
  start: 8, // 8 AM
  end: 20,  // 8 PM
  daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
};

export const DND_HOURS = {
  start: 20, // 8 PM
  end: 8,    // 8 AM
};

// SLA Timers (in minutes)
export const SLA_TIMERS = {
  FIRST_RESPONSE: 60,        // 1 hour
  LEAD_FOLLOWUP: 1440,       // 24 hours
  QUOTE_RESPONSE: 4320,      // 3 days
  SURVEY_BOOKING: 2880,      // 2 days
  DESIGN_COMPLETION: 10080,  // 7 days
  SNAG_RESOLUTION: 2880,     // 2 days
};

// Geographic
export const DEFAULT_COUNTRY = 'GB';
export const DEFAULT_TIMEZONE = 'Europe/London';
export const DEFAULT_CURRENCY = 'GBP';
export const DEFAULT_LOCALE = 'en-GB';

// Portal Configuration
export const PORTAL_KEY_LENGTH = 20;
export const PORTAL_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Mobile App
export const GEOFENCE_RADIUS = 100; // meters
export const OFFLINE_SYNC_TIMEOUT = 5 * 60 * 1000; // 5 minutes
export const COMPLIANCE_CHECK_TIMEOUT = 10 * 60 * 1000; // 10 minutes

// Integration Settings
export const TWILIO_WEBHOOK_TIMEOUT = 30000; // 30 seconds
export const DOCUSIGN_WEBHOOK_TIMEOUT = 30000; // 30 seconds
export const XERO_SYNC_INTERVAL = 60 * 60 * 1000; // 1 hour
export const OUTLOOK_SYNC_INTERVAL = 15 * 60 * 1000; // 15 minutes

// Security
export const PASSWORD_MIN_LENGTH = 8;
export const BCRYPT_ROUNDS = 12;
export const JWT_EXPIRY = '7d';
export const JWT_REFRESH_EXPIRY = '30d';
export const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 100;

// Two-Factor Authentication
export const TOTP_WINDOW = 1;
export const TOTP_DIGITS = 6;
export const TOTP_PERIOD = 30;

// Email Settings
export const EMAIL_FROM = 'noreply@bowmanskb.co.uk';
export const EMAIL_REPLY_TO = 'info@bowmanskb.co.uk';
export const EMAIL_BATCH_SIZE = 100;

// SMS Settings
export const SMS_BATCH_SIZE = 50;

// Backup & Retention
export const BACKUP_RETENTION_DAYS = 90;
export const AUDIT_LOG_RETENTION_DAYS = 2555; // 7 years
export const CALL_RECORDING_RETENTION_DAYS = 90;
export const DOCUMENT_RETENTION_YEARS = 5;

// Performance Targets (SLOs)
export const PERFORMANCE_TARGETS = {
  SEARCH_RESPONSE_TIME: 150,    // ms (p95)
  LEAD_VIEW_TIME: 800,          // ms (p95)
  DIALER_LOAD_TIME: 1000,       // ms (p95)
  API_RESPONSE_TIME: 200,       // ms (p95)
  DATABASE_QUERY_TIME: 100,     // ms (p95)
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_VOICE_CALLING: true,
  ENABLE_SMS: true,
  ENABLE_DOCUSIGN: true,
  ENABLE_XERO_INTEGRATION: true,
  ENABLE_OUTLOOK_SYNC: true,
  ENABLE_PORTAL_COMMENTS: true,
  ENABLE_DESIGN_WATERMARKS: true,
  ENABLE_OFFLINE_MODE: true,
  ENABLE_BIOMETRIC_UNLOCK: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
};

// Pipeline Stages (Default)
export const DEFAULT_PIPELINE_STAGES = [
  { name: 'New Lead', probability: 10, order: 1 },
  { name: 'Qualified', probability: 25, order: 2 },
  { name: 'Survey Booked', probability: 40, order: 3 },
  { name: 'Quote Sent', probability: 60, order: 4 },
  { name: 'Negotiating', probability: 75, order: 5 },
  { name: 'Won', probability: 100, order: 6, isClosedWon: true },
  { name: 'Lost', probability: 0, order: 7, isClosedLost: true },
];

// Form Categories
export const FORM_CATEGORIES = {
  SURVEY: 'Site Survey Forms',
  DAILY_LOG: 'Daily Work Logs',
  START_WORK: 'Start Work Forms',
  END_WORK: 'End Work Forms',
  DESIGN_BRIEF: 'Design Brief Forms',
  CLIENT_FEEDBACK: 'Client Feedback Forms',
  COMPLIANCE_CHECK: 'Compliance Check Forms',
};

// Document Categories
export const DOCUMENT_CATEGORIES = {
  CONTRACT: 'Contracts & Agreements',
  INVOICE: 'Invoices & Billing',
  QUOTE: 'Quotes & Estimates',
  DESIGN: 'Design Files',
  PHOTO: 'Photos & Images',
  SPECIFICATION: 'Specifications',
  COMPLIANCE: 'Compliance Documents',
  HANDOVER: 'Handover Documentation',
  OTHER: 'Other Documents',
};

// Room Types
export const ROOM_TYPES = {
  BATHROOM: 'Bathroom',
  EN_SUITE: 'En-Suite',
  WC: 'WC/Cloakroom',
  WETROOM: 'Wet Room',
  SHOWER_ROOM: 'Shower Room',
  UTILITY: 'Utility Room',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'Administrator',
  MANAGER: 'Manager',
  SALES: 'Sales Representative',
  DESIGNER: 'Designer',
  FIELD: 'Field Worker',
  INSTALLER_COMPANY_OWNER: 'Installer Company Owner',
  READ_ONLY: 'Read Only',
};

// Status Colors
export const STATUS_COLORS = {
  NEW: '#3B82F6',           // Blue
  CONTACTED: '#F59E0B',     // Yellow
  QUALIFIED: '#10B981',     // Green
  PROPOSAL_SENT: '#8B5CF6', // Purple
  NEGOTIATING: '#F97316',   // Orange
  WON: '#10B981',          // Green
  LOST: '#EF4444',         // Red
  NURTURING: '#6B7280',    // Gray
  
  QUOTED: '#3B82F6',       // Blue
  SURVEY_BOOKED: '#F59E0B', // Yellow
  SURVEYED: '#F59E0B',     // Yellow
  DESIGNING: '#8B5CF6',    // Purple
  DESIGN_APPROVED: '#10B981', // Green
  MATERIALS_ORDERED: '#F97316', // Orange
  SCHEDULED: '#3B82F6',    // Blue
  IN_PROGRESS: '#F59E0B',  // Yellow
  SNAGGING: '#F97316',     // Orange
  COMPLETED: '#10B981',    // Green
  CANCELLED: '#EF4444',    // Red
  
  PENDING: '#3B82F6',      // Blue
  COMPLETED_TASK: '#10B981', // Green
  CANCELLED_TASK: '#EF4444', // Red
  
  LOW: '#6B7280',          // Gray
  MEDIUM: '#3B82F6',       // Blue
  HIGH: '#F97316',         // Orange
  URGENT: '#EF4444',       // Red
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    SETUP_2FA: '/auth/setup-2fa',
    VERIFY_2FA: '/auth/verify-2fa',
  },
  
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: '/users/:id',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    CHANGE_PASSWORD: '/users/:id/password',
  },
  
  CLIENTS: {
    LIST: '/clients',
    CREATE: '/clients',
    GET: '/clients/:id',
    UPDATE: '/clients/:id',
    DELETE: '/clients/:id',
    MERGE: '/clients/:id/merge',
  },
  
  LEADS: {
    LIST: '/leads',
    CREATE: '/leads',
    GET: '/leads/:id',
    UPDATE: '/leads/:id',
    DELETE: '/leads/:id',
    CONVERT: '/leads/:id/convert',
  },
  
  DEALS: {
    LIST: '/deals',
    CREATE: '/deals',
    GET: '/deals/:id',
    UPDATE: '/deals/:id',
    DELETE: '/deals/:id',
    MOVE_STAGE: '/deals/:id/stage',
  },
  
  JOBS: {
    LIST: '/jobs',
    CREATE: '/jobs',
    GET: '/jobs/:id',
    UPDATE: '/jobs/:id',
    DELETE: '/jobs/:id',
    TIMELINE: '/jobs/:id/timeline',
  },
  
  ACTIVITIES: {
    LIST: '/activities',
    CREATE: '/activities',
    GET: '/activities/:id',
    UPDATE: '/activities/:id',
    DELETE: '/activities/:id',
  },
  
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    GET: '/tasks/:id',
    UPDATE: '/tasks/:id',
    DELETE: '/tasks/:id',
    COMPLETE: '/tasks/:id/complete',
  },
  
  APPOINTMENTS: {
    LIST: '/appointments',
    CREATE: '/appointments',
    GET: '/appointments/:id',
    UPDATE: '/appointments/:id',
    DELETE: '/appointments/:id',
  },
  
  FILES: {
    UPLOAD: '/files/upload',
    GET: '/files/:id',
    DELETE: '/files/:id',
    PRESIGNED_URL: '/files/presigned-url',
  },
  
  PORTAL: {
    ACCESS: '/portal/:key',
    MOODBOARDS: '/portal/:key/moodboards',
    DESIGNS: '/portal/:key/designs',
    PROGRESS: '/portal/:key/progress',
    GUIDES: '/portal/:key/guides',
    HANDOVER: '/portal/:key/handover',
  },
  
  MOBILE: {
    SYNC: '/mobile/sync',
    CHECK_IN: '/mobile/check-in',
    UPLOAD_PHOTOS: '/mobile/photos',
    SUBMIT_FORM: '/mobile/forms',
  },
  
  REPORTS: {
    PIPELINE: '/reports/pipeline',
    LEADS: '/reports/leads',
    JOBS: '/reports/jobs',
    COMPLIANCE: '/reports/compliance',
    FINANCIAL: '/reports/financial',
  },
  
  INTEGRATIONS: {
    TWILIO_WEBHOOK: '/webhooks/twilio',
    DOCUSIGN_WEBHOOK: '/webhooks/docusign',
    XERO_WEBHOOK: '/webhooks/xero',
    OUTLOOK_WEBHOOK: '/webhooks/outlook',
  },
};

// Webhook Events
export const WEBHOOK_EVENTS = {
  LEAD_CREATED: 'lead.created',
  LEAD_UPDATED: 'lead.updated',
  DEAL_STAGE_CHANGED: 'deal.stage_changed',
  JOB_STATUS_CHANGED: 'job.status_changed',
  TASK_COMPLETED: 'task.completed',
  APPOINTMENT_SCHEDULED: 'appointment.scheduled',
  DOCUMENT_UPLOADED: 'document.uploaded',
  FORM_SUBMITTED: 'form.submitted',
  DESIGN_APPROVED: 'design.approved',
  PAYMENT_RECEIVED: 'payment.received',
};

// Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INTEGRATION_ERROR: 'INTEGRATION_ERROR',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created',
  UPDATED: 'Successfully updated',
  DELETED: 'Successfully deleted',
  SENT: 'Successfully sent',
  SAVED: 'Successfully saved',
  UPLOADED: 'Successfully uploaded',
  SYNCED: 'Successfully synced',
  PROCESSED: 'Successfully processed',
};
