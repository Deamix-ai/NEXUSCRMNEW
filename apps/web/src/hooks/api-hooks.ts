import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  accountsApi, 
  activitiesApi, 
  authApi, 
  dashboardApi, 
  documentsApi, 
  enquiriesApi, 
  leadsApi, 
  projectsApi, 
  roomsApi, 
  surveysApi,
  workflowsApi,
  qa,
  analytics,
  sales,
} from '../lib/api-client';
import { toast } from 'react-hot-toast';

// Query Keys
export const queryKeys = {
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
  },
  auth: {
    me: ['auth', 'me'] as const,
  },
  accounts: {
    all: (params?: any) => ['accounts', 'list', params] as const,
    byId: (id: string) => ['accounts', 'detail', id] as const,
    stats: ['accounts', 'stats'] as const,
  },
  enquiries: {
    all: (params?: any) => ['enquiries', 'list', params] as const,
    byId: (id: string) => ['enquiries', 'detail', id] as const,
  },
  leads: {
    all: (params?: any) => ['leads', 'list', params] as const,
    byId: (id: string) => ['leads', 'detail', id] as const,
    stats: ['leads', 'stats'] as const,
  },
  projects: {
    all: (params?: any) => ['projects', 'list', params] as const,
    byId: (id: string) => ['projects', 'detail', id] as const,
    stats: ['projects', 'stats'] as const,
  },
  activities: {
    all: (params?: any) => ['activities', 'list', params] as const,
    byId: (id: string) => ['activities', 'detail', id] as const,
    byAccount: (accountId: string, params?: any) => ['activities', 'account', accountId, params] as const,
  },
  documents: {
    all: (params?: any) => ['documents', 'list', params] as const,
    byId: (id: string) => ['documents', 'detail', id] as const,
    byAccount: (accountId: string, params?: any) => ['documents', 'account', accountId, params] as const,
    byRoom: (roomId: string, params?: any) => ['documents', 'room', roomId, params] as const,
  },
  rooms: {
    all: (params?: any) => ['rooms', 'list', params] as const,
    byId: (id: string) => ['rooms', 'detail', id] as const,
  },
  surveys: {
    all: (params?: any) => ['surveys', 'list', params] as const,
    byId: (id: string) => ['surveys', 'detail', id] as const,
    byAccount: (accountId: string, params?: any) => ['surveys', 'account', accountId, params] as const,
    byRoom: (roomId: string, params?: any) => ['surveys', 'room', roomId, params] as const,
  },
  qa: {
    testPlans: (params?: any) => ['qa', 'testPlans', params] as const,
    testPlan: (id: string) => ['qa', 'testPlan', id] as const,
    testPlanCoverage: (id: string) => ['qa', 'testPlanCoverage', id] as const,
    testCases: (params?: any) => ['qa', 'testCases', params] as const,
    testExecutions: (params?: any) => ['qa', 'testExecutions', params] as const,
    defects: (params?: any) => ['qa', 'defects', params] as const,
    defect: (id: string) => ['qa', 'defect', id] as const,
    metrics: ['qa', 'metrics'] as const,
  },
  analytics: {
    reports: (params?: any) => ['analytics', 'reports', params] as const,
    report: (id: string) => ['analytics', 'report', id] as const,
  },
  sales: {
    deals: (params?: any) => ['sales', 'deals', params] as const,
    deal: (id: string) => ['sales', 'deal', id] as const,
    stages: ['sales', 'stages'] as const,
    forecast: (params?: any) => ['sales', 'forecast', params] as const,
  },
};

// Dashboard Hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: dashboardApi.getStats,
  });
};

// Authentication Hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.getCurrentUser,
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      toast.success('Login successful');
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Registration successful');
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Registration failed');
    },
  });
};

