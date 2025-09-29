
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  firstName: 'firstName',
  lastName: 'lastName',
  phone: 'phone',
  role: 'role',
  isActive: 'isActive',
  lastLoginAt: 'lastLoginAt',
  emailVerifiedAt: 'emailVerifiedAt',
  twoFactorSecret: 'twoFactorSecret',
  twoFactorEnabled: 'twoFactorEnabled',
  avatarUrl: 'avatarUrl',
  timezone: 'timezone',
  preferences: 'preferences',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById',
  updatedById: 'updatedById'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  orgId: 'orgId',
  name: 'name',
  legalName: 'legalName',
  emails: 'emails',
  phones: 'phones',
  billingAddress: 'billingAddress',
  siteAddresses: 'siteAddresses',
  ownerId: 'ownerId',
  tags: 'tags',
  status: 'status',
  portalToken: 'portalToken',
  designFeePaid: 'designFeePaid',
  consentMarketing: 'consentMarketing',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  createdById: 'createdById',
  updatedById: 'updatedById'
};

exports.Prisma.EnquiryScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  status: 'status',
  priority: 'priority',
  source: 'source',
  campaign: 'campaign',
  medium: 'medium',
  estimatedValue: 'estimatedValue',
  contactMethod: 'contactMethod',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  mobile: 'mobile',
  company: 'company',
  message: 'message',
  accountId: 'accountId',
  ownerId: 'ownerId',
  leadId: 'leadId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById',
  updatedById: 'updatedById'
};

