'use client'

import React, { useState } from 'react'
import { 
  Webhook, Plus, Settings, Activity, AlertCircle,
  CheckCircle, XCircle, Clock, Zap, Code, Play,
  Pause, Edit3, Trash2, Copy, ExternalLink,
  RefreshCw, Filter, Search, Database, Mail,
  Globe, Shield, Key, TestTube, FileText,
  ArrowRight, BarChart3, Target, Users
} from 'lucide-react'

interface WebhookEndpoint {
  id: string
  name: string
  url: string
  description: string
  events: string[]
  isActive: boolean
  secret?: string
  method: 'POST' | 'PUT' | 'PATCH'
  headers: Record<string, string>
  timeout: number
  retryCount: number
  lastTriggered: Date | null
  totalDeliveries: number
  successfulDeliveries: number
  failedDeliveries: number
  lastError?: string
  createdAt: Date
  tags: string[]
}

interface WebhookEvent {
  id: string
  webhookId: string
  eventType: string
  payload: Record<string, any>
  status: 'pending' | 'delivered' | 'failed' | 'retrying'
  attempts: number
  responseCode?: number
  responseTime?: number
  triggeredAt: Date
  deliveredAt?: Date
  errorMessage?: string
}

interface WebhookMetrics {
  totalWebhooks: number
  activeWebhooks: number
  totalDeliveries: number
  successRate: number
  avgResponseTime: number
  deliveriesToday: number
  failedToday: number
  retryingCount: number
}

