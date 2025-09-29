'use client'

import React, { useState } from 'react'
import { 
  Activity, Calendar, Clock, Download, Eye, Filter,
  Search, User, Users, Shield, AlertTriangle,
  CheckCircle, XCircle, FileText, Database, Globe,
  Lock, Unlock, Key, Settings, RefreshCw, BarChart3,
  TrendingUp, TrendingDown, ArrowRight, ExternalLink,
  MapPin, Smartphone, Monitor, Tablet, Chrome,
  HardDrive, Wifi, WifiOff
} from 'lucide-react'

interface AuditLog {
  id: string
  timestamp: Date
  userId: string
  userName: string
  userEmail: string
  action: string
  resource: string
  resourceId?: string
  description: string
  category: 'authentication' | 'data_access' | 'data_modification' | 'system_admin' | 'security' | 'integration'
  severity: 'low' | 'medium' | 'high' | 'critical'
  ipAddress: string
  userAgent: string
  location?: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser: string
  success: boolean
  errorMessage?: string
  metadata?: Record<string, any>
}

interface SecurityEvent {
  id: string
  type: 'failed_login' | 'suspicious_activity' | 'data_breach' | 'unauthorized_access' | 'privilege_escalation'
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
  userId?: string
  userName?: string
  description: string
  ipAddress: string
  location?: string
  isResolved: boolean
  resolvedBy?: string
  resolvedAt?: Date
  notes?: string
}

interface AuditMetrics {
  totalEvents: number
  eventsToday: number
  failedLogins: number
  securityAlerts: number
  uniqueUsers: number
  dataModifications: number
  systemChanges: number
  criticalEvents: number
}