exports.Prisma.ContactScalarFieldEnum = {
  id: 'id',
  accountId: 'accountId',
  name: 'name',
  role: 'role',
  email: 'email',
  phone: 'phone',
  isPrimary: 'isPrimary',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LeadScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  status: 'status',
  priority: 'priority',
  estimatedValue: 'estimatedValue',
  probability: 'probability',
  expectedCloseDate: 'expectedCloseDate',
  source: 'source',
  campaign: 'campaign',
  medium: 'medium',
  firstResponseAt: 'firstResponseAt',
  responseTime: 'responseTime',
  accountId: 'accountId',
  ownerId: 'ownerId',
  enquiryId: 'enquiryId',
  projectId: 'projectId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById',
  updatedById: 'updatedById'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  type: 'type',
  status: 'status',
  accountId: 'accountId',
  ownerId: 'ownerId',
  amountGrossIncVat: 'amountGrossIncVat',
  vatRate: 'vatRate',
  probability: 'probability',
  source: 'source',
  utm: 'utm',
  leadId: 'leadId',
  completedProjectId: 'completedProjectId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CompletedProjectScalarFieldEnum = {
  id: 'id',
  accountId: 'accountId',
  projectId: 'projectId',
  ownerId: 'ownerId',
  title: 'title',
  description: 'description',
  status: 'status',
  startDate: 'startDate',
  endDate: 'endDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ActivityScalarFieldEnum = {
  id: 'id',
  accountId: 'accountId',
  enquiryId: 'enquiryId',
  leadId: 'leadId',
  projectId: 'projectId',
  userId: 'userId',
  type: 'type',
  threadKey: 'threadKey',
  summary: 'summary',
  body: 'body',
  attachments: 'attachments',
  durations: 'durations',
  metadata: 'metadata',
  occurredAt: 'occurredAt',
  createdAt: 'createdAt'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  status: 'status',
  priority: 'priority',
  dueDate: 'dueDate',
  completedAt: 'completedAt',
  assigneeId: 'assigneeId',
  accountId: 'accountId',
  enquiryId: 'enquiryId',
  leadId: 'leadId',
  projectId: 'projectId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppointmentScalarFieldEnum = {
  id: 'id',
  accountId: 'accountId',
  projectId: 'projectId',
  title: 'title',
  description: 'description',
  type: 'type',
  startTime: 'startTime',
  endTime: 'endTime',
  location: 'location',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DocumentScalarFieldEnum = {
  id: 'id',
  accountId: 'accountId',
  projectId: 'projectId',
  filename: 'filename',
  fileUrl: 'fileUrl',
  fileSize: 'fileSize',
  mimeType: 'mimeType',
  type: 'type',
  uploadedBy: 'uploadedBy',
  createdAt: 'createdAt'
};

exports.Prisma.SnagScalarFieldEnum = {
  id: 'id',
  accountId: 'accountId',
  projectId: 'projectId',
  title: 'title',
  description: 'description',
  status: 'status',
  priority: 'priority',
  assigneeId: 'assigneeId',
  dueAt: 'dueAt',
  photos: 'photos',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EventLogScalarFieldEnum = {
  id: 'id',
  accountId: 'accountId',
  actorId: 'actorId',
  entity: 'entity',
  entityId: 'entityId',
  action: 'action',
  before: 'before',
  after: 'after',
  createdAt: 'createdAt'
};

exports.Prisma.WorkflowDefinitionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  version: 'version',
  isActive: 'isActive',
  triggerType: 'triggerType',
  triggerConditions: 'triggerConditions',
  accountId: 'accountId',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WorkflowStepScalarFieldEnum = {
  id: 'id',
  workflowId: 'workflowId',
  name: 'name',
  description: 'description',
  stepType: 'stepType',
  position: 'position',
  configuration: 'configuration',
  conditions: 'conditions',
  isRequired: 'isRequired',
  timeoutMinutes: 'timeoutMinutes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WorkflowStepApproverScalarFieldEnum = {
  id: 'id',
  stepId: 'stepId',
  userId: 'userId',
  approverType: 'approverType',
  isRequired: 'isRequired',
  order: 'order',
  createdAt: 'createdAt'
};

exports.Prisma.WorkflowInstanceScalarFieldEnum = {
  id: 'id',
  workflowId: 'workflowId',
  entityType: 'entityType',
  entityId: 'entityId',
  status: 'status',
  currentStepId: 'currentStepId',
  priority: 'priority',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  errorMessage: 'errorMessage',
  metadata: 'metadata',
  accountId: 'accountId',
  initiatedById: 'initiatedById'
};

exports.Prisma.WorkflowStepExecutionScalarFieldEnum = {
  id: 'id',
  instanceId: 'instanceId',
  stepId: 'stepId',
  status: 'status',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  assignedToId: 'assignedToId',
  result: 'result',
  errorMessage: 'errorMessage',
  retryCount: 'retryCount',
  isManual: 'isManual'
};

exports.Prisma.WorkflowApprovalScalarFieldEnum = {
  id: 'id',
  instanceId: 'instanceId',
  approverId: 'approverId',
  stepApproverId: 'stepApproverId',
  status: 'status',
  comments: 'comments',
  approvedAt: 'approvedAt',
  rejectedAt: 'rejectedAt',
  requestedAt: 'requestedAt',
  remindersSent: 'remindersSent',
  lastReminderAt: 'lastReminderAt'
};

exports.Prisma.WorkflowTemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  category: 'category',
  industry: 'industry',
  templateData: 'templateData',
  isPublic: 'isPublic',
  usageCount: 'usageCount',
  rating: 'rating',
  accountId: 'accountId',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  workflowId: 'workflowId'
};

exports.Prisma.AutomationRuleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  triggerEvent: 'triggerEvent',
  conditions: 'conditions',
  actions: 'actions',
  isActive: 'isActive',
  priority: 'priority',
  executionCount: 'executionCount',
  lastExecutedAt: 'lastExecutedAt',
  accountId: 'accountId',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AutomationExecutionScalarFieldEnum = {
  id: 'id',
  ruleId: 'ruleId',
  triggerData: 'triggerData',
  result: 'result',
  status: 'status',
  errorMessage: 'errorMessage',
  executedAt: 'executedAt',
  durationMs: 'durationMs'
};

exports.Prisma.TestPlanScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  version: 'version',
  status: 'status',
  projectId: 'projectId',
  feature: 'feature',
  environment: 'environment',
  startDate: 'startDate',
  endDate: 'endDate',
  createdById: 'createdById',
  assignedToId: 'assignedToId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TestCaseScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  preconditions: 'preconditions',
  steps: 'steps',
  expectedResult: 'expectedResult',
  priority: 'priority',
  status: 'status',
  tags: 'tags',
  automatable: 'automatable',
  estimatedTime: 'estimatedTime',
  testPlanId: 'testPlanId',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TestExecutionScalarFieldEnum = {
  id: 'id',
  testPlanId: 'testPlanId',
  testCaseId: 'testCaseId',
  status: 'status',
  result: 'result',
  actualResult: 'actualResult',
  evidence: 'evidence',
  executionTime: 'executionTime',
  environment: 'environment',
  browserVersion: 'browserVersion',
  osVersion: 'osVersion',
  notes: 'notes',
  executedById: 'executedById',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DefectScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  steps: 'steps',
  expectedBehavior: 'expectedBehavior',
  actualBehavior: 'actualBehavior',
  severity: 'severity',
  priority: 'priority',
  status: 'status',
  environment: 'environment',
  browserVersion: 'browserVersion',
  osVersion: 'osVersion',
  attachments: 'attachments',
  reproducible: 'reproducible',
  regression: 'regression',
  testExecutionId: 'testExecutionId',
  reportedById: 'reportedById',
  assignedToId: 'assignedToId',
  reportedAt: 'reportedAt',
  resolvedAt: 'resolvedAt',
  closedAt: 'closedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DefectTestCaseScalarFieldEnum = {
  id: 'id',
  defectId: 'defectId',
  testCaseId: 'testCaseId',
  createdAt: 'createdAt'
};

exports.Prisma.DefectCommentScalarFieldEnum = {
  id: 'id',
  content: 'content',
  defectId: 'defectId',
  authorId: 'authorId',
  isInternal: 'isInternal',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QAReviewScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  type: 'type',
  entityId: 'entityId',
  status: 'status',
  criteria: 'criteria',
  findings: 'findings',
  recommendations: 'recommendations',
  approved: 'approved',
  testPlanId: 'testPlanId',
  reviewerId: 'reviewerId',
  reviewedAt: 'reviewedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.UserRole = exports.$Enums.UserRole = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  SALES: 'SALES',
  DESIGNER: 'DESIGNER',
  INSTALLER: 'INSTALLER',
  FINANCE: 'FINANCE'
};

exports.AccountStatus = exports.$Enums.AccountStatus = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED'
};