// Workflow hooks
export const useWorkflowDefinitions = (params?: Parameters<typeof workflowsApi.getDefinitions>[0]) => {
  return useQuery({
    queryKey: ['workflows', 'definitions', params],
    queryFn: () => workflowsApi.getDefinitions(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useWorkflowDefinitionById = (id: string) => {
  return useQuery({
    queryKey: ['workflows', 'definitions', id],
    queryFn: () => workflowsApi.getDefinitionById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateWorkflowDefinition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workflowsApi.createDefinition,
    onSuccess: () => {
      toast.success('Workflow definition created successfully');
      queryClient.invalidateQueries({ queryKey: ['workflows', 'definitions'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create workflow definition');
    },
  });
};

export const useUpdateWorkflowDefinition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => workflowsApi.updateDefinition(id, data),
    onSuccess: (_, variables) => {
      toast.success('Workflow definition updated successfully');
      queryClient.invalidateQueries({ queryKey: ['workflows', 'definitions'] });
      queryClient.invalidateQueries({ queryKey: ['workflows', 'definitions', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update workflow definition');
    },
  });
};

export const useDeleteWorkflowDefinition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workflowsApi.deleteDefinition,
    onSuccess: () => {
      toast.success('Workflow definition deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['workflows', 'definitions'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete workflow definition');
    },
  });
};

export const useWorkflowInstances = (params?: Parameters<typeof workflowsApi.getInstances>[0]) => {
  return useQuery({
    queryKey: ['workflows', 'instances', params],
    queryFn: () => workflowsApi.getInstances(params),
    staleTime: 30 * 1000, // 30 seconds for real-time updates
  });
};

export const useWorkflowInstanceById = (id: string) => {
  return useQuery({
    queryKey: ['workflows', 'instances', id],
    queryFn: () => workflowsApi.getInstanceById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};

export const useStartWorkflowInstance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workflowsApi.startInstance,
    onSuccess: () => {
      toast.success('Workflow instance started successfully');
      queryClient.invalidateQueries({ queryKey: ['workflows', 'instances'] });
      queryClient.invalidateQueries({ queryKey: ['workflows', 'stats'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to start workflow instance');
    },
  });
};

export const useExecuteWorkflowStep = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, stepId, data }: { instanceId: string; stepId: string; data?: any }) => 
      workflowsApi.executeStep(instanceId, stepId, data),
    onSuccess: (_, variables) => {
      toast.success('Workflow step executed successfully');
      queryClient.invalidateQueries({ queryKey: ['workflows', 'instances'] });
      queryClient.invalidateQueries({ queryKey: ['workflows', 'instances', variables.instanceId] });
      queryClient.invalidateQueries({ queryKey: ['workflows', 'stats'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to execute workflow step');
    },
  });
};

export const usePauseWorkflowInstance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workflowsApi.pauseInstance,
    onSuccess: () => {
      toast.success('Workflow instance paused');
      queryClient.invalidateQueries({ queryKey: ['workflows', 'instances'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to pause workflow instance');
    },
  });
};

export const useResumeWorkflowInstance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workflowsApi.resumeInstance,
    onSuccess: () => {
      toast.success('Workflow instance resumed');
      queryClient.invalidateQueries({ queryKey: ['workflows', 'instances'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to resume workflow instance');
    },
  });
};

export const useCancelWorkflowInstance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, reason }: { instanceId: string; reason?: string }) => 
      workflowsApi.cancelInstance(instanceId, reason),
    onSuccess: () => {
      toast.success('Workflow instance cancelled');
      queryClient.invalidateQueries({ queryKey: ['workflows', 'instances'] });
      queryClient.invalidateQueries({ queryKey: ['workflows', 'stats'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to cancel workflow instance');
    },
  });
};

export const useWorkflowApprovals = (params?: Parameters<typeof workflowsApi.getApprovals>[0]) => {
  return useQuery({
    queryKey: ['workflows', 'approvals', params],
    queryFn: () => workflowsApi.getApprovals(params),
    staleTime: 30 * 1000, // 30 seconds for real-time updates
  });
};

export const useApproveWorkflow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ approvalId, data }: { approvalId: string; data: { comments?: string } }) => 
      workflowsApi.approve(approvalId, data),
    onSuccess: () => {
      toast.success('Workflow approved successfully');
      queryClient.invalidateQueries({ queryKey: ['workflows', 'approvals'] });
      queryClient.invalidateQueries({ queryKey: ['workflows', 'instances'] });
      queryClient.invalidateQueries({ queryKey: ['workflows', 'stats'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to approve workflow');
    },
  });
};

export const useRejectWorkflow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ approvalId, data }: { approvalId: string; data: { comments?: string; reason?: string } }) => 
      workflowsApi.reject(approvalId, data),
    onSuccess: () => {
      toast.success('Workflow rejected');
      queryClient.invalidateQueries({ queryKey: ['workflows', 'approvals'] });
      queryClient.invalidateQueries({ queryKey: ['workflows', 'instances'] });
      queryClient.invalidateQueries({ queryKey: ['workflows', 'stats'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to reject workflow');
    },
  });
};

export const useWorkflowStats = () => {
  return useQuery({
    queryKey: ['workflows', 'stats'],
    queryFn: workflowsApi.getStats,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logout successful');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Logout failed');
    },
  });
};

