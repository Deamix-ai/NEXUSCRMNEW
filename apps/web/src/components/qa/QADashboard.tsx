'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Bug,
  TestTube,
  FileText,
  TrendingUp,
  Users,
  Activity,
  BarChart3,
  Plus,
  Search,
  Filter,
  Eye,
  Play,
  Pause,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data - in a real app this would come from API
const mockQAMetrics = {
  testPlans: { total: 25, draft: 3, active: 18, completed: 4 },
  testCases: { total: 450, active: 380, deprecated: 70 },
  testExecutions: { total: 1200, passed: 960, failed: 180, blocked: 60, passRate: 80 },
  defects: {
    total: 85,
    open: 15,
    inProgress: 25,
    resolved: 30,
    closed: 15,
    bySevetiry: { LOW: 20, MEDIUM: 35, HIGH: 20, CRITICAL: 8, BLOCKER: 2 },
    byPriority: { LOW: 15, MEDIUM: 40, HIGH: 25, URGENT: 5 }
  },
  quality: { defectDensity: 0.19, testCoverage: 85, criticalDefects: 8, blockerDefects: 2 }
};

const mockTestPlans = [
  {
    id: '1',
    name: 'Bathroom Design Module v2.1',
    description: 'Comprehensive testing of new bathroom design features',
    status: 'ACTIVE',
    version: '2.1',
    testCases: 45,
    executions: 120,
    coverage: 85,
    createdAt: '2024-01-15',
    assignedTo: { firstName: 'Sarah', lastName: 'Wilson' }
  },
  {
    id: '2',
    name: 'Quote Generation System',
    description: 'End-to-end testing of quote and proposal generation',
    status: 'COMPLETED',
    version: '1.0',
    testCases: 32,
    executions: 89,
    coverage: 100,
    createdAt: '2024-01-10',
    assignedTo: { firstName: 'Mike', lastName: 'Johnson' }
  },
];

const mockDefects = [
  {
    id: '1',
    title: 'Quote PDF generation fails for projects with custom items',
    severity: 'HIGH',
    priority: 'HIGH',
    status: 'OPEN',
    reportedBy: { firstName: 'Sarah', lastName: 'Wilson' },
    assignedTo: { firstName: 'Dev', lastName: 'Team' },
    reportedAt: '2024-01-20T10:30:00Z',
    testCase: 'Quote Generation - Custom Items',
    environment: 'Production'
  },
  {
    id: '2',
    title: 'Room measurement validation allows negative values',
    severity: 'MEDIUM',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    reportedBy: { firstName: 'Mike', lastName: 'Johnson' },
    assignedTo: { firstName: 'Alice', lastName: 'Smith' },
    reportedAt: '2024-01-19T14:15:00Z',
    testCase: 'Room Measurement Validation',
    environment: 'Staging'
  },
];

const QADashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASSED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'BLOCKED':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'IN_PROGRESS':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'BLOCKER':
        return 'bg-red-600 text-white';
      case 'CRITICAL':
        return 'bg-red-500 text-white';
      case 'HIGH':
        return 'bg-orange-500 text-white';
      case 'MEDIUM':
        return 'bg-yellow-500 text-black';
      case 'LOW':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'PASSED':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
      case 'OPEN':
        return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'BLOCKED':
        return 'bg-yellow-100 text-yellow-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quality Assurance</h1>
          <p className="text-muted-foreground">
            Test management, defect tracking, and quality metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Test Plan
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Test Plans */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Plans</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockQAMetrics.testPlans.total}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {mockQAMetrics.testPlans.active} active • {mockQAMetrics.testPlans.completed} completed
            </div>
            <div className="flex gap-1 mt-2">
              <div className="text-xs text-green-600">{mockQAMetrics.testPlans.active} Active</div>
              <span className="text-xs text-muted-foreground">•</span>
              <div className="text-xs text-gray-600">{mockQAMetrics.testPlans.draft} Draft</div>
            </div>
          </CardContent>
        </Card>

        {/* Test Cases */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Cases</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockQAMetrics.testCases.total}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {mockQAMetrics.testCases.active} active cases
            </div>
            <div className="flex gap-1 mt-2">
              <div className="text-xs text-green-600">{mockQAMetrics.quality.testCoverage}% Coverage</div>
            </div>
          </CardContent>
        </Card>

        {/* Test Executions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockQAMetrics.testExecutions.passRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {mockQAMetrics.testExecutions.passed} passed • {mockQAMetrics.testExecutions.failed} failed
            </div>
            <div className="flex gap-1 mt-2">
              <div className="text-xs text-green-600">{mockQAMetrics.testExecutions.passed} Passed</div>
              <span className="text-xs text-muted-foreground">•</span>
              <div className="text-xs text-red-600">{mockQAMetrics.testExecutions.failed} Failed</div>
            </div>
          </CardContent>
        </Card>

        {/* Defects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Defects</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockQAMetrics.defects.open + mockQAMetrics.defects.inProgress}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {mockQAMetrics.quality.criticalDefects} critical • {mockQAMetrics.quality.blockerDefects} blocker
            </div>
            <div className="flex gap-1 mt-2">
              <div className="text-xs text-red-600">{mockQAMetrics.defects.open} Open</div>
              <span className="text-xs text-muted-foreground">•</span>
              <div className="text-xs text-blue-600">{mockQAMetrics.defects.inProgress} In Progress</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'test-plans', 'defects', 'executions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-2 px-1 border-b-2 font-medium text-sm capitalize",
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                {tab.replace(/([A-Z])/g, ' $1').replace('-', ' ').trim()}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Test Coverage</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${mockQAMetrics.quality.testCoverage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{mockQAMetrics.quality.testCoverage}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pass Rate</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${mockQAMetrics.testExecutions.passRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{mockQAMetrics.testExecutions.passRate}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Defect Density</span>
                    <span className="text-sm font-medium">{mockQAMetrics.quality.defectDensity} per test</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Test Plans */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Test Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTestPlans.map((plan) => (
                    <div key={plan.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{plan.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {plan.testCases} test cases • {plan.coverage}% coverage
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Plans Tab */}
        {activeTab === 'test-plans' && (
          <div className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search test plans..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Statuses</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Test Plans List */}
            <Card>
              <CardHeader>
                <CardTitle>Test Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTestPlans.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-medium">{plan.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {plan.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(plan.status)}>
                            {plan.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Execute
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">{plan.testCases}</span> test cases
                        </div>
                        <div>
                          <span className="font-medium">{plan.executions}</span> executions
                        </div>
                        <div>
                          <span className="font-medium">{plan.coverage}%</span> coverage
                        </div>
                        <div>
                          Created {formatDate(plan.createdAt)}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Test Coverage</span>
                          <span>{plan.coverage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${plan.coverage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Defects Tab */}
        {activeTab === 'defects' && (
          <div className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search defects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                  <select 
                    value={severityFilter} 
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Severities</option>
                    <option value="BLOCKER">Blocker</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Defects List */}
            <Card>
              <CardHeader>
                <CardTitle>Defects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDefects.map((defect) => (
                    <div key={defect.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{defect.title}</h4>
                            <Badge className={getSeverityColor(defect.severity)}>
                              {defect.severity}
                            </Badge>
                            <Badge className={getStatusColor(defect.status)}>
                              {defect.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Test Case: {defect.testCase}</p>
                            <p>Environment: {defect.environment}</p>
                            <p>
                              Reported by {defect.reportedBy.firstName} {defect.reportedBy.lastName} • 
                              Assigned to {defect.assignedTo?.firstName} {defect.assignedTo?.lastName}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          Reported {formatDate(defect.reportedAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(defect.status)}
                          <span>{defect.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Executions Tab */}
        {activeTab === 'executions' && (
          <Card>
            <CardHeader>
              <CardTitle>Test Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Execution Monitoring</h3>
                <p className="text-sm text-gray-600 mb-4">Advanced test execution tracking and real-time monitoring capabilities.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">This feature is currently in development and will be available in a future release.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QADashboard;