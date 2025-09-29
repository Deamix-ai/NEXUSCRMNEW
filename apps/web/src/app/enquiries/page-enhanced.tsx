'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Download, Upload } from 'lucide-react';
import { AddLeadModal } from '@/components/leads/add-lead-modal';
import { ConvertEnquiryToLeadModal } from '@/components/conversions/convert-enquiry-to-lead-modal';
import { enquiriesApi } from '@/lib/api-client';
import { useCurrentUserId } from '@/contexts/AuthContext';
import { AdvancedSearch, ENQUIRY_SEARCH_FIELDS } from '@/components/common/AdvancedSearch';
import { BulkOperations, ENQUIRY_BULK_ACTIONS } from '@/components/common/BulkOperations';
import { DataTable, DEFAULT_TABLE_ACTIONS } from '@/components/common/DataTable';
import { DataImportExport } from '@/components/common/DataImportExport';
import Link from 'next/link';

interface Enquiry {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  source: string;
  estimatedValue: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  createdAt: string;
  account?: {
    id: string;
    name: string;
  };
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

function StatsCard({ title, value, subtitle, trend, className = '' }: StatsCardProps) {
  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <span className="text-white text-sm font-bold">E</span>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
              {subtitle && (
                <dd className="text-sm text-gray-500">{subtitle}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

const STATUS_COLORS = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800', 
  QUALIFIED: 'bg-green-100 text-green-800',
  PROPOSAL_SENT: 'bg-orange-100 text-orange-800',
  WON: 'bg-green-100 text-green-800',
  CONVERTED: 'bg-purple-100 text-purple-800',
  REJECTED: 'bg-red-100 text-red-800',
  LOST: 'bg-red-100 text-red-800',
  NURTURING: 'bg-gray-100 text-gray-800'
};

const PRIORITY_COLORS = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800'
};

export default function EnquiriesPageEnhanced() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [convertingEnquiry, setConvertingEnquiry] = useState<Enquiry | null>(null);
  const [showImportExport, setShowImportExport] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const currentUserId = useCurrentUserId();

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await enquiriesApi.getAll() as any;
      const enquiriesData = response || [];
      setEnquiries(enquiriesData);
      setFilteredEnquiries(enquiriesData);
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters: any) => {
    let filtered = [...enquiries];
    
    // Exclude converted enquiries by default
    filtered = filtered.filter(enquiry => enquiry.status !== 'CONVERTED');
    
    // Quick search
    if (filters._quickSearch) {
      const searchTerm = filters._quickSearch.toLowerCase();
      filtered = filtered.filter(enquiry => 
        enquiry.title.toLowerCase().includes(searchTerm) ||
        enquiry.firstName.toLowerCase().includes(searchTerm) ||
        enquiry.lastName.toLowerCase().includes(searchTerm) ||
        enquiry.email.toLowerCase().includes(searchTerm) ||
        enquiry.description.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(enquiry => enquiry.status === filters.status);
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(enquiry => enquiry.priority === filters.priority);
    }

    // Source filter
    if (filters.source) {
      filtered = filtered.filter(enquiry => enquiry.source === filters.source);
    }

    // Date range filter
    if (filters.createdAt_from || filters.createdAt_to) {
      filtered = filtered.filter(enquiry => {
        const enquiryDate = new Date(enquiry.createdAt);
        const fromDate = filters.createdAt_from ? new Date(filters.createdAt_from) : null;
        const toDate = filters.createdAt_to ? new Date(filters.createdAt_to) : null;
        
        if (fromDate && enquiryDate < fromDate) return false;
        if (toDate && enquiryDate > toDate) return false;
        return true;
      });
    }

    // Minimum value filter
    if (filters.estimatedValue) {
      filtered = filtered.filter(enquiry => 
        enquiry.estimatedValue >= Number(filters.estimatedValue)
      );
    }

    setFilteredEnquiries(filtered);
    setPage(1); // Reset to first page when filtering
  };

  const handleClearSearch = () => {
    const nonConverted = enquiries.filter(enquiry => enquiry.status !== 'CONVERTED');
    setFilteredEnquiries(nonConverted);
    setPage(1);
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
      
      // Transform the modal data to match the API requirements
      const apiData = {
        title: data.title,
        description: data.description || '',
        status: 'NEW',
        priority: data.priority || 'MEDIUM',
        estimatedValue: String(data.estimatedValue || 0),
        source: data.source || 'Website',
        campaign: data.campaign || '',
        medium: data.medium || '',
        // Use account information from the modal data
        firstName: data.firstName || (data.accountName ? data.accountName.split(' ')[0] : 'Unknown'),
        lastName: data.lastName || (data.accountName ? data.accountName.split(' ').slice(1).join(' ') || 'User' : 'User'),
        email: data.email || data.accountEmail || '',
        phone: data.phone || data.accountPhone || '',
        company: data.company || data.accountCompany || '',
        accountId: data.accountId, // REQUIRED field - enquiries must belong to an account
        ownerId: data.ownerId || currentUserId || 'cmfmmd5vx0000mgrrivusht65' // Use current user or fallback to admin user
      };
      
      console.log('Creating enquiry with data:', apiData);
      await enquiriesApi.create(apiData);
      setIsAddModalOpen(false);
      fetchEnquiries();
      alert('Enquiry created successfully!');
    } catch (error) {
      console.error('Failed to create enquiry:', error);
      // Check if it's an account-related error
      if (error.message && error.message.includes('Account')) {
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
      await enquiriesApi.convertToLead(convertingEnquiry.id, data);
      setConvertingEnquiry(null);
      fetchEnquiries();
      alert('Enquiry successfully converted to lead!');
    } catch (error) {
      console.error('Failed to convert enquiry:', error);
      alert('Failed to convert enquiry. Please try again.');
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  // Calculate stats
  const activeEnquiries = enquiries.filter(e => e.status !== 'CONVERTED');
  const stats = {
    total: activeEnquiries.length,
    new: activeEnquiries.filter(e => e.status === 'NEW').length,
    contacted: activeEnquiries.filter(e => e.status === 'CONTACTED').length,
    qualified: activeEnquiries.filter(e => e.status === 'QUALIFIED').length,
    totalValue: activeEnquiries.reduce((sum, e) => sum + (e.estimatedValue || 0), 0)
  };

  // Table columns configuration
  const columns = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (value: string, row: Enquiry) => (
        <div>
          <Link 
            href={`/enquiries/${row.id}`}
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            {value}
          </Link>
          <div className="text-sm text-gray-500">{row.description?.substring(0, 50)}...</div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (value: any, row: Enquiry) => (
        <div>
          <div className="font-medium text-gray-900">{row.firstName} {row.lastName}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
          <div className="text-sm text-gray-500">{row.phone}</div>
        </div>
      )
    },
    {
      key: 'account',
      label: 'Account',
      render: (value: any, row: Enquiry) => (
        <div className="text-sm text-gray-900">
          {row.account?.name || 'No Account'}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[value] || 'bg-gray-100 text-gray-800'}`}>
          {value.replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${PRIORITY_COLORS[value] || 'bg-gray-100 text-gray-800'}`}>
          {value}
        </span>
      )
    },
    {
      key: 'source',
      label: 'Source',
      sortable: true
    },
    {
      key: 'estimatedValue',
      label: 'Est. Value',
      sortable: true,
      render: (value: number) => formatCurrency(value || 0)
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('en-GB')
    }
  ];

