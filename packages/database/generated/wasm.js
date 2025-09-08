
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

exports.Prisma.ClientScalarFieldEnum = {
  id: 'id',
  companyName: 'companyName',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  mobile: 'mobile',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  city: 'city',
  county: 'county',
  postcode: 'postcode',
  country: 'country',
  clientType: 'clientType',
  leadSource: 'leadSource',
  referralSource: 'referralSource',
  portalKey: 'portalKey',
  portalLastAccessAt: 'portalLastAccessAt',
  marketingConsent: 'marketingConsent',
  marketingConsentDate: 'marketingConsentDate',
  emailConsent: 'emailConsent',
  smsConsent: 'smsConsent',
  callRecordingConsent: 'callRecordingConsent',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById',
  updatedById: 'updatedById',
  ownerId: 'ownerId'
};

exports.Prisma.ContactScalarFieldEnum = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  mobile: 'mobile',
  jobTitle: 'jobTitle',
  isPrimary: 'isPrimary',
  clientId: 'clientId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById',
  updatedById: 'updatedById'
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
  clientId: 'clientId',
  ownerId: 'ownerId',
  dealId: 'dealId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById',
  updatedById: 'updatedById'
};

exports.Prisma.DealScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  value: 'value',
  probability: 'probability',
  expectedCloseDate: 'expectedCloseDate',
  actualCloseDate: 'actualCloseDate',
  stageId: 'stageId',
  clientId: 'clientId',
  ownerId: 'ownerId',
  jobId: 'jobId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById',
  updatedById: 'updatedById'
};

