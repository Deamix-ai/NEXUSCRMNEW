'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  FileText,
  AlertCircle,
  MessageSquare,
  Send,
  ArrowRight,
  ArrowLeft,
  Eye,
  Download,
  Edit,
  UserCheck,
  Shield,
  Timer,
  Bell,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Filter,
  Search,
  SortAsc,
  Plus,
  X
} from 'lucide-react';

// Types for Approval Workflow
interface ApprovalStep {
  id: string;
  name: string;
  description: string;
  approverRole: string;
  approverIds: string[];
  order: number;
  isRequired: boolean;
  conditions?: {
    minimumAmount?: number;
    maximumAmount?: number;
    categories?: string[];
    requiresAllApprovers?: boolean;
  };
  timeoutDays?: number;
}

interface ApprovalAction {
  id: string;
  stepId: string;
  approverId: string;
  action: 'approved' | 'rejected' | 'pending' | 'skipped';
  comments?: string;
  timestamp: string;
  isAutomatic?: boolean;
}

interface QuoteApproval {
  id: string;
  quoteId: string;
  workflowId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';
  currentStepId?: string;
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  expiresAt?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  totalAmount: number;
  steps: ApprovalStep[];
  actions: ApprovalAction[];
  notifications: {
    emailSent: boolean;
    remindersSent: number;
    lastReminderAt?: string;
  };
}

interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  steps: ApprovalStep[];
  conditions: {
    minimumAmount?: number;
    maximumAmount?: number;
    categories?: string[];
    accountTypes?: string[];
  };
  settings: {
    autoApprovalEnabled: boolean;
    autoApprovalLimit?: number;
    reminderFrequencyDays: number;
    escalationEnabled: boolean;
    escalationDays: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
}

interface Quote {
  id: string;
  quoteNumber: string;
  title: string;
  total: number;
  accountName: string;
  contactName: string;
  status: string;
  createdAt: string;
}

