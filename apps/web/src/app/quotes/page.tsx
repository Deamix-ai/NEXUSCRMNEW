'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { QuoteBuilder } from '@/components/quotes/QuoteBuilder';
import { ApprovalWorkflow } from '@/components/quotes/ApprovalWorkflow';
import { ProposalManagement } from '@/components/quotes/ProposalManagement';
import { QuoteTemplateManager } from '@/components/quotes/QuoteTemplateManager';
import { 
  useStartWorkflowInstance,
  useCreateWorkflowDefinition,
  useUpdateWorkflowDefinition,
  useApproveWorkflow,
  useRejectWorkflow,
} from '@/hooks/api-hooks';
import { 
  FileText,
  Settings,
  Users,
  BarChart3,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Filter,
  Download
} from 'lucide-react';

// Sample data for the quotes system
const sampleAccounts = [
  {
    id: 'acc-1',
    name: 'Johnson Construction Ltd',
    email: 'contact@johnsonconstruction.com',
    phone: '01234 567890',
    address: '123 High Street',
    city: 'Manchester',
    postcode: 'M1 1AA',
    industry: 'Construction'
  },
  {
    id: 'acc-2',
    name: 'Smith Residential Properties',
    email: 'info@smithproperties.co.uk',
    phone: '0207 123 4567',
    address: '456 Park Road',
    city: 'London',
    postcode: 'SW1A 1AA',
    industry: 'Property Development'
  }
];

const sampleContacts = [
  {
    id: 'cont-1',
    firstName: 'James',
    lastName: 'Johnson',
    email: 'james@johnsonconstruction.com',
    phone: '01234 567891',
    jobTitle: 'Project Manager',
    accountId: 'acc-1'
  },
  {
    id: 'cont-2',
    firstName: 'Sarah',
    lastName: 'Smith',
    email: 'sarah@smithproperties.co.uk',
    phone: '0207 123 4568',
    jobTitle: 'Development Director',
    accountId: 'acc-2'
  }
];

const sampleUsers = [
  {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    role: 'Sales Manager',
    department: 'Sales',
    isActive: true
  },
  {
    id: 'user-2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    role: 'Senior Designer',
    department: 'Design',
    isActive: true
  }
];

const sampleQuoteTemplates = [
  {
    id: 'temp-1',
    name: 'Standard Bathroom Renovation',
    description: 'Complete bathroom renovation package including design, materials, and installation',
    category: 'Bathroom',
    industry: 'Residential',
    items: [
      {
        id: 'item-1',
        name: 'Premium Bathroom Suite',
        description: 'Complete luxury bathroom suite including toilet, basin, and bath',
        category: 'Bathroom Suites',
        quantity: 1,
        unitPrice: 1250.00,
        discount: 0,
        discountType: 'percentage' as const,
        total: 1250.00,
        isOptional: false
      },
      {
        id: 'item-2',
        name: 'Professional Installation',
        description: 'Complete installation service by certified professionals',
        category: 'Labour',
        quantity: 1,
        unitPrice: 850.00,
        discount: 0,
        discountType: 'percentage' as const,
        total: 850.00,
        isOptional: false
      }
    ],
    terms: 'All work guaranteed for 12 months. Materials warranty as per manufacturer terms. Payment due within 30 days.',
    validityDays: 30,
    isDefault: true,
    isActive: true,
    sections: [
      {
        id: 'sec-1',
        type: 'header' as const,
        title: 'Project Overview',
        content: 'Complete bathroom renovation including design consultation, materials supply, and professional installation.',
        order: 0,
        isVisible: true,
        isEditable: true,
        styles: {
          fontSize: 18,
          fontWeight: 'bold' as const,
          textAlign: 'center' as const,
          color: '#1f2937',
          backgroundColor: '#f9fafb',
          padding: 16
        }
      },
      {
        id: 'sec-2',
        type: 'table' as const,
        title: 'Materials & Labour',
        content: 'Detailed breakdown of materials and labour costs',
        order: 1,
        isVisible: true,
        isEditable: true,
        styles: {
          fontSize: 14,
          textAlign: 'left' as const,
          padding: 12
        }
      }
    ],
    variables: [
      {
        id: 'var-1',
        name: 'customer_name',
        label: 'Customer Name',
        type: 'text' as const,
        isRequired: true,
        description: 'Name of the customer'
      },
      {
        id: 'var-2',
        name: 'project_value',
        label: 'Project Value',
        type: 'currency' as const,
        isRequired: true,
        description: 'Total project value'
      }
    ],
    settings: {
      paperSize: 'A4' as const,
      orientation: 'portrait' as const,
      margins: { top: 20, bottom: 20, left: 20, right: 20 },
      branding: {
        logoPosition: 'left' as const,
        logoSize: 'medium' as const,
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        fontFamily: 'Arial',
        showWatermark: false
      },
      header: {
        showPageNumbers: true,
        showDate: true,
        showCompanyInfo: true,
        height: 80
      },
      footer: {
        showTerms: true,
        showSignature: true,
        showContact: true,
        height: 60
      }
    },
    usageCount: 45,
    averageValue: 8500,
    conversionRate: 68.5,
    createdBy: 'user-1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-09-01T14:30:00Z'
  }
];

