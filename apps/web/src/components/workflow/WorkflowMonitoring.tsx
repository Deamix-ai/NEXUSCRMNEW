'use client'

import React, { useState } from 'react'
import { 
  Activity, Play, Pause, AlertCircle, CheckCircle, 
  XCircle, Clock, BarChart3, TrendingUp, TrendingDown,
  Filter, Calendar, Search, Download, RefreshCw,
  Zap, Target, Users, Mail, Database, FileText,
  Settings, Eye, AlertTriangle, Info, ArrowUpRight
} from 'lucide-react'

interface WorkflowExecution {
  id: string
  workflowId: string
  workflowName: string
  status: 'running' | 'completed' | 'failed' | 'paused' | 'waiting'
  startedAt: Date
  completedAt?: Date
  duration?: number
  triggeredBy: string
  currentStep: string
  totalSteps: number
  completedSteps: number
  errorMessage?: string
  data: Record<string, any>
}

interface WorkflowMetrics {
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  averageExecutionTime: number
  executionsToday: number
  activeExecutions: number
  mostUsedWorkflow: string
  successRate: number
}

interface WorkflowPerformance {
  workflowId: string
  workflowName: string
  executions: number
  successRate: number
  averageTime: number
  lastRun: Date
  trend: 'up' | 'down' | 'stable'
}

