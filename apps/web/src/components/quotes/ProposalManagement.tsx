'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Send,
  Eye,
  Edit,
  Copy,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  DollarSign,
  Image,
  Paperclip,
  MessageSquare,
  Star,
  BarChart3,
  Filter,
  Search,
  Plus,
  Settings,
  Upload,
  Link,
  Mail,
  Phone,
  MapPin,
  Building,
  Tag,
  AlertTriangle,
  RefreshCw,
  Archive,
  Heart,
  Share2
} from 'lucide-react';

// Types for Proposal Management
interface ProposalSection {
  id: string;
  type: 'text' | 'image' | 'table' | 'chart' | 'quote' | 'attachment';
  title: string;
  content: any;
  order: number;
  isRequired: boolean;
  settings: {
    showInPreview: boolean;
    allowCustomerEdit: boolean;
    pageBreakAfter: boolean;
  };
}

interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  sections: ProposalSection[];
  variables: Record<string, string>;
  settings: {
    branding: {
      logo?: string;
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
    };
    layout: {
      headerHeight: number;
      footerHeight: number;
      margins: {
        top: number;
        bottom: number;
        left: number;
        right: number;
      };
    };
  };
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Proposal {
  id: string;
  proposalNumber: string;
  title: string;
  description: string;
  quoteId?: string;
  accountId: string;
  contactId: string;
  ownerId: string;
  templateId: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'under_review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sections: ProposalSection[];
  totalValue: number;
  validUntil: string;
  tags: string[];
  customFields: Record<string, any>;
  tracking: {
    sentAt?: string;
    viewedAt?: string;
    lastViewedAt?: string;
    viewCount: number;
    timeSpentViewing: number;
    sectionsViewed: string[];
    acceptedAt?: string;
    rejectedAt?: string;
    feedback?: string;
  };
  collaboration: {
    comments: ProposalComment[];
    reviewers: string[];
    approvers: string[];
    isLocked: boolean;
    lockedBy?: string;
    lockedAt?: string;
  };
  version: number;
  parentProposalId?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProposalComment {
  id: string;
  sectionId?: string;
  userId: string;
  content: string;
  type: 'comment' | 'suggestion' | 'approval' | 'rejection';
  isInternal: boolean;
  isResolved: boolean;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProposalAnalytics {
  totalProposals: number;
  conversionRate: number;
  averageResponseTime: number;
  averageViewTime: number;
  topPerformingSections: Array<{
    sectionId: string;
    sectionTitle: string;
    viewRate: number;
    engagementScore: number;
  }>;
  statusBreakdown: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    sent: number;
    accepted: number;
    value: number;
  }>;
}

interface Account {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  accountId: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface ProposalManagementProps {
  proposals: Proposal[];
  templates: ProposalTemplate[];
  accounts: Account[];
  contacts: Contact[];
  users: User[];
  analytics: ProposalAnalytics;
  onCreateProposal: (proposal: Partial<Proposal>) => void;
  onUpdateProposal: (proposalId: string, updates: Partial<Proposal>) => void;
  onDeleteProposal: (proposalId: string) => void;
  onSendProposal: (proposalId: string) => void;
  onDuplicateProposal: (proposalId: string) => void;
  onAddComment: (proposalId: string, comment: Omit<ProposalComment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTemplate: (template: ProposalTemplate) => void;
}

export const ProposalManagement: React.FC<ProposalManagementProps> = ({
  proposals,
  templates,
  accounts,
  contacts,
  users,
  analytics,
  onCreateProposal,
  onUpdateProposal,
  onDeleteProposal,
  onSendProposal,
  onDuplicateProposal,
  onAddComment,
  onUpdateTemplate
}) => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'templates' | 'analytics'>('proposals');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'kanban'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProposal, setNewProposal] = useState<Partial<Proposal>>({
    title: '',
    description: '',
    accountId: '',
    contactId: '',
    templateId: '',
    priority: 'medium',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tags: []
  });

  // Filter proposals
  const filteredProposals = proposals.filter(proposal => {
    const matchesStatus = filterStatus === 'all' || proposal.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || proposal.priority === filterPriority;
    
    const account = accounts.find(a => a.id === proposal.accountId);
    const contact = contacts.find(c => c.id === proposal.contactId);
    const matchesSearch = searchQuery === '' || 
      proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.proposalNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact?.lastName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'viewed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'under_review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'viewed': return <Eye className="h-4 w-4" />;
      case 'under_review': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  const getAccountName = (accountId: string): string => {
    const account = accounts.find(a => a.id === accountId);
    return account?.name || 'Unknown Account';
  };

  const getContactName = (contactId: string): string => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact';
  };

  const handleCreateProposal = () => {
    if (!newProposal.title || !newProposal.accountId || !newProposal.templateId) {
      alert('Please fill in all required fields');
      return;
    }

    const proposal: Partial<Proposal> = {
      ...newProposal,
      proposalNumber: `P-${Date.now()}`,
      status: 'draft',
      version: 1,
      tracking: {
        viewCount: 0,
        timeSpentViewing: 0,
        sectionsViewed: []
      },
      collaboration: {
        comments: [],
        reviewers: [],
        approvers: [],
        isLocked: false
      }
    };

    onCreateProposal(proposal);
    setShowCreateModal(false);
    setNewProposal({
      title: '',
      description: '',
      accountId: '',
      contactId: '',
      templateId: '',
      priority: 'medium',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tags: []
    });
  };

  const handleAccountChange = (accountId: string) => {
    setNewProposal(prev => ({
      ...prev,
      accountId,
      contactId: '' // Reset contact when account changes
    }));
  };

  const filteredContacts = contacts.filter(contact => contact.accountId === newProposal.accountId);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Proposal Management</h2>
              <p className="text-sm text-gray-600">
                Create, manage, and track business proposals
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-gray-600 rounded-sm"></div>
                  <div className="bg-gray-600 rounded-sm"></div>
                  <div className="bg-gray-600 rounded-sm"></div>
                  <div className="bg-gray-600 rounded-sm"></div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              <span>New Proposal</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'proposals', label: 'Proposals', count: proposals.length },
              { id: 'templates', label: 'Templates', count: templates.length },
              { id: 'analytics', label: 'Analytics', count: null }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'proposals' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search proposals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="viewed">Viewed</option>
                <option value="under_review">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Proposals List/Grid */}
            {viewMode === 'list' ? (
              <div className="space-y-4">
                {filteredProposals.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
                    <p className="text-gray-600">Create your first proposal to get started.</p>
                  </div>
                ) : (
                  filteredProposals.map((proposal) => (
                    <div key={proposal.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {proposal.proposalNumber} - {proposal.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(proposal.status)}`}>
                              {proposal.status.replace('_', ' ').charAt(0).toUpperCase() + proposal.status.replace('_', ' ').slice(1)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(proposal.priority)}`}>
                              {proposal.priority.charAt(0).toUpperCase() + proposal.priority.slice(1)} Priority
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Customer:</span> {getAccountName(proposal.accountId)}
                            </div>
                            <div>
                              <span className="font-medium">Contact:</span> {getContactName(proposal.contactId)}
                            </div>
                            <div>
                              <span className="font-medium">Value:</span> £{proposal.totalValue?.toFixed(2) || '0.00'}
                            </div>
                            <div>
                              <span className="font-medium">Valid Until:</span> {new Date(proposal.validUntil).toLocaleDateString()}
                            </div>
                          </div>

                          {proposal.description && (
                            <p className="mt-2 text-sm text-gray-600">{proposal.description}</p>
                          )}

                          {proposal.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {proposal.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedProposal(selectedProposal?.id === proposal.id ? null : proposal)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDuplicateProposal(proposal.id)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onSendProposal(proposal.id)}
                            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            <Send className="h-4 w-4" />
                            <span>Send</span>
                          </button>
                        </div>
                      </div>

                      {/* Tracking Info */}
                      {proposal.tracking.sentAt && (
                        <div className="border-t border-gray-200 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Send className="h-4 w-4 text-blue-500" />
                              <span>Sent: {new Date(proposal.tracking.sentAt).toLocaleDateString()}</span>
                            </div>
                            {proposal.tracking.viewedAt && (
                              <div className="flex items-center space-x-2">
                                <Eye className="h-4 w-4 text-purple-500" />
                                <span>Viewed: {new Date(proposal.tracking.viewedAt).toLocaleDateString()}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <BarChart3 className="h-4 w-4 text-gray-500" />
                              <span>Views: {proposal.tracking.viewCount}</span>
                            </div>
                            {proposal.tracking.timeSpentViewing > 0 && (
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span>Time: {Math.round(proposal.tracking.timeSpentViewing / 60)}min</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Expanded Details */}
                      {selectedProposal?.id === proposal.id && (
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Sections */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-3">Proposal Sections</h4>
                              <div className="space-y-2">
                                {proposal.sections.map((section) => (
                                  <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                                      <span className="text-sm font-medium">{section.title}</span>
                                      <span className="text-xs text-gray-500">({section.type})</span>
                                    </div>
                                    {section.isRequired && (
                                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                        Required
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Comments */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Comments</h4>
                              <div className="space-y-3">
                                {proposal.collaboration.comments.slice(0, 3).map((comment) => (
                                  <div key={comment.id} className="flex space-x-3">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                      <User className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">{getUserName(comment.userId)}</span>
                                        <span className="text-xs text-gray-500">
                                          {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                                    </div>
                                  </div>
                                ))}
                                {proposal.collaboration.comments.length === 0 && (
                                  <p className="text-sm text-gray-500">No comments yet</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProposals.map((proposal) => (
                  <div key={proposal.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(proposal.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(proposal.status)}`}>
                          {proposal.status.replace('_', ' ').charAt(0).toUpperCase() + proposal.status.replace('_', ' ').slice(1)}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(proposal.priority)}`}>
                        {proposal.priority}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">{proposal.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{proposal.proposalNumber}</p>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Customer:</span> {getAccountName(proposal.accountId)}
                      </div>
                      <div>
                        <span className="font-medium">Value:</span> £{proposal.totalValue?.toFixed(2) || '0.00'}
                      </div>
                      <div>
                        <span className="font-medium">Valid Until:</span> {new Date(proposal.validUntil).toLocaleDateString()}
                      </div>
                    </div>

                    {proposal.tracking.viewCount > 0 && (
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                        <span>{proposal.tracking.viewCount} views</span>
                        {proposal.tracking.timeSpentViewing > 0 && (
                          <span>{Math.round(proposal.tracking.timeSpentViewing / 60)}min read</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => onSendProposal(proposal.id)}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Send className="h-4 w-4" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Proposal Templates</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Plus className="h-4 w-4" />
                <span>Create Template</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {template.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Default
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Category:</span> {template.category}
                    </div>
                    <div>
                      <span className="font-medium">Industry:</span> {template.industry}
                    </div>
                    <div>
                      <span className="font-medium">Sections:</span> {template.sections.length}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Proposals</p>
                    <p className="text-2xl font-bold">{analytics.totalProposals}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Conversion Rate</p>
                    <p className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Avg Response Time</p>
                    <p className="text-2xl font-bold">{analytics.averageResponseTime.toFixed(1)}d</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Avg View Time</p>
                    <p className="text-2xl font-bold">{analytics.averageViewTime.toFixed(1)}m</p>
                  </div>
                  <Eye className="h-8 w-8 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Proposal Status Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(analytics.statusBreakdown).map(([status, count]) => (
                  <div key={status} className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Sections */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Sections</h3>
              <div className="space-y-4">
                {analytics.topPerformingSections.map((section) => (
                  <div key={section.sectionId} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{section.sectionTitle}</h4>
                      <p className="text-sm text-gray-600">View Rate: {section.viewRate.toFixed(1)}%</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{section.engagementScore.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Engagement Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Proposal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Create New Proposal</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proposal Title *
                    </label>
                    <input
                      type="text"
                      value={newProposal.title || ''}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter proposal title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template *
                    </label>
                    <select
                      value={newProposal.templateId || ''}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, templateId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select a template...</option>
                      {templates.filter(t => t.isActive).map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProposal.description || ''}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Brief description of the proposal..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account *
                    </label>
                    <select
                      value={newProposal.accountId || ''}
                      onChange={(e) => handleAccountChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select an account...</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact
                    </label>
                    <select
                      value={newProposal.contactId || ''}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, contactId: e.target.value }))}
                      disabled={!newProposal.accountId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                    >
                      <option value="">Select a contact...</option>
                      {filteredContacts.map(contact => (
                        <option key={contact.id} value={contact.id}>
                          {contact.firstName} {contact.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newProposal.priority || 'medium'}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={newProposal.validUntil || ''}
                      onChange={(e) => setNewProposal(prev => ({ ...prev, validUntil: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProposal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};