exports.Prisma.PipelineStageScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  order: 'order',
  probability: 'probability',
  isClosedWon: 'isClosedWon',
  isClosedLost: 'isClosedLost',
  autoTasks: 'autoTasks',
  autoEmails: 'autoEmails',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ActivityScalarFieldEnum = {
  id: 'id',
  type: 'type',
  title: 'title',
  description: 'description',
  direction: 'direction',
  duration: 'duration',
  outcome: 'outcome',
  userId: 'userId',
  clientId: 'clientId',
  contactId: 'contactId',
  leadId: 'leadId',
  dealId: 'dealId',
  emailMessageId: 'emailMessageId',
  callRecordingUrl: 'callRecordingUrl',
  metadata: 'metadata',
  createdAt: 'createdAt',
  scheduledAt: 'scheduledAt',
  completedAt: 'completedAt'
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
  createdById: 'createdById',
  clientId: 'clientId',
  leadId: 'leadId',
  dealId: 'dealId',
  jobId: 'jobId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppointmentScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  startTime: 'startTime',
  endTime: 'endTime',
  location: 'location',
  meetingUrl: 'meetingUrl',
  status: 'status',
  userId: 'userId',
  clientId: 'clientId',
  jobId: 'jobId',
  outlookEventId: 'outlookEventId',
  calendarSynced: 'calendarSynced',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RoomScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  length: 'length',
  width: 'width',
  height: 'height',
  currentCondition: 'currentCondition',
  accessNotes: 'accessNotes',
  clientId: 'clientId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.JobScalarFieldEnum = {
  id: 'id',
  jobNumber: 'jobNumber',
  title: 'title',
  description: 'description',
  status: 'status',
  quotedDate: 'quotedDate',
  surveyDate: 'surveyDate',
  designDate: 'designDate',
  startDate: 'startDate',
  expectedEndDate: 'expectedEndDate',
  actualEndDate: 'actualEndDate',
  quotedValue: 'quotedValue',
  finalValue: 'finalValue',
  depositAmount: 'depositAmount',
  depositPaid: 'depositPaid',
  designFeePaid: 'designFeePaid',
  balancePaid: 'balancePaid',
  clientId: 'clientId',
  roomId: 'roomId',
  dealId: 'dealId',
  installerCompanyId: 'installerCompanyId',
  designerId: 'designerId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.JobDayLogScalarFieldEnum = {
  id: 'id',
  date: 'date',
  userId: 'userId',
  jobId: 'jobId',
  startTime: 'startTime',
  endTime: 'endTime',
  lunchStart: 'lunchStart',
  lunchEnd: 'lunchEnd',
  checkInLatitude: 'checkInLatitude',
  checkInLongitude: 'checkInLongitude',
  checkInAddress: 'checkInAddress',
  workCompleted: 'workCompleted',
  materialsUsed: 'materialsUsed',
  issuesEncountered: 'issuesEncountered',
  startFormData: 'startFormData',
  dailyFormData: 'dailyFormData',
  endFormData: 'endFormData',
  photos: 'photos',
  isCompliant: 'isCompliant',
  complianceNotes: 'complianceNotes',
  syncStatus: 'syncStatus',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InstallerCompanyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  contactEmail: 'contactEmail',
  contactPhone: 'contactPhone',
  address: 'address',
  insuranceExpiry: 'insuranceExpiry',
  dbsExpiry: 'dbsExpiry',
  contractSigned: 'contractSigned',
  contractSignedAt: 'contractSignedAt',
  isActive: 'isActive',
  isSuspended: 'isSuspended',
  suspensionReason: 'suspensionReason',
  ownerId: 'ownerId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InstallerTeamMemberScalarFieldEnum = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  dbsExpiry: 'dbsExpiry',
  isActive: 'isActive',
  companyId: 'companyId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DesignVersionScalarFieldEnum = {
  id: 'id',
  version: 'version',
  title: 'title',
  description: 'description',
  status: 'status',
  renderUrls: 'renderUrls',
  planUrls: 'planUrls',
  specSheetUrl: 'specSheetUrl',
  isClientVisible: 'isClientVisible',
  clientViewedAt: 'clientViewedAt',
  clientApprovedAt: 'clientApprovedAt',
  clientFeedback: 'clientFeedback',
  jobId: 'jobId',
  designerId: 'designerId',
  isFinal: 'isFinal',
  lockedAt: 'lockedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DesignClashTicketScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  status: 'status',
  priority: 'priority',
  photoUrls: 'photoUrls',
  resolution: 'resolution',
  resolvedAt: 'resolvedAt',
  designVersionId: 'designVersionId',
  reportedById: 'reportedById',
  assignedToId: 'assignedToId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MoodboardScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  status: 'status',
  clientId: 'clientId',
  jobId: 'jobId',
  isClientVisible: 'isClientVisible',
  clientLastViewedAt: 'clientLastViewedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MoodboardItemScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  imageUrl: 'imageUrl',
  sourceUrl: 'sourceUrl',
  category: 'category',
  order: 'order',
  moodboardId: 'moodboardId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MoodboardCommentScalarFieldEnum = {
  id: 'id',
  content: 'content',
  xPosition: 'xPosition',
  yPosition: 'yPosition',
  authorId: 'authorId',
  authorName: 'authorName',
  itemId: 'itemId',
  createdAt: 'createdAt'
};

exports.Prisma.ParsedSpecItemScalarFieldEnum = {
  id: 'id',
  originalText: 'originalText',
  parsedCategory: 'parsedCategory',
  parsedBrand: 'parsedBrand',
  parsedModel: 'parsedModel',
  parsedDescription: 'parsedDescription',
  parsedQuantity: 'parsedQuantity',
  parsedPrice: 'parsedPrice',
  status: 'status',
  notes: 'notes',
  substitution: 'substitution',
  actualPrice: 'actualPrice',
  parseConfidence: 'parseConfidence',
  requiresReview: 'requiresReview',
  jobId: 'jobId',
  sourceDocumentId: 'sourceDocumentId',
  sourcePage: 'sourcePage',
  sourceLineNumber: 'sourceLineNumber',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SnagScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  category: 'category',
  severity: 'severity',
  status: 'status',
  photoUrls: 'photoUrls',
  isClientVisible: 'isClientVisible',
  clientNotified: 'clientNotified',
  resolution: 'resolution',
  resolvedAt: 'resolvedAt',
  jobId: 'jobId',
  reportedById: 'reportedById',
  assignedToId: 'assignedToId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DocumentScalarFieldEnum = {
  id: 'id',
  filename: 'filename',
  originalFilename: 'originalFilename',
  mimeType: 'mimeType',
  fileSize: 'fileSize',
  storageUrl: 'storageUrl',
  category: 'category',
  description: 'description',
  isPublic: 'isPublic',
  virusScanStatus: 'virusScanStatus',
  virusScanResult: 'virusScanResult',
  clientId: 'clientId',
  dealId: 'dealId',
  jobId: 'jobId',
  createdAt: 'createdAt',
  uploadedById: 'uploadedById'
};

