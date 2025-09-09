'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

// Mock data for clients
const initialClients = [
  {
    id: '1',
    name: 'Thompson Family',
    email: 'contact@thompsonfamily.co.uk',
    phone: '+44 7700 900001',
    address: '123 Oak Street, Manchester, M1 1AA',
    type: 'RESIDENTIAL',
    status: 'ACTIVE',
    totalProjects: 3,
    totalValue: 45000,
    lastProject: '2025-08-15T00:00:00Z',
    notes: 'Long-term client with multiple properties',
    assignedTo: 'John Smith',
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Davis Properties Ltd',
    email: 'info@davisproperties.co.uk',
    phone: '+44 7700 900002',
    address: '456 Business Park, Birmingham, B1 2BB',
    type: 'COMMERCIAL',
    status: 'ACTIVE',
    totalProjects: 8,
    totalValue: 180000,
    lastProject: '2025-09-01T00:00:00Z',
    notes: 'Property development company, regular contracts',
    assignedTo: 'Jane Wilson',
    createdAt: '2022-06-10T00:00:00Z',
  },
  {
    id: '3',
    name: 'Wilson Homes',
    email: 'emma@wilsonhomes.co.uk',
    phone: '+44 7700 900003',
    address: '789 Cedar Avenue, Leeds, LS1 3CC',
    type: 'RESIDENTIAL',
    status: 'ACTIVE',
    totalProjects: 2,
    totalValue: 32000,
    lastProject: '2025-07-20T00:00:00Z',
    notes: 'High-end residential projects',
    assignedTo: 'John Smith',
    createdAt: '2024-03-08T00:00:00Z',
  },
  {
    id: '4',
    name: 'Brown Construction',
    email: 'david@brownconstruction.co.uk',
    phone: '+44 7700 900004',
    address: '321 Industrial Estate, Liverpool, L1 4DD',
    type: 'TRADE',
    status: 'ACTIVE',
    totalProjects: 15,
    totalValue: 95000,
    lastProject: '2025-08-30T00:00:00Z',
    notes: 'Subcontractor for larger projects',
    assignedTo: 'Mike Johnson',
    createdAt: '2021-11-22T00:00:00Z',
  },
  {
    id: '5',
    name: 'Anderson Estates',
    email: 'contact@andersonestates.co.uk',
    phone: '+44 7700 900005',
    address: '654 Birch Lane, Newcastle, NE1 5EE',
    type: 'COMMERCIAL',
    status: 'INACTIVE',
    totalProjects: 4,
    totalValue: 85000,
    lastProject: '2024-12-15T00:00:00Z',
    notes: 'Seasonal work, mostly dormant in winter',
    assignedTo: 'Jane Wilson',
    createdAt: '2023-08-14T00:00:00Z',
  },
];

const typeColors = {
  RESIDENTIAL: 'bg-blue-100 text-blue-800',
  COMMERCIAL: 'bg-green-100 text-green-800',
  TRADE: 'bg-purple-100 text-purple-800',
};

const statusColors = {
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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ClientsPage() {
  const [clients, setClients] = useState(initialClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || client.type === typeFilter;
    const matchesStatus = !statusFilter || client.status === statusFilter;
    const matchesAssigned = !assignedFilter || client.assignedTo === assignedFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesAssigned;
  });

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-full">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {filteredClients.length} clients
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Export
                </button>
                <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Add Client
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
                  placeholder="Search clients..."
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="type"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="">All Types</option>
                  <option value="RESIDENTIAL">Residential</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="TRADE">Trade</option>
                </select>
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
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
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
                  <option value="Mike Johnson">Mike Johnson</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Client Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                        <span className="text-brand-600 font-semibold text-lg">
                          {client.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {client.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[client.type as keyof typeof typeColors]}`}>
                            {client.type}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[client.status as keyof typeof statusColors]}`}>
                            {client.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
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
                    </div>
                  </div>

                  {/* Client Details */}
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {client.email}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {client.phone}
                    </div>
                    <div className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="break-words">{client.address}</span>
                    </div>
                  </div>

                  {/* Project Statistics */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-semibold text-gray-900">{client.totalProjects}</p>
                        <p className="text-xs text-gray-500">Projects</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-gray-900">{formatCurrency(client.totalValue)}</p>
                        <p className="text-xs text-gray-500">Total Value</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-gray-900">{formatDate(client.lastProject)}</p>
                        <p className="text-xs text-gray-500">Last Project</p>
                      </div>
                    </div>
                  </div>

                  {/* Notes and Assignment */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-600 truncate">
                          <span className="font-medium">Notes:</span> {client.notes}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {client.assignedTo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
