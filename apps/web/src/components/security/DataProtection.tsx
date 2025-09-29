'use client'

import React, { useState } from 'react'
import { 
  Shield, Lock, Eye, EyeOff, Key, Settings,
  AlertTriangle, CheckCircle, XCircle, Database,
  FileText, Download, Upload, RefreshCw, Search,
  Filter, Users, Activity, Clock, Calendar,
  BarChart3, TrendingUp, Globe, Smartphone,
  Monitor, Tablet, MapPin, Bell, Mail, Phone,
  Wifi, HardDrive, Zap, ExternalLink, Copy,
  Edit3, Trash2, Plus, Minus, RotateCcw, LockOpen
} from 'lucide-react'

interface DataAsset {
  id: string
  name: string
  description: string
  type: 'customer_data' | 'financial_data' | 'employee_data' | 'business_data' | 'system_data'
  category: 'personal' | 'sensitive' | 'confidential' | 'public'
  location: string[]
  dataSubjects: number
  retentionPeriod: string
  lastBackup: Date
  encryptionStatus: 'encrypted' | 'partially_encrypted' | 'not_encrypted'
  accessControls: string[]
  complianceFrameworks: string[]
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  dataController: string
  dataProcessor?: string
  lastAudit: Date
  nextAudit: Date
  isActive: boolean
}

interface DataFlow {
  id: string
  name: string
  sourceSystem: string
  targetSystem: string
  dataTypes: string[]
  frequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly'
  encryptionInTransit: boolean
  dataMinimization: boolean
  purposeLimitation: string
  legalBasis: string
  isActive: boolean
  lastReview: Date
}

interface DataSubjectRequest {
  id: string
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection'
  requestorName: string
  requestorEmail: string
  requestDate: Date
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  dueDate: Date
  assignedTo: string
  description: string
  responseMethod: 'email' | 'postal' | 'secure_portal'
  completedDate?: Date
  notes?: string
}

interface PrivacyImpactAssessment {
  id: string
  projectName: string
  description: string
  dataTypes: string[]
  riskLevel: 'low' | 'medium' | 'high'
  status: 'draft' | 'review' | 'approved' | 'rejected'
  assessor: string
  startDate: Date
  completionDate?: Date
  mitigationMeasures: string[]
  residualRisk: string
  approver?: string
  approvalDate?: Date
}

interface DataProtectionMetrics {
  totalDataAssets: number
  encryptedAssets: number
  highRiskAssets: number
  activeDataFlows: number
  pendingRequests: number
  overdueRequests: number
  completedPIAs: number
  pendingPIAs: number
}