exports.Prisma.FormTemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  category: 'category',
  schema: 'schema',
  isActive: 'isActive',
  version: 'version',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FormSubmissionScalarFieldEnum = {
  id: 'id',
  data: 'data',
  submissionSource: 'submissionSource',
  templateId: 'templateId',
  submittedById: 'submittedById',
  clientId: 'clientId',
  jobId: 'jobId',
  submittedAt: 'submittedAt'
};

exports.Prisma.HandoverPackScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  completionCertUrl: 'completionCertUrl',
  warrantyDocsUrls: 'warrantyDocsUrls',
  finalPhotosUrls: 'finalPhotosUrls',
  guidesIncluded: 'guidesIncluded',
  isGenerated: 'isGenerated',
  generatedAt: 'generatedAt',
  deliveredAt: 'deliveredAt',
  clientAccessedAt: 'clientAccessedAt',
  jobId: 'jobId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GuideScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  content: 'content',
  category: 'category',
  tags: 'tags',
  isPublished: 'isPublished',
  featured: 'featured',
  metaDescription: 'metaDescription',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  publishedAt: 'publishedAt'
};

exports.Prisma.EmailJourneyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  isActive: 'isActive',
  triggerEvent: 'triggerEvent',
  triggerConditions: 'triggerConditions',
  totalSent: 'totalSent',
  totalOpened: 'totalOpened',
  totalClicked: 'totalClicked',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmailSequenceStepScalarFieldEnum = {
  id: 'id',
  stepNumber: 'stepNumber',
  templateId: 'templateId',
  delayDays: 'delayDays',
  delayHours: 'delayHours',
  sendConditions: 'sendConditions',
  journeyId: 'journeyId'
};

exports.Prisma.WebhookScalarFieldEnum = {
  id: 'id',
  name: 'name',
  url: 'url',
  events: 'events',
  secret: 'secret',
  isActive: 'isActive',
  totalDeliveries: 'totalDeliveries',
  lastDeliveryAt: 'lastDeliveryAt',
  lastSuccessAt: 'lastSuccessAt',
  lastFailureAt: 'lastFailureAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WebhookDeliveryScalarFieldEnum = {
  id: 'id',
  eventType: 'eventType',
  payload: 'payload',
  httpStatus: 'httpStatus',
  responseBody: 'responseBody',
  errorMessage: 'errorMessage',
  deliveryAttempts: 'deliveryAttempts',
  deliveredAt: 'deliveredAt',
  webhookId: 'webhookId',
  createdAt: 'createdAt'
};

exports.Prisma.EventLogScalarFieldEnum = {
  id: 'id',
  eventType: 'eventType',
  entityType: 'entityType',
  entityId: 'entityId',
  changes: 'changes',
  metadata: 'metadata',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  userId: 'userId',
  occurredAt: 'occurredAt'
};

exports.Prisma.IntegrationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  config: 'config',
  isActive: 'isActive',
  lastSyncAt: 'lastSyncAt',
  nextSyncAt: 'nextSyncAt',
  syncErrors: 'syncErrors',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MergeQueueScalarFieldEnum = {
  id: 'id',
  entityType: 'entityType',
  primaryEntityId: 'primaryEntityId',
  duplicateEntityId: 'duplicateEntityId',
  status: 'status',
  mergeRules: 'mergeRules',
  reviewedById: 'reviewedById',
  reviewedAt: 'reviewedAt',
  mergedAt: 'mergedAt',
  createdAt: 'createdAt'
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
  FIELD: 'FIELD',
  INSTALLER_COMPANY_OWNER: 'INSTALLER_COMPANY_OWNER',
  READ_ONLY: 'READ_ONLY'
};

exports.ClientType = exports.$Enums.ClientType = {
  RESIDENTIAL: 'RESIDENTIAL',
  COMMERCIAL: 'COMMERCIAL',
  TRADE: 'TRADE'
};