exports.EnquiryStatus = exports.$Enums.EnquiryStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  CONVERTED: 'CONVERTED',
  REJECTED: 'REJECTED',
  NURTURING: 'NURTURING'
};

exports.Priority = exports.$Enums.Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

exports.LeadStatus = exports.$Enums.LeadStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  PROPOSAL_SENT: 'PROPOSAL_SENT',
  NEGOTIATING: 'NEGOTIATING',
  WON: 'WON',
  LOST: 'LOST'
};

exports.ProjectType = exports.$Enums.ProjectType = {
  KITCHEN: 'KITCHEN',
  BATHROOM: 'BATHROOM',
  CLOAKROOM: 'CLOAKROOM',
  ENSUITE: 'ENSUITE',
  WET_ROOM: 'WET_ROOM',
  OTHER: 'OTHER'
};

exports.ProjectStatus = exports.$Enums.ProjectStatus = {
  PLANNING: 'PLANNING',
  DESIGN: 'DESIGN',
  QUOTED: 'QUOTED',
  APPROVED: 'APPROVED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  ON_HOLD: 'ON_HOLD'
};

exports.CompletedProjectStatus = exports.$Enums.CompletedProjectStatus = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.ActivityType = exports.$Enums.ActivityType = {
  NOTE: 'NOTE',
  CALL: 'CALL',
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  MEETING: 'MEETING',
  VOICEMAIL: 'VOICEMAIL',
  SIGNATURE: 'SIGNATURE',
  UPLOAD: 'UPLOAD',
  FORM: 'FORM',
  SYSTEM: 'SYSTEM'
};

exports.TaskStatus = exports.$Enums.TaskStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED'
};

exports.AppointmentType = exports.$Enums.AppointmentType = {
  DESIGN_CONSULTATION: 'DESIGN_CONSULTATION',
  SITE_SURVEY: 'SITE_SURVEY',
  DESIGN_PRESENTATION: 'DESIGN_PRESENTATION',
  CONTRACT_SIGNING: 'CONTRACT_SIGNING',
  INSTALL_START: 'INSTALL_START',
  PROGRESS_CHECK: 'PROGRESS_CHECK',
  HANDOVER: 'HANDOVER',
  AFTERCARE: 'AFTERCARE',
  FOLLOW_UP: 'FOLLOW_UP'
};

exports.AppointmentStatus = exports.$Enums.AppointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW'
};

