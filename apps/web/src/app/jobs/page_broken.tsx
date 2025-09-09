'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

// Mock data for jobs
const initialJobs = [
  {
    id: '1',
    title: 'Thompson Kitchen Renovation',
    client: 'Thompson Family',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    value: 25000,
    startDate: '2025-09-01T00:00:00Z',
    expectedEndDate: '2025-10-15T00:00:00Z',
    progress: 65,
    projectManager: 'John Smith',
    installer: 'Davis Construction',
    address: '123 Oak Street, Manchester, M1 1AA',
    description: 'Complete kitchen renovation with island and premium appliances',
    rooms: ['Kitchen'],
    notes: 'Client requested premium finishes throughout',
  },
  {
    id: '2',
    title: 'Wilson Bathroom Suite',
    client: 'Wilson Homes',
    status: 'DESIGN',
    priority: 'MEDIUM',
    value: 18500,
    startDate: '2025-09-15T00:00:00Z',
    expectedEndDate: '2025-11-01T00:00:00Z',
    progress: 25,
    projectManager: 'Jane Wilson',
    installer: 'Brown Construction',
    address: '789 Cedar Avenue, Leeds, LS1 3CC',
    description: 'Luxury bathroom renovation with walk-in shower',
    rooms: ['Master Bathroom', 'En-suite'],
    notes: 'Accessibility features required',
  },
  {
    id: '3',
    title: 'Davis Properties Commercial',
    client: 'Davis Properties Ltd',
    status: 'PLANNING',
    priority: 'HIGH',
    value: 45000,
    startDate: '2025-10-01T00:00:00Z',
    expectedEndDate: '2025-12-20T00:00:00Z',
    progress: 10,
    projectManager: 'Mike Johnson',
    installer: 'TBD',
    address: '456 Business Park, Birmingham, B1 2BB',
    description: 'Commercial kitchen and bathroom fit-out for office building',
    rooms: ['Commercial Kitchen', 'Washrooms'],
    notes: 'Multiple phases across 3 floors',
  },
  {
    id: '4',
    title: 'Anderson Kitchen & Utility',
    client: 'Anderson Estates',
    status: 'COMPLETED',
    priority: 'LOW',
    value: 22000,
    startDate: '2025-07-15T00:00:00Z',
    expectedEndDate: '2025-08-30T00:00:00Z',
    progress: 100,
    projectManager: 'John Smith',
    installer: 'Brown Construction',
    address: '654 Birch Lane, Newcastle, NE1 5EE',
    description: 'Kitchen renovation with separate utility room',
    rooms: ['Kitchen', 'Utility Room'],
    notes: 'Project completed on time and under budget',
  },
  {
    id: '5',
    title: 'Brown Construction Office',
    client: 'Brown Construction',
    status: 'ON_HOLD',
    priority: 'LOW',
    value: 8500,
    startDate: '2025-08-01T00:00:00Z',
    expectedEndDate: '2025-09-15T00:00:00Z',
    progress: 40,
    projectManager: 'Jane Wilson',
    installer: 'Brown Construction',
    address: '321 Industrial Estate, Liverpool, L1 4DD',
    description: 'Office kitchen and washroom upgrade',
    rooms: ['Office Kitchen', 'Washroom'],
    notes: 'On hold due to planning delays',
  },
];

const statusColors = {
  PLANNING: 'bg-blue-100 text-blue-800',
  DESIGN: 'bg-purple-100 text-purple-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  ON_HOLD: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
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

function getProgressColor(progress: number) {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 50) return 'bg-yellow-500';
  if (progress >= 25) return 'bg-blue-500';
  return 'bg-gray-500';
}

export default function JobsPage() {
  const [jobs, setJobs] = useState(initialJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [managerFilter, setManagerFilter] = useState('');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || job.status === statusFilter;
    const matchesPriority = !priorityFilter || job.priority === priorityFilter;
    const matchesManager = !managerFilter || job.projectManager === managerFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesManager;
  });

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-full">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {filteredJobs.length} jobs
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Export
                </button>
                <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Create Job
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
                  placeholder="Search jobs..."
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
                  <option value="PLANNING">Planning</option>
                  <option value="DESIGN">Design</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Manager
                </label>
                <select
                  id="manager"
                  value={managerFilter}
                  onChange={(e) => setManagerFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="">All Managers</option>
                  <option value="John Smith">John Smith</option>
                  <option value="Jane Wilson">Jane Wilson</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {job.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[job.status as keyof typeof statusColors]}`}>
                          {job.status.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[job.priority as keyof typeof priorityColors]}`}>
                          {job.priority}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          <p><span className="font-medium">Client:</span> {job.client}</p>
                          <p><span className="font-medium">Value:</span> {formatCurrency(job.value)}</p>
                          <p><span className="font-medium">Manager:</span> {job.projectManager}</p>
                        </div>
                        <div className="space-y-1">
                          <p><span className="font-medium">Start Date:</span> {formatDate(job.startDate)}</p>
                          <p><span className="font-medium">End Date:</span> {formatDate(job.expectedEndDate)}</p>
                          <p><span className="font-medium">Installer:</span> {job.installer}</p>
                        </div>
                        <div className="space-y-1">
                          <p><span className="font-medium">Rooms:</span></p>
                          <div className="flex flex-wrap gap-1">
                            {job.rooms.map((room, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {room}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p><span className="font-medium">Address:</span></p>
                          <p className="text-xs">{job.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">Progress</span>
                      <span className="text-gray-600">{job.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(job.progress)}`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  {job.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {job.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
