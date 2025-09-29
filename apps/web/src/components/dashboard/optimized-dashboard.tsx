'use client';

import React, { memo, useMemo, Component, ReactNode } from 'react';
import { useOptimizedMemo } from '@/lib/performance';

interface DashboardData {
  metrics: {
    totalLeads: number;
    totalSales: number;
    conversionRate: number;
    revenue: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
  leadsData: Array<{
    date: string;
    count: number;
  }>;
  salesData: Array<{
    date: string;
    amount: number;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    priority: string;
    dueDate: string;
    completed: boolean;
  }>;
}

interface OptimizedDashboardProps {
  data?: DashboardData;
  loading?: boolean;
  error?: Error | null;
}

// Simple Error Boundary
class DashboardErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Something went wrong
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="rounded-md bg-red-100 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-200"
                  onClick={() => this.setState({ hasError: false, error: undefined })}
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Optimized Metrics Cards Component
const MetricsCards = memo<{ metrics: DashboardData['metrics'] }>(({ metrics }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const metricsData = useMemo(() => [
    {
      title: 'Total Leads',
      value: metrics.totalLeads.toLocaleString(),
      icon: '👥',
      color: 'blue'
    },
    {
      title: 'Total Sales',
      value: metrics.totalSales.toLocaleString(),
      icon: '💰',
      color: 'green'
    },
    {
      title: 'Conversion Rate',
      value: formatPercentage(metrics.conversionRate),
      icon: '📈',
      color: 'purple'
    },
    {
      title: 'Revenue',
      value: formatCurrency(metrics.revenue),
      icon: '💷',
      color: 'indigo'
    },
  ], [metrics]);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metricsData.map((metric) => (
        <div key={metric.title} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">{metric.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

MetricsCards.displayName = 'MetricsCards';

// Optimized Recent Activity Component
const RecentActivity = memo<{ activities: DashboardData['recentActivity'] }>(({ activities }) => {
  const limitedActivities = useMemo(() => activities.slice(0, 5), [activities]);

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {limitedActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <p className="text-xs text-gray-500">{formatRelativeTime(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

RecentActivity.displayName = 'RecentActivity';

// Optimized Tasks List Component
const TasksList = memo<{ tasks: DashboardData['tasks'] }>(({ tasks }) => {
  const pendingTasks = useMemo(() => 
    tasks.filter(task => !task.completed).slice(0, 5), 
    [tasks]
  );

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Tasks</h3>
      <div className="space-y-3">
        {pendingTasks.length === 0 ? (
          <p className="text-sm text-gray-500">No pending tasks</p>
        ) : (
          pendingTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

TasksList.displayName = 'TasksList';

// Optimized loading skeleton
const DashboardSkeleton = memo(() => (
  <div className="space-y-6 animate-pulse">
    {/* Metrics cards skeleton */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>

    {/* Activity and tasks skeleton */}
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
));

DashboardSkeleton.displayName = 'DashboardSkeleton';

export const OptimizedDashboard = memo<OptimizedDashboardProps>(({
  data,
  loading = false,
  error = null,
}) => {
  // Memoize data processing
  const processedData = useOptimizedMemo(() => {
    if (!data) return null;

    return {
      metrics: data.metrics,
      recentActivity: data.recentActivity?.slice(0, 10) || [],
      pendingTasks: data.tasks?.filter(task => !task.completed) || [],
    };
  }, [data]);

  // Show loading skeleton
  if (loading || !processedData) {
    return <DashboardSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Failed to load dashboard
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <div className="space-y-6">
        {/* Metrics Cards */}
        <MetricsCards metrics={processedData.metrics} />

        {/* Activity and Tasks Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentActivity activities={processedData.recentActivity} />
          <TasksList tasks={processedData.pendingTasks} />
        </div>
      </div>
    </DashboardErrorBoundary>
  );
});

OptimizedDashboard.displayName = 'OptimizedDashboard';