interface ApprovalWorkflowProps {
  approvals: QuoteApproval[];
  workflows: ApprovalWorkflow[];
  users: User[];
  quotes: Quote[];
  currentUserId: string;
  onApprove: (approvalId: string, stepId: string, comments?: string) => void;
  onReject: (approvalId: string, stepId: string, comments: string) => void;
  onRequestApproval: (quoteId: string, workflowId: string, priority: string) => void;
  onUpdateWorkflow: (workflow: ApprovalWorkflow) => void;
  onCancelApproval: (approvalId: string, reason: string) => void;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  approvals,
  workflows,
  users,
  quotes,
  currentUserId,
  onApprove,
  onReject,
  onRequestApproval,
  onUpdateWorkflow,
  onCancelApproval
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'workflows'>('pending');
  const [selectedApproval, setSelectedApproval] = useState<QuoteApproval | null>(null);
  const [actionComments, setActionComments] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newRequestQuoteId, setNewRequestQuoteId] = useState('');
  const [newRequestWorkflowId, setNewRequestWorkflowId] = useState('');
  const [newRequestPriority, setNewRequestPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  // Filter approvals based on current tab and filters
  const filteredApprovals = approvals.filter(approval => {
    const matchesTab = activeTab === 'pending' 
      ? approval.status === 'pending'
      : approval.status !== 'pending';
    
    const matchesStatus = filterStatus === 'all' || approval.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || approval.priority === filterPriority;
    
    const quote = quotes.find(q => q.id === approval.quoteId);
    const matchesSearch = searchQuery === '' || 
      quote?.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote?.accountName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesStatus && matchesPriority && matchesSearch;
  });

  // Get pending approvals for current user
  const myPendingApprovals = approvals.filter(approval => {
    if (approval.status !== 'pending' || !approval.currentStepId) return false;
    
    const currentStep = approval.steps.find(step => step.id === approval.currentStepId);
    return currentStep?.approverIds.includes(currentUserId);
  });

  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  const getQuoteDetails = (quoteId: string) => {
    return quotes.find(q => q.id === quoteId);
  };

  const getStepStatus = (approval: QuoteApproval, step: ApprovalStep): 'pending' | 'approved' | 'rejected' | 'skipped' => {
    const stepActions = approval.actions.filter(action => action.stepId === step.id);
    
    if (stepActions.length === 0) {
      return approval.currentStepId === step.id ? 'pending' : 'pending';
    }

    if (step.conditions?.requiresAllApprovers) {
      const requiredApprovers = step.approverIds.length;
      const approvedCount = stepActions.filter(action => action.action === 'approved').length;
      const rejectedCount = stepActions.filter(action => action.action === 'rejected').length;
      
      if (rejectedCount > 0) return 'rejected';
      if (approvedCount === requiredApprovers) return 'approved';
      return 'pending';
    } else {
      const latestAction = stepActions.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
      return latestAction.action as any;
    }
  };

  const canUserActOnStep = (approval: QuoteApproval, step: ApprovalStep): boolean => {
    if (approval.status !== 'pending' || approval.currentStepId !== step.id) return false;
    return step.approverIds.includes(currentUserId);
  };

  const handleApprove = async (approval: QuoteApproval, step: ApprovalStep) => {
    if (!canUserActOnStep(approval, step)) return;
    
    onApprove(approval.id, step.id, actionComments);
    setActionComments('');
    setSelectedApproval(null);
  };

  const handleReject = async (approval: QuoteApproval, step: ApprovalStep) => {
    if (!canUserActOnStep(approval, step)) return;
    if (!actionComments.trim()) {
      alert('Comments are required when rejecting a quote.');
      return;
    }
    
    onReject(approval.id, step.id, actionComments);
    setActionComments('');
    setSelectedApproval(null);
  };

  const handleRequestApproval = () => {
    if (!newRequestQuoteId || !newRequestWorkflowId) return;
    
    onRequestApproval(newRequestQuoteId, newRequestWorkflowId, newRequestPriority);
    setShowRequestModal(false);
    setNewRequestQuoteId('');
    setNewRequestWorkflowId('');
    setNewRequestPriority('medium');
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'skipped': return <ArrowRight className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Quote Approval Workflow</h2>
              <p className="text-sm text-gray-600">
                Manage quote approvals and workflows
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {myPendingApprovals.length > 0 && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-orange-100 text-orange-800 rounded-lg">
                <Bell className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {myPendingApprovals.length} pending approval{myPendingApprovals.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              <span>Request Approval</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'pending', label: 'Pending Approvals', count: approvals.filter(a => a.status === 'pending').length },
              { id: 'history', label: 'Approval History', count: approvals.filter(a => a.status !== 'pending').length },
              { id: 'workflows', label: 'Workflow Management', count: workflows.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {(activeTab === 'pending' || activeTab === 'history') && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search quotes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Approvals List */}
            <div className="space-y-4">
              {filteredApprovals.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No approvals found</h3>
                  <p className="text-gray-600">
                    {activeTab === 'pending' 
                      ? 'There are no pending approvals at the moment.'
                      : 'No approval history matches your current filters.'
                    }
                  </p>
                </div>
              ) : (
                filteredApprovals.map((approval) => {
                  const quote = getQuoteDetails(approval.quoteId);
                  const currentStep = approval.steps.find(step => step.id === approval.currentStepId);
                  const canAct = currentStep && canUserActOnStep(approval, currentStep);

                  return (
                    <div key={approval.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {quote?.quoteNumber} - {quote?.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(approval.status)}`}>
                              {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(approval.priority)}`}>
                              {approval.priority.charAt(0).toUpperCase() + approval.priority.slice(1)} Priority
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Customer:</span> {quote?.accountName}
                            </div>
                            <div>
                              <span className="font-medium">Amount:</span> £{approval.totalAmount.toFixed(2)}
                            </div>
                            <div>
                              <span className="font-medium">Requested:</span> {new Date(approval.requestedAt).toLocaleDateString()}
                            </div>
                          </div>

                          {approval.expiresAt && (
                            <div className="mt-2 flex items-center space-x-2 text-sm">
                              <Timer className="h-4 w-4 text-orange-500" />
                              <span className="text-orange-600">
                                Expires: {new Date(approval.expiresAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedApproval(selectedApproval?.id === approval.id ? null : approval)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {canAct && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleApprove(approval, currentStep)}
                                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                              >
                                <ThumbsUp className="h-4 w-4" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => setSelectedApproval(approval)}
                                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                              >
                                <ThumbsDown className="h-4 w-4" />
                                <span>Reject</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Approval Steps Progress */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Approval Progress</h4>
                        <div className="space-y-3">
                          {approval.steps.map((step, index) => {
                            const stepStatus = getStepStatus(approval, step);
                            const isCurrentStep = approval.currentStepId === step.id;
                            const stepActions = approval.actions.filter(action => action.stepId === step.id);

                            return (
                              <div key={step.id} className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    stepStatus === 'approved' ? 'bg-green-100' :
                                    stepStatus === 'rejected' ? 'bg-red-100' :
                                    isCurrentStep ? 'bg-yellow-100' : 'bg-gray-100'
                                  }`}>
                                    {getStepStatusIcon(stepStatus)}
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {step.name}
                                  </span>
                                  {isCurrentStep && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                      Current
                                    </span>
                                  )}
                                </div>

                                <div className="flex-1 text-sm text-gray-600">
                                  Approvers: {step.approverIds.map(id => getUserName(id)).join(', ')}
                                </div>

                                {stepActions.length > 0 && (
                                  <div className="text-sm text-gray-600">
                                    {stepActions.map(action => (
                                      <div key={action.id} className="flex items-center space-x-2">
                                        <span>{getUserName(action.approverId)}</span>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                          action.action === 'approved' ? 'bg-green-100 text-green-800' :
                                          action.action === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                          {action.action}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {new Date(action.timestamp).toLocaleDateString()}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {selectedApproval?.id === approval.id && (
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <div className="space-y-4">
                            {/* Action History */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-3">Action History</h4>
                              <div className="space-y-2">
                                {approval.actions.map((action) => (
                                  <div key={action.id} className="flex items-start space-x-3 text-sm">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                                      action.action === 'approved' ? 'bg-green-500' :
                                      action.action === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`} />
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium">{getUserName(action.approverId)}</span>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                          action.action === 'approved' ? 'bg-green-100 text-green-800' :
                                          action.action === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                          {action.action}
                                        </span>
                                        <span className="text-gray-500">
                                          {new Date(action.timestamp).toLocaleString()}
                                        </span>
                                      </div>
                                      {action.comments && (
                                        <p className="mt-1 text-gray-600">{action.comments}</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action Form for Current User */}
                            {canAct && (
                              <div className="border-t border-gray-200 pt-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Your Action</h4>
                                <div className="space-y-3">
                                  <textarea
                                    value={actionComments}
                                    onChange={(e) => setActionComments(e.target.value)}
                                    placeholder="Add comments (required for rejection)..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                  />
                                  <div className="flex items-center space-x-3">
                                    <button
                                      onClick={() => handleApprove(approval, currentStep!)}
                                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      <span>Approve</span>
                                    </button>
                                    <button
                                      onClick={() => handleReject(approval, currentStep!)}
                                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                      <XCircle className="h-4 w-4" />
                                      <span>Reject</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {activeTab === 'workflows' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Approval Workflows</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Plus className="h-4 w-4" />
                <span>Create Workflow</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{workflow.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        workflow.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {workflow.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Steps:</span> {workflow.steps.length}
                    </div>
                    
                    {workflow.conditions.minimumAmount && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Min Amount:</span> £{workflow.conditions.minimumAmount.toFixed(2)}
                      </div>
                    )}

                    {workflow.conditions.maximumAmount && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Max Amount:</span> £{workflow.conditions.maximumAmount.toFixed(2)}
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Approval Steps</h5>
                      <div className="space-y-2">
                        {workflow.steps.map((step, index) => (
                          <div key={step.id} className="flex items-center space-x-3 text-sm">
                            <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </span>
                            <span className="font-medium">{step.name}</span>
                            <span className="text-gray-600">({step.approverIds.length} approver{step.approverIds.length !== 1 ? 's' : ''})</span>
                            {step.isRequired && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Required</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Request Approval Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Request Quote Approval</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quote *
                </label>
                <select
                  value={newRequestQuoteId}
                  onChange={(e) => setNewRequestQuoteId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select a quote...</option>
                  {quotes.filter(q => q.status === 'draft').map(quote => (
                    <option key={quote.id} value={quote.id}>
                      {quote.quoteNumber} - {quote.title} (£{quote.total.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow *
                </label>
                <select
                  value={newRequestWorkflowId}
                  onChange={(e) => setNewRequestWorkflowId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select a workflow...</option>
                  {workflows.filter(w => w.isActive).map(workflow => (
                    <option key={workflow.id} value={workflow.id}>
                      {workflow.name} ({workflow.steps.length} steps)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  value={newRequestPriority}
                  onChange={(e) => setNewRequestPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestApproval}
                disabled={!newRequestQuoteId || !newRequestWorkflowId}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};