'use client'

import React, { useState } from 'react'
import { 
  Shield, Lock, Users, Settings, AlertTriangle,
  CheckCircle, XCircle, Clock, Eye, FileText,
  Download, Upload, RefreshCw, Search, Filter,
  BarChart3, TrendingUp, Database, Key, Globe,
  Activity, Calendar, Bell, Mail, Smartphone,
  Monitor, Tablet, Chrome, User, Building,
  CreditCard, Zap, Wifi, MapPin, Plus
} from 'lucide-react'

interface ComplianceFramework {
  id: string
  name: string
  description: string
  requirements: ComplianceRequirement[]
  overallStatus: 'compliant' | 'non_compliant' | 'partial' | 'pending'
  lastAssessment: Date
  nextAssessment: Date
  isActive: boolean
}

interface ComplianceRequirement {
  id: string
  frameworkId: string
  title: string
  description: string
  category: 'data_protection' | 'access_control' | 'audit_logging' | 'encryption' | 'incident_response' | 'training'
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_applicable'
  evidence: string[]
  responsibleTeam: string
  dueDate?: Date
  lastReview: Date
  notes?: string
}

interface ComplianceReport {
  id: string
  name: string
  frameworks: string[]
  generatedAt: Date
  generatedBy: string
  status: 'draft' | 'final' | 'archived'
  findings: ComplianceFinding[]
  overallScore: number
}

interface ComplianceFinding {
  id: string
  requirementId: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  recommendation: string
  status: 'open' | 'in_progress' | 'resolved'
  assignedTo?: string
  dueDate?: Date
}

interface ComplianceMetrics {
  totalRequirements: number
  compliantRequirements: number
  overallComplianceRate: number
  criticalIssues: number
  highPriorityIssues: number
  overdueRequirements: number
  upcomingAssessments: number
  recentFindings: number
}

