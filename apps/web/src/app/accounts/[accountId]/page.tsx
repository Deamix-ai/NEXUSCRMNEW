'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AddLeadModal } from '@/components/leads/add-lead-modal';
import { accountsApi, enquiriesApi, leadsApi } from '@/lib/api-client';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign,
  Activity,
  FileText,
  Home,
  Plus,
  MessageSquare,
  Settings,
  Edit3,
  ExternalLink,
  Clock,
  Target,
  Briefcase,
  TrendingUp
} from 'lucide-react';

interface Account {
  id: string;
  companyName?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  county?: string;
  postcode?: string;
  country: string;
  clientType: 'RESIDENTIAL' | 'COMMERCIAL' | 'TRADE';
  leadSource?: string;
  referralSource?: string;
  totalValue: number;
  createdAt: string;
  lastContact?: string;
  // Add relational fields
  enquiries?: Array<{
    id: string;
    title: string;
    description?: string;
    status: string;
    source: string;
    value: number;
    priority?: string;
    createdAt: string;
  }>;
  contacts?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    role?: string;
    jobTitle?: string;
    isPrimary?: boolean;
  }>;
  // Additional properties from API
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  jobs?: any[];
  leads?: any[];
  activities?: any[];
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  description: string;
  dueDate: string;
  createdAt: string;
}

interface FullAccount extends Account {
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  contacts: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    jobTitle?: string;
    isPrimary: boolean;
  }>;
  jobs: Array<{
    id: string;
    title: string;
    status: string;
    quotedValue: number;
    startDate?: string;
    room: {
      id: string;
      name: string;
      type: string;
    };
  }>;
  enquiries: Array<{
    id: string;
    title: string;
    status: string;
    source: string;
    value: number;
    createdAt: string;
  }>;
  leads: Array<{
    id: string;
    title: string;
    status: string;
    source: string;
    value: number;
    createdAt: string;
  }>;
  activities: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
    };
  }>;
}

const tabConfig = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'enquiries', label: 'Enquiries', icon: Target },
  { id: 'leads', label: 'Leads', icon: TrendingUp },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'completed', label: 'Completed', icon: Calendar },
  { id: 'invoices', label: 'Invoices', icon: DollarSign },
  { id: 'activities', label: 'Activity Timeline', icon: Activity },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'contacts', label: 'Contacts', icon: User },
];