// Account Hooks
export const useAccounts = (params?: Parameters<typeof accountsApi.getAll>[0]) => {
  return useQuery({
    queryKey: queryKeys.accounts.all(params),
    queryFn: () => accountsApi.getAll(params),
  });
};

export const useAccount = (id: string) => {
  return useQuery({
    queryKey: queryKeys.accounts.byId(id),
    queryFn: () => accountsApi.getById(id),
    enabled: !!id,
  });
};

export const useAccountStats = () => {
  return useQuery({
    queryKey: queryKeys.accounts.stats,
    queryFn: accountsApi.getStats,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: accountsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Account created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create account');
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => accountsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.byId(id) });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Account updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update account');
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: accountsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Account deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete account');
    },
  });
};

// Enquiry Hooks
export const useEnquiries = (params?: Parameters<typeof enquiriesApi.getAll>[0]) => {
  return useQuery({
    queryKey: queryKeys.enquiries.all(params),
    queryFn: () => enquiriesApi.getAll(params),
  });
};

export const useEnquiry = (id: string) => {
  return useQuery({
    queryKey: queryKeys.enquiries.byId(id),
    queryFn: () => enquiriesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateEnquiry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: enquiriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Enquiry created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create enquiry');
    },
  });
};

export const useUpdateEnquiry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => enquiriesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enquiries.byId(id) });
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Enquiry updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update enquiry');
    },
  });
};

export const useDeleteEnquiry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: enquiriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Enquiry deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete enquiry');
    },
  });
};

export const useConvertEnquiryToLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ enquiryId, data }: { enquiryId: string; data?: any }) => 
      enquiriesApi.convertToLead(enquiryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Enquiry converted to lead successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to convert enquiry to lead');
    },
  });
};

// Lead Hooks
export const useLeads = (params?: Parameters<typeof leadsApi.getAll>[0]) => {
  return useQuery({
    queryKey: queryKeys.leads.all(params),
    queryFn: () => leadsApi.getAll(params),
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: queryKeys.leads.byId(id),
    queryFn: () => leadsApi.getById(id),
    enabled: !!id,
  });
};

export const useLeadStats = () => {
  return useQuery({
    queryKey: queryKeys.leads.stats,
    queryFn: leadsApi.getStats,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: leadsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create lead');
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => leadsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.byId(id) });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update lead');
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: leadsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete lead');
    },
  });
};

export const useConvertLeadToProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ leadId, data }: { leadId: string; data: any }) => 
      leadsApi.convertToProject(leadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Lead converted to project successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to convert lead to project');
    },
  });
};

// Project Hooks
export const useProjects = (params?: Parameters<typeof projectsApi.getAll>[0]) => {
  return useQuery({
    queryKey: queryKeys.projects.all(params),
    queryFn: () => projectsApi.getAll(params),
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: queryKeys.projects.byId(id),
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });
};

export const useProjectStats = () => {
  return useQuery({
    queryKey: queryKeys.projects.stats,
    queryFn: projectsApi.getStats,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create project');
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => projectsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.byId(id) });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update project');
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete project');
    },
  });
};

// Activity Hooks
export const useActivities = (params?: Parameters<typeof activitiesApi.getAll>[0]) => {
  return useQuery({
    queryKey: queryKeys.activities.all(params),
    queryFn: () => activitiesApi.getAll(params),
  });
};

export const useActivity = (id: string) => {
  return useQuery({
    queryKey: queryKeys.activities.byId(id),
    queryFn: () => activitiesApi.getById(id),
    enabled: !!id,
  });
};

export const useAccountActivities = (accountId: string, params?: Parameters<typeof activitiesApi.getByClient>[1]) => {
  return useQuery({
    queryKey: queryKeys.activities.byAccount(accountId, params),
    queryFn: () => activitiesApi.getByClient(accountId, params),
    enabled: !!accountId,
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: activitiesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Activity created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create activity');
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => activitiesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.byId(id) });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Activity updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update activity');
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: activitiesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Activity deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete activity');
    },
  });
};

// Document Hooks
export const useDocuments = (params?: Parameters<typeof documentsApi.getAll>[0]) => {
  return useQuery({
    queryKey: queryKeys.documents.all(params),
    queryFn: () => documentsApi.getAll(params),
  });
};

export const useDocument = (id: string) => {
  return useQuery({
    queryKey: queryKeys.documents.byId(id),
    queryFn: () => documentsApi.getById(id),
    enabled: !!id,
  });
};

export const useAccountDocuments = (accountId: string, params?: Parameters<typeof documentsApi.getByClient>[1]) => {
  return useQuery({
    queryKey: queryKeys.documents.byAccount(accountId, params),
    queryFn: () => documentsApi.getByClient(accountId, params),
    enabled: !!accountId,
  });
};