  // Table actions
  const tableActions = [
    ...DEFAULT_TABLE_ACTIONS,
    {
      id: 'convert',
      label: 'Convert to Lead',
      icon: <Plus className="h-4 w-4" />,
      onClick: (row: Enquiry) => setConvertingEnquiry(row),
      show: (row: Enquiry) => row.status !== 'CONVERTED'
    }
  ];

  // Import fields configuration
  const importFields = [
    { key: 'title', label: 'Title', required: true, type: 'text' as const, example: 'Kitchen Renovation' },
    { key: 'description', label: 'Description', required: false, type: 'text' as const, example: 'Full kitchen renovation including...' },
    { key: 'firstName', label: 'First Name', required: true, type: 'text' as const, example: 'John' },
    { key: 'lastName', label: 'Last Name', required: true, type: 'text' as const, example: 'Smith' },
    { key: 'email', label: 'Email', required: true, type: 'email' as const, example: 'john@example.com' },
    { key: 'phone', label: 'Phone', required: false, type: 'phone' as const, example: '07123456789' },
    { key: 'source', label: 'Source', required: false, type: 'select' as const, options: ['Website', 'Phone', 'Email', 'Referral'] },
    { key: 'priority', label: 'Priority', required: false, type: 'select' as const, options: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
    { key: 'estimatedValue', label: 'Estimated Value', required: false, type: 'number' as const, example: '15000' }
  ];

  const handleImport = async (data: any[]) => {
    // Mock import implementation
    console.log('Importing data:', data);
    return {
      success: true,
      imported: data.length,
      errors: [],
      warnings: []
    };
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    console.log('Exporting in format:', format);
    // Mock export implementation
  };

  // Pagination
  const totalPages = Math.ceil(filteredEnquiries.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, endIndex);

  // Initialize with non-converted enquiries
  useEffect(() => {
    if (enquiries.length > 0) {
      const nonConverted = enquiries.filter(enquiry => enquiry.status !== 'CONVERTED');
      setFilteredEnquiries(nonConverted);
    }
  }, [enquiries]);

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
            <p className="text-gray-600">Manage and track customer enquiries with enhanced tools</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowImportExport(!showImportExport)}
            >
              {showImportExport ? <Filter className="h-4 w-4 mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              {showImportExport ? 'Hide' : 'Import/Export'}
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Enquiry
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatsCard 
            title="Total Enquiries" 
            value={stats.total}
            subtitle="Active enquiries"
          />
          <StatsCard 
            title="New" 
            value={stats.new}
            subtitle="Awaiting contact"
          />
          <StatsCard 
            title="Contacted" 
            value={stats.contacted}
            subtitle="In progress"
          />
          <StatsCard 
            title="Qualified" 
            value={stats.qualified}
            subtitle="Ready to convert"
          />
          <StatsCard 
            title="Total Value" 
            value={formatCurrency(stats.totalValue)}
            subtitle="Estimated value"
          />
        </div>

        {/* Import/Export Section */}
        {showImportExport && (
          <div className="mb-6">
            <DataImportExport
              entityType="Enquiries"
              importFields={importFields}
              onImport={handleImport}
              onExport={handleExport}
            />
          </div>
        )}

        {/* Advanced Search */}
        <AdvancedSearch
          fields={ENQUIRY_SEARCH_FIELDS}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search enquiries by title, name, email, or description..."
        />

        {/* Bulk Operations */}
        <BulkOperations
          selectedIds={selectedIds}
          totalCount={filteredEnquiries.length}
          onSelectAll={() => setSelectedIds(filteredEnquiries.map(e => e.id))}
          onDeselectAll={() => setSelectedIds([])}
          actions={ENQUIRY_BULK_ACTIONS}
        />

        {/* Data Table */}
        <DataTable
          data={paginatedEnquiries}
          columns={columns}
          keyField="id"
          selectable={true}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          actions={tableActions}
          loading={loading}
          emptyMessage="No enquiries found. Add your first enquiry to get started."
          pagination={{
            page,
            pageSize,
            total: filteredEnquiries.length,
            onPageChange: setPage,
            onPageSizeChange: setPageSize
          }}
        />

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
          enquiryValue={convertingEnquiry?.estimatedValue?.toString()}
        />
      </div>
    </DashboardLayout>
  );
}