const sampleProductCatalog = [
  {
    id: 'prod-1',
    name: 'Premium Bathroom Suite',
    description: 'Complete luxury bathroom suite including toilet, basin, and bath',
    category: 'Bathroom Suites',
    quantity: 1,
    unitPrice: 1250.00,
    discount: 0,
    discountType: 'percentage' as const,
    total: 1250.00,
    isOptional: false
  },
  {
    id: 'prod-2',
    name: 'Professional Installation',
    description: 'Complete installation service by certified professionals',
    category: 'Labour',
    quantity: 1,
    unitPrice: 850.00,
    discount: 0,
    discountType: 'percentage' as const,
    total: 850.00,
    isOptional: false
  }
];

const sampleQuotes = [
  {
    id: 'quote-1',
    quoteNumber: 'Q-2024-001',
    title: 'Bathroom Renovation - Johnson Residence',
    total: 8500.00,
    accountName: 'Johnson Construction Ltd',
    contactName: 'James Johnson',
    status: 'sent',
    createdAt: '2024-09-01T10:00:00Z'
  },
  {
    id: 'quote-2',
    quoteNumber: 'Q-2024-002',
    title: 'Kitchen Renovation - Smith Property',
    total: 12750.00,
    accountName: 'Smith Residential Properties',
    contactName: 'Sarah Smith',
    status: 'draft',
    createdAt: '2024-09-05T14:30:00Z'
  }
];

const sampleApprovals = [
  {
    id: 'app-1',
    quoteId: 'quote-1',
    workflowId: 'wf-1',
    status: 'pending' as const,
    currentStepId: 'step-1',
    requestedBy: 'user-1',
    requestedAt: '2024-09-01T10:00:00Z',
    priority: 'medium' as const,
    totalAmount: 8500.00,
    steps: [
      {
        id: 'step-1',
        name: 'Manager Approval',
        description: 'Requires approval from department manager',
        approverRole: 'Manager',
        approverIds: ['user-1'],
        order: 0,
        isRequired: true,
        timeoutDays: 3
      }
    ],
    actions: [],
    notifications: {
      emailSent: true,
      remindersSent: 0
    }
  }
];