export const useRoomDocuments = (roomId: string, params?: Parameters<typeof documentsApi.getByRoom>[1]) => {
  return useQuery({
    queryKey: queryKeys.documents.byRoom(roomId, params),
    queryFn: () => documentsApi.getByRoom(roomId, params),
    enabled: !!roomId,
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: documentsApi.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload document');
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => documentsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.byId(id) });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update document');
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: documentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete document');
    },
  });
};

// Room Hooks
export const useRooms = (params?: Parameters<typeof roomsApi.getAll>[0]) => {
  return useQuery({
    queryKey: queryKeys.rooms.all(params),
    queryFn: () => roomsApi.getAll(params),
  });
};

export const useRoom = (id: string) => {
  return useQuery({
    queryKey: queryKeys.rooms.byId(id),
    queryFn: () => roomsApi.getById(id),
    enabled: !!id,
  });
};

// Survey Hooks
export const useSurveys = (params?: Parameters<typeof surveysApi.getAll>[0]) => {
  return useQuery({
    queryKey: queryKeys.surveys.all(params),
    queryFn: () => surveysApi.getAll(params),
  });
};

export const useSurvey = (id: string) => {
  return useQuery({
    queryKey: queryKeys.surveys.byId(id),
    queryFn: () => surveysApi.getById(id),
    enabled: !!id,
  });
};

export const useAccountSurveys = (accountId: string, params?: Parameters<typeof surveysApi.getByClient>[1]) => {
  return useQuery({
    queryKey: queryKeys.surveys.byAccount(accountId, params),
    queryFn: () => surveysApi.getByClient(accountId, params),
    enabled: !!accountId,
  });
};

export const useRoomSurveys = (roomId: string, params?: Parameters<typeof surveysApi.getByRoom>[1]) => {
  return useQuery({
    queryKey: queryKeys.surveys.byRoom(roomId, params),
    queryFn: () => surveysApi.getByRoom(roomId, params),
    enabled: !!roomId,
  });
};

export const useCreateSurvey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: surveysApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast.success('Survey created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create survey');
    },
  });
};

export const useUpdateSurvey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => surveysApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.surveys.byId(id) });
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast.success('Survey updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update survey');
    },
  });
};

export const useDeleteSurvey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: surveysApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      toast.success('Survey deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete survey');
    },
  });
};

// QA Hooks

// Test Plans
export const useTestPlans = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.qa.testPlans(params),
    queryFn: () => qa.getTestPlans(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTestPlan = (id: string) => {
  return useQuery({
    queryKey: queryKeys.qa.testPlan(id),
    queryFn: () => qa.getTestPlan(id),
    enabled: !!id,
  });
};

export const useTestPlanCoverage = (id: string) => {
  return useQuery({
    queryKey: queryKeys.qa.testPlanCoverage(id),
    queryFn: () => qa.getTestPlanCoverage(id),
    enabled: !!id,
  });
};

export const useCreateTestPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: qa.createTestPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa', 'testPlans'] });
      toast.success('Test plan created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create test plan');
    },
  });
};

export const useUpdateTestPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => qa.updateTestPlan(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qa.testPlan(id) });
      queryClient.invalidateQueries({ queryKey: ['qa', 'testPlans'] });
      toast.success('Test plan updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update test plan');
    },
  });
};

export const useDeleteTestPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: qa.deleteTestPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa', 'testPlans'] });
      toast.success('Test plan deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete test plan');
    },
  });
};

// Test Cases
export const useTestCases = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.qa.testCases(params),
    queryFn: () => qa.getTestCases(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateTestCase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: qa.createTestCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa', 'testCases'] });
      toast.success('Test case created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create test case');
    },
  });
};

export const useUpdateTestCase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => qa.updateTestCase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa', 'testCases'] });
      toast.success('Test case updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update test case');
    },
  });
};

// Test Executions
export const useTestExecutions = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.qa.testExecutions(params),
    queryFn: () => qa.getTestExecutions(params),
    staleTime: 30 * 1000, // 30 seconds for real-time updates
  });
};

export const useCreateTestExecution = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: qa.createTestExecution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa', 'testExecutions'] });
      queryClient.invalidateQueries({ queryKey: ['qa', 'metrics'] });
      toast.success('Test execution created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create test execution');
    },
  });
};

export const useUpdateTestExecution = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => qa.updateTestExecution(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa', 'testExecutions'] });
      queryClient.invalidateQueries({ queryKey: ['qa', 'metrics'] });
      toast.success('Test execution updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update test execution');
    },
  });
};

