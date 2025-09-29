'use client'

import React, { useState } from 'react'
import { 
  Link, Plus, Settings, Search, Filter, Power,
  CheckCircle, XCircle, AlertTriangle, Clock,
  Zap, Database, Mail, Phone, FileText, Globe,
  Users, ShoppingCart, DollarSign, BarChart3,
  Shield, Key, RefreshCw, Download, Upload,
  ExternalLink, Activity, Calendar, MessageSquare
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  category: string
  provider: string
  version: string
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  isEnabled: boolean
  lastSync: Date | null
  syncFrequency: string
  dataTypes: string[]
  connectionHealth: number
  totalRecords: number
  lastError?: string
  configurations: Record<string, any>
  icon: React.ComponentType<any>
  color: string
}

interface IntegrationCategory {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  integrations: number
}

export function IntegrationDashboard() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Xero Accounting',
      description: 'Sync financial data and invoicing with Xero accounting software',
      category: 'Finance',
      provider: 'Xero',
      version: '3.2.1',
      status: 'connected',
      isEnabled: true,
      lastSync: new Date('2024-01-20T10:30:00'),
      syncFrequency: 'hourly',
      dataTypes: ['invoices', 'payments', 'customers', 'products'],
      connectionHealth: 98,
      totalRecords: 1247,
      configurations: { apiKey: '***hidden***', webhookUrl: 'https://api.crm.com/webhooks/xero' },
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      id: '2',
      name: 'Mailchimp',
      description: 'Email marketing automation and campaign management',
      category: 'Marketing',
      provider: 'Mailchimp',
      version: '2.8.4',
      status: 'connected',
      isEnabled: true,
      lastSync: new Date('2024-01-20T09:15:00'),
      syncFrequency: 'daily',
      dataTypes: ['contacts', 'campaigns', 'lists', 'analytics'],
      connectionHealth: 95,
      totalRecords: 3456,
      configurations: { apiKey: '***hidden***', listId: 'mc_001', audienceId: 'aud_123' },
      icon: Mail,
      color: 'bg-yellow-500'
    },
    {
      id: '3',
      name: 'Slack',
      description: 'Team communication and notification integration',
      category: 'Communication',
      provider: 'Slack',
      version: '1.5.2',
      status: 'connected',
      isEnabled: true,
      lastSync: new Date('2024-01-20T11:45:00'),
      syncFrequency: 'real-time',
      dataTypes: ['messages', 'channels', 'users'],
      connectionHealth: 100,
      totalRecords: 892,
      configurations: { webhookUrl: 'https://hooks.slack.com/services/...', channel: '#crm-alerts' },
      icon: MessageSquare,
      color: 'bg-purple-500'
    },
    {
      id: '4',
      name: 'Google Calendar',
      description: 'Schedule synchronization and appointment management',
      category: 'Productivity',
      provider: 'Google',
      version: '4.1.0',
      status: 'error',
      isEnabled: false,
      lastSync: new Date('2024-01-19T14:20:00'),
      syncFrequency: 'bi-directional',
      dataTypes: ['events', 'calendars', 'attendees'],
      connectionHealth: 0,
      totalRecords: 0,
      lastError: 'OAuth token expired. Please re-authorize.',
      configurations: { clientId: 'google_client_123', calendarId: 'primary' },
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      id: '5',
      name: 'Zapier',
      description: 'Automation workflows and trigger-based actions',
      category: 'Automation',
      provider: 'Zapier',
      version: '2.3.7',
      status: 'pending',
      isEnabled: false,
      lastSync: null,
      syncFrequency: 'trigger-based',
      dataTypes: ['webhooks', 'triggers', 'actions'],
      connectionHealth: 0,
      totalRecords: 0,
      configurations: { apiKey: '***pending***' },
      icon: Zap,
      color: 'bg-orange-500'
    },
    {
      id: '6',
      name: 'Salesforce',
      description: 'CRM data synchronization and lead management',
      category: 'CRM',
      provider: 'Salesforce',
      version: '5.0.2',
      status: 'disconnected',
      isEnabled: false,
      lastSync: new Date('2024-01-15T16:30:00'),
      syncFrequency: 'daily',
      dataTypes: ['leads', 'contacts', 'opportunities', 'accounts'],
      connectionHealth: 0,
      totalRecords: 0,
      configurations: {},
      icon: Users,
      color: 'bg-blue-600'
    }
  ])

  const [categories] = useState<IntegrationCategory[]>([
    {
      id: '1',
      name: 'Finance',
      description: 'Accounting and financial integrations',
      icon: DollarSign,
      color: 'bg-green-100 text-green-800',
      integrations: 3
    },
    {
      id: '2',
      name: 'Marketing',
      description: 'Email marketing and campaign tools',
      icon: Mail,
      color: 'bg-yellow-100 text-yellow-800',
      integrations: 5
    },
    {
      id: '3',
      name: 'Communication',
      description: 'Team communication and messaging',
      icon: MessageSquare,
      color: 'bg-purple-100 text-purple-800',
      integrations: 2
    },
    {
      id: '4',
      name: 'Productivity',
      description: 'Calendar and task management',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-800',
      integrations: 4
    },
    {
      id: '5',
      name: 'Automation',
      description: 'Workflow automation tools',
      icon: Zap,
      color: 'bg-orange-100 text-orange-800',
      integrations: 3
    },
    {
      id: '6',
      name: 'CRM',
      description: 'Customer relationship management',
      icon: Users,
      color: 'bg-indigo-100 text-indigo-800',
      integrations: 2
    }
  ])

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'disconnected': return <XCircle className="h-4 w-4 text-gray-500" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800'
      case 'disconnected': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-600'
    if (health >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId
          ? { ...integration, isEnabled: !integration.isEnabled }
          : integration
      )
    )
  }

  const reconnectIntegration = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId
          ? { 
              ...integration, 
              status: 'connected',
              connectionHealth: 100,
              lastError: undefined,
              lastSync: new Date()
            }
          : integration
      )
    )
  }

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || integration.category === filterCategory
    const matchesStatus = !filterStatus || integration.status === filterStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const connectedIntegrations = integrations.filter(i => i.status === 'connected').length
  const totalRecords = integrations.reduce((sum, i) => sum + i.totalRecords, 0)
  const avgHealth = integrations.filter(i => i.status === 'connected')
    .reduce((sum, i, _, arr) => sum + i.connectionHealth / arr.length, 0)

  if (selectedIntegration) {
    const IconComponent = selectedIntegration.icon
    
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedIntegration(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Integrations
            </button>
            <div className="flex items-center space-x-3">
              <div className={`p-3 ${selectedIntegration.color} text-white rounded-lg`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedIntegration.name}</h2>
                <p className="text-gray-600">{selectedIntegration.description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => toggleIntegration(selectedIntegration.id)}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                selectedIntegration.isEnabled
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Power className="h-4 w-4" />
              <span>{selectedIntegration.isEnabled ? 'Disable' : 'Enable'}</span>
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configure</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Connection Status */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Connection Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(selectedIntegration.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedIntegration.status)}`}>
                      {selectedIntegration.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedIntegration.status === 'connected' ? 'Integration is working properly' :
                     selectedIntegration.status === 'error' ? selectedIntegration.lastError :
                     selectedIntegration.status === 'pending' ? 'Connection is being established' :
                     'Integration is not connected'}
                  </p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <span className={`font-medium ${getHealthColor(selectedIntegration.connectionHealth)}`}>
                      {selectedIntegration.connectionHealth}% Health
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Connection stability and performance</p>
                </div>
              </div>

              {selectedIntegration.status === 'error' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-700">{selectedIntegration.lastError}</span>
                    </div>
                    <button
                      onClick={() => reconnectIntegration(selectedIntegration.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Reconnect
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sync Information */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Synchronization</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Last Sync:</span>
                  <p className="font-medium">
                    {selectedIntegration.lastSync 
                      ? selectedIntegration.lastSync.toLocaleString()
                      : 'Never'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Frequency:</span>
                  <p className="font-medium capitalize">{selectedIntegration.syncFrequency}</p>
                </div>
                <div>
                  <span className="text-gray-600">Records Synced:</span>
                  <p className="font-medium">{selectedIntegration.totalRecords.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-gray-600 text-sm">Data Types:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedIntegration.dataTypes.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Sync Now</span>
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export Data</span>
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Import Data</span>
                </button>
              </div>
            </div>

            {/* Configuration */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Configuration</h3>
              <div className="space-y-4">
                {Object.entries(selectedIntegration.configurations).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                    </span>
                    <span className="text-sm text-gray-600 font-mono">
                      {String(value).includes('***') ? value : `${String(value).substring(0, 20)}...`}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-blue-600 text-sm hover:text-blue-800">
                Edit Configuration →
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-medium">{selectedIntegration.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium">{selectedIntegration.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{selectedIntegration.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Enabled:</span>
                  <span className={`font-medium ${selectedIntegration.isEnabled ? 'text-green-600' : 'text-gray-600'}`}>
                    {selectedIntegration.isEnabled ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-gray-900">Sync completed successfully</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">2 hours ago</p>
                </div>
                <div className="text-sm">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-3 w-3 text-blue-500" />
                    <span className="text-gray-900">Configuration updated</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">1 day ago</p>
                </div>
                <div className="text-sm">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-3 w-3 text-purple-500" />
                    <span className="text-gray-900">Integration enabled</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">3 days ago</p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Support & Documentation</h3>
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Integration Guide</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>API Documentation</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Troubleshooting</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Contact Support</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Integration Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage and monitor your third-party integrations</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Integration</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Link className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Connected</p>
              <p className="text-2xl font-bold text-gray-900">{connectedIntegrations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Database className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{totalRecords.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Health</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(avgHealth)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Globe className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <div
              key={category.id}
              className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => setFilterCategory(filterCategory === category.name ? '' : category.name)}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-lg ${category.color}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.integrations} available</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="connected">Connected</option>
            <option value="disconnected">Disconnected</option>
            <option value="error">Error</option>
            <option value="pending">Pending</option>
          </select>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link className="h-4 w-4" />
            <span>{filteredIntegrations.length} integrations</span>
          </div>
        </div>
      </div>

      {/* Integrations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => {
          const IconComponent = integration.icon
          return (
            <div key={integration.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 ${integration.color} text-white rounded-lg`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-600">{integration.category}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                  {integration.status.toUpperCase()}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{integration.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-500">Health:</span>
                  <span className={`ml-1 font-medium ${getHealthColor(integration.connectionHealth)}`}>
                    {integration.connectionHealth}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Records:</span>
                  <span className="ml-1 font-medium">{integration.totalRecords.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Version:</span>
                  <span className="ml-1 font-medium">{integration.version}</span>
                </div>
                <div>
                  <span className="text-gray-500">Sync:</span>
                  <span className="ml-1 font-medium capitalize">{integration.syncFrequency}</span>
                </div>
              </div>

              {integration.lastError && (
                <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  {integration.lastError}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedIntegration(integration)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                >
                  View Details
                </button>
                <button
                  onClick={() => toggleIntegration(integration.id)}
                  className={`p-2 rounded ${
                    integration.isEnabled 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                  title={integration.isEnabled ? 'Disable' : 'Enable'}
                >
                  <Power className="h-4 w-4" />
                </button>
                <button
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <Link className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterCategory || filterStatus ? 'No matching integrations found' : 'No integrations configured'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterCategory || filterStatus 
              ? 'Try adjusting your filters to see more results'
              : 'Connect your favorite tools to streamline workflows'
            }
          </p>
          {!searchTerm && !filterCategory && !filterStatus && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Add First Integration
            </button>
          )}
        </div>
      )}
    </div>
  )
}