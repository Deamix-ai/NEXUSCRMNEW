'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ConvertDealToJobModal } from '@/components/conversions/convert-deal-to-job-modal';
import { leadsApi, projectsApi } from '@/lib/api-client';



interface Lead {
  id: string;
  title: string;
  description?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'NEGOTIATING' | 'WON' | 'LOST';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimatedValue?: number;
  probability?: number;
  source?: string;
  clientId: string;
  client?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  dealId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.leadId as string;
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  const fetchLead = async () => {
    try {
      const response = await leadsApi.getById(leadId);
      setLead(response as Lead);
    } catch (error) {
      console.error('Failed to fetch lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToProject = async (jobData: any) => {
    if (!lead || !lead.dealId) return;
    
    try {
      await projectsApi.convertToJob(lead.dealId, jobData);
      alert('Lead successfully converted to project!');
      router.push(`/accounts/${lead.clientId}`);
    } catch (error) {
      console.error('Failed to convert lead:', error);
      alert('Failed to convert lead. Please try again.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!lead) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Lead not found</h2>
          <p className="mt-2 text-gray-600">The lead you're looking for doesn't exist.</p>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'details', name: 'Details' },
    { id: 'documents', name: 'Documents' },
    { id: 'appointments', name: 'Appointments' },
    { id: 'activities', name: 'Activities' },
    { id: 'proposals', name: 'Proposals' },
  ];

  const statusColors = {
    NEW: 'bg-blue-100 text-blue-800',
    CONTACTED: 'bg-yellow-100 text-yellow-800',
    QUALIFIED: 'bg-purple-100 text-purple-800',
    PROPOSAL_SENT: 'bg-indigo-100 text-indigo-800',
    NEGOTIATING: 'bg-orange-100 text-orange-800',
    WON: 'bg-green-100 text-green-800',
    LOST: 'bg-red-100 text-red-800',
  };

  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex space-x-2 text-sm text-gray-500 mb-2">
                <button
                  onClick={() => router.push(`/accounts/${lead.clientId}`)}
                  className="hover:text-gray-700"
                >
                  {lead.client?.firstName} {lead.client?.lastName}
                </button>
                <span>/</span>
                <span className="text-gray-900">Lead</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">{lead.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusColors[lead.status]}`}>
                  {lead.status.replace('_', ' ')}
                </span>
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${priorityColors[lead.priority]}`}>
                  {lead.priority} Priority
                </span>
                {lead.probability && (
                  <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
                    {lead.probability}% Probability
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsConvertModalOpen(true)}
                disabled={lead.status === 'WON' || lead.status === 'LOST' || !lead.dealId}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Convert to Project
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg">
          {activeTab === 'details' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Details</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.description || 'No description provided'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Estimated Value</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {lead.estimatedValue ? `£${lead.estimatedValue.toLocaleString()}` : 'Not specified'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Probability</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.probability}%</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Source</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.source || 'Unknown'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(lead.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Account</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <button
                      onClick={() => router.push(`/accounts/${lead.clientId}`)}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      {lead.client?.firstName} {lead.client?.lastName}
                    </button>
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
              <div className="text-center py-12">
                <p className="text-gray-500">No documents uploaded yet.</p>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Upload Document
                </button>
              </div>
            </div>
          )}

          {activeTab === 'proposals' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Proposals</h3>
              <div className="text-center py-12">
                <p className="text-gray-500">No proposals created yet.</p>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Create Proposal
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Appointments</h3>
              <div className="text-center py-12">
                <p className="text-gray-500">No appointments scheduled.</p>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Schedule Appointment
                </button>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Activities</h3>
              <div className="text-center py-12">
                <p className="text-gray-500">No activities recorded.</p>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Add Activity
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Convert to Project Modal */}
      <ConvertDealToJobModal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        onConvert={handleConvertToProject}
        dealTitle={lead.title}
        dealValue={lead.estimatedValue}
      />
    </DashboardLayout>
  );
}