// Defects
export const useDefects = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.qa.defects(params),
    queryFn: () => qa.getDefects(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDefect = (id: string) => {
  return useQuery({
    queryKey: queryKeys.qa.defect(id),
    queryFn: () => qa.getDefect(id),
    enabled: !!id,
  });
};

export const useCreateDefect = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: qa.createDefect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa', 'defects'] });
      queryClient.invalidateQueries({ queryKey: ['qa', 'metrics'] });
      toast.success('Defect created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create defect');
    },
  });
};

export const useUpdateDefect = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => qa.updateDefect(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qa.defect(id) });
      queryClient.invalidateQueries({ queryKey: ['qa', 'defects'] });
      queryClient.invalidateQueries({ queryKey: ['qa', 'metrics'] });
      toast.success('Defect updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update defect');
    },
  });
};

export const useAddDefectComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { comment: string } }) => 
      qa.addDefectComment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qa.defect(id) });
      toast.success('Comment added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add comment');
    },
  });
};

// Reviews
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: qa.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa', 'reviews'] });
      toast.success('Review created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create review');
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => qa.updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qa', 'reviews'] });
      toast.success('Review updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update review');
    },
  });
};

// Metrics
export const useQAMetrics = () => {
  return useQuery({
    queryKey: queryKeys.qa.metrics,
    queryFn: qa.getMetrics,
    staleTime: 30 * 1000, // 30 seconds for real-time dashboard
  });
};

// Analytics & Reports Hooks
export const useReports = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.analytics.reports(params),
    queryFn: () => analytics.getReports(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRefreshAnalytics = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: analytics.refresh,
    onSuccess: () => {
      // Invalidate all analytics-related queries
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Analytics data refreshed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to refresh analytics data');
    },
  });
};

export const useSaveReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: analytics.saveReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', 'reports'] });
      toast.success('Report saved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save report');
    },
  });
};

export const useRunReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ reportId, params }: { reportId: string; params?: any }) => 
      analytics.runReport(reportId, params),
    onSuccess: () => {
      toast.success('Report executed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to run report');
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: analytics.deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', 'reports'] });
      toast.success('Report deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete report');
    },
  });
};

export const useDuplicateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: analytics.duplicateReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', 'reports'] });
      toast.success('Report duplicated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to duplicate report');
    },
  });
};

// Sales & Deals Hooks

// Deals
export const useDeals = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.sales.deals(params),
    queryFn: () => sales.getDeals(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDeal = (id: string) => {
  return useQuery({
    queryKey: queryKeys.sales.deal(id),
    queryFn: () => sales.getDeal(id),
    enabled: !!id,
  });
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sales.createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales', 'deals'] });
      queryClient.invalidateQueries({ queryKey: ['sales', 'forecast'] });
      toast.success('Deal created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create deal');
    },
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => sales.updateDeal(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.deal(id) });
      queryClient.invalidateQueries({ queryKey: ['sales', 'deals'] });
      queryClient.invalidateQueries({ queryKey: ['sales', 'forecast'] });
      toast.success('Deal updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update deal');
    },
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sales.deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales', 'deals'] });
      queryClient.invalidateQueries({ queryKey: ['sales', 'forecast'] });
      toast.success('Deal deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete deal');
    },
  });
};

export const useMoveDeal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, stageId }: { id: string; stageId: string }) => 
      sales.moveDeal(id, stageId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.deal(id) });
      queryClient.invalidateQueries({ queryKey: ['sales', 'deals'] });
      queryClient.invalidateQueries({ queryKey: ['sales', 'forecast'] });
      toast.success('Deal moved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to move deal');
    },
  });
};

// Sales Stages
export const useSalesStages = () => {
  return useQuery({
    queryKey: queryKeys.sales.stages,
    queryFn: sales.getStages,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateSalesStages = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sales.updateStages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.stages });
      queryClient.invalidateQueries({ queryKey: ['sales', 'deals'] });
      toast.success('Sales stages updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update sales stages');
    },
  });
};

// Forecasting
export const useForecast = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.sales.forecast(params),
    queryFn: () => sales.getForecast(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateForecast = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ period, data }: { period: string; data: any }) => 
      sales.updateForecast(period, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales', 'forecast'] });
      toast.success('Forecast updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update forecast');
    },
  });
};

export const useExportForecast = () => {
  return useMutation({
    mutationFn: sales.exportForecast,
    onSuccess: () => {
      toast.success('Forecast exported successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to export forecast');
    },
  });
};