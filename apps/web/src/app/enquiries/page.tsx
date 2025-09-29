'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AddLeadModal } from '@/components/leads/add-lead-modal';
import { ConvertEnquiryToLeadModal } from '@/components/conversions/convert-enquiry-to-lead-modal';
import { useEnquiries, useCreateEnquiry, useConvertEnquiryToLead } from '@/hooks/api-hooks';
import { useCurrentUserId } from '@/contexts/AuthContext';
import { Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function EnquiriesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [convertingEnquiry, setConvertingEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const currentUserId = useCurrentUserId();

  // Use React Query hooks
  const { data: enquiriesData = [], isLoading: loading } = useEnquiries();
  const createEnquiryMutation = useCreateEnquiry();
  const convertToLeadMutation = useConvertEnquiryToLead();
  
  // Ensure enquiries is always an array
  const enquiries = Array.isArray(enquiriesData) ? enquiriesData : [];

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const handleAddEnquiry = async (data) => {
    try {
      // Validate required fields - Account is MANDATORY
      if (!data.accountId) {
        alert('An account must be selected for this enquiry. Enquiries cannot exist without being linked to an account.');
        return;
      }
      
      // Validate we have basic enquiry information
      if (!data.title || data.title.trim() === '') {
        alert('Please provide a title for the enquiry.');
        return;
      }

      // Debug: Check currentUserId
      console.log('currentUserId:', currentUserId);
      console.log('data.ownerId:', data.ownerId);
      
      if (!data.ownerId && !currentUserId) {
        alert('No owner ID available. Please ensure you are logged in.');
        return;
      }
      
      // Transform the modal data to match the API requirements
      const apiData = {
        title: data.title,
        description: data.description || undefined,
        status: 'NEW',
        priority: data.priority || 'MEDIUM',
        estimatedValue: data.estimatedValue ? String(data.estimatedValue) : undefined,
        source: data.source || 'Website',
        campaign: data.campaign || undefined,
        medium: data.medium || undefined,
        // Use account information from the modal data
        firstName: data.firstName || (data.accountName ? data.accountName.split(' ')[0] : 'Unknown'),
        lastName: data.lastName || (data.accountName ? data.accountName.split(' ').slice(1).join(' ') || 'User' : 'User'),
        email: data.email || data.accountEmail || undefined,
        phone: data.phone || data.accountPhone || undefined,
        company: data.company || data.accountCompany || undefined,
        accountId: data.accountId, // REQUIRED field - enquiries must belong to an account
        ownerId: data.ownerId || currentUserId, // Let API handle missing user ID with system default
      };

      console.log('Sending API data:', JSON.stringify(apiData, null, 2));
      
      await createEnquiryMutation.mutateAsync(apiData);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to create enquiry:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Check if it's a validation error with specific messages
      if (error.response?.data?.message) {
        const messages = Array.isArray(error.response.data.message) 
          ? error.response.data.message 
          : [error.response.data.message];
        alert(`Validation Error:\n${messages.join('\n')}`);
      } else if (error.message && error.message.includes('Account')) {
        alert('Error: The selected account could not be found. Please select a valid account.');
      } else if (error.message && error.message.includes('User')) {
        alert('Error: Invalid user assignment. Please contact support.');
      } else {
        alert('Failed to create enquiry. Please ensure all required fields are filled and try again.');
      }
    }
  };

  const handleConvertToLead = async (data) => {
    if (!convertingEnquiry) return;
    
    try {
      await convertToLeadMutation.mutateAsync({
        enquiryId: convertingEnquiry.id,
        data
      });
      setConvertingEnquiry(null);
    } catch (error) {
      console.error('Failed to convert enquiry:', error);
      alert('Failed to convert enquiry. Please try again.');
    }
  };

  const statusColors = {
    NEW: 'bg-blue-100 text-blue-800',
    CONTACTED: 'bg-yellow-100 text-yellow-800',
    QUALIFIED: 'bg-purple-100 text-purple-800',
    PROPOSAL_SENT: 'bg-orange-100 text-orange-800',
    WON: 'bg-green-100 text-green-800',
    LOST: 'bg-red-100 text-red-800',
    NURTURING: 'bg-gray-100 text-gray-800',
  };

  // Filter enquiries based on search term and filters
  const filteredEnquiries = enquiries.filter(enquiry => {
    if (enquiry.status === 'CONVERTED') return false;
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
                         (enquiry.title?.toLowerCase().includes(searchLower)) ||
                         (enquiry.description?.toLowerCase().includes(searchLower)) ||
                         (enquiry.source?.toLowerCase().includes(searchLower));
    const matchesStatus = !statusFilter || enquiry.status === statusFilter;
    const matchesSource = !sourceFilter || enquiry.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">Enquiries</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage incoming customer enquiries and convert them to leads.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Enquiry
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{enquiries.filter(enquiry => enquiry.status !== 'CONVERTED').length}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Enquiries</dt>
                    <dd className="text-lg font-medium text-gray-900">{enquiries.filter(enquiry => enquiry.status !== 'CONVERTED').length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {enquiries.filter(e => e.status === 'NEW').length}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">New Enquiries</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {enquiries.filter(e => e.status === 'NEW').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {enquiries.filter(e => e.status === 'QUALIFIED').length}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Qualified</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {enquiries.filter(e => e.status === 'QUALIFIED').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">£</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(enquiries.filter(e => e.status !== 'CONVERTED').reduce((sum, enquiry) => sum + (enquiry.estimatedValue || 0), 0))}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search enquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="PROPOSAL_SENT">Proposal Sent</option>
                  <option value="WON">Won</option>
                  <option value="LOST">Lost</option>
                  <option value="NURTURING">Nurturing</option>
                </select>
              </div>

              <div>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Sources</option>
                  {Array.from(new Set(enquiries.map(enquiry => enquiry.source).filter(Boolean))).map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
                    setSourceFilter('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredEnquiries.length === 0 ? (
          <div className="mt-8 text-center py-12 bg-white rounded-lg shadow">
            <div className="mx-auto h-12 w-12 text-gray-400">💡</div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No enquiries found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter || sourceFilter 
                ? 'Try adjusting your search criteria or filters.' 
                : 'Get started by creating your first enquiry.'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add New Enquiry
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <Link 
                          href={`/enquiries/${enquiry.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {enquiry.title}
                        </Link>
                        {enquiry.description && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">{enquiry.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {enquiry.firstName && enquiry.lastName ? `${enquiry.firstName} ${enquiry.lastName}` : '-'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {enquiry.email || enquiry.phone || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[enquiry.status] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {enquiry.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {enquiry.source || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {enquiry.estimatedValue ? `£${enquiry.estimatedValue.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(enquiry.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/enquiries/${enquiry.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => setConvertingEnquiry(enquiry)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Convert
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Enquiry Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddEnquiry}
      />

      {/* Convert Enquiry to Lead Modal */}
      <ConvertEnquiryToLeadModal
        isOpen={!!convertingEnquiry}
        onClose={() => setConvertingEnquiry(null)}
        onConvert={handleConvertToLead}
        enquiryTitle={convertingEnquiry?.title || ''}
        enquiryValue={convertingEnquiry?.estimatedValue}
      />
    </DashboardLayout>
  );
}