export function ComplianceCenter() {
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([
    {
      id: '1',
      name: 'UK GDPR',
      description: 'UK General Data Protection Regulation compliance requirements',
      requirements: [],
      overallStatus: 'compliant',
      lastAssessment: new Date('2024-01-15'),
      nextAssessment: new Date('2024-07-15'),
      isActive: true
    },
    {
      id: '2',
      name: 'PECR',
      description: 'Privacy and Electronic Communications Regulations',
      requirements: [],
      overallStatus: 'partial',
      lastAssessment: new Date('2024-01-10'),
      nextAssessment: new Date('2024-04-10'),
      isActive: true
    },
    {
      id: '3',
      name: 'ISO 27001',
      description: 'Information Security Management System',
      requirements: [],
      overallStatus: 'pending',
      lastAssessment: new Date('2024-01-01'),
      nextAssessment: new Date('2024-06-01'),
      isActive: false
    },
    {
      id: '4',
      name: 'SOC 2 Type II',
      description: 'Service Organization Control 2 compliance',
      requirements: [],
      overallStatus: 'non_compliant',
      lastAssessment: new Date('2023-12-15'),
      nextAssessment: new Date('2024-03-15'),
      isActive: true
    }
  ])

  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([
    {
      id: '1',
      frameworkId: '1',
      title: 'Data Processing Records',
      description: 'Maintain comprehensive records of all data processing activities',
      category: 'data_protection',
      priority: 'critical',
      status: 'compliant',
      evidence: ['Data Processing Register', 'Privacy Impact Assessments'],
      responsibleTeam: 'Legal & Compliance',
      lastReview: new Date('2024-01-15'),
      notes: 'All records updated quarterly'
    },
    {
      id: '2',
      frameworkId: '1',
      title: 'Right to Erasure Implementation',
      description: 'Implement technical measures to fulfill data subject deletion requests',
      category: 'data_protection',
      priority: 'high',
      status: 'compliant',
      evidence: ['Automated Deletion System', 'Process Documentation'],
      responsibleTeam: 'Engineering',
      lastReview: new Date('2024-01-12')
    },
    {
      id: '3',
      frameworkId: '1',
      title: 'Consent Management System',
      description: 'Deploy compliant consent collection and withdrawal mechanisms',
      category: 'data_protection',
      priority: 'critical',
      status: 'in_progress',
      evidence: ['Consent Management Platform'],
      responsibleTeam: 'Product Team',
      dueDate: new Date('2024-02-15'),
      lastReview: new Date('2024-01-18')
    },
    {
      id: '4',
      frameworkId: '2',
      title: 'Email Marketing Consent',
      description: 'Ensure explicit consent for all email marketing communications',
      category: 'data_protection',
      priority: 'high',
      status: 'non_compliant',
      evidence: [],
      responsibleTeam: 'Marketing',
      dueDate: new Date('2024-01-30'),
      lastReview: new Date('2024-01-10'),
      notes: 'Missing double opt-in mechanism'
    },
    {
      id: '5',
      frameworkId: '3',
      title: 'Access Control Matrix',
      description: 'Implement role-based access control with regular reviews',
      category: 'access_control',
      priority: 'critical',
      status: 'compliant',
      evidence: ['RBAC System', 'Quarterly Access Reviews'],
      responsibleTeam: 'IT Security',
      lastReview: new Date('2024-01-01')
    },
    {
      id: '6',
      frameworkId: '4',
      title: 'Security Audit Logging',
      description: 'Comprehensive logging of all security-relevant events',
      category: 'audit_logging',
      priority: 'high',
      status: 'compliant',
      evidence: ['Audit Log System', 'Log Retention Policy'],
      responsibleTeam: 'IT Security',
      lastReview: new Date('2023-12-15')
    }
  ])

  const [reports, setReports] = useState<ComplianceReport[]>([
    {
      id: '1',
      name: 'Q4 2023 GDPR Compliance Review',
      frameworks: ['1'],
      generatedAt: new Date('2024-01-15'),
      generatedBy: 'Compliance Team',
      status: 'final',
      findings: [],
      overallScore: 94
    },
    {
      id: '2',
      name: 'PECR Assessment Report',
      frameworks: ['2'],
      generatedAt: new Date('2024-01-10'),
      generatedBy: 'Legal Team',
      status: 'draft',
      findings: [],
      overallScore: 76
    }
  ])

  const [selectedTab, setSelectedTab] = useState<'overview' | 'frameworks' | 'requirements' | 'reports'>('overview')
  const [selectedFramework, setSelectedFramework] = useState<ComplianceFramework | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  const metrics: ComplianceMetrics = {
    totalRequirements: requirements.length,
    compliantRequirements: requirements.filter(r => r.status === 'compliant').length,
    overallComplianceRate: Math.round(
      (requirements.filter(r => r.status === 'compliant').length / requirements.length) * 100
    ),
    criticalIssues: requirements.filter(r => r.priority === 'critical' && r.status !== 'compliant').length,
    highPriorityIssues: requirements.filter(r => r.priority === 'high' && r.status !== 'compliant').length,
    overdueRequirements: requirements.filter(r => 
      r.dueDate && r.dueDate < new Date() && r.status !== 'compliant'
    ).length,
    upcomingAssessments: frameworks.filter(f => {
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      return f.nextAssessment <= nextWeek
    }).length,
    recentFindings: 5
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'non_compliant': return <XCircle className="h-4 w-4 text-red-500" />
      case 'partial': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />
      case 'pending': return <Clock className="h-4 w-4 text-gray-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 border-green-200'
      case 'non_compliant': return 'bg-red-100 text-red-800 border-red-200'
      case 'partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data_protection': return <Shield className="h-4 w-4" />
      case 'access_control': return <Lock className="h-4 w-4" />
      case 'audit_logging': return <FileText className="h-4 w-4" />
      case 'encryption': return <Key className="h-4 w-4" />
      case 'incident_response': return <AlertTriangle className="h-4 w-4" />
      case 'training': return <Users className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const updateRequirementStatus = (requirementId: string, newStatus: string) => {
    setRequirements(prev =>
      prev.map(req =>
        req.id === requirementId
          ? { ...req, status: newStatus as any, lastReview: new Date() }
          : req
      )
    )
  }

  const generateReport = (frameworkIds: string[]) => {
    // Implementation for generating compliance report
    console.log('Generating report for frameworks:', frameworkIds)
  }

  const exportCompliance = () => {
    // Implementation for exporting compliance data
    console.log('Exporting compliance data...')
  }

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || req.status === filterStatus
    const matchesCategory = !filterCategory || req.category === filterCategory
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const filteredFrameworks = frameworks.filter(framework => {
    const matchesSearch = framework.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         framework.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || framework.overallStatus === filterStatus
    
    return matchesSearch && matchesStatus
  })

  if (selectedFramework) {
    const frameworkRequirements = requirements.filter(r => r.frameworkId === selectedFramework.id)
    
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedFramework(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Frameworks
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedFramework.name}</h2>
              <p className="text-gray-600">{selectedFramework.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => generateReport([selectedFramework.id])}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Generate Report</span>
            </button>
            <span className={`px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedFramework.overallStatus)}`}>
              {selectedFramework.overallStatus.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requirements</p>
                <p className="text-2xl font-bold text-gray-900">{frameworkRequirements.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Compliant</p>
                <p className="text-2xl font-bold text-green-600">
                  {frameworkRequirements.filter(r => r.status === 'compliant').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Non-Compliant</p>
                <p className="text-2xl font-bold text-red-600">
                  {frameworkRequirements.filter(r => r.status === 'non_compliant').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {frameworkRequirements.filter(r => r.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Requirements</h3>
          <div className="space-y-4">
            {frameworkRequirements.map((requirement) => (
              <div key={requirement.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getCategoryIcon(requirement.category)}
                      <h4 className="font-medium text-gray-900">{requirement.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(requirement.priority)}`}>
                        {requirement.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(requirement.status)}`}>
                        {requirement.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{requirement.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Responsible Team:</span>
                        <p className="text-gray-600">{requirement.responsibleTeam}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Last Review:</span>
                        <p className="text-gray-600">{requirement.lastReview.toLocaleDateString()}</p>
                      </div>
                      {requirement.dueDate && (
                        <div>
                          <span className="font-medium text-gray-700">Due Date:</span>
                          <p className={`${
                            requirement.dueDate < new Date() ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {requirement.dueDate.toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {requirement.evidence.length > 0 && (
                      <div className="mt-3">
                        <span className="font-medium text-gray-700 text-sm">Evidence:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {requirement.evidence.map((evidence, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {evidence}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {requirement.notes && (
                      <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded text-sm">
                        <span className="font-medium text-gray-700">Notes:</span>
                        <p className="text-gray-600 mt-1">{requirement.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <select
                      value={requirement.status}
                      onChange={(e) => updateRequirementStatus(requirement.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="compliant">Compliant</option>
                      <option value="non_compliant">Non-Compliant</option>
                      <option value="in_progress">In Progress</option>
                      <option value="not_applicable">Not Applicable</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compliance Center</h2>
          <p className="text-gray-600 mt-1">Monitor regulatory compliance and manage requirements</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={exportCompliance}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Framework</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
              <p className="text-2xl font-bold text-green-600">{metrics.overallComplianceRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Issues</p>
              <p className="text-2xl font-bold text-red-600">{metrics.criticalIssues}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue Items</p>
              <p className="text-2xl font-bold text-yellow-600">{metrics.overdueRequirements}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Assessments</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.upcomingAssessments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Issues Alert */}
      {metrics.criticalIssues > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-medium text-red-900">Critical Compliance Issues</h3>
          </div>
          <div className="space-y-2">
            {requirements
              .filter(r => r.priority === 'critical' && r.status !== 'compliant')
              .slice(0, 3)
              .map((req) => (
                <div key={req.id} className="flex items-center justify-between text-sm">
                  <span className="text-red-800">{req.title}</span>
                  <span className="text-red-600">{req.responsibleTeam}</span>
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
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'frameworks', label: 'Frameworks', icon: Shield },
              { id: 'requirements', label: 'Requirements', icon: FileText },
              { id: 'reports', label: 'Reports', icon: Download }
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
          {selectedTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Compliance Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Compliance Summary</h3>
                <div className="space-y-4">
                  {frameworks.filter(f => f.isActive).map((framework) => {
                    const frameworkReqs = requirements.filter(r => r.frameworkId === framework.id)
                    const compliantCount = frameworkReqs.filter(r => r.status === 'compliant').length
                    const complianceRate = frameworkReqs.length > 0 ? Math.round((compliantCount / frameworkReqs.length) * 100) : 0
                    
                    return (
                      <div key={framework.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div>
                          <h4 className="font-medium text-gray-900">{framework.name}</h4>
                          <p className="text-sm text-gray-600">{complianceRate}% compliant</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(framework.overallStatus)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(framework.overallStatus)}`}>
                            {framework.overallStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {requirements
                    .sort((a, b) => b.lastReview.getTime() - a.lastReview.getTime())
                    .slice(0, 5)
                    .map((req) => (
                      <div key={req.id} className="flex items-center space-x-3 p-2 border border-gray-200 rounded">
                        {getStatusIcon(req.status)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{req.title}</p>
                          <p className="text-xs text-gray-500">
                            Updated {req.lastReview.toLocaleDateString()} by {req.responsibleTeam}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
                <div className="space-y-3">
                  {requirements
                    .filter(r => r.dueDate && r.status !== 'compliant')
                    .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
                    .slice(0, 5)
                    .map((req) => (
                      <div key={req.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div>
                          <p className="font-medium text-gray-900">{req.title}</p>
                          <p className="text-sm text-gray-600">{req.responsibleTeam}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            req.dueDate && req.dueDate < new Date() ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {req.dueDate?.toLocaleDateString()}
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(req.priority)}`}>
                            {req.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Framework Assessment Schedule */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Assessment Schedule</h3>
                <div className="space-y-3">
                  {frameworks
                    .sort((a, b) => a.nextAssessment.getTime() - b.nextAssessment.getTime())
                    .map((framework) => (
                      <div key={framework.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div>
                          <p className="font-medium text-gray-900">{framework.name}</p>
                          <p className="text-sm text-gray-600">
                            Last: {framework.lastAssessment.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {framework.nextAssessment.toLocaleDateString()}
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            framework.nextAssessment <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {framework.nextAssessment <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                              ? 'Due Soon'
                              : 'On Track'
                            }
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'frameworks' && (
            <div>
              {/* Framework Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search frameworks..."
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
                  <option value="compliant">Compliant</option>
                  <option value="partial">Partial</option>
                  <option value="non_compliant">Non-Compliant</option>
                  <option value="pending">Pending</option>
                </select>
                <div className="col-span-2 flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>{filteredFrameworks.length} frameworks</span>
                </div>
              </div>

              {/* Frameworks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFrameworks.map((framework) => {
                  const frameworkReqs = requirements.filter(r => r.frameworkId === framework.id)
                  const compliantCount = frameworkReqs.filter(r => r.status === 'compliant').length
                  const complianceRate = frameworkReqs.length > 0 ? Math.round((compliantCount / frameworkReqs.length) * 100) : 0
                  
                  return (
                    <div
                      key={framework.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedFramework(framework)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg text-gray-900">{framework.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(framework.overallStatus)}`}>
                          {framework.overallStatus.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{framework.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Requirements</p>
                          <p className="text-lg font-semibold text-gray-900">{frameworkReqs.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Compliance</p>
                          <p className="text-lg font-semibold text-green-600">{complianceRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Last Assessment</p>
                          <p className="text-sm text-gray-900">{framework.lastAssessment.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Next Assessment</p>
                          <p className="text-sm text-gray-900">{framework.nextAssessment.toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          framework.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {framework.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {getStatusIcon(framework.overallStatus)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {selectedTab === 'requirements' && (
            <div>
              {/* Requirement Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requirements..."
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
                  <option value="compliant">Compliant</option>
                  <option value="non_compliant">Non-Compliant</option>
                  <option value="in_progress">In Progress</option>
                  <option value="not_applicable">Not Applicable</option>
                </select>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="data_protection">Data Protection</option>
                  <option value="access_control">Access Control</option>
                  <option value="audit_logging">Audit Logging</option>
                  <option value="encryption">Encryption</option>
                  <option value="incident_response">Incident Response</option>
                  <option value="training">Training</option>
                </select>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>{filteredRequirements.length} requirements</span>
                </div>
              </div>

              {/* Requirements List */}
              <div className="space-y-4">
                {filteredRequirements.map((requirement) => (
                  <div key={requirement.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          {getCategoryIcon(requirement.category)}
                          <h3 className="font-medium text-gray-900">{requirement.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(requirement.priority)}`}>
                            {requirement.priority.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
                            {requirement.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{requirement.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Framework:</span>
                            <p className="text-gray-600">
                              {frameworks.find(f => f.id === requirement.frameworkId)?.name}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Team:</span>
                            <p className="text-gray-600">{requirement.responsibleTeam}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Last Review:</span>
                            <p className="text-gray-600">{requirement.lastReview.toLocaleDateString()}</p>
                          </div>
                          {requirement.dueDate && (
                            <div>
                              <span className="font-medium text-gray-700">Due Date:</span>
                              <p className={`${
                                requirement.dueDate < new Date() ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {requirement.dueDate.toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {requirement.evidence.length > 0 && (
                          <div className="mt-4">
                            <span className="font-medium text-gray-700 text-sm">Evidence:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {requirement.evidence.map((evidence, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                  {evidence}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6">
                        <select
                          value={requirement.status}
                          onChange={(e) => updateRequirementStatus(requirement.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-3 py-2"
                        >
                          <option value="compliant">Compliant</option>
                          <option value="non_compliant">Non-Compliant</option>
                          <option value="in_progress">In Progress</option>
                          <option value="not_applicable">Not Applicable</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'reports' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Compliance Reports</h3>
                <p className="text-gray-600">
                  Generate and manage compliance assessment reports.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Report Generation */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Generate New Report</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Frameworks
                      </label>
                      <div className="space-y-2">
                        {frameworks.map((framework) => (
                          <label key={framework.id} className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm text-gray-900">{framework.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Generate Report
                    </button>
                  </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Recent Reports</h4>
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div>
                          <p className="font-medium text-gray-900">{report.name}</p>
                          <p className="text-sm text-gray-600">
                            {report.generatedAt.toLocaleDateString()} • Score: {report.overallScore}%
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.status === 'final' ? 'bg-green-100 text-green-800' :
                            report.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {report.status}
                          </span>
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
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