const statusColors = {
  QUOTED: 'bg-yellow-100 text-yellow-800',
  SURVEY_BOOKED: 'bg-blue-100 text-blue-800',
  DESIGNING: 'bg-purple-100 text-purple-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const enquiryStatusColors = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  QUALIFIED: 'bg-purple-100 text-purple-800',
  PROPOSAL_SENT: 'bg-orange-100 text-orange-800',
  WON: 'bg-green-100 text-green-800',
  LOST: 'bg-red-100 text-red-800',
  NURTURING: 'bg-gray-100 text-gray-800',
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

export default function AccountDetailPage() {
  const params = useParams();
  const accountId = params.accountId as string;
  
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isUploadDocumentModalOpen, setIsUploadDocumentModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);

  useEffect(() => {
    if (accountId) {
      fetchAccount();
    }
  }, [accountId]);

  const fetchAccount = async () => {
    try {
      setLoading(true);
      // Use the accountsApi to fetch the specific account
      const client = await accountsApi.getById(accountId) as any;

      if (client) {
        // Fetch enquiries and leads for this account separately
        const [enquiriesResponse, leadsResponse] = await Promise.all([
          enquiriesApi.getAll({ accountId }).catch(() => []),
          leadsApi.getAll({ accountId }).catch(() => [])
        ]);

        // Transform the API data to match the frontend expectations
        const transformedAccount = {
          ...client,
          // Map projects to jobs for the projects section
          jobs: (client.deals || []).map((deal: any) => ({
            id: deal.id,
            title: deal.title,
            status: deal.stage?.name || 'IN_PROGRESS',
            quotedValue: parseFloat(deal.value) || 0,
            startDate: deal.createdAt,
            room: {
              id: deal.id, // Use deal ID as fallback
              name: deal.title || 'Project',
              type: 'Bathroom', // Default type
            }
          })),
          // Use the separately fetched enquiries and leads
          enquiries: (enquiriesResponse as any) || [],
          leads: (leadsResponse as any) || [],
          // Add other required fields
          totalValue: (client.deals || []).reduce((sum: number, deal: any) => sum + (parseFloat(deal.value) || 0), 0),
          // Add default empty activities array since API doesn't include activities with user data
          activities: [],
        };
        
        setAccount(transformedAccount);
      } else {
        notFound();
      }
    } catch (error) {
      console.error('Failed to fetch account:', error);
      notFound();
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (leadData: any) => {
    try {

      // Map the modal form data to the API structure
      const apiData = {
        title: leadData.title,
        description: leadData.description || '',
        status: leadData.status || 'NEW',
        priority: leadData.priority || 'MEDIUM',
        estimatedValue: leadData.estimatedValue || 0,
        source: leadData.source,
        firstName: leadData.firstName || 'Unknown',
        lastName: leadData.lastName || 'User',
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        message: leadData.notes,
        accountId: accountId,
        ownerId: account?.owner?.id || 'cmfbhlacp0000jdr8iqfhqno2', // Default to Jonathon Barclay if no owner
      };

      // Create the enquiry
      const response = await enquiriesApi.create(apiData);

      // Refresh the account data to show the new lead
      await fetchAccount();
      
      // Close the modal
      setIsAddLeadModalOpen(false);
      
      // Show success message
      alert('Enquiry created successfully!');
    } catch (error) {
      console.error('Failed to create lead:', error);
      alert(`Failed to create enquiry: ${error.message || 'Unknown error'}`);
      // Don't close modal on error so user can try again
    }
  };

  const createInvoice = async (invoiceData: {
    description: string;
    amount: number;
    dueDate: string;
  }) => {
    try {
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
        description: invoiceData.description,
        amount: invoiceData.amount,
        status: 'draft',
        dueDate: invoiceData.dueDate,
        createdAt: new Date().toISOString(),
      };

      // Add to local state (in a real app, this would be an API call)
      setInvoices(prev => [...prev, newInvoice]);
      setIsCreateInvoiceModalOpen(false);
      
      alert('Invoice created successfully!');
    } catch (error) {
      console.error('Failed to create invoice:', error);
      alert('Failed to create invoice');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!account) {
    return notFound();
  }

  const displayName = account.companyName || 
    (account.firstName && account.lastName ? `${account.firstName} ${account.lastName}` : 
    account.firstName || account.lastName || 'Unknown Account');
  const activeProjects = (account.jobs || []).filter(p => !['COMPLETED', 'CANCELLED'].includes(p.status));
  const totalProjectValue = (account.jobs || []).reduce((sum, p) => sum + (p.quotedValue || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Account Header */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  {account.companyName ? (
                    <Building2 className="h-8 w-8 text-blue-600" />
                  ) : (
                    <User className="h-8 w-8 text-blue-600" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                  {account.companyName && (account.firstName || account.lastName) && (
                    <p className="text-lg text-gray-600">
                      {account.firstName && account.lastName ? `${account.firstName} ${account.lastName}` : 
                       account.firstName || account.lastName}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                      account.clientType === 'RESIDENTIAL' ? 'bg-blue-100 text-blue-800' :
                      account.clientType === 'COMMERCIAL' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {account.clientType}
                    </span>
                    <span className="text-sm text-gray-500">
                      Owner: {account.owner?.firstName && account.owner?.lastName ? 
                        `${account.owner.firstName} ${account.owner.lastName}` : 
                        account.owner?.firstName || account.owner?.lastName || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setIsEditAccountModalOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Account
                </button>
                <button 
                  onClick={() => setIsAddProjectModalOpen(true)}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{(account.jobs || []).length}</div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeProjects.length}</div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalProjectValue)}</div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{(account.leads || []).length}</div>
              <div className="text-sm text-gray-600">Enquiries</div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              {account.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-900">{account.email}</span>
                </div>
              )}
              {account.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-900">{account.phone}</span>
                </div>
              )}
              {account.addressLine1 && (
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-0.5" />
                  <div className="text-sm text-gray-900">
                    <div>{account.addressLine1}</div>
                    {account.addressLine2 && <div>{account.addressLine2}</div>}
                    <div>{account.city}, {account.county} {account.postcode}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Created</div>
                  <div className="text-sm text-gray-900">{new Date(account.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              {account.leadSource && (
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Lead Source</div>
                    <div className="text-sm text-gray-900">{account.leadSource}</div>
                  </div>
                </div>
              )}
              {account.lastContact && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Last Contact</div>
                    <div className="text-sm text-gray-900">{new Date(account.lastContact).toLocaleDateString()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                <span className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  Call Customer
                </span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                <span className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  Send Email
                </span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  Schedule Meeting
                </span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-gray-400" />
                  Add Note
                </span>
                <Plus className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabConfig.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Projects */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
                      <Link href="#" onClick={() => setActiveTab('projects')} className="text-blue-600 hover:text-blue-800 text-sm">
                        View all
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {(account.jobs || []).slice(0, 3).map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{project.title}</h4>
                              <p className="text-sm text-gray-500">{project.room.name} - {project.room.type}</p>
                            </div>
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusColors[project.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                              {project.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{formatCurrency(project.quotedValue || 0)}</span>
                            <span className="text-sm text-gray-500">{new Date(project.startDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                      <Link href="#" onClick={() => setActiveTab('activities')} className="text-blue-600 hover:text-blue-800 text-sm">
                        View all
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {(account.activities || []).slice(0, 4).map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.description}</p>
                            <p className="text-xs text-gray-500">
                              {activity.user?.firstName} {activity.user?.lastName} • {new Date(activity.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {(!account.activities || account.activities.length === 0) && (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Projects</h3>
                  <button 
                    onClick={() => setIsAddProjectModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2 inline" />
                    New Project
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(account.jobs || []).filter(project => project.status !== 'COMPLETED').map((project) => (
                    <Link 
                      key={project.id} 
                      href={`/projects/${project.id}`}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusColors[project.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{project.room.name} - {project.room.type}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(project.quotedValue || 0)}</span>
                        <span className="text-sm text-gray-500">{new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'enquiries' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Enquiries</h3>
                  <button 
                    onClick={() => setIsAddLeadModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2 inline" />
                    New Enquiry
                  </button>
                </div>
                <div className="space-y-4">
                  {(account.enquiries || []).map((enquiry) => (
                    <Link 
                      key={enquiry.id} 
                      href={`/enquiries/${enquiry.id}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{enquiry.title}</h4>
                          <p className="text-sm text-gray-500">Source: {enquiry.source}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${enquiryStatusColors[enquiry.status as keyof typeof enquiryStatusColors] || 'bg-gray-100 text-gray-800'}`}>
                            {enquiry.status.replace('_', ' ')}
                          </span>
                          <div className="mt-1">
                            <span className="text-sm font-medium text-gray-900">{formatCurrency(enquiry.value)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Created: {new Date(enquiry.createdAt).toLocaleDateString()}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'leads' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Leads</h3>
                  <button 
                    onClick={() => setIsAddLeadModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2 inline" />
                    New Lead
                  </button>
                </div>
                <div className="space-y-4">
                  {(account.leads || []).map((lead) => (
                    <Link 
                      key={lead.id} 
                      href={`/leads/${lead.id}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{lead.title}</h4>
                          <p className="text-sm text-gray-500">Source: {lead.source}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${enquiryStatusColors[lead.status as keyof typeof enquiryStatusColors] || 'bg-gray-100 text-gray-800'}`}>
                            {lead.status.replace('_', ' ')}
                          </span>
                          <div className="mt-1">
                            <span className="text-sm font-medium text-gray-900">{formatCurrency(lead.value)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Created: {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'completed' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Completed Projects</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(account.jobs || []).filter(project => project.status === 'COMPLETED').map((project) => (
                    <Link 
                      key={project.id} 
                      href={`/projects/${project.id}`}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-green-100 text-green-800">
                          COMPLETED
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{project.room.name} - {project.room.type}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(project.quotedValue || 0)}</span>
                        <span className="text-sm text-gray-500">
                          Started: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Invoices</h3>
                  <button 
                    onClick={() => setIsCreateInvoiceModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2 inline" />
                    Create Invoice
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Placeholder for invoices - you'll need to add invoice data to the account model */}
                  <div className="text-center py-12">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Create invoices for completed work</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activities' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Activity Timeline</h3>
                <div className="space-y-4">
                  {(account.activities || []).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 border-l-2 border-blue-200 pl-4 py-2">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {activity.user?.firstName} {activity.user?.lastName} • {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                  <button 
                    onClick={() => setIsUploadDocumentModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2 inline" />
                    Upload Document
                  </button>
                </div>
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No documents yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Upload contracts, photos, or other documents</p>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Contacts</h3>
                  <button 
                    onClick={() => setIsAddContactModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2 inline" />
                    Add Contact
                  </button>
                </div>
                <div className="space-y-4">
                  {account.contacts.map((contact) => (
                    <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {contact.firstName} {contact.lastName}
                              {contact.isPrimary && (
                                <span className="ml-2 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">
                                  Primary
                                </span>
                              )}
                            </h4>
                            {contact.jobTitle && (
                              <p className="text-sm text-gray-500">{contact.jobTitle}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {contact.email && (
                            <div className="text-sm text-gray-900">{contact.email}</div>
                          )}
                          {contact.phone && (
                            <div className="text-sm text-gray-500">{contact.phone}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onSubmit={handleCreateLead}
        accountId={accountId}
      />

      {/* Simple Modal for New Project */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">New Project</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Project creation functionality is being developed. This will allow you to create new projects for this account.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setIsAddProjectModalOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simple Modal for Upload Document */}
      {isUploadDocumentModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Document</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Document upload functionality is being developed. This will allow you to upload and manage documents for this account.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setIsUploadDocumentModalOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simple Modal for Add Contact */}
      {isAddContactModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add Contact</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Contact management functionality is being developed. This will allow you to add and manage contacts for this account.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setIsAddContactModalOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simple Modal for Create Invoice */}
      {isCreateInvoiceModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Create Invoice</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Invoice creation functionality is being developed. This will allow you to create and manage invoices for this account.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setIsCreateInvoiceModalOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
