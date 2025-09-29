'use client'

import React, { useState } from 'react'
import { 
  Workflow, Settings, Activity, FileText, 
  BarChart3, Plus, Target, Zap, CheckCircle,
  Clock, Users, ArrowRight, TrendingUp
} from 'lucide-react'
import { WorkflowBuilder } from '@/components/workflow/WorkflowBuilder'
import { AutomationRules } from '@/components/workflow/AutomationRules'
import { ProcessTemplates } from '@/components/workflow/ProcessTemplates'
import { WorkflowMonitoring } from '@/components/workflow/WorkflowMonitoring'

export default function WorkflowAutomationPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'builder' | 'rules' | 'templates' | 'monitoring'>('overview')

  const stats = {
    activeWorkflows: 12,
    automationRules: 8,
    processTemplates: 15,
    executionsToday: 23,
    successRate: 95.3,
    timeSaved: 240
  }

  const recentActivity = [
    {
      id: '1',
      type: 'workflow_completed',
      title: 'New Lead Assignment workflow completed',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      id: '2',
      type: 'rule_triggered',
      title: 'Quote Approval rule triggered',
      time: '15 minutes ago',
      status: 'waiting'
    },
    {
      id: '3',
      type: 'template_used',
      title: 'Customer Onboarding template used',
      time: '1 hour ago',
      status: 'success'
    },
    {
      id: '4',
      type: 'workflow_failed',
      title: 'Follow-up Reminder workflow failed',
      time: '2 hours ago',
      status: 'error'
    }
  ]

  const quickActions = [
    {
      title: 'Create Workflow',
      description: 'Build a new automated workflow',
      icon: Workflow,
      color: 'bg-blue-500',
      action: () => setActiveTab('builder')
    },
    {
      title: 'Add Automation Rule',
      description: 'Set up a new automation rule',
      icon: Zap,
      color: 'bg-green-500',
      action: () => setActiveTab('rules')
    },
    {
      title: 'Use Template',
      description: 'Start from a process template',
      icon: FileText,
      color: 'bg-purple-500',
      action: () => setActiveTab('templates')
    },
    {
      title: 'View Monitoring',
      description: 'Check workflow performance',
      icon: BarChart3,
      color: 'bg-orange-500',
      action: () => setActiveTab('monitoring')
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workflow_completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rule_triggered': return <Zap className="h-4 w-4 text-yellow-500" />
      case 'template_used': return <FileText className="h-4 w-4 text-blue-500" />
      case 'workflow_failed': return <Activity className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200'
      case 'waiting': return 'bg-yellow-50 border-yellow-200'
      case 'error': return 'bg-red-50 border-red-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  if (activeTab !== 'overview') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="px-6 py-4">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Target },
                { id: 'builder', label: 'Workflow Builder', icon: Workflow },
                { id: 'rules', label: 'Automation Rules', icon: Zap },
                { id: 'templates', label: 'Process Templates', icon: FileText },
                { id: 'monitoring', label: 'Monitoring', icon: BarChart3 }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="min-h-screen">
          {activeTab === 'builder' && <WorkflowBuilder />}
          {activeTab === 'rules' && <AutomationRules />}
          {activeTab === 'templates' && <ProcessTemplates />}
          {activeTab === 'monitoring' && <WorkflowMonitoring />}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Advanced Workflow Automation</h1>
              <p className="text-gray-600 mt-1">Streamline your business processes with intelligent automation</p>
            </div>
            <button
              onClick={() => setActiveTab('builder')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Workflow</span>
            </button>
          </div>

          <nav className="flex space-x-8 mt-4">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'builder', label: 'Workflow Builder', icon: Workflow },
              { id: 'rules', label: 'Automation Rules', icon: Zap },
              { id: 'templates', label: 'Process Templates', icon: FileText },
              { id: 'monitoring', label: 'Monitoring', icon: BarChart3 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Workflow className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeWorkflows}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Automation Rules</p>
                <p className="text-2xl font-bold text-gray-900">{stats.automationRules}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Templates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.processTemplates}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Executions Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.executionsToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">{stats.successRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Saved (hrs)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.timeSaved}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                <p className="text-sm text-gray-600 mt-1">Get started with workflow automation</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon
                    return (
                      <button
                        key={index}
                        onClick={action.action}
                        className="text-left p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 ${action.color} text-white rounded-lg group-hover:scale-110 transition-transform`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-lg border mt-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Workflow Performance</h2>
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>+12% this month</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <div className="flex items-end justify-between h-full space-x-2">
                    {/* Sample performance data visualization */}
                    {[
                      { label: 'Jan', value: 85, executions: 142 },
                      { label: 'Feb', value: 92, executions: 158 },
                      { label: 'Mar', value: 78, executions: 134 },
                      { label: 'Apr', value: 96, executions: 167 },
                      { label: 'May', value: 89, executions: 145 },
                      { label: 'Jun', value: 94, executions: 178 },
                      { label: 'Jul', value: 87, executions: 156 }
                    ].map((data, index) => (
                      <div key={data.label} className="flex flex-col items-center space-y-2 flex-1">
                        <div className="flex flex-col items-center space-y-1 text-xs text-gray-600">
                          <span className="font-medium">{data.value}%</span>
                          <span className="text-gray-400">{data.executions}</span>
                        </div>
                        <div 
                          className="w-full bg-blue-500 rounded-t-sm transition-all duration-500 hover:bg-blue-600"
                          style={{ height: `${data.value}%` }}
                          title={`${data.label}: ${data.value}% success rate, ${data.executions} executions`}
                        />
                        <span className="text-xs text-gray-500 font-medium">{data.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Success Rate (%)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-400">Executions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <p className="text-sm text-gray-600 mt-1">Latest workflow events and executions</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className={`p-3 rounded-lg border ${getActivityStatusColor(activity.status)}`}
                    >
                      <div className="flex items-start space-x-3">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => setActiveTab('monitoring')}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All Activity →
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg border mt-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Workflow Engine</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Automation Rules</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Background Tasks</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-yellow-600">Processing</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Connections</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}