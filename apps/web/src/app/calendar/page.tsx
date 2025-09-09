'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useCRM } from '@/contexts/CRMContext';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CalendarPage() {
  const { leads, jobs } = useCRM();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('list');

  // Get upcoming activities from leads and jobs
  const upcomingActivities = [
    ...leads.map(lead => ({
      id: `lead-${lead.id}`,
      title: `Follow up: ${lead.name}`,
      type: 'lead' as const,
      date: lead.lastContact,
      client: lead.name,
      status: lead.status,
      description: `Follow up on lead for ${lead.projectType}`,
      value: lead.value,
    })),
    ...jobs.map(job => ({
      id: `job-${job.id}`,
      title: job.title,
      type: 'job' as const,
      date: job.startDate,
      client: job.clientName,
      status: job.status,
      description: job.description,
      value: job.value,
      endDate: job.endDate,
      progress: job.progress,
    }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const todayActivities = upcomingActivities.filter(activity => {
    const activityDate = new Date(activity.date);
    const today = new Date();
    return activityDate.toDateString() === today.toDateString();
  });

  const thisWeekActivities = upcomingActivities.filter(activity => {
    const activityDate = new Date(activity.date);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return activityDate >= today && activityDate <= weekFromNow;
  });

  const typeColors = {
    lead: 'bg-blue-100 text-blue-800',
    job: 'bg-green-100 text-green-800',
  };

  const statusColors = {
    // Lead statuses
    NEW: 'bg-blue-100 text-blue-800',
    CONTACTED: 'bg-yellow-100 text-yellow-800',
    QUALIFIED: 'bg-purple-100 text-purple-800',
    PROPOSAL: 'bg-indigo-100 text-indigo-800',
    WON: 'bg-green-100 text-green-800',
    LOST: 'bg-red-100 text-red-800',
    // Job statuses
    PLANNING: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    ON_HOLD: 'bg-red-100 text-red-800',
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900">Calendar</h1>
            <p className="mt-2 text-sm text-gray-700">
              View and manage your schedule, appointments, and project timelines.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`rounded-md px-3 py-2 text-sm font-semibold ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300'
                }`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setViewMode('week')}
                className={`rounded-md px-3 py-2 text-sm font-semibold ${
                  viewMode === 'week'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300'
                }`}
              >
                Week
              </button>
              <button
                type="button"
                onClick={() => setViewMode('month')}
                className={`rounded-md px-3 py-2 text-sm font-semibold ${
                  viewMode === 'month'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300'
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{todayActivities.length}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Today</dt>
                    <dd className="text-lg font-medium text-gray-900">{todayActivities.length} activities</dd>
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
                    <span className="text-white text-sm font-medium">{thisWeekActivities.length}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">This Week</dt>
                    <dd className="text-lg font-medium text-gray-900">{thisWeekActivities.length} activities</dd>
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
                      {jobs.filter(j => j.status === 'IN_PROGRESS').length}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {jobs.filter(j => j.status === 'IN_PROGRESS').length} in progress
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
                    <span className="text-white text-sm font-medium">
                      {leads.filter(l => ['NEW', 'CONTACTED'].includes(l.status)).length}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Follow-ups</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {leads.filter(l => ['NEW', 'CONTACTED'].includes(l.status)).length} pending
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'list' && (
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Activities</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                {upcomingActivities.slice(0, 20).map((activity) => (
                  <li key={activity.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${typeColors[activity.type]}`}>
                              {activity.type}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-500">{activity.client}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusColors[activity.status as keyof typeof statusColors]}`}>
                            {activity.status}
                          </span>
                          <p className="text-sm text-gray-500">{formatDateTime(activity.date)}</p>
                        </div>
                      </div>
                      {activity.description && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                      )}
                      {activity.type === 'job' && 'progress' in activity && (
                        <div className="mt-2 flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${activity.progress}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-500">{activity.progress}%</span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
                {upcomingActivities.length === 0 && (
                  <li>
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-gray-500">No upcoming activities scheduled.</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {viewMode === 'week' && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Week View</h2>
            <div className="text-center py-12">
              <p className="text-gray-500">Weekly calendar view coming soon...</p>
              <p className="text-sm text-gray-400 mt-2">
                For now, use the List view to see all activities.
              </p>
            </div>
          </div>
        )}

        {viewMode === 'month' && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Month View</h2>
            <div className="text-center py-12">
              <p className="text-gray-500">Monthly calendar view coming soon...</p>
              <p className="text-sm text-gray-400 mt-2">
                For now, use the List view to see all activities.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
