'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { KPIDashboard } from '@/components/analytics/KPIDashboard';
import { CustomReportBuilder } from '@/components/analytics/CustomReportBuilder';
import { PerformanceAnalytics } from '@/components/analytics/PerformanceAnalytics';
import {
  useRefreshAnalytics,
  useSaveReport,
  useRunReport,
  useDeleteReport,
  useDuplicateReport,
} from '@/hooks/api-hooks';
import { 
  BarChart3,
  FileText,
  Activity,
  TrendingUp,
  DollarSign,
  Target,
  Award
} from 'lucide-react';

// Sample data for KPI Dashboard
const sampleKPIMetrics = [
  {
    id: 'total_revenue',
    title: 'Total Revenue',
    value: 156780,
    previousValue: 142300,
    change: 10.2,
    changeType: 'increase' as const,
    target: 180000,
    unit: 'currency' as const,
    category: 'sales' as const,
    trend: [120000, 125000, 138000, 142000, 148000, 152000, 156780],
    status: 'good' as const,
    description: 'Total revenue generated from all closed deals this period'
  },
  {
    id: 'total_deals',
    title: 'Deals Closed',
    value: 47,
    previousValue: 42,
    change: 11.9,
    changeType: 'increase' as const,
    target: 60,
    unit: 'number' as const,
    category: 'sales' as const,
    trend: [35, 38, 40, 42, 44, 46, 47],
    status: 'good' as const,
    description: 'Number of successfully closed deals'
  },
  {
    id: 'conversion_rate',
    title: 'Lead Conversion Rate',
    value: 24.3,
    previousValue: 22.1,
    change: 10.0,
    changeType: 'increase' as const,
    target: 30,
    unit: 'percentage' as const,
    category: 'pipeline' as const,
    trend: [20.5, 21.2, 21.8, 22.1, 23.2, 23.8, 24.3],
    status: 'good' as const,
    description: 'Percentage of leads that convert to projects'
  },
  {
    id: 'pipeline_value',
    title: 'Pipeline Value',
    value: 284500,
    previousValue: 267800,
    change: 6.2,
    changeType: 'increase' as const,
    target: 350000,
    unit: 'currency' as const,
    category: 'pipeline' as const,
    trend: [240000, 248000, 256000, 267800, 272000, 278000, 284500],
    status: 'warning' as const,
    description: 'Total value of deals in active pipeline'
  },
  {
    id: 'average_deal_size',
    title: 'Average Deal Size',
    value: 3335,
    previousValue: 3388,
    change: -1.6,
    changeType: 'decrease' as const,
    target: 4000,
    unit: 'currency' as const,
    category: 'sales' as const,
    trend: [3200, 3280, 3350, 3388, 3365, 3340, 3335],
    status: 'warning' as const,
    description: 'Average value per closed deal'
  }
];

// Sample data for Custom Report Builder
const sampleReportFields = [
  {
    id: 'enquiry_title',
    name: 'Enquiry Title',
    type: 'string' as const,
    source: 'enquiries' as const,
    category: 'dimensions' as const,
    description: 'Title of the enquiry'
  },
  {
    id: 'enquiry_value',
    name: 'Estimated Value',
    type: 'currency' as const,
    source: 'enquiries' as const,
    category: 'measures' as const,
    description: 'Estimated value of the enquiry',
    aggregation: 'sum' as const
  }
];

const sampleSavedReports = [
  {
    id: '1',
    name: 'Monthly Sales Report',
    description: 'Comprehensive monthly sales performance analysis',
    type: 'table' as const,
    fields: ['enquiry_title', 'enquiry_value'],
    filters: [],
    sorts: [],
    isPublic: false,
    tags: ['sales', 'monthly'],
    createdBy: 'John Smith',
    createdAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-09-15T14:30:00Z',
    lastRun: '2024-09-18T09:15:00Z'
  }
];

// Sample data for Performance Analytics
const samplePerformanceMetrics = [
  {
    id: 'revenue_growth',
    category: 'sales' as const,
    name: 'Revenue Growth',
    value: 15.2,
    previousValue: 12.8,
    target: 20,
    unit: 'percentage' as const,
    trend: 'up' as const,
    changePercent: 18.8,
    status: 'good' as const,
    description: 'Year-over-year revenue growth percentage',
    benchmark: 18
  }
];

const sampleTeamMembers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Senior Sales Executive',
    metrics: {
      revenue: 89500,
      deals: 27,
      conversionRate: 28.5,
      activities: 156,
      responseTime: 1.8
    },
    targets: {
      revenue: 100000,
      deals: 30,
      conversionRate: 25
    },
    performance: {
      rank: 1,
      score: 92,
      trend: 'up' as const
    }
  }
];

const samplePipelineMetrics = [
  {
    stage: 'Enquiry',
    count: 45,
    value: 135000,
    averageAge: 3,
    conversionRate: 68.2,
    velocity: 12
  }
];

const sampleActivityMetrics = [
  {
    type: 'calls' as const,
    count: 245,
    successRate: 67.3,
    averageResponseTime: 2.4,
    trend: 'up' as const
  }
];

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState<'kpi' | 'reports' | 'performance'>('kpi');
  const [dateRange, setDateRange] = useState('month');

  // React Query hooks
  const refreshAnalytics = useRefreshAnalytics();
  const saveReport = useSaveReport();
  const runReport = useRunReport();
  const deleteReport = useDeleteReport();
  const duplicateReport = useDuplicateReport();

  const handleRefreshData = () => {
    refreshAnalytics.mutate();
  };

  const handleSaveReport = (report: any) => {
    saveReport.mutate(report);
  };

  const handleRunReport = (report: any) => {
    runReport.mutate({ reportId: report.id, params: report.parameters });
  };

  const handleDeleteReport = (reportId: string) => {
    deleteReport.mutate(reportId);
  };

  const handleDuplicateReport = (reportId: string) => {
    duplicateReport.mutate(reportId);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Reporting & Analytics Dashboard
                </h1>
                <p className="text-gray-600">
                  Comprehensive business intelligence and performance monitoring
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Revenue</p>
                    <p className="text-2xl font-bold">£156,780</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+10.2% from last month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Active Deals</p>
                    <p className="text-2xl font-bold">102</p>
                  </div>
                  <Target className="h-8 w-8 text-green-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+8 new this week</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Conversion Rate</p>
                    <p className="text-2xl font-bold">24.3%</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+2.2% improvement</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Team Performance</p>
                    <p className="text-2xl font-bold">84%</p>
                  </div>
                  <Award className="h-8 w-8 text-orange-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">Above target</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'kpi', label: 'KPI Dashboard', icon: BarChart3 },
                { id: 'reports', label: 'Custom Reports', icon: FileText },
                { id: 'performance', label: 'Performance Analytics', icon: Activity }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          {activeTab === 'kpi' && (
            <KPIDashboard
              metrics={sampleKPIMetrics}
              charts={[]}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onRefresh={handleRefreshData}
            />
          )}

          {activeTab === 'reports' && (
            <CustomReportBuilder
              fields={sampleReportFields}
              savedReports={sampleSavedReports}
              onSaveReport={handleSaveReport}
              onRunReport={handleRunReport}
              onDeleteReport={handleDeleteReport}
              onDuplicateReport={handleDuplicateReport}
            />
          )}

          {activeTab === 'performance' && (
            <PerformanceAnalytics
              metrics={samplePerformanceMetrics}
              teamMembers={sampleTeamMembers}
              pipelineMetrics={samplePipelineMetrics}
              activityMetrics={sampleActivityMetrics}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onRefresh={handleRefreshData}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
