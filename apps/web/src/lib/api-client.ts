
// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
    };

    // Only set Content-Type header if not dealing with FormData
    if (!(options.body instanceof FormData)) {
      config.headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
    } else {
      config.headers = {
        ...options.headers,
      };
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  // Dashboard
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Authentication
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: { email: string; password: string; firstName: string; lastName: string; companyName?: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  // Leads
  async getLeads(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    source?: string;
    priority?: string;
    accountId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.source) searchParams.set('source', params.source);
    if (params?.priority) searchParams.set('priority', params.priority);
    if (params?.accountId) searchParams.set('accountId', params.accountId);
    
    const query = searchParams.toString();
    return this.request(`/leads${query ? `?${query}` : ''}`);
  }

  async getLeadStats() {
    return this.request('/leads/stats');
  }

  async createLead(data: any) {
    return this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLead(id: string, data: any) {
    return this.request(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteLead(id: string) {
    return this.request(`/leads/${id}`, {
      method: 'DELETE',
    });
  }

  async getLeadById(id: string) {
    return this.request(`/leads/${id}`);
  }

  async convertLeadToProject(leadId: string, data: any) {
    return this.request(`/leads/${leadId}/convert`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Enquiries
  async getEnquiries(params?: {
    page?: number;
    limit?: number;
    search?: string;
    accountId?: string;
    status?: string;
    priority?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.accountId) searchParams.set('accountId', params.accountId);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.priority) searchParams.set('priority', params.priority);

    const query = searchParams.toString();
    return this.request(`/enquiries${query ? `?${query}` : ''}`);
  }

  async getEnquiryById(id: string) {
    return this.request(`/enquiries/${id}`);
  }

  async createEnquiry(data: any) {
    return this.request('/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEnquiry(id: string, data: any) {
    return this.request(`/enquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteEnquiry(id: string) {
    return this.request(`/enquiries/${id}`, {
      method: 'DELETE',
    });
  }

  async convertEnquiryToLead(enquiryId: string, data?: any) {
    return this.request(`/enquiries/${enquiryId}/convert-to-lead`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  // Projects
  async getProjects(params?: {
    page?: number;
    limit?: number;
    search?: string;
    stageId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.stageId) searchParams.set('stageId', params.stageId);

    const query = searchParams.toString();
    return this.request(`/projects${query ? `?${query}` : ''}`);
  }

  async getProjectById(id: string) {
    return this.request(`/projects/${id}`);
  }

  async getProjectStats() {
    return this.request('/projects/stats');
  }

  async createProject(data: any) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: any) {
    return this.request(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async convertProjectToJob(projectId: string, data: any) {
    return this.request(`/projects/${projectId}/convert`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Accounts
  async getAccounts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    return this.request(`/accounts${query ? `?${query}` : ''}`);
  }

  async getAccountStats() {
    return this.request('/accounts/stats');
  }

  async getAccountById(id: string) {
    return this.request(`/accounts/${id}`);
  }

  async createAccount(data: any) {
    return this.request('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAccount(id: string, data: any) {
    return this.request(`/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(id: string) {
    return this.request(`/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Rooms (mapped from projects)
  async getRooms(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.type) searchParams.set('type', params.type);
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    return this.request(`/rooms${query ? `?${query}` : ''}`);
  }

  async getRoomById(id: string) {
    return this.request(`/rooms/${id}`);
  }

  // Jobs/Projects
  async getJobs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    return this.request(`/jobs${query ? `?${query}` : ''}`);
  }

  async getJobById(id: string) {
    return this.request(`/jobs/${id}`);
  }

  async getJobStats() {
    return this.request('/jobs/stats');
  }

  async createJob(data: any) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJob(id: string, data: any) {
    return this.request(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteJob(id: string) {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // Activities
  async getActivities(params?: {
    page?: number;
    limit?: number;
    accountId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.accountId) searchParams.set('accountId', params.accountId);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);
    
    const query = searchParams.toString();
    return this.request(`/activities${query ? `?${query}` : ''}`);
  }

  async getActivityById(id: string) {
    return this.request(`/activities/${id}`);
  }

  async createActivity(data: any) {
    return this.request('/activities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateActivity(id: string, data: any) {
    return this.request(`/activities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteActivity(id: string) {
    return this.request(`/activities/${id}`, {
      method: 'DELETE',
    });
  }

  async getAccountActivities(accountId: string, params?: {
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return this.request(`/accounts/${accountId}/activities${query ? `?${query}` : ''}`);
  }

  // Documents
  async getDocuments(params?: {
    page?: number;
    limit?: number;
    accountId?: string;
    roomId?: string;
    category?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.accountId) searchParams.set('accountId', params.accountId);
    if (params?.roomId) searchParams.set('roomId', params.roomId);
    if (params?.category) searchParams.set('category', params.category);
    
    const query = searchParams.toString();
    return this.request(`/documents${query ? `?${query}` : ''}`);
  }

  async getDocumentById(id: string) {
    return this.request(`/documents/${id}`);
  }

  async uploadDocument(data: FormData) {
    return this.request('/documents', {
      method: 'POST',
      body: data,
    });
  }

  async updateDocument(id: string, data: any) {
    return this.request(`/documents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteDocument(id: string) {
    return this.request(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  async getAccountDocuments(accountId: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.category) searchParams.set('category', params.category);
    
    const query = searchParams.toString();
    return this.request(`/accounts/${accountId}/documents${query ? `?${query}` : ''}`);
  }

  async getRoomDocuments(roomId: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.category) searchParams.set('category', params.category);
    
    const query = searchParams.toString();
    return this.request(`/rooms/${roomId}/documents${query ? `?${query}` : ''}`);
  }

  // Surveys/Appointments  
  async getSurveys(params?: {
    page?: number;
    limit?: number;
    accountId?: string;
    roomId?: string;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.accountId) searchParams.set('accountId', params.accountId);
    if (params?.roomId) searchParams.set('roomId', params.roomId);
    if (params?.status) searchParams.set('status', params.status);
    
    const query = searchParams.toString();
    return this.request(`/surveys${query ? `?${query}` : ''}`);
  }

  async getSurveyById(id: string) {
    return this.request(`/surveys/${id}`);
  }

  async createSurvey(data: any) {
    return this.request('/surveys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSurvey(id: string, data: any) {
    return this.request(`/surveys/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteSurvey(id: string) {
    return this.request(`/surveys/${id}`, {
      method: 'DELETE',
    });
  }

  async getAccountSurveys(accountId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    
    const query = searchParams.toString();
    return this.request(`/accounts/${accountId}/surveys${query ? `?${query}` : ''}`);
  }

  async getRoomSurveys(roomId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    
    const query = searchParams.toString();
    return this.request(`/rooms/${roomId}/surveys${query ? `?${query}` : ''}`);
  }

  // Workflows
  async getWorkflowDefinitions(params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.isActive !== undefined) searchParams.set('isActive', params.isActive.toString());
    
    const query = searchParams.toString();
    return this.request(`/workflows/definitions${query ? `?${query}` : ''}`);
  }

  async getWorkflowDefinitionById(id: string) {
    return this.request(`/workflows/definitions/${id}`);
  }

  async createWorkflowDefinition(data: any) {
    return this.request('/workflows/definitions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWorkflowDefinition(id: string, data: any) {
    return this.request(`/workflows/definitions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteWorkflowDefinition(id: string) {
    return this.request(`/workflows/definitions/${id}`, {
      method: 'DELETE',
    });
  }

  // Workflow Instances
  async getWorkflowInstances(params?: {
    page?: number;
    limit?: number;
    status?: string;
    workflowId?: string;
    entityType?: string;
    entityId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.workflowId) searchParams.set('workflowId', params.workflowId);
    if (params?.entityType) searchParams.set('entityType', params.entityType);
    if (params?.entityId) searchParams.set('entityId', params.entityId);
    
    const query = searchParams.toString();
    return this.request(`/workflows/instances${query ? `?${query}` : ''}`);
  }

  async getWorkflowInstanceById(id: string) {
    return this.request(`/workflows/instances/${id}`);
  }

  async startWorkflowInstance(data: {
    workflowId: string;
    entityType: string;
    entityId: string;
    priority?: string;
    metadata?: any;
  }) {
    return this.request('/workflows/instances/start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async executeWorkflowStep(instanceId: string, stepId: string, data?: any) {
    return this.request(`/workflows/instances/${instanceId}/steps/${stepId}/execute`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  async pauseWorkflowInstance(instanceId: string) {
    return this.request(`/workflows/instances/${instanceId}/pause`, {
      method: 'POST',
    });
  }

  async resumeWorkflowInstance(instanceId: string) {
    return this.request(`/workflows/instances/${instanceId}/resume`, {
      method: 'POST',
    });
  }

  async cancelWorkflowInstance(instanceId: string, reason?: string) {
    return this.request(`/workflows/instances/${instanceId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Workflow Approvals
  async getWorkflowApprovals(params?: {
    page?: number;
    limit?: number;
    status?: string;
    approverId?: string;
    instanceId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.approverId) searchParams.set('approverId', params.approverId);
    if (params?.instanceId) searchParams.set('instanceId', params.instanceId);
    
    const query = searchParams.toString();
    return this.request(`/workflows/approvals${query ? `?${query}` : ''}`);
  }

  async approveWorkflow(approvalId: string, data: { comments?: string }) {
    return this.request(`/workflows/approvals/${approvalId}/approve`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async rejectWorkflow(approvalId: string, data: { comments?: string; reason?: string }) {
    return this.request(`/workflows/approvals/${approvalId}/reject`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Workflow Stats
  async getWorkflowStats() {
    return this.request('/workflows/stats');
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Convenience exports
export const dashboardApi = {
  getStats: () => apiClient.getDashboardStats(),
};

export const authApi = {
  login: (credentials: { email: string; password: string }) => apiClient.login(credentials),
  register: (data: { email: string; password: string; firstName: string; lastName: string; companyName?: string }) => apiClient.register(data),
  logout: () => apiClient.logout(),
  getCurrentUser: () => apiClient.getCurrentUser(),
  refreshToken: () => apiClient.refreshToken(),
};

export const leadsApi = {
  getAll: (params?: Parameters<typeof apiClient.getLeads>[0]) => 
    apiClient.getLeads(params),
  getById: (id: string) => apiClient.getLeadById(id),
  getStats: () => apiClient.getLeadStats(),
  create: (data: any) => apiClient.createLead(data),
  update: (id: string, data: any) => apiClient.updateLead(id, data),
  delete: (id: string) => apiClient.deleteLead(id),
  convertToProject: (leadId: string, data: any) => apiClient.convertLeadToProject(leadId, data),
};

export const enquiriesApi = {
  getAll: (params?: Parameters<typeof apiClient.getEnquiries>[0]) => 
    apiClient.getEnquiries(params),
  getById: (id: string) => apiClient.getEnquiryById(id),
  create: (data: any) => apiClient.createEnquiry(data),
  update: (id: string, data: any) => apiClient.updateEnquiry(id, data),
  delete: (id: string) => apiClient.deleteEnquiry(id),
  convertToLead: (enquiryId: string, data?: any) => apiClient.convertEnquiryToLead(enquiryId, data),
};

// Projects API (consolidated from Jobs API for consistent terminology)
export const projectsApi = {
  getAll: (params?: Parameters<typeof apiClient.getProjects>[0]) => 
    apiClient.getProjects(params),
  getById: (id: string) => apiClient.getProjectById(id),
  getStats: () => apiClient.getProjectStats(),
  create: (data: any) => apiClient.createProject(data),
  update: (id: string, data: any) => apiClient.updateProject(id, data),
  delete: (id: string) => apiClient.deleteProject(id),
  convertToJob: (projectId: string, data: any) => apiClient.convertProjectToJob(projectId, data),
};

export const accountsApi = {
  getAll: (params?: Parameters<typeof apiClient.getAccounts>[0]) => 
    apiClient.getAccounts(params),
  getById: (id: string) => apiClient.getAccountById(id),
  getStats: () => apiClient.getAccountStats(),
  create: (data: any) => apiClient.createAccount(data),
  update: (id: string, data: any) => apiClient.updateAccount(id, data),
  delete: (id: string) => apiClient.deleteAccount(id),
};

export const roomsApi = {
  getAll: (params?: Parameters<typeof apiClient.getRooms>[0]) => 
    apiClient.getRooms(params),
  getById: (id: string) => apiClient.getRoomById(id),
};

export const activitiesApi = {
  getAll: (params?: Parameters<typeof apiClient.getActivities>[0]) => 
    apiClient.getActivities(params),
  getById: (id: string) => apiClient.getActivityById(id),
  create: (data: any) => apiClient.createActivity(data),
  update: (id: string, data: any) => apiClient.updateActivity(id, data),
  delete: (id: string) => apiClient.deleteActivity(id),
  getByClient: (accountId: string, params?: Parameters<typeof apiClient.getAccountActivities>[1]) => 
    apiClient.getAccountActivities(accountId, params),
};

export const documentsApi = {
  getAll: (params?: Parameters<typeof apiClient.getDocuments>[0]) => 
    apiClient.getDocuments(params),
  getById: (id: string) => apiClient.getDocumentById(id),
  upload: (data: FormData) => apiClient.uploadDocument(data),
  update: (id: string, data: any) => apiClient.updateDocument(id, data),
  delete: (id: string) => apiClient.deleteDocument(id),
  getByClient: (accountId: string, params?: Parameters<typeof apiClient.getAccountDocuments>[1]) => 
    apiClient.getAccountDocuments(accountId, params),
  getByRoom: (roomId: string, params?: Parameters<typeof apiClient.getRoomDocuments>[1]) => 
    apiClient.getRoomDocuments(roomId, params),
};

export const surveysApi = {
  getAll: (params?: Parameters<typeof apiClient.getSurveys>[0]) => 
    apiClient.getSurveys(params),
  getById: (id: string) => apiClient.getSurveyById(id),
  create: (data: any) => apiClient.createSurvey(data),
  update: (id: string, data: any) => apiClient.updateSurvey(id, data),
  delete: (id: string) => apiClient.deleteSurvey(id),
  getByClient: (accountId: string, params?: Parameters<typeof apiClient.getAccountSurveys>[1]) => 
    apiClient.getAccountSurveys(accountId, params),
  getByRoom: (roomId: string, params?: Parameters<typeof apiClient.getRoomSurveys>[1]) => 
    apiClient.getRoomSurveys(roomId, params),
};

export const workflowsApi = {
  // Definitions
  getDefinitions: (params?: Parameters<typeof apiClient.getWorkflowDefinitions>[0]) => 
    apiClient.getWorkflowDefinitions(params),
  getDefinitionById: (id: string) => apiClient.getWorkflowDefinitionById(id),
  createDefinition: (data: any) => apiClient.createWorkflowDefinition(data),
  updateDefinition: (id: string, data: any) => apiClient.updateWorkflowDefinition(id, data),
  deleteDefinition: (id: string) => apiClient.deleteWorkflowDefinition(id),
  
  // Instances
  getInstances: (params?: Parameters<typeof apiClient.getWorkflowInstances>[0]) => 
    apiClient.getWorkflowInstances(params),
  getInstanceById: (id: string) => apiClient.getWorkflowInstanceById(id),
  startInstance: (data: Parameters<typeof apiClient.startWorkflowInstance>[0]) => 
    apiClient.startWorkflowInstance(data),
  executeStep: (instanceId: string, stepId: string, data?: any) => 
    apiClient.executeWorkflowStep(instanceId, stepId, data),
  pauseInstance: (instanceId: string) => apiClient.pauseWorkflowInstance(instanceId),
  resumeInstance: (instanceId: string) => apiClient.resumeWorkflowInstance(instanceId),
  cancelInstance: (instanceId: string, reason?: string) => 
    apiClient.cancelWorkflowInstance(instanceId, reason),
  
  // Approvals
  getApprovals: (params?: Parameters<typeof apiClient.getWorkflowApprovals>[0]) => 
    apiClient.getWorkflowApprovals(params),
  approve: (approvalId: string, data: { comments?: string }) => 
    apiClient.approveWorkflow(approvalId, data),
  reject: (approvalId: string, data: { comments?: string; reason?: string }) => 
    apiClient.rejectWorkflow(approvalId, data),
  
  // Stats
  getStats: () => apiClient.getWorkflowStats(),
};

// Add QA methods to the main API client
Object.assign(apiClient, {
  // Test Plans
  async createTestPlan(data: any) {
    return this.request('/qa/test-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getTestPlans(params?: {
    page?: number;
    limit?: number;
    status?: string;
    projectId?: string;
  }) {
    const query = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    return this.request(`/qa/test-plans${query ? `?${query}` : ''}`);
  },

  async getTestPlan(id: string) {
    return this.request(`/qa/test-plans/${id}`);
  },

  async updateTestPlan(id: string, data: any) {
    return this.request(`/qa/test-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteTestPlan(id: string) {
    return this.request(`/qa/test-plans/${id}`, {
      method: 'DELETE',
    });
  },

  async getTestPlanCoverage(id: string) {
    return this.request(`/qa/test-plans/${id}/coverage`);
  },

  // Test Cases
  async createTestCase(data: any) {
    return this.request('/qa/test-cases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getTestCases(params?: {
    page?: number;
    limit?: number;
    testPlanId?: string;
    priority?: string;
    status?: string;
  }) {
    const query = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    return this.request(`/qa/test-cases${query ? `?${query}` : ''}`);
  },

  async updateTestCase(id: string, data: any) {
    return this.request(`/qa/test-cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Test Executions
  async createTestExecution(data: any) {
    return this.request('/qa/test-executions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getTestExecutions(params?: {
    page?: number;
    limit?: number;
    testCaseId?: string;
    testPlanId?: string;
    executedBy?: string;
    status?: string;
  }) {
    const query = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    return this.request(`/qa/test-executions${query ? `?${query}` : ''}`);
  },

  async updateTestExecution(id: string, data: any) {
    return this.request(`/qa/test-executions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Defects
  async createDefect(data: any) {
    return this.request('/qa/defects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getDefects(params?: {
    page?: number;
    limit?: number;
    priority?: string;
    severity?: string;
    status?: string;
    assignedTo?: string;
    reportedBy?: string;
  }) {
    const query = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    return this.request(`/qa/defects${query ? `?${query}` : ''}`);
  },

  async getDefect(id: string) {
    return this.request(`/qa/defects/${id}`);
  },

  async updateDefect(id: string, data: any) {
    return this.request(`/qa/defects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async addDefectComment(id: string, data: { comment: string }) {
    return this.request(`/qa/defects/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Reviews
  async createReview(data: any) {
    return this.request('/qa/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateReview(id: string, data: any) {
    return this.request(`/qa/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Metrics
  async getQAMetrics() {
    return this.request('/qa/metrics');
  },
});

// Convenience exports for QA
export const qa = {
  // Test Plans
  createTestPlan: (data: any) => (apiClient as any).createTestPlan(data),
  getTestPlans: (params?: any) => (apiClient as any).getTestPlans(params),
  getTestPlan: (id: string) => (apiClient as any).getTestPlan(id),
  updateTestPlan: (id: string, data: any) => (apiClient as any).updateTestPlan(id, data),
  deleteTestPlan: (id: string) => (apiClient as any).deleteTestPlan(id),
  getTestPlanCoverage: (id: string) => (apiClient as any).getTestPlanCoverage(id),
  
  // Test Cases
  createTestCase: (data: any) => (apiClient as any).createTestCase(data),
  getTestCases: (params?: any) => (apiClient as any).getTestCases(params),
  updateTestCase: (id: string, data: any) => (apiClient as any).updateTestCase(id, data),
  
  // Test Executions
  createTestExecution: (data: any) => (apiClient as any).createTestExecution(data),
  getTestExecutions: (params?: any) => (apiClient as any).getTestExecutions(params),
  updateTestExecution: (id: string, data: any) => (apiClient as any).updateTestExecution(id, data),
  
  // Defects
  createDefect: (data: any) => (apiClient as any).createDefect(data),
  getDefects: (params?: any) => (apiClient as any).getDefects(params),
  getDefect: (id: string) => (apiClient as any).getDefect(id),
  updateDefect: (id: string, data: any) => (apiClient as any).updateDefect(id, data),
  addDefectComment: (id: string, data: { comment: string }) => 
    (apiClient as any).addDefectComment(id, data),
  
  // Reviews
  createReview: (data: any) => (apiClient as any).createReview(data),
  updateReview: (id: string, data: any) => (apiClient as any).updateReview(id, data),
  
  // Metrics
  getMetrics: () => (apiClient as any).getQAMetrics(),
};

// Add analytics/reports methods to the main API client  
Object.assign(apiClient, {
  // Analytics & Reports
  async refreshAnalytics() {
    return this.request('/analytics/refresh', {
      method: 'POST',
    });
  },

  async saveReport(data: any) {
    return this.request('/analytics/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async runReport(reportId: string, params?: any) {
    return this.request(`/analytics/reports/${reportId}/run`, {
      method: 'POST',
      body: JSON.stringify(params || {}),
    });
  },

  async deleteReport(reportId: string) {
    return this.request(`/analytics/reports/${reportId}`, {
      method: 'DELETE',
    });
  },

  async duplicateReport(reportId: string) {
    return this.request(`/analytics/reports/${reportId}/duplicate`, {
      method: 'POST',
    });
  },

  async getReports(params?: any) {
    const query = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    return this.request(`/analytics/reports${query ? `?${query}` : ''}`);
  },
});

// Convenience exports for Analytics & Reports
export const analytics = {
  refresh: () => (apiClient as any).refreshAnalytics(),
  saveReport: (data: any) => (apiClient as any).saveReport(data),
  runReport: (reportId: string, params?: any) => (apiClient as any).runReport(reportId, params),
  deleteReport: (reportId: string) => (apiClient as any).deleteReport(reportId),
  duplicateReport: (reportId: string) => (apiClient as any).duplicateReport(reportId),
  getReports: (params?: any) => (apiClient as any).getReports(params),
};

// Add sales/deals methods to the main API client  
Object.assign(apiClient, {
  // Sales & Deals
  async getDeals(params?: {
    page?: number;
    limit?: number;
    stage?: string;
    ownerId?: string;
    status?: string;
  }) {
    const query = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    return this.request(`/deals${query ? `?${query}` : ''}`);
  },

  async getDeal(id: string) {
    return this.request(`/deals/${id}`);
  },

  async createDeal(data: any) {
    return this.request('/deals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateDeal(id: string, data: any) {
    return this.request(`/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteDeal(id: string) {
    return this.request(`/deals/${id}`, {
      method: 'DELETE',
    });
  },

  async moveDeal(id: string, stageId: string) {
    return this.request(`/deals/${id}/move`, {
      method: 'POST',
      body: JSON.stringify({ stageId }),
    });
  },

  // Sales Stages
  async getSalesStages() {
    return this.request('/sales/stages');
  },

  async updateSalesStages(stages: any[]) {
    return this.request('/sales/stages', {
      method: 'PUT',
      body: JSON.stringify({ stages }),
    });
  },

  // Forecasting
  async getForecast(params?: {
    period?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const query = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString();
    return this.request(`/sales/forecast${query ? `?${query}` : ''}`);
  },

  async updateForecast(period: string, data: any) {
    return this.request(`/sales/forecast/${period}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async exportForecast(period: string) {
    return this.request(`/sales/forecast/${period}/export`, {
      method: 'POST',
    });
  },
});

// Convenience exports for Sales & Deals
export const sales = {
  // Deals
  getDeals: (params?: any) => (apiClient as any).getDeals(params),
  getDeal: (id: string) => (apiClient as any).getDeal(id),
  createDeal: (data: any) => (apiClient as any).createDeal(data),
  updateDeal: (id: string, data: any) => (apiClient as any).updateDeal(id, data),
  deleteDeal: (id: string) => (apiClient as any).deleteDeal(id),
  moveDeal: (id: string, stageId: string) => (apiClient as any).moveDeal(id, stageId),
  
  // Stages
  getStages: () => (apiClient as any).getSalesStages(),
  updateStages: (stages: any[]) => (apiClient as any).updateSalesStages(stages),
  
  // Forecasting
  getForecast: (params?: any) => (apiClient as any).getForecast(params),
  updateForecast: (period: string, data: any) => (apiClient as any).updateForecast(period, data),
  exportForecast: (period: string) => (apiClient as any).exportForecast(period),
};