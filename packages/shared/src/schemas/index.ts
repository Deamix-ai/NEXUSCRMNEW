import { z } from 'zod';

// Base schemas
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export const SearchSchema = z.object({
  q: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// User schemas
export const CreateUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'SALES', 'DESIGNER', 'FIELD', 'INSTALLER_COMPANY_OWNER', 'READ_ONLY']),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
});

export const UpdateUserSchema = CreateUserSchema.partial().omit({ password: true });

export const ChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  twoFactorCode: z.string().optional(),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email(),
});

export const ConfirmResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Client schemas
export const CreateClientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().default('GB'),
  clientType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'TRADE']).default('RESIDENTIAL'),
  leadSource: z.string().optional(),
  referralSource: z.string().optional(),
  marketingConsent: z.boolean().default(false),
  emailConsent: z.boolean().default(true),
  smsConsent: z.boolean().default(false),
  callRecordingConsent: z.boolean().default(false),
});

export const UpdateClientSchema = CreateClientSchema.partial();

// Contact schemas
export const CreateContactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  jobTitle: z.string().optional(),
  isPrimary: z.boolean().default(false),
  clientId: z.string(),
});

export const UpdateContactSchema = CreateContactSchema.partial().omit({ clientId: true });

// Lead schemas
export const CreateLeadSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATING', 'WON', 'LOST', 'NURTURING']).default('NEW'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  estimatedValue: z.number().min(0).optional(),
  probability: z.number().min(0).max(100).default(50),
  expectedCloseDate: z.string().datetime().optional(),
  source: z.string().optional(),
  campaign: z.string().optional(),
  medium: z.string().optional(),
  clientId: z.string(),
  ownerId: z.string(),
});

export const UpdateLeadSchema = CreateLeadSchema.partial().omit({ clientId: true });

// Deal schemas
export const CreateDealSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  value: z.number().min(0),
  probability: z.number().min(0).max(100).default(50),
  expectedCloseDate: z.string().datetime().optional(),
  stageId: z.string(),
  clientId: z.string(),
  ownerId: z.string(),
});

export const UpdateDealSchema = CreateDealSchema.partial().omit({ clientId: true });

// Job schemas
export const CreateJobSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['QUOTED', 'SURVEY_BOOKED', 'SURVEYED', 'DESIGNING', 'DESIGN_APPROVED', 'MATERIALS_ORDERED', 'SCHEDULED', 'IN_PROGRESS', 'SNAGGING', 'COMPLETED', 'CANCELLED']).default('QUOTED'),
  quotedValue: z.number().min(0).optional(),
  depositAmount: z.number().min(0).optional(),
  clientId: z.string(),
  roomId: z.string(),
  designerId: z.string().optional(),
  installerCompanyId: z.string().optional(),
});

export const UpdateJobSchema = CreateJobSchema.partial().omit({ clientId: true, roomId: true });

// Room schemas
export const CreateRoomSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['BATHROOM', 'EN_SUITE', 'WC', 'WETROOM', 'SHOWER_ROOM', 'UTILITY']),
  length: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  currentCondition: z.string().optional(),
  accessNotes: z.string().optional(),
  clientId: z.string(),
});

export const UpdateRoomSchema = CreateRoomSchema.partial().omit({ clientId: true });

// Task schemas
export const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).default('PENDING'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().datetime().optional(),
  assigneeId: z.string(),
  clientId: z.string().optional(),
  leadId: z.string().optional(),
  dealId: z.string().optional(),
  jobId: z.string().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial().omit({ assigneeId: true });

// Activity schemas
export const CreateActivitySchema = z.object({
  type: z.enum(['CALL', 'EMAIL', 'SMS', 'MEETING', 'NOTE', 'TASK', 'DOCUMENT_UPLOAD', 'PORTAL_ACCESS', 'SURVEY_SUBMITTED', 'DESIGN_VIEWED', 'PAYMENT_RECEIVED']),
  title: z.string().min(1),
  description: z.string().optional(),
  direction: z.enum(['INBOUND', 'OUTBOUND']).optional(),
  duration: z.number().min(0).optional(),
  outcome: z.string().optional(),
  clientId: z.string().optional(),
  contactId: z.string().optional(),
  leadId: z.string().optional(),
  dealId: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).default({}),
});

// Appointment schemas
export const CreateAppointmentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  location: z.string().optional(),
  meetingUrl: z.string().url().optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).default('SCHEDULED'),
  clientId: z.string(),
  jobId: z.string().optional(),
});

export const UpdateAppointmentSchema = CreateAppointmentSchema.partial().omit({ clientId: true });

