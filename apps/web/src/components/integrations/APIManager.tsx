'use client'

import React, { useState } from 'react'
import { 
  Settings, Code, Key, Database, Globe, Shield,
  Plus, Search, Filter, CheckCircle, XCircle,
  AlertTriangle, Activity, Clock, Zap, Copy,
  Edit3, Trash2, RefreshCw, Eye, EyeOff,
  ExternalLink, Download, Upload, TestTube,
  BarChart3, Users, Lock, Unlock, FileText
} from 'lucide-react'

interface APIEndpoint {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description: string
  version: string
  isActive: boolean
  authentication: 'none' | 'api_key' | 'oauth' | 'bearer' | 'basic'
  rateLimit: {
    requests: number
    period: string
  }
  lastUsed: Date | null
  totalCalls: number
  successRate: number
  avgResponseTime: number
  category: string
}

interface APIKey {
  id: string
  name: string
  description: string
  key: string
  permissions: string[]
  expiresAt: Date | null
  isActive: boolean
  lastUsed: Date | null
  createdAt: Date
  usageCount: number
  ipWhitelist: string[]
  environment: 'development' | 'staging' | 'production'
}

interface APIMetrics {
  totalEndpoints: number
  activeKeys: number
  totalRequests: number
  averageResponseTime: number
  successRate: number
  requestsToday: number
  errors24h: number
  topEndpoint: string
}