export function WebhookManager() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([
    {
      id: '1',
      name: 'Customer Update Notifications',
      url: 'https://partner-api.example.com/webhooks/customer-updates',
      description: 'Notify partner system when customer information is updated',
      events: ['customer.created', 'customer.updated', 'customer.deleted'],
      isActive: true,
      secret: 'whsec_2K8j9dkf3...',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Version': '1.0' },
      timeout: 30,
      retryCount: 3,
      lastTriggered: new Date('2024-01-20T10:30:00'),
      totalDeliveries: 1247,
      successfulDeliveries: 1203,
      failedDeliveries: 44,
      createdAt: new Date('2024-01-01'),
      tags: ['customer', 'sync', 'partner']
    },
    {
      id: '2',
      name: 'Order Processing Pipeline',
      url: 'https://fulfillment.example.com/api/webhooks/orders',
      description: 'Trigger order fulfillment when payment is confirmed',
      events: ['payment.completed', 'order.confirmed'],
      isActive: true,
      secret: 'whsec_8H3n5gkl9...',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer token123' },
      timeout: 45,
      retryCount: 5,
      lastTriggered: new Date('2024-01-20T11:15:00'),
      totalDeliveries: 892,
      successfulDeliveries: 884,
      failedDeliveries: 8,
      createdAt: new Date('2024-01-05'),
      tags: ['orders', 'payment', 'fulfillment']
    },
    {
      id: '3',
      name: 'Slack Notifications',
      url: 'https://hooks.slack.com/services/T123/B456/xyz789',
      description: 'Send team notifications for important CRM events',
      events: ['lead.qualified', 'project.completed', 'payment.failed'],
      isActive: true,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      timeout: 10,
      retryCount: 2,
      lastTriggered: new Date('2024-01-20T09:45:00'),
      totalDeliveries: 456,
      successfulDeliveries: 456,
      failedDeliveries: 0,
      createdAt: new Date('2024-01-10'),
      tags: ['notifications', 'slack', 'alerts']
    },
    {
      id: '4',
      name: 'Analytics Data Export',
      url: 'https://analytics.example.com/api/data/ingest',
      description: 'Export CRM data to external analytics platform',
      events: ['analytics.daily_summary', 'report.generated'],
      isActive: false,
      secret: 'whsec_9L2k1mnp4...',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Source': 'CRM-Nexus' },
      timeout: 60,
      retryCount: 1,
      lastTriggered: new Date('2024-01-18T23:00:00'),
      totalDeliveries: 234,
      successfulDeliveries: 198,
      failedDeliveries: 36,
      lastError: 'Connection timeout',
      createdAt: new Date('2024-01-12'),
      tags: ['analytics', 'export', 'data']
    }
  ])

  const [events] = useState<WebhookEvent[]>([
    {
      id: '1',
      webhookId: '1',
      eventType: 'customer.updated',
      payload: { customerId: 'cust_123', changes: ['email', 'phone'] },
      status: 'delivered',
      attempts: 1,
      responseCode: 200,
      responseTime: 245,
      triggeredAt: new Date('2024-01-20T10:30:00'),
      deliveredAt: new Date('2024-01-20T10:30:00')
    },
    {
      id: '2',
      webhookId: '2',
      eventType: 'payment.completed',
      payload: { orderId: 'ord_456', amount: 1250.00, currency: 'GBP' },
      status: 'delivered',
      attempts: 1,
      responseCode: 200,
      responseTime: 189,
      triggeredAt: new Date('2024-01-20T11:15:00'),
      deliveredAt: new Date('2024-01-20T11:15:00')
    },
    {
      id: '3',
      webhookId: '4',
      eventType: 'analytics.daily_summary',
      payload: { date: '2024-01-19', metrics: {} },
      status: 'failed',
      attempts: 3,
      responseCode: 504,
      triggeredAt: new Date('2024-01-19T23:00:00'),
      errorMessage: 'Gateway timeout'
    },
    {
      id: '4',
      webhookId: '3',
      eventType: 'lead.qualified',
      payload: { leadId: 'lead_789', score: 85 },
      status: 'retrying',
      attempts: 2,
      triggeredAt: new Date('2024-01-20T09:45:00')
    }
  ])

  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEndpoint | null>(null)
  const [selectedTab, setSelectedTab] = useState<'webhooks' | 'events' | 'testing'>('webhooks')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterEvent, setFilterEvent] = useState('')

  const metrics: WebhookMetrics = {
    totalWebhooks: webhooks.length,
    activeWebhooks: webhooks.filter(w => w.isActive).length,
    totalDeliveries: webhooks.reduce((sum, w) => sum + w.totalDeliveries, 0),
    successRate: Math.round(
      (webhooks.reduce((sum, w) => sum + w.successfulDeliveries, 0) /
       webhooks.reduce((sum, w) => sum + w.totalDeliveries, 0)) * 100
    ),
    avgResponseTime: 234,
    deliveriesToday: 89,
    failedToday: 3,
    retryingCount: events.filter(e => e.status === 'retrying').length
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      case 'retrying': return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
      case 'pending': return <Clock className="h-4 w-4 text-gray-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'retrying': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const toggleWebhook = (webhookId: string) => {
    setWebhooks(prev =>
      prev.map(webhook =>
        webhook.id === webhookId
          ? { ...webhook, isActive: !webhook.isActive }
          : webhook
      )
    )
  }

  const testWebhook = (webhookId: string) => {
    // Implementation for testing webhook
    console.log('Testing webhook:', webhookId)
  }

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const filteredWebhooks = webhooks.filter(webhook => {
    const matchesSearch = webhook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         webhook.url.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'active' && webhook.isActive) ||
                         (filterStatus === 'inactive' && !webhook.isActive)
    
    return matchesSearch && matchesStatus
  })

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.eventType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || event.status === filterStatus
    const matchesEvent = !filterEvent || event.eventType === filterEvent
    
    return matchesSearch && matchesStatus && matchesEvent
  })

  if (selectedWebhook) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedWebhook(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Webhooks
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedWebhook.name}</h2>
              <p className="text-gray-600">{selectedWebhook.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => testWebhook(selectedWebhook.id)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2"
            >
              <TestTube className="h-4 w-4" />
              <span>Test Webhook</span>
            </button>
            <button
              onClick={() => toggleWebhook(selectedWebhook.id)}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                selectedWebhook.isActive
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {selectedWebhook.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{selectedWebhook.isActive ? 'Disable' : 'Enable'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Configuration */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endpoint URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 text-sm font-mono bg-gray-100 px-3 py-2 rounded border">
                      {selectedWebhook.url}
                    </code>
                    <button
                      onClick={() => copyWebhookUrl(selectedWebhook.url)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      HTTP Method
                    </label>
                    <span className="px-3 py-2 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                      {selectedWebhook.method}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timeout (seconds)
                    </label>
                    <span className="text-sm">{selectedWebhook.timeout}s</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Events
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedWebhook.events.map((event) => (
                      <span
                        key={event}
                        className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedWebhook.secret && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Webhook Secret
                    </label>
                    <code className="text-sm font-mono bg-gray-100 px-3 py-2 rounded border block">
                      {selectedWebhook.secret}
                    </code>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headers
                  </label>
                  <div className="space-y-2">
                    {Object.entries(selectedWebhook.headers).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2 text-sm">
                        <code className="font-mono text-gray-600">{key}:</code>
                        <code className="font-mono text-gray-900">{value}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Deliveries */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Deliveries</h3>
              <div className="space-y-3">
                {events
                  .filter(e => e.webhookId === selectedWebhook.id)
                  .slice(0, 5)
                  .map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(event.status)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{event.eventType}</p>
                          <p className="text-xs text-gray-500">
                            {event.triggeredAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        {event.responseCode && (
                          <p className={`font-medium ${
                            event.responseCode >= 200 && event.responseCode < 300 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {event.responseCode}
                          </p>
                        )}
                        {event.responseTime && (
                          <p className="text-gray-500">{event.responseTime}ms</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Statistics */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Statistics</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Deliveries:</span>
                  <span className="font-medium">{selectedWebhook.totalDeliveries.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Successful:</span>
                  <span className="font-medium text-green-600">{selectedWebhook.successfulDeliveries.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Failed:</span>
                  <span className="font-medium text-red-600">{selectedWebhook.failedDeliveries.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-medium">
                    {Math.round((selectedWebhook.successfulDeliveries / selectedWebhook.totalDeliveries) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Retry Count:</span>
                  <span className="font-medium">{selectedWebhook.retryCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Triggered:</span>
                  <span className="font-medium">
                    {selectedWebhook.lastTriggered 
                      ? selectedWebhook.lastTriggered.toLocaleDateString()
                      : 'Never'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedWebhook.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Edit Configuration
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  View Event Log
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Download Delivery Report
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                  Delete Webhook
                </button>
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
          <h2 className="text-2xl font-bold text-gray-900">Webhook Manager</h2>
          <p className="text-gray-600 mt-1">Manage webhook endpoints and monitor event deliveries</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Webhook</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Webhook className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Webhooks</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalWebhooks}</p>
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
              <p className="text-2xl font-bold text-green-600">{metrics.successRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Deliveries Today</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.deliveriesToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <RefreshCw className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Retrying</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.retryingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'webhooks', label: 'Webhooks', icon: Webhook },
              { id: 'events', label: 'Event Log', icon: Activity },
              { id: 'testing', label: 'Testing', icon: TestTube }
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
          {selectedTab === 'webhooks' && (
            <div>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search webhooks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="col-span-2 flex items-center space-x-2 text-sm text-gray-600">
                  <Webhook className="h-4 w-4" />
                  <span>{filteredWebhooks.length} webhooks</span>
                </div>
              </div>

              {/* Webhooks List */}
              <div className="space-y-4">
                {filteredWebhooks.map((webhook) => (
                  <div key={webhook.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{webhook.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            webhook.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {webhook.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {webhook.method}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{webhook.description}</p>
                        
                        <div className="text-sm text-gray-500 mb-3">
                          <code className="bg-gray-100 px-2 py-1 rounded font-mono">
                            {webhook.url}
                          </code>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Deliveries:</span>
                            <span className="ml-1">{webhook.totalDeliveries.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="font-medium">Success Rate:</span>
                            <span className={`ml-1 ${
                              (webhook.successfulDeliveries / webhook.totalDeliveries) >= 0.95 
                                ? 'text-green-600' 
                                : (webhook.successfulDeliveries / webhook.totalDeliveries) >= 0.8 
                                  ? 'text-yellow-600' 
                                  : 'text-red-600'
                            }`}>
                              {Math.round((webhook.successfulDeliveries / webhook.totalDeliveries) * 100)}%
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Events:</span>
                            <span className="ml-1">{webhook.events.length}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setSelectedWebhook(webhook)}
                          className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => testWebhook(webhook.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Test Webhook"
                        >
                          <TestTube className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleWebhook(webhook.id)}
                          className={`p-2 rounded ${
                            webhook.isActive 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={webhook.isActive ? 'Disable' : 'Enable'}
                        >
                          {webhook.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'events' && (
            <div>
              {/* Event Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                  <option value="retrying">Retrying</option>
                  <option value="pending">Pending</option>
                </select>
                <select
                  value={filterEvent}
                  onChange={(e) => setFilterEvent(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Events</option>
                  <option value="customer.created">customer.created</option>
                  <option value="customer.updated">customer.updated</option>
                  <option value="payment.completed">payment.completed</option>
                  <option value="lead.qualified">lead.qualified</option>
                </select>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Activity className="h-4 w-4" />
                  <span>{filteredEvents.length} events</span>
                </div>
              </div>

              {/* Events List */}
              <div className="space-y-3">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(event.status)}
                        <div>
                          <p className="font-medium text-gray-900">{event.eventType}</p>
                          <p className="text-sm text-gray-500">
                            {event.triggeredAt.toLocaleString()}
                            {event.attempts > 1 && ` • Attempt ${event.attempts}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status.toUpperCase()}
                        </span>
                        {event.responseCode && (
                          <p className="text-sm text-gray-500 mt-1">
                            {event.responseCode} • {event.responseTime}ms
                          </p>
                        )}
                      </div>
                    </div>
                    {event.errorMessage && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        {event.errorMessage}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'testing' && (
            <div className="text-center py-12">
              <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Webhook Testing Console</h3>
              <p className="text-gray-600 mb-4">Test webhook endpoints with custom payloads</p>
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