export function DataProtection() {
  const [dataAssets, setDataAssets] = useState<DataAsset[]>([
    {
      id: '1',
      name: 'Customer Database',
      description: 'Primary customer information and contact details',
      type: 'customer_data',
      category: 'personal',
      location: ['Primary Database', 'Backup Server'],
      dataSubjects: 15420,
      retentionPeriod: '7 years',
      lastBackup: new Date('2024-01-20T02:00:00'),
      encryptionStatus: 'encrypted',
      accessControls: ['Role-based access', 'Multi-factor authentication'],
      complianceFrameworks: ['UK GDPR', 'PECR'],
      riskLevel: 'medium',
      dataController: 'Bowman Bathrooms Ltd',
      lastAudit: new Date('2024-01-15'),
      nextAudit: new Date('2024-07-15'),
      isActive: true
    },
    {
      id: '2',
      name: 'Financial Records',
      description: 'Invoice, payment, and accounting data',
      type: 'financial_data',
      category: 'confidential',
      location: ['Accounting System', 'Xero Integration'],
      dataSubjects: 8934,
      retentionPeriod: '10 years',
      lastBackup: new Date('2024-01-20T01:30:00'),
      encryptionStatus: 'encrypted',
      accessControls: ['Restricted access', 'Audit logging', 'Approval workflows'],
      complianceFrameworks: ['UK GDPR', 'Companies House'],
      riskLevel: 'high',
      dataController: 'Bowman Bathrooms Ltd',
      dataProcessor: 'Xero UK Ltd',
      lastAudit: new Date('2024-01-10'),
      nextAudit: new Date('2024-04-10'),
      isActive: true
    },
    {
      id: '3',
      name: 'Employee Records',
      description: 'HR data including personal and employment information',
      type: 'employee_data',
      category: 'sensitive',
      location: ['HR System', 'Local Storage'],
      dataSubjects: 45,
      retentionPeriod: '7 years post employment',
      lastBackup: new Date('2024-01-19T23:00:00'),
      encryptionStatus: 'partially_encrypted',
      accessControls: ['HR team only', 'Manager approval required'],
      complianceFrameworks: ['UK GDPR', 'Employment Law'],
      riskLevel: 'high',
      dataController: 'Bowman Bathrooms Ltd',
      lastAudit: new Date('2024-01-01'),
      nextAudit: new Date('2024-06-01'),
      isActive: true
    },
    {
      id: '4',
      name: 'Marketing Communications',
      description: 'Email lists and marketing preferences',
      type: 'customer_data',
      category: 'personal',
      location: ['Mailchimp', 'CRM System'],
      dataSubjects: 5678,
      retentionPeriod: 'Until consent withdrawn',
      lastBackup: new Date('2024-01-20T00:15:00'),
      encryptionStatus: 'encrypted',
      accessControls: ['Marketing team', 'Consent tracking'],
      complianceFrameworks: ['UK GDPR', 'PECR'],
      riskLevel: 'medium',
      dataController: 'Bowman Bathrooms Ltd',
      dataProcessor: 'Mailchimp',
      lastAudit: new Date('2023-12-15'),
      nextAudit: new Date('2024-03-15'),
      isActive: true
    }
  ])

  const [dataFlows, setDataFlows] = useState<DataFlow[]>([
    {
      id: '1',
      name: 'CRM to Email Marketing',
      sourceSystem: 'CRM System',
      targetSystem: 'Mailchimp',
      dataTypes: ['Email addresses', 'Names', 'Marketing preferences'],
      frequency: 'daily',
      encryptionInTransit: true,
      dataMinimization: true,
      purposeLimitation: 'Email marketing campaigns only',
      legalBasis: 'Consent',
      isActive: true,
      lastReview: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Sales to Accounting',
      sourceSystem: 'CRM System',
      targetSystem: 'Xero',
      dataTypes: ['Customer details', 'Invoice data', 'Payment information'],
      frequency: 'real_time',
      encryptionInTransit: true,
      dataMinimization: false,
      purposeLimitation: 'Financial reporting and compliance',
      legalBasis: 'Contract performance',
      isActive: true,
      lastReview: new Date('2024-01-10')
    },
    {
      id: '3',
      name: 'Website to CRM',
      sourceSystem: 'Company Website',
      targetSystem: 'CRM System',
      dataTypes: ['Contact forms', 'Lead information', 'Cookies'],
      frequency: 'real_time',
      encryptionInTransit: true,
      dataMinimization: true,
      purposeLimitation: 'Lead generation and customer service',
      legalBasis: 'Legitimate interest',
      isActive: true,
      lastReview: new Date('2024-01-08')
    }
  ])

  const [dataSubjectRequests, setDataSubjectRequests] = useState<DataSubjectRequest[]>([
    {
      id: '1',
      type: 'access',
      requestorName: 'John Smith',
      requestorEmail: 'john.smith@email.com',
      requestDate: new Date('2024-01-18'),
      status: 'in_progress',
      dueDate: new Date('2024-02-17'),
      assignedTo: 'Privacy Team',
      description: 'Request for copy of all personal data held',
      responseMethod: 'email'
    },
    {
      id: '2',
      type: 'erasure',
      requestorName: 'Sarah Johnson',
      requestorEmail: 'sarah.j@email.com',
      requestDate: new Date('2024-01-15'),
      status: 'completed',
      dueDate: new Date('2024-02-14'),
      assignedTo: 'Data Team',
      description: 'Request to delete all personal data',
      responseMethod: 'email',
      completedDate: new Date('2024-01-20'),
      notes: 'Data successfully removed from all systems'
    },
    {
      id: '3',
      type: 'rectification',
      requestorName: 'Mike Wilson',
      requestorEmail: 'mike.w@email.com',
      requestDate: new Date('2024-01-12'),
      status: 'pending',
      dueDate: new Date('2024-02-11'),
      assignedTo: 'Customer Service',
      description: 'Correction of incorrect address information',
      responseMethod: 'postal'
    }
  ])

  const [pias, setPias] = useState<PrivacyImpactAssessment[]>([
    {
      id: '1',
      projectName: 'Customer Portal Implementation',
      description: 'New self-service portal for customers',
      dataTypes: ['Personal details', 'Project information', 'Communication logs'],
      riskLevel: 'medium',
      status: 'approved',
      assessor: 'Privacy Officer',
      startDate: new Date('2023-12-01'),
      completionDate: new Date('2024-01-15'),
      mitigationMeasures: ['Encryption at rest', 'Role-based access', 'Regular audits'],
      residualRisk: 'Low - acceptable with implemented controls',
      approver: 'Data Protection Officer',
      approvalDate: new Date('2024-01-15')
    },
    {
      id: '2',
      projectName: 'AI-Powered Lead Scoring',
      description: 'Machine learning system for lead qualification',
      dataTypes: ['Behavioral data', 'Communication history', 'Preferences'],
      riskLevel: 'high',
      status: 'review',
      assessor: 'Technical Team',
      startDate: new Date('2024-01-10'),
      mitigationMeasures: ['Data anonymization', 'Consent mechanisms', 'Opt-out options'],
      residualRisk: 'Medium - requires additional oversight'
    }
  ])

  const [selectedTab, setSelectedTab] = useState<'assets' | 'flows' | 'requests' | 'pia'>('assets')
  const [selectedAsset, setSelectedAsset] = useState<DataAsset | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterRisk, setFilterRisk] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const metrics: DataProtectionMetrics = {
    totalDataAssets: dataAssets.length,
    encryptedAssets: dataAssets.filter(a => a.encryptionStatus === 'encrypted').length,
    highRiskAssets: dataAssets.filter(a => a.riskLevel === 'high' || a.riskLevel === 'critical').length,
    activeDataFlows: dataFlows.filter(f => f.isActive).length,
    pendingRequests: dataSubjectRequests.filter(r => r.status === 'pending').length,
    overdueRequests: dataSubjectRequests.filter(r => 
      r.status !== 'completed' && r.dueDate < new Date()
    ).length,
    completedPIAs: pias.filter(p => p.status === 'approved').length,
    pendingPIAs: pias.filter(p => p.status === 'draft' || p.status === 'review').length
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'customer_data': return <Users className="h-4 w-4" />
      case 'financial_data': return <BarChart3 className="h-4 w-4" />
      case 'employee_data': return <Users className="h-4 w-4" />
      case 'business_data': return <FileText className="h-4 w-4" />
      case 'system_data': return <Database className="h-4 w-4" />
      default: return <Database className="h-4 w-4" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEncryptionIcon = (status: string) => {
    switch (status) {
      case 'encrypted': return <Lock className="h-4 w-4 text-green-500" />
      case 'partially_encrypted': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'not_encrypted': return <LockOpen className="h-4 w-4 text-red-500" />
      default: return <Lock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': 
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_progress': 
      case 'review': return <Clock className="h-4 w-4 text-blue-500" />
      case 'pending': 
      case 'draft': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': 
      case 'approved': return 'bg-green-100 text-green-800'
      case 'in_progress': 
      case 'review': return 'bg-blue-100 text-blue-800'
      case 'pending': 
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const updateRequestStatus = (requestId: string, newStatus: string) => {
    setDataSubjectRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? { 
              ...req, 
              status: newStatus as any,
              completedDate: newStatus === 'completed' ? new Date() : undefined
            }
          : req
      )
    )
  }

  const exportDataMapping = () => {
    // Implementation for exporting data mapping
    console.log('Exporting data mapping...')
  }

  const filteredAssets = dataAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || asset.type === filterType
    const matchesRisk = !filterRisk || asset.riskLevel === filterRisk
    
    return matchesSearch && matchesType && matchesRisk
  })

  const filteredRequests = dataSubjectRequests.filter(request => {
    const matchesSearch = request.requestorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestorEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || request.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  if (selectedAsset) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedAsset(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Data Assets
            </button>
            <div className="flex items-center space-x-3">
              {getTypeIcon(selectedAsset.type)}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedAsset.name}</h2>
                <p className="text-gray-600">{selectedAsset.description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-2 rounded-full text-sm font-medium border ${getRiskColor(selectedAsset.riskLevel)}`}>
              {selectedAsset.riskLevel.toUpperCase()} RISK
            </span>
            {getEncryptionIcon(selectedAsset.encryptionStatus)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Asset Details */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Asset Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedAsset.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedAsset.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Subjects</label>
                  <p className="text-sm text-gray-900">{selectedAsset.dataSubjects.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Retention Period</label>
                  <p className="text-sm text-gray-900">{selectedAsset.retentionPeriod}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Controller</label>
                  <p className="text-sm text-gray-900">{selectedAsset.dataController}</p>
                </div>
                {selectedAsset.dataProcessor && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Processor</label>
                    <p className="text-sm text-gray-900">{selectedAsset.dataProcessor}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Backup</label>
                  <p className="text-sm text-gray-900">{selectedAsset.lastBackup.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Encryption Status</label>
                  <div className="flex items-center space-x-2">
                    {getEncryptionIcon(selectedAsset.encryptionStatus)}
                    <span className="text-sm text-gray-900 capitalize">
                      {selectedAsset.encryptionStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Locations */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Storage Locations</h3>
              <div className="space-y-2">
                {selectedAsset.location.map((location, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <HardDrive className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-900">{location}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Controls */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Access Controls</h3>
              <div className="space-y-2">
                {selectedAsset.accessControls.map((control, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-900">{control}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Frameworks */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Compliance Frameworks</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAsset.complianceFrameworks.map((framework, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                  >
                    {framework}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Risk Assessment */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Level:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(selectedAsset.riskLevel)}`}>
                    {selectedAsset.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Encryption:</span>
                  <div className="flex items-center space-x-1">
                    {getEncryptionIcon(selectedAsset.encryptionStatus)}
                    <span className="text-sm">
                      {selectedAsset.encryptionStatus === 'encrypted' ? 'Secure' : 
                       selectedAsset.encryptionStatus === 'partially_encrypted' ? 'Partial' : 'At Risk'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Volume:</span>
                  <span className="text-sm font-medium">
                    {selectedAsset.dataSubjects > 10000 ? 'High' :
                     selectedAsset.dataSubjects > 1000 ? 'Medium' : 'Low'}
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Information */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Audit Schedule</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Audit:</span>
                  <span className="text-sm font-medium">{selectedAsset.lastAudit.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Audit:</span>
                  <span className="text-sm font-medium">{selectedAsset.nextAudit.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedAsset.nextAudit <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedAsset.nextAudit <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      ? 'Due Soon'
                      : 'On Track'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Edit Asset Details
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Update Risk Assessment
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Schedule Audit
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Generate Report
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                  Archive Asset
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
          <h2 className="text-2xl font-bold text-gray-900">Data Protection</h2>
          <p className="text-gray-600 mt-1">Manage data assets, privacy rights, and protection measures</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={exportDataMapping}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Mapping</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Data Asset</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Data Assets</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalDataAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Encrypted Assets</p>
              <p className="text-2xl font-bold text-green-600">{metrics.encryptedAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Risk Assets</p>
              <p className="text-2xl font-bold text-red-600">{metrics.highRiskAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-600">{metrics.pendingRequests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Requests Alert */}
      {metrics.overdueRequests > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-medium text-red-900">Overdue Data Subject Requests</h3>
          </div>
          <div className="space-y-2">
            {dataSubjectRequests
              .filter(r => r.status !== 'completed' && r.dueDate < new Date())
              .slice(0, 3)
              .map((request) => (
                <div key={request.id} className="flex items-center justify-between text-sm">
                  <span className="text-red-800">
                    {request.type.toUpperCase()} request from {request.requestorName}
                  </span>
                  <span className="text-red-600">
                    Due: {request.dueDate.toLocaleDateString()}
                  </span>
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
              { id: 'assets', label: 'Data Assets', icon: Database },
              { id: 'flows', label: 'Data Flows', icon: Activity },
              { id: 'requests', label: 'Subject Requests', icon: Users },
              { id: 'pia', label: 'Privacy Impact', icon: Shield }
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
                {id === 'requests' && metrics.pendingRequests > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {metrics.pendingRequests}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'assets' && (
            <div>
              {/* Asset Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="customer_data">Customer Data</option>
                  <option value="financial_data">Financial Data</option>
                  <option value="employee_data">Employee Data</option>
                  <option value="business_data">Business Data</option>
                  <option value="system_data">System Data</option>
                </select>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Risk Levels</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Database className="h-4 w-4" />
                  <span>{filteredAssets.length} assets</span>
                </div>
              </div>

              {/* Data Assets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(asset.type)}
                        <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                      </div>
                      {getEncryptionIcon(asset.encryptionStatus)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{asset.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Data Subjects:</span>
                        <span className="font-medium">{asset.dataSubjects.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium capitalize">{asset.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Locations:</span>
                        <span className="font-medium">{asset.location.length}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(asset.riskLevel)}`}>
                        {asset.riskLevel.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        Next audit: {asset.nextAudit.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'flows' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Data Flow Mapping</h3>
                <p className="text-gray-600">
                  Monitor data movements between systems and ensure compliance.
                </p>
              </div>

              <div className="space-y-4">
                {dataFlows.map((flow) => (
                  <div key={flow.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Activity className="h-5 w-5 text-blue-600" />
                          <h4 className="font-medium text-gray-900">{flow.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            flow.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {flow.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Source:</span>
                            <p className="text-sm text-gray-600">{flow.sourceSystem}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Target:</span>
                            <p className="text-sm text-gray-600">{flow.targetSystem}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Frequency:</span>
                            <p className="text-sm text-gray-600 capitalize">{flow.frequency.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Legal Basis:</span>
                            <p className="text-sm text-gray-600">{flow.legalBasis}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Purpose:</span>
                            <p className="text-sm text-gray-600">{flow.purposeLimitation}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Last Review:</span>
                            <p className="text-sm text-gray-600">{flow.lastReview.toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700">Data Types:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {flow.dataTypes.map((type, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            {flow.encryptionInTransit ? (
                              <Lock className="h-4 w-4 text-green-500" />
                            ) : (
                              <LockOpen className="h-4 w-4 text-red-500" />
                            )}
                            <span className={flow.encryptionInTransit ? 'text-green-600' : 'text-red-600'}>
                              {flow.encryptionInTransit ? 'Encrypted' : 'Not Encrypted'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {flow.dataMinimization ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className={flow.dataMinimization ? 'text-green-600' : 'text-red-600'}>
                              {flow.dataMinimization ? 'Minimized' : 'Full Dataset'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        <button className="p-2 text-gray-400 hover:text-gray-600" title="Edit Flow">
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'requests' && (
            <div>
              {/* Request Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requests..."
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
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{filteredRequests.length} requests</span>
                </div>
              </div>

              {/* Data Subject Requests */}
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Users className="h-5 w-5 text-blue-600" />
                          <h4 className="font-medium text-gray-900 capitalize">
                            {request.type.replace('_', ' ')} Request
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status.replace('_', ' ').toUpperCase()}
                          </span>
                          {request.dueDate < new Date() && request.status !== 'completed' && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              OVERDUE
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-4">{request.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Requestor:</span>
                            <p className="text-gray-600">{request.requestorName}</p>
                            <p className="text-gray-600">{request.requestorEmail}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Request Date:</span>
                            <p className="text-gray-600">{request.requestDate.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Due Date:</span>
                            <p className={`${
                              request.dueDate < new Date() && request.status !== 'completed' 
                                ? 'text-red-600' 
                                : 'text-gray-600'
                            }`}>
                              {request.dueDate.toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Assigned To:</span>
                            <p className="text-gray-600">{request.assignedTo}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Response Method:</span>
                            <p className="text-gray-600 capitalize">{request.responseMethod.replace('_', ' ')}</p>
                          </div>
                          {request.completedDate && (
                            <div>
                              <span className="font-medium text-gray-700">Completed:</span>
                              <p className="text-gray-600">{request.completedDate.toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                        
                        {request.notes && (
                          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
                            <span className="font-medium text-gray-700 text-sm">Notes:</span>
                            <p className="text-gray-600 text-sm mt-1">{request.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6">
                        <select
                          value={request.status}
                          onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-3 py-2"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'pia' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Privacy Impact Assessments</h3>
                <p className="text-gray-600">
                  Assess privacy risks for new projects and data processing activities.
                </p>
              </div>

              <div className="space-y-4">
                {pias.map((pia) => (
                  <div key={pia.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Shield className="h-5 w-5 text-purple-600" />
                          <h4 className="font-medium text-gray-900">{pia.projectName}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(pia.riskLevel)}`}>
                            {pia.riskLevel.toUpperCase()} RISK
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pia.status)}`}>
                            {pia.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{pia.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Assessor:</span>
                            <p className="text-sm text-gray-600">{pia.assessor}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Start Date:</span>
                            <p className="text-sm text-gray-600">{pia.startDate.toLocaleDateString()}</p>
                          </div>
                          {pia.completionDate && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Completed:</span>
                              <p className="text-sm text-gray-600">{pia.completionDate.toLocaleDateString()}</p>
                            </div>
                          )}
                          {pia.approver && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Approver:</span>
                              <p className="text-sm text-gray-600">{pia.approver}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700">Data Types:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {pia.dataTypes.map((type, index) => (
                              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700">Mitigation Measures:</span>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                            {pia.mitigationMeasures.map((measure, index) => (
                              <li key={index}>{measure}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                          <span className="text-sm font-medium text-gray-700">Residual Risk:</span>
                          <p className="text-sm text-gray-600 mt-1">{pia.residualRisk}</p>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex items-center space-x-2">
                        {getStatusIcon(pia.status)}
                        <button className="p-2 text-gray-400 hover:text-gray-600" title="Edit PIA">
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}