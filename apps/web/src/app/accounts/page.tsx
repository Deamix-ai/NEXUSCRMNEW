'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AddAccountModal } from '@/components/accounts/AddAccountModal';
import { Plus, Search, Filter, Building2, User, Phone, Mail, MapPin, Calendar, DollarSign, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Toast from '@/components/ui/Toast';
import ErrorToast from '@/components/ui/ErrorToast';
import { useCurrentUserId } from '@/contexts/AuthContext';
import { useAccounts, useCreateAccount } from '@/hooks/api-hooks';

interface Account {
  id: string;
  name: string;
  legalName?: string;
  emails: string[];
  phones: string[];
  billingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    county?: string;
    postcode?: string;
    country?: string;
  };
  tags: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
  };
  // Calculated fields that might be added by the API
  totalValue?: number;
  activeProjects?: number;
  totalProjects?: number;
}

const clientTypeColors = {
  RESIDENTIAL: 'bg-blue-100 text-blue-800',
  COMMERCIAL: 'bg-purple-100 text-purple-800',
  TRADE: 'bg-orange-100 text-orange-800',
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  SUSPENDED: 'bg-red-100 text-red-800',
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

export default function AccountsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const currentUserId = useCurrentUserId();

  // Use React Query hooks
  const { data: accountsData, isLoading, error, refetch } = useAccounts();
  const createAccountMutation = useCreateAccount();

  // Handle the API response structure: { data: [...], pagination: {...} }
  const accounts = Array.isArray((accountsData as any)?.data) ? (accountsData as any).data : [];

  const handleCreateAccount = async (accountData: any) => {
    try {
      // Transform the form data to match the new Account schema
      const accountPayload = {
        name: accountData.companyName || `${accountData.firstName} ${accountData.lastName}`.trim(),
        legalName: accountData.companyName || `${accountData.firstName} ${accountData.lastName}`.trim(),
        emails: accountData.email ? [accountData.email] : [],
        phones: [accountData.phone, accountData.mobile].filter(Boolean),
        billingAddress: (accountData.addressLine1 || accountData.city || accountData.postcode) ? {
          line1: accountData.addressLine1 || '',
          line2: accountData.addressLine2 || '',
          city: accountData.city || '',
          county: accountData.county || '',
          postcode: accountData.postcode || '',
          country: 'United Kingdom'
        } : null,
        ownerId: currentUserId, // Let API handle missing user ID with system default
        consentMarketing: accountData.marketingConsent || false,
        tags: accountData.clientType ? [accountData.clientType] : [],
      };

      await createAccountMutation.mutateAsync(accountPayload);
      setShowAddModal(false);
      setShowSuccessToast(true);
    } catch (error) {
      console.error('Failed to create account:', error);
      setErrorMessage(`Failed to create account: ${error}`);
      throw error;
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.legalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.emails?.some(email => email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      account.phones?.some(phone => phone.includes(searchTerm)) ||
      account.billingAddress?.postcode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || 
      account.tags?.includes(selectedType) || 
      account.status === selectedType;

    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
            <p className="text-gray-600">Manage your accounts and their projects</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Account
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search accounts by name, email, phone, or postcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="TRADE">Trade</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <User className="h-5 w-5 text-blue-600" />
              <span className="ml-2 text-sm font-medium text-gray-900">Total Accounts</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{accounts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-green-600" />
              <span className="ml-2 text-sm font-medium text-gray-900">Active Projects</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {accounts.reduce((sum, account) => sum + (account.activeProjects || 0), 0)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span className="ml-2 text-sm font-medium text-gray-900">Total Value</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatCurrency(accounts.reduce((sum, account) => sum + (account.totalValue || 0), 0))}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-orange-600" />
              <span className="ml-2 text-sm font-medium text-gray-900">This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {accounts.filter(account => {
                const created = new Date(account.createdAt);
                const now = new Date();
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50" data-account-row>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/accounts/${account.id}`} className="flex items-center group">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {account.tags?.includes('COMMERCIAL') || account.tags?.includes('TRADE') ? (
                              <Building2 className="h-5 w-5 text-gray-600" />
                            ) : (
                              <User className="h-5 w-5 text-gray-600" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                            {account.name}
                          </div>
                          {account.legalName && account.legalName !== account.name && (
                            <div className="text-sm text-gray-500">
                              {account.legalName}
                            </div>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {account.emails?.length > 0 && (
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="h-3 w-3 text-gray-400 mr-1" />
                            {account.emails[0]}
                          </div>
                        )}
                        {account.phones?.length > 0 && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-3 w-3 text-gray-400 mr-1" />
                            {account.phones[0]}
                          </div>
                        )}
                        {account.billingAddress && (
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                            {account.billingAddress.city}, {account.billingAddress.postcode}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {account.tags?.map((tag, index) => (
                          <span key={index} className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${clientTypeColors[tag as keyof typeof clientTypeColors] || 'bg-gray-100 text-gray-800'}`}>
                            {tag}
                          </span>
                        ))}
                        {(!account.tags || account.tags.length === 0) && (
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${clientTypeColors[account.status as keyof typeof clientTypeColors]}`}>
                            {account.status}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {account.activeProjects || 0} active
                      </div>
                      <div className="text-sm text-gray-500">
                        {account.totalProjects || 0} total
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(account.totalValue || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {account.owner.firstName} {account.owner.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(account.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No accounts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first account'
              }
            </p>
            {!searchTerm && selectedType === 'all' && (
              <div className="mt-6">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Account
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add Account Modal */}
        <AddAccountModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreateAccount}
        />

        {/* Success Toast */}
        <Toast
          message="Account created successfully!"
          type="success"
          isVisible={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
        />

        {/* Error Toast */}
        {errorMessage && (
          <ErrorToast
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
