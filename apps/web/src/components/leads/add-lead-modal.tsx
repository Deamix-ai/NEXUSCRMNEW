'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { accountsApi } from '@/lib/api-client';
import { AddAccountModal } from '@/components/accounts/AddAccountModal';


interface Account {
  id: string;
  name: string; // Account name
  legalName?: string;
  emails: string[];
  phones: string[];
  billingAddress?: {
    postcode: string;
    city: string;
    line1: string;
    line2?: string;
  };
  contacts: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    isPrimary: boolean;
  }>;
  status: string;
}

interface LeadFormData {
  title: string;
  description: string;
  source: string;
  projectType: string;
  estimatedValue: number;
  priority: string;
  urgency: string;
  preferredContactMethod: string;
  notes: string;
  status: string;
  accountId: string;
  createdAt: string;
  accountName: string;
  accountEmail: string;
  accountPhone: string;
  accountCompany: string;
  accountAddress: string;
}

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: LeadFormData) => void;
  accountId?: string; // Optional for when used in account context
}

export function AddLeadModal({ isOpen, onClose, onSubmit, accountId }: AddLeadModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    source: 'Website',
    projectType: '',
    estimatedValue: '',
    priority: 'MEDIUM',
    urgency: 'Normal',
    preferredContactMethod: 'Email',
    notes: '',
    accountId: accountId || '', // Account selection
  });

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountSearch, setAccountSearch] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  // Memoized filtered accounts with stable filtering logic
  const filteredAccounts = useMemo(() => {
    if (accounts.length === 0) return [];
    
    if (accountSearch.trim() === '') {
      return accounts.slice(0, 10); // Show first 10 accounts when no search
    }
    
    const search = accountSearch.toLowerCase();
    const filtered = accounts.filter(account => {
      const fullName = account.name?.toLowerCase() || '';
      const legalName = account.legalName?.toLowerCase() || '';
      const emails = account.emails.join(' ').toLowerCase();
      const phones = account.phones.join(' ');
      const postcode = account.billingAddress?.postcode?.toLowerCase() || '';
      
      return (
        fullName.includes(search) ||
        legalName.includes(search) ||
        emails.includes(search) ||
        phones.includes(search) ||
        postcode.includes(search)
      );
    });
    
    return filtered.slice(0, 10); // Limit to 10 results
  }, [accountSearch, accounts]);

  // Load accounts when modal opens
  useEffect(() => {
    if (isOpen && !accountId) {
      loadClients();
    }
    // Reset form when modal closes
    if (!isOpen) {
      setAccountSearch('');
      setShowAccountDropdown(false);
      setSelectedAccount(null);
    }
  }, [isOpen, accountId]);

  // Handle accountId prop changes
  useEffect(() => {
    if (accountId && accounts.length > 0) {
      const account = accounts.find(c => c.id === accountId);
      if (account) {
        setSelectedAccount(account);
        const displayName = account.name;
        setAccountSearch(`${displayName}${account.legalName ? ` (${account.legalName})` : ''}`);
        setShowAccountDropdown(false);
      }
    }
  }, [accountId, accounts]);

  const loadClients = async () => {
    try {
      setIsLoadingAccounts(true);
      const response = await accountsApi.getAll({ limit: 100 });
      const accountsData = (response as { data: Account[] }).data || []; // API returns { data: accounts[], pagination: {} }
      setAccounts(accountsData);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const handleCreateAccount = async (accountData: any) => {
    try {
      // Create the account via API
      const newAccount = await accountsApi.create(accountData) as any;
      
      // Transform to match our Account interface
      const transformedAccount: Account = {
        id: newAccount.id,
        name: `${newAccount.firstName} ${newAccount.lastName}${newAccount.companyName ? ` (${newAccount.companyName})` : ''}`,
        legalName: newAccount.companyName,
        emails: newAccount.email ? [newAccount.email] : [],
        phones: [newAccount.phone, newAccount.mobile].filter(Boolean),
        billingAddress: newAccount.addressLine1 ? {
          postcode: newAccount.postcode || '',
          city: newAccount.city || '',
          line1: newAccount.addressLine1,
          line2: newAccount.addressLine2,
        } : undefined,
        contacts: [{
          id: newAccount.id,
          name: `${newAccount.firstName} ${newAccount.lastName}`,
          email: newAccount.email || '',
          phone: newAccount.phone || newAccount.mobile || '',
          isPrimary: true
        }],
        status: 'ACTIVE'
      };

      // Add to accounts list and auto-select
      setAccounts(prev => [transformedAccount, ...prev]);
      setSelectedAccount(transformedAccount);
      setAccountSearch('');
      setFormData(prev => ({
        ...prev,
        accountId: newAccount.id,
        accountName: transformedAccount.name,
        accountEmail: transformedAccount.emails[0] || '',
        accountPhone: transformedAccount.phones[0] || '',
        accountCompany: newAccount.companyName || '',
        accountAddress: transformedAccount.billingAddress ? 
          `${transformedAccount.billingAddress.line1}, ${transformedAccount.billingAddress.city}` : ''
      }));

      // Close modal
      setIsAddAccountModalOpen(false);
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Failed to create account. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that a account is selected
    if (!formData.accountId) {
      alert('Please select an account for this enquiry.');
      return;
    }

    // Include selected account information in the submission
    const submissionData = {
      title: formData.title,
      description: formData.description,
      source: formData.source,
      projectType: formData.projectType,
      estimatedValue: parseFloat(formData.estimatedValue) || 0,
      priority: formData.priority,
      urgency: formData.urgency,
      preferredContactMethod: formData.preferredContactMethod,
      notes: formData.notes,
      status: 'NEW',
      accountId: formData.accountId,
      createdAt: new Date().toISOString(),
      // Include account information for lead creation
      accountName: selectedAccount ? selectedAccount.name : '',
      accountEmail: selectedAccount?.emails[0] || '',
      accountPhone: selectedAccount?.phones[0] || '',
      accountCompany: selectedAccount?.legalName || '',
      accountAddress: selectedAccount?.billingAddress?.postcode || '',
    };

    onSubmit(submissionData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      source: 'Website',
      projectType: '',
      estimatedValue: '',
      priority: 'MEDIUM',
      urgency: 'Normal',
      preferredContactMethod: 'Email',
      notes: '',
      accountId: accountId || '',
    });
    setSelectedAccount(null);
    setAccountSearch('');
    setShowAccountDropdown(false);
    onClose();
  };

  const handleAccountSelect = (account: Account) => {
    setSelectedAccount(account);
    setFormData(prev => ({ ...prev, accountId: account.id }));
    const displayName = account.name;
    setAccountSearch(`${displayName}${account.legalName ? ` (${account.legalName})` : ''}`);
    setShowAccountDropdown(false);
  };

  const handleClientSearchChange = useCallback((value: string) => {
    setAccountSearch(value);
    
    // Only show dropdown if we have accounts and the search value is not empty
    // or if we're clearing the search and want to show all options
    if (accounts.length > 0) {
      if (value.length > 0) {
        setShowAccountDropdown(true);
      } else {
        // Don't show dropdown immediately when clearing, let user focus to show it
        setShowAccountDropdown(false);
      }
    }
    
    // Clear selected client when user modifies the search
    if (selectedAccount && value.trim() !== `${selectedAccount.name}${selectedAccount.legalName ? ` (${selectedAccount.legalName})` : ''}`) {
      setSelectedAccount(null);
      setFormData(prev => ({ ...prev, accountId: '' }));
    }
  }, [accounts.length, selectedAccount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.client-search-container')) {
        setShowAccountDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Add New Enquiry</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Selection - Required Field */}
            {!accountId && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <label htmlFor="accountSearch" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Account *
                  <span className="text-blue-600 text-xs ml-1">(Required - Enquiries must be assigned to an account)</span>
                </label>
                <div className="relative client-search-container">
                  <input
                    type="text"
                    id="accountSearch"
                    value={accountSearch}
                    onChange={(e) => handleClientSearchChange(e.target.value)}
                    onFocus={() => {
                      // Show dropdown on focus only if we have data and no account is selected
                      if (accounts.length > 0 && (!selectedAccount || accountSearch.length > 0)) {
                        setShowAccountDropdown(true);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="Search by name, company, email, phone, or postcode..."
                    autoComplete="off"
                    required
                  />
                  
                  {isLoadingAccounts && (
                    <div className="absolute right-3 top-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  
                  {showAccountDropdown && !isLoadingAccounts && filteredAccounts.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredAccounts.map((client) => (
                        <div
                          key={client.id}
                          onClick={() => handleAccountSelect(client)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {client.name}
                              </div>
                              {client.legalName && (
                                <div className="text-sm text-gray-600">{client.legalName}</div>
                              )}
                              <div className="text-sm text-gray-500">
                                {client.emails[0] || 'No email'} {client.phones[0] && `• ${client.phones[0]}`}
                              </div>
                              {client.billingAddress?.postcode && (
                                <div className="text-xs text-gray-400">{client.billingAddress.postcode}</div>
                              )}
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              client.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              client.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {client.status.toLowerCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {showAccountDropdown && filteredAccounts.length === 0 && accountSearch.length > 0 && !isLoadingAccounts && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                      <div className="text-sm text-gray-500 text-center">
                        No accounts found matching "{accountSearch}"
                      </div>
                      <div className="text-xs text-gray-400 text-center mt-1">
                        Try searching by name, email, phone, or postcode
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddAccountModalOpen(true);
                            setShowAccountDropdown(false);
                          }}
                          className="w-full text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-md px-3 py-2 transition-colors"
                        >
                          + Create New Account for "{accountSearch}"
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedAccount && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                    <div className="text-sm text-green-800">
                      ✓ Selected: {selectedAccount.name}
                      {selectedAccount.legalName && ` (${selectedAccount.legalName})`}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Enquiry Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="e.g., Bathroom Renovation, Ensuite Refit"
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Type
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="">Select project type</option>
                  <option value="Full Bathroom">Full Bathroom</option>
                  <option value="Ensuite">Ensuite</option>
                  <option value="Downstairs Toilet">Downstairs Toilet</option>
                  <option value="Wet Room">Wet Room</option>
                  <option value="Shower Room">Shower Room</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
                  Timeline
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="Urgent">ASAP (Urgent)</option>
                  <option value="Soon">Within 1-2 months</option>
                  <option value="Normal">Within 3-6 months</option>
                  <option value="Future">Future planning (6+ months)</option>
                </select>
              </div>

              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                  Enquiry Source
                </label>
                <select
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Existing Customer">Existing Customer</option>
                  <option value="Trade Show">Trade Show</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Email">Email</option>
                  <option value="Walk-in">Walk-in</option>
                </select>
              </div>

              <div>
                <label htmlFor="estimatedValue" className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Budget (£)
                </label>
                <input
                  type="number"
                  id="estimatedValue"
                  name="estimatedValue"
                  value={formData.estimatedValue}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="15000"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder="Describe what the customer is looking for..."
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder="Any additional details about the enquiry..."
                autoComplete="off"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-brand-600 border border-transparent rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                Add Enquiry
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onSubmit={handleCreateAccount}
      />
    </div>
  );
}