export function WorkflowMonitoring() {
  const [executions] = useState<WorkflowExecution[]>([
    {
      id: '1',
      workflowId: 'wf1',
      workflowName: 'New Lead Assignment',
      status: 'completed',
      startedAt: new Date('2024-01-20T10:30:00'),
      completedAt: new Date('2024-01-20T10:32:15'),
      duration: 135,
      triggeredBy: 'System',
      currentStep: 'Send Notification',
      totalSteps: 3,
      completedSteps: 3,
      data: { leadId: 'lead_123', assignedTo: 'john.smith@company.com' }
    },
    {
      id: '2',
      workflowId: 'wf2',
      workflowName: 'Follow-up Reminder System',
      status: 'running',
      startedAt: new Date('2024-01-20T11:00:00'),
      triggeredBy: 'Schedule',
      currentStep: 'Check Overdue Tasks',
      totalSteps: 4,
      completedSteps: 1,
      data: { tasksChecked: 45, overdueFound: 12 }
    },
    {
      id: '3',
      workflowId: 'wf3',
      workflowName: 'Quote Approval Workflow',
      status: 'waiting',
      startedAt: new Date('2024-01-20T09:45:00'),
      triggeredBy: 'User Action',
      currentStep: 'Manager Approval',
      totalSteps: 4,
      completedSteps: 2,
      data: { quoteId: 'quote_456', amount: 15000, managerId: 'manager_789' }
    },
    {
      id: '4',
      workflowId: 'wf1',
      workflowName: 'New Lead Assignment',
      status: 'failed',
      startedAt: new Date('2024-01-20T08:15:00'),
      duration: 45,
      triggeredBy: 'System',
      currentStep: 'Assign User',
      totalSteps: 3,
      completedSteps: 1,
      errorMessage: 'No available sales representatives found',
      data: { leadId: 'lead_124', source: 'website' }
    },
    {
      id: '5',
      workflowId: 'wf4',
      workflowName: 'Customer Satisfaction Survey',
      status: 'paused',
      startedAt: new Date('2024-01-19T16:30:00'),
      triggeredBy: 'Project Completion',
      currentStep: 'Wait 7 Days',
      totalSteps: 3,
      completedSteps: 1,
      data: { projectId: 'proj_789', customerId: 'cust_456' }
    }
  ])

  const [metrics] = useState<WorkflowMetrics>({
    totalExecutions: 1247,
    successfulExecutions: 1189,
    failedExecutions: 58,
    averageExecutionTime: 127,
    executionsToday: 23,
    activeExecutions: 3,
    mostUsedWorkflow: 'New Lead Assignment',
    successRate: 95.3
  })

  const [performance] = useState<WorkflowPerformance[]>([
    {
      workflowId: 'wf1',
      workflowName: 'New Lead Assignment',
      executions: 245,
      successRate: 98.5,
      averageTime: 142,
      lastRun: new Date('2024-01-20T10:32:00'),
      trend: 'up'
    },
    {
      workflowId: 'wf2',
      workflowName: 'Follow-up Reminder System',
      executions: 20,
      successRate: 100,
      averageTime: 89,
      lastRun: new Date('2024-01-20T11:00:00'),
      trend: 'stable'
    },
    {
      workflowId: 'wf3',
      workflowName: 'Quote Approval Workflow',
      executions: 15,
      successRate: 93.3,
      averageTime: 1800,
      lastRun: new Date('2024-01-20T09:45:00'),
      trend: 'down'
    },
    {
      workflowId: 'wf4',
      workflowName: 'Customer Satisfaction Survey',
      executions: 8,
      successRate: 87.5,
      averageTime: 604800,
      lastRun: new Date('2024-01-19T16:30:00'),
      trend: 'stable'
    }
  ])

  const [selectedTab, setSelectedTab] = useState<'executions' | 'performance' | 'metrics'>('executions')
  const [statusFilter, setStatusFilter] = useState('')
  const [workflowFilter, setWorkflowFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [timeRange, setTimeRange] = useState('24h')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'running': return <Play className="h-4 w-4 text-blue-500" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      case 'paused': return <Pause className="h-4 w-4 text-yellow-500" />
      case 'waiting': return <Clock className="h-4 w-4 text-gray-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'running': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'waiting': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <ArrowUpRight className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
    return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`
  }

  const filteredExecutions = executions.filter(execution => {
    const matchesSearch = execution.workflowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         execution.triggeredBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || execution.status === statusFilter
    const matchesWorkflow = !workflowFilter || execution.workflowId === workflowFilter
    
    return matchesSearch && matchesStatus && matchesWorkflow
  })

  const uniqueWorkflows = Array.from(new Set(executions.map(e => ({ id: e.workflowId, name: e.workflowName }))))

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflow Monitoring</h2>
          <p className="text-gray-600 mt-1">Monitor workflow executions and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Executions</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.activeExecutions}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Currently running workflows</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">{metrics.successRate}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Overall workflow success rate</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Executions Today</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.executionsToday}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Workflows executed today</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Execution Time</p>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(metrics.averageExecutionTime)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Average completion time</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'executions', label: 'Recent Executions', icon: Activity },
              { id: 'performance', label: 'Performance', icon: BarChart3 },
              { id: 'metrics', label: 'Detailed Metrics', icon: Target }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'executions' && (
            <div>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search executions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="running">Running</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="paused">Paused</option>
                  <option value="waiting">Waiting</option>
                </select>
                <select
                  value={workflowFilter}
                  onChange={(e) => setWorkflowFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Workflows</option>
                  {uniqueWorkflows.map(workflow => (
                    <option key={workflow.id} value={workflow.id}>{workflow.name}</option>
                  ))}
                </select>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Activity className="h-4 w-4" />
                  <span>{filteredExecutions.length} executions</span>
                </div>
              </div>

              {/* Executions List */}
              <div className="space-y-4">
                {filteredExecutions.map((execution) => (
                  <div key={execution.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(execution.status)}
                          <h3 className="font-medium text-gray-900">{execution.workflowName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                            {execution.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Started:</span> {execution.startedAt.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Triggered by:</span> {execution.triggeredBy}
                          </div>
                          <div>
                            <span className="font-medium">Progress:</span> {execution.completedSteps}/{execution.totalSteps} steps
                          </div>
                          {execution.duration && (
                            <div>
                              <span className="font-medium">Duration:</span> {formatDuration(execution.duration)}
                            </div>
                          )}
                        </div>

                        {execution.status === 'running' || execution.status === 'waiting' ? (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>Current step: {execution.currentStep}</span>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${(execution.completedSteps / execution.totalSteps) * 100}%` }}
                              />
                            </div>
                          </div>
                        ) : null}

                        {execution.errorMessage && (
                          <div className="mt-2 flex items-center space-x-2 p-2 bg-red-50 border border-red-200 rounded">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-700">{execution.errorMessage}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {(execution.status === 'running' || execution.status === 'waiting') && (
                          <button
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                            title="Pause Execution"
                          >
                            <Pause className="h-4 w-4" />
                          </button>
                        )}
                        {execution.status === 'paused' && (
                          <button
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                            title="Resume Execution"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'performance' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Workflow Performance Overview</h3>
              <div className="space-y-4">
                {performance.map((workflow) => (
                  <div key={workflow.workflowId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{workflow.workflowName}</h4>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(workflow.trend)}
                        <span className="text-sm text-gray-600">
                          {workflow.trend === 'up' ? 'Improving' : workflow.trend === 'down' ? 'Declining' : 'Stable'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Executions:</span>
                        <span className="ml-2 font-medium">{workflow.executions}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Success Rate:</span>
                        <span className={`ml-2 font-medium ${workflow.successRate >= 95 ? 'text-green-600' : workflow.successRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {workflow.successRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg. Time:</span>
                        <span className="ml-2 font-medium">{formatDuration(workflow.averageTime)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Run:</span>
                        <span className="ml-2 font-medium">{workflow.lastRun.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'metrics' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Detailed Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Execution Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Executions:</span>
                      <span className="font-medium">{metrics.totalExecutions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Successful:</span>
                      <span className="font-medium text-green-600">{metrics.successfulExecutions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Failed:</span>
                      <span className="font-medium text-red-600">{metrics.failedExecutions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-medium">{metrics.successRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg. Execution Time:</span>
                      <span className="font-medium">{formatDuration(metrics.averageExecutionTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Executions Today:</span>
                      <span className="font-medium">{metrics.executionsToday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Currently Active:</span>
                      <span className="font-medium">{metrics.activeExecutions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Most Used Workflow:</span>
                      <span className="font-medium">{metrics.mostUsedWorkflow}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}