exports.LeadStatus = exports.$Enums.LeadStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  PROPOSAL_SENT: 'PROPOSAL_SENT',
  NEGOTIATING: 'NEGOTIATING',
  WON: 'WON',
  LOST: 'LOST',
  NURTURING: 'NURTURING'
};

exports.Priority = exports.$Enums.Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

exports.ActivityType = exports.$Enums.ActivityType = {
  CALL: 'CALL',
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  MEETING: 'MEETING',
  NOTE: 'NOTE',
  TASK: 'TASK',
  DOCUMENT_UPLOAD: 'DOCUMENT_UPLOAD',
  PORTAL_ACCESS: 'PORTAL_ACCESS',
  SURVEY_SUBMITTED: 'SURVEY_SUBMITTED',
  DESIGN_VIEWED: 'DESIGN_VIEWED',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED'
};

exports.Direction = exports.$Enums.Direction = {
  INBOUND: 'INBOUND',
  OUTBOUND: 'OUTBOUND'
};

exports.TaskStatus = exports.$Enums.TaskStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.AppointmentStatus = exports.$Enums.AppointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW'
};

exports.RoomType = exports.$Enums.RoomType = {
  BATHROOM: 'BATHROOM',
  EN_SUITE: 'EN_SUITE',
  WC: 'WC',
  WETROOM: 'WETROOM',
  SHOWER_ROOM: 'SHOWER_ROOM',
  UTILITY: 'UTILITY'
};

exports.JobStatus = exports.$Enums.JobStatus = {
  QUOTED: 'QUOTED',
  SURVEY_BOOKED: 'SURVEY_BOOKED',
  SURVEYED: 'SURVEYED',
  DESIGNING: 'DESIGNING',
  DESIGN_APPROVED: 'DESIGN_APPROVED',
  MATERIALS_ORDERED: 'MATERIALS_ORDERED',
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  SNAGGING: 'SNAGGING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.SyncStatus = exports.$Enums.SyncStatus = {
  QUEUED: 'QUEUED',
  UPLOADING: 'UPLOADING',
  RETRYING: 'RETRYING',
  SYNCED: 'SYNCED',
  ERROR: 'ERROR'
};

exports.DesignStatus = exports.$Enums.DesignStatus = {
  DRAFT: 'DRAFT',
  REVIEW: 'REVIEW',
  CLIENT_REVIEW: 'CLIENT_REVIEW',
  APPROVED: 'APPROVED',
  FINAL: 'FINAL',
  ARCHIVED: 'ARCHIVED'
};

exports.ClashStatus = exports.$Enums.ClashStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
};

exports.MoodboardStatus = exports.$Enums.MoodboardStatus = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED'
};

exports.SpecItemStatus = exports.$Enums.SpecItemStatus = {
  PENDING: 'PENDING',
  ORDERED: 'ORDERED',
  DELIVERED: 'DELIVERED',
  INSTALLED: 'INSTALLED',
  SUBSTITUTED: 'SUBSTITUTED',
  CANCELLED: 'CANCELLED'
};

exports.SnagCategory = exports.$Enums.SnagCategory = {
  PLUMBING: 'PLUMBING',
  ELECTRICAL: 'ELECTRICAL',
  TILING: 'TILING',
  DECORATION: 'DECORATION',
  FITTING: 'FITTING',
  CLEANING: 'CLEANING',
  OTHER: 'OTHER'
};

exports.SnagStatus = exports.$Enums.SnagStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  DEFERRED: 'DEFERRED'
};

exports.DocumentCategory = exports.$Enums.DocumentCategory = {
  CONTRACT: 'CONTRACT',
  INVOICE: 'INVOICE',
  QUOTE: 'QUOTE',
  DESIGN: 'DESIGN',
  PHOTO: 'PHOTO',
  SPECIFICATION: 'SPECIFICATION',
  COMPLIANCE: 'COMPLIANCE',
  HANDOVER: 'HANDOVER',
  OTHER: 'OTHER'
};

exports.VirusScanStatus = exports.$Enums.VirusScanStatus = {
  PENDING: 'PENDING',
  CLEAN: 'CLEAN',
  INFECTED: 'INFECTED',
  ERROR: 'ERROR'
};