exports.DocumentType = exports.$Enums.DocumentType = {
  DESIGN_DRAWING: 'DESIGN_DRAWING',
  TECHNICAL_DRAWING: 'TECHNICAL_DRAWING',
  SITE_SURVEY: 'SITE_SURVEY',
  PRODUCT_SPECIFICATION: 'PRODUCT_SPECIFICATION',
  QUOTATION: 'QUOTATION',
  CONTRACT: 'CONTRACT',
  INVOICE: 'INVOICE',
  PHOTO_BEFORE: 'PHOTO_BEFORE',
  PHOTO_PROGRESS: 'PHOTO_PROGRESS',
  PHOTO_COMPLETION: 'PHOTO_COMPLETION',
  CERTIFICATE: 'CERTIFICATE',
  WARRANTY: 'WARRANTY',
  RENDER_3D: 'RENDER_3D',
  FLOOR_PLAN: 'FLOOR_PLAN',
  OTHER: 'OTHER'
};

exports.SnagStatus = exports.$Enums.SnagStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
};

exports.WorkflowTriggerType = exports.$Enums.WorkflowTriggerType = {
  MANUAL: 'MANUAL',
  AUTOMATIC: 'AUTOMATIC',
  SCHEDULED: 'SCHEDULED',
  CONDITIONAL: 'CONDITIONAL'
};

exports.WorkflowStepType = exports.$Enums.WorkflowStepType = {
  APPROVAL: 'APPROVAL',
  TASK: 'TASK',
  NOTIFICATION: 'NOTIFICATION',
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  WEBHOOK: 'WEBHOOK',
  DATA_UPDATE: 'DATA_UPDATE',
  WAIT: 'WAIT',
  DECISION: 'DECISION',
  SCRIPT: 'SCRIPT'
};

exports.ApproverType = exports.$Enums.ApproverType = {
  REQUIRED: 'REQUIRED',
  OPTIONAL: 'OPTIONAL',
  INFORMATIONAL: 'INFORMATIONAL'
};

exports.WorkflowStatus = exports.$Enums.WorkflowStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

exports.WorkflowStepStatus = exports.$Enums.WorkflowStepStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  SKIPPED: 'SKIPPED',
  CANCELLED: 'CANCELLED'
};

exports.ApprovalStatus = exports.$Enums.ApprovalStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

exports.AutomationStatus = exports.$Enums.AutomationStatus = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  PARTIAL: 'PARTIAL'
};

exports.TestPlanStatus = exports.$Enums.TestPlanStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED'
};

exports.TestCasePriority = exports.$Enums.TestCasePriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

exports.TestCaseStatus = exports.$Enums.TestCaseStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  DEPRECATED: 'DEPRECATED'
};

exports.TestExecutionStatus = exports.$Enums.TestExecutionStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  PASSED: 'PASSED',
  FAILED: 'FAILED',
  BLOCKED: 'BLOCKED',
  SKIPPED: 'SKIPPED'
};

exports.DefectSeverity = exports.$Enums.DefectSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
  BLOCKER: 'BLOCKER'
};

exports.DefectPriority = exports.$Enums.DefectPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

exports.DefectStatus = exports.$Enums.DefectStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  REOPENED: 'REOPENED',
  REJECTED: 'REJECTED'
};

exports.QAReviewStatus = exports.$Enums.QAReviewStatus = {
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  NEEDS_REVISION: 'NEEDS_REVISION'
};

exports.Prisma.ModelName = {
  User: 'User',
  Account: 'Account',
  Enquiry: 'Enquiry',
  Contact: 'Contact',
  Lead: 'Lead',
  Project: 'Project',
  CompletedProject: 'CompletedProject',
  Activity: 'Activity',
  Task: 'Task',
  Appointment: 'Appointment',
  Document: 'Document',
  Snag: 'Snag',
  EventLog: 'EventLog',
  WorkflowDefinition: 'WorkflowDefinition',
  WorkflowStep: 'WorkflowStep',
  WorkflowStepApprover: 'WorkflowStepApprover',
  WorkflowInstance: 'WorkflowInstance',
  WorkflowStepExecution: 'WorkflowStepExecution',
  WorkflowApproval: 'WorkflowApproval',
  WorkflowTemplate: 'WorkflowTemplate',
  AutomationRule: 'AutomationRule',
  AutomationExecution: 'AutomationExecution',
  TestPlan: 'TestPlan',
  TestCase: 'TestCase',
  TestExecution: 'TestExecution',
  Defect: 'Defect',
  DefectTestCase: 'DefectTestCase',
  DefectComment: 'DefectComment',
  QAReview: 'QAReview'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
