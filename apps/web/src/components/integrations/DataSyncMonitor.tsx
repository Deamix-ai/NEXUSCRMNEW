'use client'

import React, { useState } from 'react'
import { 
  RefreshCw, AlertTriangle, CheckCircle, XCircle,
  Clock, Database, ArrowUpDown, Filter, Search,
  Settings, Play, Pause, RotateCcw, Eye,
  BarChart3, Activity, Zap, Shield, Users,
  Globe, Calendar, TrendingUp, AlertCircle,
  FileText, Download, Upload, ChevronRight,
  ExternalLink, Loader, PauseCircle, PlayCircle
} from 'lucide-react'

interface DataSource {
  id: string
  name: string
  type: 'database' | 'api' | 'file' | 'integration'
  status: 'syncing' | 'synced' | 'error' | 'paused' | 'pending'
  lastSync: Date | null
  nextSync: Date | null
  recordsTotal: number
  recordsUpToDate: number
  conflictsCount: number
  syncDuration: number
  syncFrequency: string
  errorMessage?: string
  isAutoSync: boolean
  direction: 'bidirectional' | 'import' | 'export'
  priority: 'high' | 'medium' | 'low'
}

interface SyncConflict {
  id: string
  sourceId: string
  recordType: string
  recordId: string
  field: string
  localValue: any
  remoteValue: any
  conflictType: 'data_mismatch' | 'duplicate_record' | 'missing_field' | 'validation_error'
  detectedAt: Date
  status: 'pending' | 'resolved' | 'ignored'
  resolution?: 'keep_local' | 'keep_remote' | 'merge' | 'manual'
}

interface SyncMetrics {
  totalRecords: number
  syncedToday: number
  conflictsToday: number
  avgSyncTime: number
  successRate: number
  activeDataSources: number
  pendingSyncs: number
  errorsSinceLastSuccess: number
}