// Public booking schema
export const PublicBookingSchema = z.object({
  // Client details
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  mobile: z.string().optional(),
  
  // Address
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  postcode: z.string().min(1),
  
  // Room details
  roomName: z.string().min(1),
  roomType: z.enum(['BATHROOM', 'EN_SUITE', 'WC', 'WETROOM', 'SHOWER_ROOM', 'UTILITY']),
  
  // Appointment
  appointmentDate: z.string().datetime(),
  appointmentNotes: z.string().optional(),
  
  // Consents
  marketingConsent: z.boolean().default(false),
  emailConsent: z.boolean().default(true),
  smsConsent: z.boolean().default(false),
  
  // Optional deposit
  requiresDeposit: z.boolean().default(false),
  depositAmount: z.number().min(0).optional(),
  
  // Lead source tracking
  source: z.string().optional(),
  campaign: z.string().optional(),
  medium: z.string().optional(),
});

// Mobile form schemas
export const JobDayLogSchema = z.object({
  date: z.string().date(),
  jobId: z.string(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  lunchStart: z.string().datetime().optional(),
  lunchEnd: z.string().datetime().optional(),
  checkInLatitude: z.number().optional(),
  checkInLongitude: z.number().optional(),
  checkInAddress: z.string().optional(),
  workCompleted: z.string().optional(),
  materialsUsed: z.string().optional(),
  issuesEncountered: z.string().optional(),
  startFormData: z.record(z.any()).default({}),
  dailyFormData: z.record(z.any()).default({}),
  endFormData: z.record(z.any()).default({}),
  photos: z.array(z.string()).default([]),
  isCompliant: z.boolean().default(true),
  complianceNotes: z.string().optional(),
});

// Design schemas
export const CreateDesignVersionSchema = z.object({
  version: z.number().min(1).default(1),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'REVIEW', 'CLIENT_REVIEW', 'APPROVED', 'FINAL', 'ARCHIVED']).default('DRAFT'),
  renderUrls: z.array(z.string().url()).default([]),
  planUrls: z.array(z.string().url()).default([]),
  specSheetUrl: z.string().url().optional(),
  isClientVisible: z.boolean().default(false),
  jobId: z.string(),
});

export const UpdateDesignVersionSchema = CreateDesignVersionSchema.partial().omit({ jobId: true });

// Snag schemas
export const CreateSnagSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['PLUMBING', 'ELECTRICAL', 'TILING', 'DECORATION', 'FITTING', 'CLEANING', 'OTHER']),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'DEFERRED']).default('OPEN'),
  photoUrls: z.array(z.string().url()).default([]),
  isClientVisible: z.boolean().default(false),
  jobId: z.string(),
  assignedToId: z.string().optional(),
});

export const UpdateSnagSchema = CreateSnagSchema.partial().omit({ jobId: true });

// File upload schema
export const FileUploadSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  fileSize: z.number().min(1),
  category: z.enum(['CONTRACT', 'INVOICE', 'QUOTE', 'DESIGN', 'PHOTO', 'SPECIFICATION', 'COMPLIANCE', 'HANDOVER', 'OTHER']),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  clientId: z.string().optional(),
  dealId: z.string().optional(),
  jobId: z.string().optional(),
});

// Portal comment schema
export const CreatePortalCommentSchema = z.object({
  content: z.string().min(1),
  xPosition: z.number().min(0).max(100),
  yPosition: z.number().min(0).max(100),
  authorName: z.string().optional(),
  itemId: z.string(),
});

// Search and filter schemas
export const GlobalSearchSchema = z.object({
  q: z.string().min(1),
  types: z.array(z.enum(['clients', 'leads', 'deals', 'jobs', 'tasks', 'contacts'])).optional(),
  limit: z.number().min(1).max(50).default(10),
});

export const ReportSchema = z.object({
  type: z.enum(['pipeline', 'leads', 'jobs', 'compliance', 'financial']),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
  groupBy: z.string().optional(),
  filters: z.record(z.any()).optional(),
});

// Validation helpers
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateClientInput = z.infer<typeof CreateClientSchema>;
export type UpdateClientInput = z.infer<typeof UpdateClientSchema>;
export type CreateLeadInput = z.infer<typeof CreateLeadSchema>;
export type UpdateLeadInput = z.infer<typeof UpdateLeadSchema>;
export type CreateDealInput = z.infer<typeof CreateDealSchema>;
export type UpdateDealInput = z.infer<typeof UpdateDealSchema>;
export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type UpdateJobInput = z.infer<typeof UpdateJobSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type CreateActivityInput = z.infer<typeof CreateActivitySchema>;
export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof UpdateAppointmentSchema>;
export type PublicBookingInput = z.infer<typeof PublicBookingSchema>;
export type JobDayLogInput = z.infer<typeof JobDayLogSchema>;
export type CreateDesignVersionInput = z.infer<typeof CreateDesignVersionSchema>;
export type CreateSnagInput = z.infer<typeof CreateSnagSchema>;
export type FileUploadInput = z.infer<typeof FileUploadSchema>;
export type CreatePortalCommentInput = z.infer<typeof CreatePortalCommentSchema>;
export type GlobalSearchInput = z.infer<typeof GlobalSearchSchema>;
export type ReportInput = z.infer<typeof ReportSchema>;
