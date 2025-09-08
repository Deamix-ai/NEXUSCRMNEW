'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AddLeadModal } from '@/components/leads/add-lead-modal';

// Mock data for leads
const initialLeads = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+44 7700 900123',
    company: 'Johnson Properties',
    status: 'NEW',
    source: 'Website',
    value: 15000,
    projectType: 'Kitchen Renovation',
    address: '123 Oak Street, Manchester, M1 1AA',
    notes: 'Interested in modern kitchen design with island',
    createdAt: '2025-09-08T10:30:00Z',
    lastContact: '2025-09-08T10:30:00Z',
    assignedTo: 'John Smith',
  },
  {
    id: '2',
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '+44 7700 900124',
    company: 'Davis Developments',
    status: 'CONTACTED',
    source: 'Referral',
    value: 8500,
    projectType: 'Bathroom Refit',
    address: '456 Pine Road, Birmingham, B1 2BB',
    notes: 'Looking for accessible bathroom solutions',
    createdAt: '2025-09-07T14:15:00Z',
    lastContact: '2025-09-08T09:00:00Z',
    assignedTo: 'Jane Wilson',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+44 7700 900125',
    company: 'Wilson Homes',
    status: 'QUOTED',
    source: 'Trade Show',
    value: 22000,
    projectType: 'Complete Kitchen',
    address: '789 Cedar Avenue, Leeds, LS1 3CC',
    notes: 'Premium finish required, budget flexible',
    createdAt: '2025-09-05T11:45:00Z',
    lastContact: '2025-09-07T16:30:00Z',
    assignedTo: 'John Smith',
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '+44 7700 900126',
    company: null,
    status: 'PROPOSAL_SENT',
    source: 'Google Ads',
    value: 12000,
    projectType: 'Bathroom Renovation',
    address: '321 Maple Close, Liverpool, L1 4DD',
    notes: 'First-time renovation, needs guidance',
    createdAt: '2025-09-04T16:20:00Z',
    lastContact: '2025-09-06T10:15:00Z',
    assignedTo: 'Jane Wilson',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    phone: '+44 7700 900127',
    company: 'Anderson Estates',
    status: 'NEGOTIATING',
    source: 'Website',
    value: 18500,
    projectType: 'Kitchen & Utility',
    address: '654 Birch Lane, Newcastle, NE1 5EE',
    notes: 'Multi-property developer, potential for more work',
    createdAt: '2025-09-03T09:30:00Z',
    lastContact: '2025-09-08T11:45:00Z',
    assignedTo: 'John Smith',
  },
];

const statusColors = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  QUOTED: 'bg-purple-100 text-purple-800',
  PROPOSAL_SENT: 'bg-indigo-100 text-indigo-800',
  NEGOTIATING: 'bg-orange-100 text-orange-800',
  WON: 'bg-green-100 text-green-800',
  LOST: 'bg-red-100 text-red-800',
};

const sourceColors = {
  Website: 'bg-blue-50 text-blue-700',
  Referral: 'bg-green-50 text-green-700',
  'Trade Show': 'bg-purple-50 text-purple-700',
  'Google Ads': 'bg-yellow-50 text-yellow-700',
  Social: 'bg-pink-50 text-pink-700',
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function LeadsPage() {
  const [leads, setLeads] = useState(initialLeads);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');

  const handleAddLead = (leadData: any) => {
    const newLead = {
      ...leadData,
      id: (leads.length + 1).toString(),
    };
    setLeads([newLead, ...leads]);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    const matchesSource = !sourceFilter || lead.source === sourceFilter;
    const matchesAssigned = !assignedFilter || lead.assignedTo === assignedFilter;
    
    return matchesSearch && matchesStatus && matchesSource && matchesAssigned;
  });

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-full">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {filteredLeads.length} leads
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Export
                </button>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Add Lead
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="Search leads..."
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUOTED">Quoted</option>
                  <option value="PROPOSAL_SENT">Proposal Sent</option>
                  <option value="NEGOTIATING">Negotiating</option>
                  <option value="WON">Won</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>
              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <select
                  id="source"
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="">All Sources</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Trade Show">Trade Show</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Social">Social Media</option>
                </select>
              </div>
              <div>
                <label htmlFor="assigned" className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <select
                  id="assigned"
                  value={assignedFilter}
                  onChange={(e) => setAssignedFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="">All Team Members</option>
                  <option value="John Smith">John Smith</option>
                  <option value="Jane Wilson">Jane Wilson</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Lead Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {lead.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status as keyof typeof statusColors]}`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sourceColors[lead.source as keyof typeof sourceColors] || 'bg-gray-50 text-gray-700'}`}>
                          {lead.source}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          <p><span className="font-medium">Email:</span> {lead.email}</p>
                          <p><span className="font-medium">Phone:</span> {lead.phone}</p>
                          {lead.company && <p><span className="font-medium">Company:</span> {lead.company}</p>}
                        </div>
                        <div className="space-y-1">
                          <p><span className="font-medium">Project:</span> {lead.projectType}</p>
                          <p><span className="font-medium">Value:</span> {formatCurrency(lead.value)}</p>
                          <p><span className="font-medium">Assigned:</span> {lead.assignedTo}</p>
                        </div>
                        <div className="space-y-1">
                          <p><span className="font-medium">Created:</span> {formatDate(lead.createdAt)}</p>
                          <p><span className="font-medium">Last Contact:</span> {formatDate(lead.lastContact)}</p>
                        </div>
                        <div className="space-y-1">
                          <p><span className="font-medium">Address:</span></p>
                          <p className="text-xs">{lead.address}</p>
                        </div>
                      </div>
                      
                      {lead.notes && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {lead.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Lead Modal */}
        <AddLeadModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddLead}
        />
      </div>
    </DashboardLayout>
  );
}