exports.FormCategory = exports.$Enums.FormCategory = {
  SURVEY: 'SURVEY',
  DAILY_LOG: 'DAILY_LOG',
  START_WORK: 'START_WORK',
  END_WORK: 'END_WORK',
  DESIGN_BRIEF: 'DESIGN_BRIEF',
  CLIENT_FEEDBACK: 'CLIENT_FEEDBACK',
  COMPLIANCE_CHECK: 'COMPLIANCE_CHECK'
};

exports.SubmissionSource = exports.$Enums.SubmissionSource = {
  WEB: 'WEB',
  MOBILE: 'MOBILE',
  API: 'API'
};

exports.GuideCategory = exports.$Enums.GuideCategory = {
  CARE_MAINTENANCE: 'CARE_MAINTENANCE',
  TROUBLESHOOTING: 'TROUBLESHOOTING',
  WARRANTY: 'WARRANTY',
  SAFETY: 'SAFETY',
  INSTALLATION: 'INSTALLATION',
  DESIGN_TIPS: 'DESIGN_TIPS'
};

exports.EmailTrigger = exports.$Enums.EmailTrigger = {
  STAGE_CHANGE: 'STAGE_CHANGE',
  TASK_OVERDUE: 'TASK_OVERDUE',
  APPOINTMENT_REMINDER: 'APPOINTMENT_REMINDER',
  SURVEY_COMPLETED: 'SURVEY_COMPLETED',
  DESIGN_READY: 'DESIGN_READY',
  JOB_COMPLETED: 'JOB_COMPLETED',
  PAYMENT_DUE: 'PAYMENT_DUE'
};

exports.WebhookEvent = exports.$Enums.WebhookEvent = {
  LEAD_CREATED: 'LEAD_CREATED',
  DEAL_STAGE_CHANGED: 'DEAL_STAGE_CHANGED',
  JOB_STATUS_CHANGED: 'JOB_STATUS_CHANGED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  APPOINTMENT_SCHEDULED: 'APPOINTMENT_SCHEDULED',
  DOCUMENT_UPLOADED: 'DOCUMENT_UPLOADED',
  FORM_SUBMITTED: 'FORM_SUBMITTED',
  DESIGN_APPROVED: 'DESIGN_APPROVED',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED'
};

exports.IntegrationType = exports.$Enums.IntegrationType = {
  TWILIO: 'TWILIO',
  DOCUSIGN: 'DOCUSIGN',
  XERO: 'XERO',
  OUTLOOK: 'OUTLOOK',
  GOOGLE_CALENDAR: 'GOOGLE_CALENDAR',
  MAILCHIMP: 'MAILCHIMP',
  ZAPIER: 'ZAPIER'
};

exports.MergeStatus = exports.$Enums.MergeStatus = {
  PENDING: 'PENDING',
  REVIEWED: 'REVIEWED',
  MERGED: 'MERGED',
  REJECTED: 'REJECTED'
};

exports.Prisma.ModelName = {
  User: 'User',
  Client: 'Client',
  Contact: 'Contact',
  Lead: 'Lead',
  Deal: 'Deal',
  PipelineStage: 'PipelineStage',
  Activity: 'Activity',
  Task: 'Task',
  Appointment: 'Appointment',
  Room: 'Room',
  Job: 'Job',
  JobDayLog: 'JobDayLog',
  InstallerCompany: 'InstallerCompany',
  InstallerTeamMember: 'InstallerTeamMember',
  DesignVersion: 'DesignVersion',
  DesignClashTicket: 'DesignClashTicket',
  Moodboard: 'Moodboard',
  MoodboardItem: 'MoodboardItem',
  MoodboardComment: 'MoodboardComment',
  ParsedSpecItem: 'ParsedSpecItem',
  Snag: 'Snag',
  Document: 'Document',
  FormTemplate: 'FormTemplate',
  FormSubmission: 'FormSubmission',
  HandoverPack: 'HandoverPack',
  Guide: 'Guide',
  EmailJourney: 'EmailJourney',
  EmailSequenceStep: 'EmailSequenceStep',
  Webhook: 'Webhook',
  WebhookDelivery: 'WebhookDelivery',
  EventLog: 'EventLog',
  Integration: 'Integration',
  MergeQueue: 'MergeQueue'
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