export function APIManager() {
  const [endpoints] = useState<APIEndpoint[]>([
    {
      id: '1',
      name: 'Get Customers',
      method: 'GET',
      path: '/api/v1/customers',
      description: 'Retrieve a list of all customers with optional filtering',
      version: '1.0',
      isActive: true,
      authentication: 'api_key',
      rateLimit: { requests: 1000, period: 'hour' },
      lastUsed: new Date('2024-01-20T10:30:00'),
      totalCalls: 15420,
      successRate: 99.2,
      avgResponseTime: 245,
      category: 'Customers'
    },
    {
      id: '2',
      name: 'Create Lead',
      method: 'POST',
      path: '/api/v1/leads',
      description: 'Create a new lead in the CRM system',
      version: '1.0',
      isActive: true,
      authentication: 'oauth',
      rateLimit: { requests: 500, period: 'hour' },
      lastUsed: new Date('2024-01-20T11:15:00'),
      totalCalls: 8234,
      successRate: 97.8,
      avgResponseTime: 180,
      category: 'Leads'
    },
    {
      id: '3',
      name: 'Update Project Status',
      method: 'PUT',
      path: '/api/v1/projects/{id}/status',
      description: 'Update the status of a specific project',
      version: '1.0',
      isActive: true,
      authentication: 'bearer',
      rateLimit: { requests: 200, period: 'hour' },
      lastUsed: new Date('2024-01-20T09:45:00'),
      totalCalls: 3421,
      successRate: 95.1,
      avgResponseTime: 320,
      category: 'Projects'
    },
    {
      id: '4',
      name: 'Delete Customer',
      method: 'DELETE',
      path: '/api/v1/customers/{id}',
      description: 'Permanently delete a customer record',
      version: '1.0',
      isActive: false,
      authentication: 'api_key',
      rateLimit: { requests: 50, period: 'day' },
      lastUsed: new Date('2024-01-18T14:20:00'),
      totalCalls: 156,
      successRate: 100,
      avgResponseTime: 890,
      category: 'Customers'
    },
    {
      id: '5',
      name: 'Get Analytics Data',
      method: 'GET',
      path: '/api/v1/analytics/dashboard',
      description: 'Retrieve dashboard analytics and KPI data',
      version: '2.0',
      isActive: true,
      authentication: 'bearer',
      rateLimit: { requests: 100, period: 'hour' },
      lastUsed: new Date('2024-01-20T08:30:00'),
      totalCalls: 2891,
      successRate: 98.9,
      avgResponseTime: 1250,
      category: 'Analytics'
    }
  ])

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production Mobile App',
      description: 'API key for the production mobile application',
      key: 'pk_live_51H7...',
      permissions: ['customers:read', 'leads:read', 'leads:create', 'projects:read'],
      expiresAt: new Date('2024-12-31'),
      isActive: true,
      lastUsed: new Date('2024-01-20T11:30:00'),
      createdAt: new Date('2024-01-01'),
      usageCount: 45230,
      ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
      environment: 'production'
    },
    {
      id: '2',
      name: 'Partner Integration',
      description: 'Limited access for partner system integration',
      key: 'pk_test_41G9...',
      permissions: ['customers:read', 'analytics:read'],
      expiresAt: new Date('2024-06-30'),
      isActive: true,
      lastUsed: new Date('2024-01-19T16:45:00'),
      createdAt: new Date('2024-01-15'),
      usageCount: 12567,
      ipWhitelist: ['203.0.113.0/24'],
      environment: 'production'
    },
    {
      id: '3',
      name: 'Development Testing',
      description: 'API key for development environment testing',
      key: 'pk_dev_29F8...',
      permissions: ['*'],
      expiresAt: null,
      isActive: true,
      lastUsed: new Date('2024-01-20T14:20:00'),
      createdAt: new Date('2024-01-10'),
      usageCount: 8934,
      ipWhitelist: [],
      environment: 'development'
    },
    {
      id: '4',
      name: 'Legacy Integration',
      description: 'Deprecated API key for old system',
      key: 'pk_old_83D2...',
      permissions: ['customers:read', 'leads:read'],
      expiresAt: new Date('2024-03-31'),
      isActive: false,
      lastUsed: new Date('2024-01-15T09:12:00'),
      createdAt: new Date('2023-06-01'),
      usageCount: 234567,
      ipWhitelist: ['172.16.0.0/12'],
      environment: 'production'
    }
  ])

  const [selectedTab, setSelectedTab] = useState<'endpoints' | 'keys' | 'docs' | 'testing'>('endpoints')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMethod, setFilterMethod] = useState('')
  const [filterAuth, setFilterAuth] = useState('')
  const [showKeyValue, setShowKeyValue] = useState<string | null>(null)

  const metrics: APIMetrics = {
    totalEndpoints: endpoints.length,
    activeKeys: apiKeys.filter(k => k.isActive).length,
    totalRequests: endpoints.reduce((sum, e) => sum + e.totalCalls, 0),
    averageResponseTime: Math.round(endpoints.reduce((sum, e, _, arr) => sum + e.avgResponseTime / arr.length, 0)),
    successRate: Math.round(endpoints.reduce((sum, e, _, arr) => sum + e.successRate / arr.length, 0) * 10) / 10,
    requestsToday: 3456,
    errors24h: 23,
    topEndpoint: 'Get Customers'
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800'
      case 'POST': return 'bg-green-100 text-green-800'
      case 'PUT': return 'bg-yellow-100 text-yellow-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      case 'PATCH': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAuthIcon = (auth: string) => {
    switch (auth) {
      case 'api_key': return <Key className="h-4 w-4" />
      case 'oauth': return <Shield className="h-4 w-4" />
      case 'bearer': return <Lock className="h-4 w-4" />
      case 'basic': return <Users className="h-4 w-4" />
      default: return <Unlock className="h-4 w-4" />
    }
  }

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production': return 'bg-green-100 text-green-800'
      case 'staging': return 'bg-yellow-100 text-yellow-800'
      case 'development': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const toggleApiKey = (keyId: string) => {
    setApiKeys(prev =>
      prev.map(key =>
        key.id === keyId ? { ...key, isActive: !key.isActive } : key
      )
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could add toast notification here
  }

  const filteredEndpoints = endpoints.filter(endpoint => {
    const matchesSearch = endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.path.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMethod = !filterMethod || endpoint.method === filterMethod
    const matchesAuth = !filterAuth || endpoint.authentication === filterAuth
    
    return matchesSearch && matchesMethod && matchesAuth
  })

  const filteredApiKeys = apiKeys.filter(key => {
    const matchesSearch = key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         key.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Manager</h2>
          <p className="text-gray-600 mt-1">Manage API endpoints, keys, and documentation</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New API Key</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Code className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">API Endpoints</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalEndpoints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Key className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Keys</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.activeKeys}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Requests Today</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.requestsToday.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'endpoints', label: 'API Endpoints', icon: Code },
              { id: 'keys', label: 'API Keys', icon: Key },
              { id: 'docs', label: 'Documentation', icon: FileText },
              { id: 'testing', label: 'API Testing', icon: TestTube }
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
          {selectedTab === 'endpoints' && (
            <div>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search endpoints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Methods</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
                <select
                  value={filterAuth}
                  onChange={(e) => setFilterAuth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Authentication</option>
                  <option value="none">None</option>
                  <option value="api_key">API Key</option>
                  <option value="oauth">OAuth</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="basic">Basic Auth</option>
                </select>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Code className="h-4 w-4" />
                  <span>{filteredEndpoints.length} endpoints</span>
                </div>
              </div>

              {/* Endpoints List */}
              <div className="space-y-4">
                {filteredEndpoints.map((endpoint) => (
                  <div key={endpoint.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {endpoint.path}
                          </code>
                          <div className="flex items-center space-x-1">
                            {getAuthIcon(endpoint.authentication)}
                            <span className="text-xs text-gray-500 capitalize">{endpoint.authentication}</span>
                          </div>
                          {!endpoint.isActive && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              Inactive
                            </span>
                          )}
                        </div>
                        
                        <h3 className="font-medium text-gray-900 mb-1">{endpoint.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{endpoint.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Success Rate:</span>
                            <span className={`ml-1 ${endpoint.successRate >= 95 ? 'text-green-600' : endpoint.successRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {endpoint.successRate}%
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Avg Response:</span>
                            <span className="ml-1">{endpoint.avgResponseTime}ms</span>
                          </div>
                          <div>
                            <span className="font-medium">Total Calls:</span>
                            <span className="ml-1">{endpoint.totalCalls.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="font-medium">Rate Limit:</span>
                            <span className="ml-1">{endpoint.rateLimit.requests}/{endpoint.rateLimit.period}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Test Endpoint"
                        >
                          <TestTube className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                          title="View Documentation"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                          title="Edit Endpoint"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                          title="Copy URL"
                          onClick={() => copyToClipboard(endpoint.path)}
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'keys' && (
            <div>
              {/* API Keys List */}
              <div className="space-y-4">
                {filteredApiKeys.map((key) => (
                  <div key={key.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{key.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEnvironmentColor(key.environment)}`}>
                            {key.environment.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            key.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {key.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{key.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">API Key:</span>
                            <div className="flex items-center space-x-2 mt-1">
                              <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                {showKeyValue === key.id ? key.key : `${key.key.substring(0, 12)}...`}
                              </code>
                              <button
                                onClick={() => setShowKeyValue(showKeyValue === key.id ? null : key.id)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                              >
                                {showKeyValue === key.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </button>
                              <button
                                onClick={() => copyToClipboard(key.key)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Usage Count:</span>
                            <p className="font-medium">{key.usageCount.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Created:</span>
                            <span className="ml-1">{key.createdAt.toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="font-medium">Last Used:</span>
                            <span className="ml-1">
                              {key.lastUsed ? key.lastUsed.toLocaleDateString() : 'Never'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Expires:</span>
                            <span className="ml-1">
                              {key.expiresAt ? key.expiresAt.toLocaleDateString() : 'Never'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <span className="text-sm text-gray-600">Permissions:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {key.permissions.slice(0, 3).map((permission) => (
                              <span
                                key={permission}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                              >
                                {permission}
                              </span>
                            ))}
                            {key.permissions.length > 3 && (
                              <span className="text-xs text-gray-500">+{key.permissions.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => toggleApiKey(key.id)}
                          className={`p-2 rounded ${
                            key.isActive 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={key.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {key.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                          title="Edit Key"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete Key"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'docs' && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">API Documentation</h3>
              <p className="text-gray-600 mb-4">Interactive API documentation and examples</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Generate Documentation
              </button>
            </div>
          )}

          {selectedTab === 'testing' && (
            <div className="text-center py-12">
              <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">API Testing Console</h3>
              <p className="text-gray-600 mb-4">Test API endpoints directly from the dashboard</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Open Testing Console
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}