const sampleWorkflows = [
  {
    id: 'wf-1',
    name: 'Standard Approval Workflow',
    description: 'Standard approval process for quotes over £5,000',
    isActive: true,
    steps: [
      {
        id: 'step-1',
        name: 'Manager Approval',
        description: 'Department manager approval',
        approverRole: 'Manager',
        approverIds: ['user-1'],
        order: 0,
        isRequired: true,
        timeoutDays: 3
      }
    ],
    conditions: {
      minimumAmount: 5000
    },
    settings: {
      autoApprovalEnabled: false,
      reminderFrequencyDays: 1,
      escalationEnabled: true,
      escalationDays: 3
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-09-01T00:00:00Z'
  }
];

const sampleProposals = [
  {
    id: 'prop-1',
    proposalNumber: 'P-2024-001',
    title: 'Complete Home Renovation Project',
    description: 'Comprehensive renovation including bathroom, kitchen, and living areas',
    quoteId: 'quote-1',
    accountId: 'acc-1',
    contactId: 'cont-1',
    ownerId: 'user-1',
    templateId: 'temp-1',
    status: 'sent' as const,
    priority: 'high' as const,
    sections: [],
    totalValue: 25000.00,
    validUntil: '2024-12-31',
    tags: ['renovation', 'residential'],
    customFields: {},
    tracking: {
      sentAt: '2024-09-01T10:00:00Z',
      viewedAt: '2024-09-02T15:30:00Z',
      lastViewedAt: '2024-09-05T09:15:00Z',
      viewCount: 5,
      timeSpentViewing: 420,
      sectionsViewed: ['sec-1', 'sec-2']
    },
    collaboration: {
      comments: [],
      reviewers: [],
      approvers: [],
      isLocked: false
    },
    version: 1,
    createdAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-09-05T09:15:00Z'
  }
];

const sampleProposalTemplates = [
  {
    id: 'ptemp-1',
    name: 'Residential Renovation Proposal',
    description: 'Complete proposal template for residential renovation projects',
    category: 'Renovation',
    industry: 'Residential',
    sections: [],
    variables: {},
    settings: {
      branding: {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        fontFamily: 'Arial'
      },
      layout: {
        headerHeight: 80,
        footerHeight: 60,
        margins: { top: 20, bottom: 20, left: 20, right: 20 }
      }
    },
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-09-01T00:00:00Z'
  }
];

const sampleAnalytics = {
  totalProposals: 25,
  conversionRate: 42.5,
  averageResponseTime: 3.2,
  averageViewTime: 8.5,
  topPerformingSections: [
    {
      sectionId: 'sec-1',
      sectionTitle: 'Project Overview',
      viewRate: 95.2,
      engagementScore: 8.7
    }
  ],
  statusBreakdown: {
    draft: 8,
    sent: 12,
    viewed: 3,
    accepted: 2
  },
  monthlyTrends: [
    { month: 'Aug', sent: 15, accepted: 6, value: 125000 },
    { month: 'Sep', sent: 18, accepted: 8, value: 165000 }
  ]
};

const QuotesPage = () => {
  const [activeTab, setActiveTab] = useState<'quotes' | 'approvals' | 'proposals' | 'templates'>('quotes');
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);

  // Workflow hooks
  const startWorkflowInstance = useStartWorkflowInstance();
  const createWorkflowDefinition = useCreateWorkflowDefinition();
  const updateWorkflowDefinition = useUpdateWorkflowDefinition();
  const approveWorkflow = useApproveWorkflow();
  const rejectWorkflow = useRejectWorkflow();

  // Sample handlers
  const handleSaveQuote = (quote: any) => {
    console.log('Saving quote:', quote);
    setShowQuoteBuilder(false);
  };

  const handleSendQuote = (quote: any) => {
    console.log('Sending quote:', quote);
    setShowQuoteBuilder(false);
  };

  const handlePreviewQuote = (quote: any) => {
    console.log('Previewing quote:', quote);
  };

  const handleDuplicateQuote = (quote: any) => {
    console.log('Duplicating quote:', quote);
  };

  const handleApprove = (approvalId: string, stepId: string, comments?: string) => {
    approveWorkflow.mutate({
      approvalId,
      data: { comments: comments || '' }
    });
  };

  const handleReject = (approvalId: string, stepId: string, comments: string) => {
    rejectWorkflow.mutate({
      approvalId,
      data: { comments, reason: 'Rejected via workflow' }
    });
  };

  const handleRequestApproval = (quoteId: string, workflowId: string, priority: string) => {
    startWorkflowInstance.mutate({
      workflowId,
      entityType: 'Quote',
      entityId: quoteId,
      priority: priority.toUpperCase() as any,
      metadata: { 
        quote: sampleQuotes.find(q => q.id === quoteId),
        requestedBy: 'current-user' // Should get from auth context
      }
    });
  };

  const handleUpdateWorkflow = (workflow: any) => {
    if (workflow.id) {
      updateWorkflowDefinition.mutate({
        id: workflow.id,
        data: workflow
      });
    } else {
      createWorkflowDefinition.mutate(workflow);
    }
  };

  const handleCancelApproval = (approvalId: string, reason: string) => {
    console.log('Cancelling approval:', { approvalId, reason });
  };

  const handleCreateProposal = (proposal: any) => {
    console.log('Creating proposal:', proposal);
  };

  const handleUpdateProposal = (proposalId: string, updates: any) => {
    console.log('Updating proposal:', { proposalId, updates });
  };

  const handleDeleteProposal = (proposalId: string) => {
    console.log('Deleting proposal:', proposalId);
  };

  const handleSendProposal = (proposalId: string) => {
    console.log('Sending proposal:', proposalId);
  };

  const handleDuplicateProposal = (proposalId: string) => {
    console.log('Duplicating proposal:', proposalId);
  };

  const handleAddComment = (proposalId: string, comment: any) => {
    console.log('Adding comment:', { proposalId, comment });
  };

  const handleCreateTemplate = (template: any) => {
    console.log('Creating template:', template);
  };

  const handleUpdateTemplate = (templateId: string, updates: any) => {
    console.log('Updating template:', { templateId, updates });
  };

  const handleUpdateProposalTemplate = (template: any) => {
    console.log('Updating proposal template:', template);
  };

  const handleDeleteTemplate = (templateId: string) => {
    console.log('Deleting template:', templateId);
  };

  const handleDuplicateTemplate = (templateId: string) => {
    console.log('Duplicating template:', templateId);
  };

  const handlePreviewTemplate = (template: any) => {
    console.log('Previewing template:', template);
  };

  const handleExportTemplate = (templateId: string) => {
    console.log('Exporting template:', templateId);
  };

  const handleImportTemplate = (templateData: any) => {
    console.log('Importing template:', templateData);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quote & Proposal Management
                </h1>
                <p className="text-gray-600">
                  Professional quote generation, proposal management, and approval workflows
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Active Quotes</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+15% this month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Quote Value</p>
                    <p className="text-2xl font-bold">£186K</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+28% increase</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Conversion Rate</p>
                    <p className="text-2xl font-bold">42.5%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+5.2% improvement</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Avg Response</p>
                    <p className="text-2xl font-bold">2.4 days</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Within target</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'quotes', label: 'Quote Builder', icon: FileText },
                { id: 'approvals', label: 'Approval Workflow', icon: CheckCircle },
                { id: 'proposals', label: 'Proposal Management', icon: Users },
                { id: 'templates', label: 'Template Manager', icon: Settings }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          {activeTab === 'quotes' && (
            <div className="space-y-6">
              {!showQuoteBuilder ? (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Professional Quote Builder</h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Create professional quotes with customizable templates, pricing calculators, 
                    and automated workflows. Track quote performance and conversion rates.
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setShowQuoteBuilder(true)}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <PlusCircle className="h-5 w-5" />
                      <span>Create New Quote</span>
                    </button>
                    <button className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Filter className="h-5 w-5" />
                      <span>View Existing Quotes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <QuoteBuilder
                  accounts={sampleAccounts}
                  contacts={sampleContacts}
                  templates={sampleQuoteTemplates}
                  productCatalog={sampleProductCatalog}
                  onSave={handleSaveQuote}
                  onSend={handleSendQuote}
                  onPreview={handlePreviewQuote}
                  onDuplicate={handleDuplicateQuote}
                />
              )}
            </div>
          )}

          {activeTab === 'approvals' && (
            <ApprovalWorkflow
              approvals={sampleApprovals}
              workflows={sampleWorkflows}
              users={sampleUsers}
              quotes={sampleQuotes}
              currentUserId="user-1"
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestApproval={handleRequestApproval}
              onUpdateWorkflow={handleUpdateWorkflow}
              onCancelApproval={handleCancelApproval}
            />
          )}

          {activeTab === 'proposals' && (
            <ProposalManagement
              proposals={sampleProposals}
              templates={sampleProposalTemplates}
              accounts={sampleAccounts}
              contacts={sampleContacts}
              users={sampleUsers}
              analytics={sampleAnalytics}
              onCreateProposal={handleCreateProposal}
              onUpdateProposal={handleUpdateProposal}
              onDeleteProposal={handleDeleteProposal}
              onSendProposal={handleSendProposal}
              onDuplicateProposal={handleDuplicateProposal}
              onAddComment={handleAddComment}
              onUpdateTemplate={handleUpdateProposalTemplate}
            />
          )}

          {activeTab === 'templates' && (
            <QuoteTemplateManager
              templates={sampleQuoteTemplates}
              categories={['Bathroom', 'Kitchen', 'General', 'Commercial']}
              industries={['Residential', 'Commercial', 'Industrial', 'Retail']}
              onCreateTemplate={handleCreateTemplate}
              onUpdateTemplate={handleUpdateTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              onDuplicateTemplate={handleDuplicateTemplate}
              onPreviewTemplate={handlePreviewTemplate}
              onExportTemplate={handleExportTemplate}
              onImportTemplate={handleImportTemplate}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuotesPage;


