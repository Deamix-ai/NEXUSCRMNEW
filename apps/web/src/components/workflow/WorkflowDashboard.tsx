'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  BarChart3,
  Plus,
  Search,
  Eye,
  Settings,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useWorkflowDefinitions,
  useWorkflowInstances,
  useWorkflowStats,
  useCreateWorkflowDefinition,
  usePauseWorkflowInstance,
  useResumeWorkflowInstance,
  useCancelWorkflowInstance,
} from '@/hooks/api-hooks';

interface WorkflowInstance {
  id: string;
  workflow: {
    id: string;
    name: string;
  };
  entityType: string;
  entityId: string;
  status: 'PENDING' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startedAt: string;
  completedAt?: string;
  currentStepId?: string;
  initiatedBy: {
    firstName: string;
    lastName: string;
  };
  executions: Array<{
    id: string;
    step: {
      name: string;
      stepType: string;
    };
    status: string;
    startedAt: string;
    completedAt?: string;
  }>;
}

interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  triggerType: string;
  createdAt: string;
  _count: {
    instances: number;
  };
  steps: Array<{
    id: string;
    name: string;
    stepType: string;
    position: number;
  }>;
}

interface WorkflowStats {
  totalWorkflows: number;
  activeInstances: number;
  completedToday: number;
  pendingApprovals: number;
  avgCompletionTime: number; // in hours
  successRate: number; // percentage
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  RUNNING: 'bg-blue-100 text-blue-800 border-blue-200',
  PAUSED: 'bg-gray-100 text-gray-800 border-gray-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  FAILED: 'bg-red-100 text-red-800 border-red-200',
  CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
};

const priorityColors = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800',
};

const WorkflowDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  // React Query hooks
  const { data: workflowsData = [], isLoading: workflowsLoading } = useWorkflowDefinitions();
  const { data: instancesData = [], isLoading: instancesLoading } = useWorkflowInstances({
    status: statusFilter || undefined,
  });
  const { data: statsData } = useWorkflowStats();
  
  // Type-safe data with fallbacks
  const workflows = (workflowsData as WorkflowDefinition[]) || [];
  const instances = (instancesData as WorkflowInstance[]) || [];
  const stats: WorkflowStats = (statsData as WorkflowStats) || {
    totalWorkflows: 0,
    activeInstances: 0,
    completedToday: 0,
    pendingApprovals: 0,
    avgCompletionTime: 0,
    successRate: 0,
  };
  
  // Mutations
  const createWorkflowDefinition = useCreateWorkflowDefinition();
  const pauseInstance = usePauseWorkflowInstance();
  const resumeInstance = useResumeWorkflowInstance();
  const cancelInstance = useCancelWorkflowInstance();

  const filteredInstances = instances.filter(instance => {
    const matchesSearch = searchTerm === '' || 
      instance.workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.entityId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || instance.status === statusFilter;
    const matchesPriority = priorityFilter === '' || instance.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'RUNNING':
        return <Activity className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'FAILED':
        return <AlertCircle className="h-4 w-4" />;
      case 'PAUSED':
        return <Pause className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflow Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your automated business processes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              Active definitions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Instances</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeInstances}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'instances', 'definitions', 'approvals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-2 px-1 border-b-2 font-medium text-sm capitalize",
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                {tab.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {instances.slice(0, 5).map((instance) => (
                    <div key={instance.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getStatusIcon(instance.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {instance.workflow.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {instance.entityType} #{instance.entityId}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge className={statusColors[instance.status]}>
                          {instance.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Workflows */}
            <Card>
              <CardHeader>
                <CardTitle>Most Used Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows.slice(0, 5).map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{workflow.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {workflow.steps.length} steps
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{workflow._count.instances}</p>
                        <p className="text-xs text-muted-foreground">instances</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instances Tab */}
        {activeTab === 'instances' && (
          <div className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search instances..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="RUNNING">Running</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="FAILED">Failed</option>
                  </select>
                  <select 
                    value={priorityFilter} 
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Priorities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Instances List */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Instances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInstances.map((instance) => (
                    <div key={instance.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {getStatusIcon(instance.status)}
                          </div>
                          <div>
                            <h4 className="font-medium">{instance.workflow.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {instance.entityType} #{instance.entityId} • 
                              Started by {instance.initiatedBy.firstName} {instance.initiatedBy.lastName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={priorityColors[instance.priority]}>
                            {instance.priority}
                          </Badge>
                          <Badge className={statusColors[instance.status]}>
                            {instance.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          Started {formatDuration(instance.startedAt)} ago
                        </span>
                        <span>
                          {instance.executions.length} steps • 
                          {instance.executions.filter(e => e.status === 'COMPLETED').length} completed
                        </span>
                      </div>

                      {/* Progress Steps */}
                      <div className="mt-3 flex gap-2">
                        {instance.executions.map((execution, index) => (
                          <div
                            key={execution.id}
                            className={cn(
                              "flex-1 h-2 rounded-full",
                              execution.status === 'COMPLETED' 
                                ? "bg-green-500" 
                                : execution.status === 'RUNNING'
                                ? "bg-blue-500"
                                : execution.status === 'FAILED'
                                ? "bg-red-500"
                                : "bg-gray-200"
                            )}
                            title={`${execution.step.name} - ${execution.status}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}

                  {filteredInstances.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No workflow instances found matching your criteria.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Definitions Tab */}
        {activeTab === 'definitions' && (
          <Card>
            <CardHeader>
              <CardTitle>Workflow Definitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{workflow.name}</h4>
                          <Badge variant={workflow.isActive ? "default" : "secondary"}>
                            {workflow.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">
                            {workflow.triggerType}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {workflow.description}
                        </p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{workflow.steps.length} steps</span>
                          <span>{workflow._count.instances} instances</span>
                          <span>Created {new Date(workflow.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Run
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p>No pending approvals at this time.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default WorkflowDashboard;