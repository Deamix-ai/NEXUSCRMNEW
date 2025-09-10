
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

exports.Prisma.ContactScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  name: 'name',
  role: 'role',
  email: 'email',
  phone: 'phone',
  isPrimary: 'isPrimary',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RoomScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  type: 'type',
  nickname: 'nickname',
  pipelineStageId: 'pipelineStageId',
  ownerId: 'ownerId',
  budgetLow: 'budgetLow',
  budgetHigh: 'budgetHigh',
  siteAddress: 'siteAddress',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.DealScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  roomId: 'roomId',
  stageId: 'stageId',
  ownerId: 'ownerId',
  amountGrossIncVat: 'amountGrossIncVat',
  vatRate: 'vatRate',
  probability: 'probability',
  source: 'source',
  utm: 'utm',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PipelineStageScalarFieldEnum = {
  id: 'id',
  name: 'name',
  order: 'order',
  slaHours: 'slaHours'
};

exports.Prisma.ActivityScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  roomId: 'roomId',
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
  clientId: 'clientId',
  roomId: 'roomId',
  assigneeId: 'assigneeId',
  title: 'title',
  dueAt: 'dueAt',
  priority: 'priority',
  status: 'status',
  autoGenerated: 'autoGenerated',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AppointmentScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  roomId: 'roomId',
  type: 'type',
  start: 'start',
  end: 'end',
  location: 'location',
  participants: 'participants',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.DocumentScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  roomId: 'roomId',
  category: 'category',
  url: 'url',
  thumbUrl: 'thumbUrl',
  size: 'size',
  labels: 'labels',
  capturedAt: 'capturedAt',
  capturedBy: 'capturedBy',
  clientVisible: 'clientVisible',
  clientWatermark: 'clientWatermark',
  createdAt: 'createdAt'
};

exports.Prisma.DesignVersionScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  roomId: 'roomId',
  version: 'version',
  notes: 'notes',
  assets: 'assets',
  finalApproved: 'finalApproved',
  createdAt: 'createdAt'
};

exports.Prisma.ParsedSpecItemScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  roomId: 'roomId',
  specVersion: 'specVersion',
  lineNo: 'lineNo',
  brand: 'brand',
  description: 'description',
  finish: 'finish',
  qty: 'qty',
  unitPrice: 'unitPrice',
  totalPrice: 'totalPrice',
  status: 'status',
  note: 'note',
  isCritical: 'isCritical',
  createdAt: 'createdAt'
};

exports.Prisma.SnagScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  roomId: 'roomId',
  title: 'title',
  description: 'description',
  status: 'status',
  assigneeId: 'assigneeId',
  dueAt: 'dueAt',
  clientVisible: 'clientVisible',
  photos: 'photos',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.JobScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  roomId: 'roomId',
  title: 'title',
  description: 'description',
  status: 'status',
  startDate: 'startDate',
  endDate: 'endDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FormSubmissionScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  roomId: 'roomId',
  formType: 'formType',
  data: 'data',
  submittedAt: 'submittedAt'
};

exports.Prisma.EventLogScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  roomId: 'roomId',
  actorId: 'actorId',
  entity: 'entity',
  entityId: 'entityId',
  action: 'action',
  before: 'before',
  after: 'after',
  createdAt: 'createdAt'
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

exports.ClientStatus = exports.$Enums.ClientStatus = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED'
};

exports.RoomType = exports.$Enums.RoomType = {
  KITCHEN: 'KITCHEN',
  BATHROOM: 'BATHROOM',
  CLOAKROOM: 'CLOAKROOM',
  OTHER: 'OTHER'
};

exports.RoomStatus = exports.$Enums.RoomStatus = {
  ACTIVE: 'ACTIVE',
  WON: 'WON',
  LOST: 'LOST',
  ONHOLD: 'ONHOLD',
  COMPLETED: 'COMPLETED'
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
  DONE: 'DONE',
  CANCELLED: 'CANCELLED'
};

exports.AppointmentType = exports.$Enums.AppointmentType = {
  CONSULT: 'CONSULT',
  SURVEY: 'SURVEY',
  PRESENTATION: 'PRESENTATION',
  INSTALL: 'INSTALL',
  AFTERCARE: 'AFTERCARE'
};

exports.DocCategory = exports.$Enums.DocCategory = {
  DRAWING: 'DRAWING',
  SURVEY_PACK: 'SURVEY_PACK',
  PRODUCT_LIST: 'PRODUCT_LIST',
  CONTRACT: 'CONTRACT',
  PHOTO: 'PHOTO',
  CERTIFICATE: 'CERTIFICATE',
  RENDER: 'RENDER',
  OTHER: 'OTHER'
};

exports.SpecStatus = exports.$Enums.SpecStatus = {
  PENDING: 'PENDING',
  ORDERED: 'ORDERED',
  DELIVERED: 'DELIVERED',
  ONSITE: 'ONSITE'
};

exports.SnagStatus = exports.$Enums.SnagStatus = {
  OPEN: 'OPEN',
  RESOLVED: 'RESOLVED'
};

exports.JobStatus = exports.$Enums.JobStatus = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
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

exports.Priority = exports.$Enums.Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

exports.Prisma.ModelName = {
  User: 'User',
  Client: 'Client',
  Contact: 'Contact',
  Room: 'Room',
  Deal: 'Deal',
  PipelineStage: 'PipelineStage',
  Activity: 'Activity',
  Task: 'Task',
  Appointment: 'Appointment',
  Document: 'Document',
  DesignVersion: 'DesignVersion',
  ParsedSpecItem: 'ParsedSpecItem',
  Snag: 'Snag',
  Job: 'Job',
  FormSubmission: 'FormSubmission',
  EventLog: 'EventLog',
  Lead: 'Lead'
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