export function AuditLogger() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: new Date('2024-01-20T10:30:00'),
      userId: 'user_001',
      userName: 'John Smith',
      userEmail: 'john.smith@bowmanskb.co.uk',
      action: 'LOGIN',
      resource: 'authentication',
      description: 'User successfully logged in',
      category: 'authentication',
      severity: 'low',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      location: 'London, UK',
      deviceType: 'desktop',
      browser: 'Chrome',
      success: true
    },
    {
      id: '2',
      timestamp: new Date('2024-01-20T10:25:00'),
      userId: 'user_002',
      userName: 'Sarah Johnson',
      userEmail: 'sarah.johnson@bowmanskb.co.uk',
      action: 'UPDATE_CUSTOMER',
      resource: 'customer',
      resourceId: 'cust_12345',
      description: 'Updated customer contact information',
      category: 'data_modification',
      severity: 'medium',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'Manchester, UK',
      deviceType: 'desktop',
      browser: 'Edge',
      success: true,
      metadata: {
        changes: ['email', 'phone'],
        previousValues: { email: 'old@email.com', phone: '123456789' },
        newValues: { email: 'new@email.com', phone: '987654321' }
      }
    },
    {
      id: '3',
      timestamp: new Date('2024-01-20T10:20:00'),
      userId: 'user_003',
      userName: 'Unknown User',
      userEmail: 'unknown@external.com',
      action: 'FAILED_LOGIN',
      resource: 'authentication',
      description: 'Failed login attempt with incorrect password',
      category: 'authentication',
      severity: 'high',
      ipAddress: '203.0.113.45',
      userAgent: 'curl/7.68.0',
      location: 'Unknown',
      deviceType: 'desktop',
      browser: 'Unknown',
      success: false,
      errorMessage: 'Invalid credentials'
    },
    {
      id: '4',
      timestamp: new Date('2024-01-20T10:15:00'),
      userId: 'user_001',
      userName: 'John Smith',
      userEmail: 'john.smith@bowmanskb.co.uk',
      action: 'DELETE_PROJECT',
      resource: 'project',
      resourceId: 'proj_67890',
      description: 'Deleted project: Kitchen Renovation Project',
      category: 'data_modification',
      severity: 'critical',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      location: 'London, UK',
      deviceType: 'desktop',
      browser: 'Chrome',
      success: true,
      metadata: {
        projectName: 'Kitchen Renovation Project',
        projectValue: 15000,
        customerId: 'cust_99999'
      }
    },
    {
      id: '5',
      timestamp: new Date('2024-01-20T10:10:00'),
      userId: 'user_004',
      userName: 'Mike Wilson',
      userEmail: 'mike.wilson@bowmanskb.co.uk',
      action: 'CREATE_ROLE',
      resource: 'role',
      resourceId: 'role_new_001',
      description: 'Created new custom role: Project Coordinator',
      category: 'system_admin',
      severity: 'medium',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101',
      location: 'Birmingham, UK',
      deviceType: 'desktop',
      browser: 'Firefox',
      success: true,
      metadata: {
        roleName: 'Project Coordinator',
        permissions: ['projects.read', 'projects.write', 'tasks.read', 'tasks.write']
      }
    },
    {
      id: '6',
      timestamp: new Date('2024-01-20T09:45:00'),
      userId: 'user_005',
      userName: 'Emma Brown',
      userEmail: 'emma.brown@bowmanskb.co.uk',
      action: 'EXPORT_DATA',
      resource: 'customer_data',
      description: 'Exported customer data to CSV',
      category: 'data_access',
      severity: 'high',
      ipAddress: '192.168.1.115',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
      location: 'Leeds, UK',
      deviceType: 'mobile',
      browser: 'Safari',
      success: true,
      metadata: {
        recordCount: 1250,
        exportFormat: 'CSV',
        fileSize: '2.4MB'
      }
    }
  ])

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'failed_login',
      severity: 'high',
      timestamp: new Date('2024-01-20T10:20:00'),
      userName: 'Unknown User',
      description: 'Multiple failed login attempts from suspicious IP address',
      ipAddress: '203.0.113.45',
      location: 'Unknown',
      isResolved: false
    },
    {
      id: '2',
      type: 'suspicious_activity',
      severity: 'medium',
      timestamp: new Date('2024-01-20T09:30:00'),
      userId: 'user_006',
      userName: 'Test User',
      description: 'Unusual data access pattern detected',
      ipAddress: '192.168.1.200',
      location: 'London, UK',
      isResolved: true,
      resolvedBy: 'admin_001',
      resolvedAt: new Date('2024-01-20T10:00:00'),
      notes: 'False positive - legitimate bulk data export for reporting'
    },
    {
      id: '3',
      type: 'unauthorized_access',
      severity: 'critical',
      timestamp: new Date('2024-01-19T23:45:00'),
      description: 'Attempted access to admin panel without proper permissions',
      ipAddress: '198.51.100.25',
      location: 'Unknown',
      isResolved: false
    }
  ])

  const [selectedTab, setSelectedTab] = useState<'logs' | 'security' | 'analytics'>('logs')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('')
  const [filterUser, setFilterUser] = useState('')
  const [dateRange, setDateRange] = useState('today')

  const metrics: AuditMetrics = {
    totalEvents: auditLogs.length,
    eventsToday: auditLogs.filter(log => {
      const today = new Date()
      return log.timestamp.toDateString() === today.toDateString()
    }).length,
    failedLogins: auditLogs.filter(log => log.action === 'FAILED_LOGIN').length,
    securityAlerts: securityEvents.filter(event => !event.isResolved).length,
    uniqueUsers: new Set(auditLogs.map(log => log.userId)).size,
    dataModifications: auditLogs.filter(log => log.category === 'data_modification').length,
    systemChanges: auditLogs.filter(log => log.category === 'system_admin').length,
    criticalEvents: auditLogs.filter(log => log.severity === 'critical').length
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'medium': return <Eye className="h-4 w-4 text-yellow-500" />
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <Key className="h-4 w-4" />
      case 'data_access': return <Eye className="h-4 w-4" />
      case 'data_modification': return <FileText className="h-4 w-4" />
      case 'system_admin': return <Settings className="h-4 w-4" />
      case 'security': return <Shield className="h-4 w-4" />
      case 'integration': return <Globe className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop': return <Monitor className="h-4 w-4" />
      case 'mobile': return <Smartphone className="h-4 w-4" />
      case 'tablet': return <Tablet className="h-4 w-4" />
      default: return <Monitor className="h-4 w-4" />
    }
  }

  const getBrowserIcon = (browser: string) => {
    switch (browser.toLowerCase()) {
      case 'chrome': return <Chrome className="h-4 w-4" />
      case 'firefox': return <Globe className="h-4 w-4" />
      case 'safari': return <Globe className="h-4 w-4" />
      case 'edge': return <Globe className="h-4 w-4" />
      default: return <Globe className="h-4 w-4" />
    }
  }

  const resolveSecurityEvent = (eventId: string) => {
    setSecurityEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? {
              ...event,
              isResolved: true,
              resolvedBy: 'current_user',
              resolvedAt: new Date(),
              notes: 'Resolved by security team'
            }
          : event
      )
    )
  }

  const exportLogs = () => {
    // Implementation for exporting audit logs
    console.log('Exporting audit logs...')
  }

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || log.category === filterCategory
    const matchesSeverity = !filterSeverity || log.severity === filterSeverity
    const matchesUser = !filterUser || log.userId === filterUser
    
    return matchesSearch && matchesCategory && matchesSeverity && matchesUser
  })

  const filteredSecurityEvents = securityEvents.filter(event => {
    const matchesSearch = event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = !filterSeverity || event.severity === filterSeverity
    
    return matchesSearch && matchesSeverity
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audit Logger</h2>
          <p className="text-gray-600 mt-1">Monitor system activity and security events</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={exportLogs}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Logs</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Events Today</p>
              <p className="text-2xl font-bold text-green-600">{metrics.eventsToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Security Alerts</p>
              <p className="text-2xl font-bold text-red-600">{metrics.securityAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.uniqueUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Security Alerts */}
      {securityEvents.filter(e => !e.isResolved).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-medium text-red-900">Active Security Alerts</h3>
          </div>
          <div className="space-y-2">
            {securityEvents.filter(e => !e.isResolved).slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center justify-between text-sm">
                <span className="text-red-800">{event.description}</span>
                <button
                  onClick={() => resolveSecurityEvent(event.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'logs', label: 'Audit Logs', icon: FileText },
              { id: 'security', label: 'Security Events', icon: Shield },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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
                {id === 'security' && metrics.securityAlerts > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {metrics.securityAlerts}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'logs' && (
            <div>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search logs..."
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
                  <option value="authentication">Authentication</option>
                  <option value="data_access">Data Access</option>
                  <option value="data_modification">Data Modification</option>
                  <option value="system_admin">System Admin</option>
                  <option value="security">Security</option>
                  <option value="integration">Integration</option>
                </select>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="all">All Time</option>
                </select>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>{filteredLogs.length} logs</span>
                </div>
              </div>

              {/* Audit Logs */}
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getSeverityIcon(log.severity)}
                          {getCategoryIcon(log.category)}
                          <span className="font-medium text-gray-900">{log.action}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(log.severity)}`}>
                            {log.severity.toUpperCase()}
                          </span>
                          {!log.success && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              FAILED
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">{log.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{log.userName}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{log.timestamp.toLocaleString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{log.ipAddress}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            {getDeviceIcon(log.deviceType)}
                            <span>{log.deviceType}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            {getBrowserIcon(log.browser)}
                            <span>{log.browser}</span>
                          </span>
                        </div>
                        
                        {log.location && (
                          <p className="text-xs text-gray-500 mt-1">Location: {log.location}</p>
                        )}
                        
                        {log.errorMessage && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                            Error: {log.errorMessage}
                          </div>
                        )}
                        
                        {log.metadata && (
                          <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded">
                            <p className="text-xs font-medium text-gray-700 mb-1">Additional Details:</p>
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-1 text-gray-400 hover:text-gray-600" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600" title="Export">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'security' && (
            <div>
              {/* Security Event Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search security events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>{filteredSecurityEvents.length} events</span>
                </div>
              </div>

              {/* Security Events */}
              <div className="space-y-4">
                {filteredSecurityEvents.map((event) => (
                  <div key={event.id} className={`border rounded-lg p-6 ${
                    event.isResolved ? 'bg-gray-50 border-gray-200' : 'bg-white border-orange-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          {getSeverityIcon(event.severity)}
                          <span className="font-medium text-gray-900 capitalize">
                            {event.type.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(event.severity)}`}>
                            {event.severity.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.isResolved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {event.isResolved ? 'RESOLVED' : 'ACTIVE'}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Timestamp:</span>
                            <p>{event.timestamp.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">IP Address:</span>
                            <p>{event.ipAddress}</p>
                          </div>
                          <div>
                            <span className="font-medium">Location:</span>
                            <p>{event.location || 'Unknown'}</p>
                          </div>
                          {event.userName && (
                            <div>
                              <span className="font-medium">User:</span>
                              <p>{event.userName}</p>
                            </div>
                          )}
                          {event.isResolved && event.resolvedBy && (
                            <div>
                              <span className="font-medium">Resolved by:</span>
                              <p>{event.resolvedBy}</p>
                            </div>
                          )}
                          {event.isResolved && event.resolvedAt && (
                            <div>
                              <span className="font-medium">Resolved at:</span>
                              <p>{event.resolvedAt.toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                        
                        {event.notes && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm font-medium text-blue-900">Resolution Notes:</p>
                            <p className="text-sm text-blue-800">{event.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6">
                        {!event.isResolved && (
                          <button
                            onClick={() => resolveSecurityEvent(event.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Activity Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Authentication Events:</span>
                    <span className="font-medium">
                      {auditLogs.filter(l => l.category === 'authentication').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Data Modifications:</span>
                    <span className="font-medium">{metrics.dataModifications}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">System Changes:</span>
                    <span className="font-medium">{metrics.systemChanges}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Failed Logins:</span>
                    <span className="font-medium text-red-600">{metrics.failedLogins}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Critical Events:</span>
                    <span className="font-medium text-red-600">{metrics.criticalEvents}</span>
                  </div>
                </div>
              </div>

              {/* Top Users */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Most Active Users</h3>
                <div className="space-y-3">
                  {Object.entries(
                    auditLogs.reduce((acc, log) => {
                      acc[log.userName] = (acc[log.userName] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                  )
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([userName, count]) => (
                      <div key={userName} className="flex items-center justify-between">
                        <span className="text-gray-900">{userName}</span>
                        <span className="font-medium">{count} events</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Security Trends */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Security Trends</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Failed Login Rate:</span>
                    <span className="flex items-center space-x-1 text-red-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>12%</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Data Export Requests:</span>
                    <span className="flex items-center space-x-1 text-green-600">
                      <TrendingDown className="h-4 w-4" />
                      <span>-8%</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Avg Session Duration:</span>
                    <span className="font-medium">2h 34m</span>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Database Connections:</span>
                    <span className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Healthy</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">API Response Time:</span>
                    <span className="font-medium">142ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Error Rate:</span>
                    <span className="text-green-600">0.02%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="text-green-600">99.98%</span>
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