export function DataSyncMonitor() {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Xero Accounting',
      type: 'integration',
      status: 'synced',
      lastSync: new Date('2024-01-20T10:30:00'),
      nextSync: new Date('2024-01-20T14:30:00'),
      recordsTotal: 15420,
      recordsUpToDate: 15420,
      conflictsCount: 0,
      syncDuration: 145,
      syncFrequency: 'Every 4 hours',
      isAutoSync: true,
      direction: 'bidirectional',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Customer Database',
      type: 'database',
      status: 'syncing',
      lastSync: new Date('2024-01-20T11:00:00'),
      nextSync: null,
      recordsTotal: 8934,
      recordsUpToDate: 8456,
      conflictsCount: 2,
      syncDuration: 89,
      syncFrequency: 'Real-time',
      isAutoSync: true,
      direction: 'bidirectional',
      priority: 'high'
    },
    {
      id: '3',
      name: 'Mailchimp Contacts',
      type: 'integration',
      status: 'error',
      lastSync: new Date('2024-01-20T09:15:00'),
      nextSync: new Date('2024-01-20T12:15:00'),
      recordsTotal: 5678,
      recordsUpToDate: 5234,
      conflictsCount: 15,
      syncDuration: 234,
      syncFrequency: 'Every 3 hours',
      errorMessage: 'API rate limit exceeded',
      isAutoSync: true,
      direction: 'export',
      priority: 'medium'
    },
    {
      id: '4',
      name: 'Project Files Backup',
      type: 'file',
      status: 'paused',
      lastSync: new Date('2024-01-19T23:00:00'),
      nextSync: null,
      recordsTotal: 2345,
      recordsUpToDate: 2345,
      conflictsCount: 0,
      syncDuration: 567,
      syncFrequency: 'Daily at 11 PM',
      isAutoSync: false,
      direction: 'export',
      priority: 'low'
    },
    {
      id: '5',
      name: 'Google Calendar',
      type: 'integration',
      status: 'pending',
      lastSync: null,
      nextSync: new Date('2024-01-20T12:00:00'),
      recordsTotal: 0,
      recordsUpToDate: 0,
      conflictsCount: 0,
      syncDuration: 0,
      syncFrequency: 'Every 30 minutes',
      isAutoSync: true,
      direction: 'bidirectional',
      priority: 'medium'
    }
  ])

  const [conflicts, setConflicts] = useState<SyncConflict[]>([
    {
      id: '1',
      sourceId: '2',
      recordType: 'Customer',
      recordId: 'cust_12345',
      field: 'email',
      localValue: 'john.smith@email.com',
      remoteValue: 'j.smith@email.com',
      conflictType: 'data_mismatch',
      detectedAt: new Date('2024-01-20T10:45:00'),
      status: 'pending'
    },
    {
      id: '2',
      sourceId: '2',
      recordType: 'Customer',
      recordId: 'cust_67890',
      field: 'phone',
      localValue: '+44 7700 900123',
      remoteValue: '07700 900123',
      conflictType: 'data_mismatch',
      detectedAt: new Date('2024-01-20T10:50:00'),
      status: 'pending'
    },
    {
      id: '3',
      sourceId: '3',
      recordType: 'Contact',
      recordId: 'contact_456',
      field: 'subscription_status',
      localValue: 'active',
      remoteValue: 'subscribed',
      conflictType: 'validation_error',
      detectedAt: new Date('2024-01-20T09:30:00'),
      status: 'resolved',
      resolution: 'keep_remote'
    }
  ])

  const [selectedTab, setSelectedTab] = useState<'overview' | 'sources' | 'conflicts' | 'logs'>('overview')
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType] = useState('')

  const metrics: SyncMetrics = {
    totalRecords: dataSources.reduce((sum, ds) => sum + ds.recordsTotal, 0),
    syncedToday: 47892,
    conflictsToday: 17,
    avgSyncTime: 178,
    successRate: 98.2,
    activeDataSources: dataSources.filter(ds => ds.status === 'syncing' || ds.status === 'synced').length,
    pendingSyncs: dataSources.filter(ds => ds.status === 'pending').length,
    errorsSinceLastSuccess: dataSources.filter(ds => ds.status === 'error').length
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'syncing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'synced': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      case 'paused': return <PauseCircle className="h-4 w-4 text-gray-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'syncing': return 'bg-blue-100 text-blue-800'
      case 'synced': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'paused': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database': return <Database className="h-4 w-4" />
      case 'integration': return <Globe className="h-4 w-4" />
      case 'file': return <FileText className="h-4 w-4" />
      case 'api': return <Zap className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'bidirectional': return <ArrowUpDown className="h-4 w-4" />
      case 'import': return <Download className="h-4 w-4" />
      case 'export': return <Upload className="h-4 w-4" />
      default: return <ArrowUpDown className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const toggleSync = (sourceId: string) => {
    setDataSources(prev =>
      prev.map(source =>
        source.id === sourceId
          ? { 
              ...source, 
              status: source.status === 'paused' ? 'pending' : 'paused',
              isAutoSync: source.status === 'paused' ? true : false
            }
          : source
      )
    )
  }

  const triggerManualSync = (sourceId: string) => {
    setDataSources(prev =>
      prev.map(source =>
        source.id === sourceId
          ? { ...source, status: 'syncing' }
          : source
      )
    )
  }

  const resolveConflict = (conflictId: string, resolution: 'keep_local' | 'keep_remote' | 'merge') => {
    setConflicts(prev =>
      prev.map(conflict =>
        conflict.id === conflictId
          ? { ...conflict, status: 'resolved', resolution }
          : conflict
      )
    )
  }

  const filteredSources = dataSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || source.status === filterStatus
    const matchesType = !filterType || source.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const pendingConflicts = conflicts.filter(c => c.status === 'pending')

  if (selectedSource) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedSource(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Data Sources
            </button>
            <div className="flex items-center space-x-3">
              {getTypeIcon(selectedSource.type)}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedSource.name}</h2>
                <p className="text-gray-600">
                  {selectedSource.direction.charAt(0).toUpperCase() + selectedSource.direction.slice(1)} synchronization
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => triggerManualSync(selectedSource.id)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Manual Sync</span>
            </button>
            <button
              onClick={() => toggleSync(selectedSource.id)}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                selectedSource.status === 'paused'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {selectedSource.status === 'paused' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              <span>{selectedSource.status === 'paused' ? 'Resume' : 'Pause'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Status Overview */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Synchronization Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedSource.recordsTotal.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Records</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {selectedSource.recordsUpToDate.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Up to Date</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">
                    {selectedSource.conflictsCount}
                  </p>
                  <p className="text-sm text-gray-600">Conflicts</p>
                </div>
              </div>
            </div>

            {/* Sync Progress */}
            {selectedSource.status === 'syncing' && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Sync Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((selectedSource.recordsUpToDate / selectedSource.recordsTotal) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(selectedSource.recordsUpToDate / selectedSource.recordsTotal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {selectedSource.recordsUpToDate.toLocaleString()} of {selectedSource.recordsTotal.toLocaleString()} records
                    </span>
                    <span className="text-blue-600 flex items-center">
                      <Loader className="h-4 w-4 animate-spin mr-1" />
                      Syncing...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Information */}
            {selectedSource.errorMessage && (
              <div className="bg-white rounded-lg border border-red-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-900">Sync Error</h3>
                </div>
                <p className="text-red-700 mb-4">{selectedSource.errorMessage}</p>
                <div className="flex space-x-3">
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm">
                    Retry Sync
                  </button>
                  <button className="border border-red-300 text-red-700 px-4 py-2 rounded-md hover:bg-red-50 text-sm">
                    View Error Details
                  </button>
                </div>
              </div>
            )}

            {/* Conflicts */}
            {selectedSource.conflictsCount > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Data Conflicts</h3>
                <div className="space-y-3">
                  {conflicts
                    .filter(c => c.sourceId === selectedSource.id && c.status === 'pending')
                    .slice(0, 3)
                    .map((conflict) => (
                      <div key={conflict.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <span className="font-medium text-gray-900">
                              {conflict.recordType} {conflict.recordId}
                            </span>
                          </div>
                          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            {conflict.conflictType.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          <p><strong>Field:</strong> {conflict.field}</p>
                          <p><strong>Local:</strong> {String(conflict.localValue)}</p>
                          <p><strong>Remote:</strong> {String(conflict.remoteValue)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => resolveConflict(conflict.id, 'keep_local')}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            Keep Local
                          </button>
                          <button
                            onClick={() => resolveConflict(conflict.id, 'keep_remote')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                          >
                            Keep Remote
                          </button>
                          <button
                            onClick={() => resolveConflict(conflict.id, 'merge')}
                            className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-50"
                          >
                            Merge
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                {selectedSource.conflictsCount > 3 && (
                  <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm">
                    View all {selectedSource.conflictsCount} conflicts →
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Configuration */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Configuration</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium flex items-center space-x-1">
                    {getTypeIcon(selectedSource.type)}
                    <span>{selectedSource.type.charAt(0).toUpperCase() + selectedSource.type.slice(1)}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Direction:</span>
                  <span className="font-medium flex items-center space-x-1">
                    {getDirectionIcon(selectedSource.direction)}
                    <span>{selectedSource.direction.charAt(0).toUpperCase() + selectedSource.direction.slice(1)}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-medium">{selectedSource.syncFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Auto Sync:</span>
                  <span className={`font-medium ${selectedSource.isAutoSync ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedSource.isAutoSync ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <span className={`font-medium ${getPriorityColor(selectedSource.priority)}`}>
                    {selectedSource.priority.charAt(0).toUpperCase() + selectedSource.priority.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Timing Information */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Timing</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Sync:</span>
                  <span className="font-medium">
                    {selectedSource.lastSync 
                      ? selectedSource.lastSync.toLocaleString()
                      : 'Never'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Sync:</span>
                  <span className="font-medium">
                    {selectedSource.nextSync 
                      ? selectedSource.nextSync.toLocaleString()
                      : 'Not scheduled'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Duration:</span>
                  <span className="font-medium">{selectedSource.syncDuration}s</span>
                </div>
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
                  View Sync History
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Export Data Mapping
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Test Connection
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                  Remove Data Source
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
          <h2 className="text-2xl font-bold text-gray-900">Data Sync Monitor</h2>
          <p className="text-gray-600 mt-1">Monitor data synchronization across all connected systems</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
          <Database className="h-4 w-4" />
          <span>Add Data Source</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalRecords.toLocaleString()}</p>
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
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conflicts</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingConflicts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Sync Time</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.avgSyncTime}s</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'sources', label: 'Data Sources', icon: Database },
              { id: 'conflicts', label: 'Conflicts', icon: AlertTriangle },
              { id: 'logs', label: 'Sync Logs', icon: FileText }
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
                {id === 'conflicts' && pendingConflicts.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {pendingConflicts.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Active Syncs */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Active Synchronizations</h3>
                <div className="space-y-3">
                  {dataSources
                    .filter(ds => ds.status === 'syncing')
                    .map((source) => (
                      <div key={source.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(source.status)}
                            <span className="font-medium">{source.name}</span>
                          </div>
                          <button
                            onClick={() => setSelectedSource(source)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(source.recordsUpToDate / source.recordsTotal) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-blue-700">
                          {source.recordsUpToDate.toLocaleString()} / {source.recordsTotal.toLocaleString()} records
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Recent Conflicts */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Conflicts</h3>
                <div className="space-y-3">
                  {pendingConflicts.slice(0, 4).map((conflict) => (
                    <div key={conflict.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="font-medium text-sm">{conflict.recordType}</span>
                        </div>
                        <span className="text-xs text-orange-600">
                          {conflict.detectedAt.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Field "{conflict.field}" has conflicting values
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => resolveConflict(conflict.id, 'keep_local')}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          Keep Local
                        </button>
                        <button
                          onClick={() => resolveConflict(conflict.id, 'keep_remote')}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                        >
                          Keep Remote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'sources' && (
            <div>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search data sources..."
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
                  <option value="synced">Synced</option>
                  <option value="syncing">Syncing</option>
                  <option value="error">Error</option>
                  <option value="paused">Paused</option>
                  <option value="pending">Pending</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="database">Database</option>
                  <option value="integration">Integration</option>
                  <option value="file">File</option>
                  <option value="api">API</option>
                </select>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Database className="h-4 w-4" />
                  <span>{filteredSources.length} sources</span>
                </div>
              </div>

              {/* Data Sources List */}
              <div className="space-y-4">
                {filteredSources.map((source) => (
                  <div key={source.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(source.type)}
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium text-gray-900">{source.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(source.status)}`}>
                              {source.status.toUpperCase()}
                            </span>
                            {getDirectionIcon(source.direction)}
                            <span className={`text-xs font-medium ${getPriorityColor(source.priority)}`}>
                              {source.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{source.syncFrequency}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right text-sm">
                          <p className="font-medium">
                            {source.recordsUpToDate.toLocaleString()} / {source.recordsTotal.toLocaleString()}
                          </p>
                          <p className="text-gray-500">
                            {Math.round((source.recordsUpToDate / source.recordsTotal) * 100)}% synced
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedSource(source)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => triggerManualSync(source.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Manual Sync"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleSync(source.id)}
                            className={`p-2 rounded ${
                              source.status === 'paused' 
                                ? 'text-green-600 hover:bg-green-50' 
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                            title={source.status === 'paused' ? 'Resume' : 'Pause'}
                          >
                            {source.status === 'paused' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {source.conflictsCount > 0 && (
                      <div className="mt-3 flex items-center space-x-2 text-sm text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{source.conflictsCount} conflicts need resolution</span>
                      </div>
                    )}

                    {source.errorMessage && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        {source.errorMessage}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'conflicts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Data Conflicts</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Auto-resolve simple conflicts
                </button>
              </div>

              <div className="space-y-4">
                {pendingConflicts.map((conflict) => {
                  const source = dataSources.find(ds => ds.id === conflict.sourceId)
                  return (
                    <div key={conflict.id} className="border border-orange-200 rounded-lg p-6 bg-orange-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {conflict.recordType} - {conflict.recordId}
                            </h4>
                            <p className="text-sm text-gray-600">
                              From {source?.name} • Detected {conflict.detectedAt.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-xs font-medium">
                          {conflict.conflictType.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Field: {conflict.field}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm font-medium text-blue-900 mb-1">Local Value</p>
                            <code className="text-sm text-blue-800">{String(conflict.localValue)}</code>
                          </div>
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <p className="text-sm font-medium text-green-900 mb-1">Remote Value</p>
                            <code className="text-sm text-green-800">{String(conflict.remoteValue)}</code>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => resolveConflict(conflict.id, 'keep_local')}
                          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                        >
                          Keep Local
                        </button>
                        <button
                          onClick={() => resolveConflict(conflict.id, 'keep_remote')}
                          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                        >
                          Keep Remote
                        </button>
                        <button
                          onClick={() => resolveConflict(conflict.id, 'merge')}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-50"
                        >
                          Manual Merge
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm">
                          Ignore
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {selectedTab === 'logs' && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sync Logs</h3>
              <p className="text-gray-600 mb-4">Detailed synchronization logs and audit trail</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                View Full Logs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}