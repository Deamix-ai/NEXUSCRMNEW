'use client'

import React, { useState } from 'react'
import { 
  Settings, Play, Pause, Edit3, Trash2, Copy, 
  Plus, Filter, Search, Clock, Users, Zap,
  CheckCircle, XCircle, AlertTriangle, BarChart3,
  Calendar, Target, Mail, Phone, Database,
  FileText, ArrowRight, RotateCcw, Activity
} from 'lucide-react'

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: {
    type: string
    conditions: Record<string, any>
  }
  actions: Array<{
    type: string
    config: Record<string, any>
  }>
  isActive: boolean
  lastTriggered: Date | null
  triggerCount: number
  successRate: number
  createdAt: Date
  category: string
  priority: 'low' | 'medium' | 'high'
}

interface TriggerTemplate {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  category: string
  configFields: Array<{
    name: string
    type: string
    label: string
    required: boolean
    options?: string[]
  }>
}

export function AutomationRules() {
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'New Lead Auto-Assignment',
      description: 'Automatically assign new leads to available sales team members based on territory and workload',
      trigger: {
        type: 'record_created',
        conditions: { entity: 'lead', source: 'website' }
      },
      actions: [
        { type: 'assign_user', config: { strategy: 'round_robin', team: 'sales' } },
        { type: 'send_notification', config: { template: 'new_lead_assigned' } }
      ],
      isActive: true,
      lastTriggered: new Date('2024-01-20T10:30:00'),
      triggerCount: 245,
      successRate: 98.5,
      createdAt: new Date('2024-01-01'),
      category: 'Lead Management',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Follow-up Reminder System',
      description: 'Send automated follow-up reminders for overdue tasks and appointments',
      trigger: {
        type: 'schedule',
        conditions: { frequency: 'daily', time: '09:00' }
      },
      actions: [
        { type: 'check_overdue_tasks', config: {} },
        { type: 'send_email', config: { template: 'task_reminder' } },
        { type: 'create_activity', config: { type: 'follow_up_reminder' } }
      ],
      isActive: true,
      lastTriggered: new Date('2024-01-20T09:00:00'),
      triggerCount: 20,
      successRate: 100,
      createdAt: new Date('2024-01-05'),
      category: 'Task Management',
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Quote Approval Workflow',
      description: 'Route quotes over £10,000 to management for approval before sending to client',
      trigger: {
        type: 'record_updated',
        conditions: { entity: 'quote', field: 'total_amount', operator: 'greater_than', value: 10000 }
      },
      actions: [
        { type: 'update_status', config: { status: 'pending_approval' } },
        { type: 'assign_user', config: { role: 'sales_manager' } },
        { type: 'send_notification', config: { template: 'quote_approval_needed' } }
      ],
      isActive: true,
      lastTriggered: new Date('2024-01-19T14:15:00'),
      triggerCount: 15,
      successRate: 93.3,
      createdAt: new Date('2024-01-10'),
      category: 'Sales',
      priority: 'high'
    },
    {
      id: '4',
      name: 'Customer Satisfaction Survey',
      description: 'Send satisfaction surveys 7 days after project completion',
      trigger: {
        type: 'record_updated',
        conditions: { entity: 'project', field: 'status', value: 'completed' }
      },
      actions: [
        { type: 'wait', config: { duration: 7, unit: 'days' } },
        { type: 'send_email', config: { template: 'satisfaction_survey' } },
        { type: 'create_task', config: { title: 'Follow up on survey response' } }
      ],
      isActive: false,
      lastTriggered: new Date('2024-01-18T16:45:00'),
      triggerCount: 8,
      successRate: 87.5,
      createdAt: new Date('2024-01-12'),
      category: 'Customer Service',
      priority: 'low'
    }
  ])

  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null)
  const [showNewRule, setShowNewRule] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const triggerTemplates: TriggerTemplate[] = [
    {
      id: 'record_created',
      name: 'Record Created',
      description: 'Trigger when a new record is created',
      icon: Plus,
      category: 'Data Events',
      configFields: [
        { name: 'entity', type: 'select', label: 'Entity Type', required: true, options: ['lead', 'account', 'project', 'quote'] },
        { name: 'conditions', type: 'json', label: 'Additional Conditions', required: false }
      ]
    },
    {
      id: 'record_updated',
      name: 'Record Updated',
      description: 'Trigger when a record is modified',
      icon: Edit3,
      category: 'Data Events',
      configFields: [
        { name: 'entity', type: 'select', label: 'Entity Type', required: true, options: ['lead', 'account', 'project', 'quote'] },
        { name: 'field', type: 'text', label: 'Field Name', required: true },
        { name: 'operator', type: 'select', label: 'Operator', required: true, options: ['equals', 'not_equals', 'greater_than', 'less_than', 'contains'] },
        { name: 'value', type: 'text', label: 'Value', required: true }
      ]
    },
    {
      id: 'schedule',
      name: 'Scheduled',
      description: 'Trigger at specific times or intervals',
      icon: Clock,
      category: 'Time-based',
      configFields: [
        { name: 'frequency', type: 'select', label: 'Frequency', required: true, options: ['daily', 'weekly', 'monthly'] },
        { name: 'time', type: 'time', label: 'Time', required: true },
        { name: 'days', type: 'multiselect', label: 'Days (for weekly)', required: false, options: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }
      ]
    },
    {
      id: 'email_received',
      name: 'Email Received',
      description: 'Trigger when an email is received',
      icon: Mail,
      category: 'Communication',
      configFields: [
        { name: 'from', type: 'text', label: 'From Email Pattern', required: false },
        { name: 'subject', type: 'text', label: 'Subject Contains', required: false },
        { name: 'to', type: 'text', label: 'To Email', required: false }
      ]
    }
  ]

  const categories = Array.from(new Set(rules.map(rule => rule.category)))
  
  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || rule.category === filterCategory
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'active' && rule.isActive) ||
                         (filterStatus === 'inactive' && !rule.isActive)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    )
  }

  const duplicateRule = (rule: AutomationRule) => {
    const newRule: AutomationRule = {
      ...rule,
      id: `rule_${Date.now()}`,
      name: `${rule.name} (Copy)`,
      triggerCount: 0,
      lastTriggered: null,
      createdAt: new Date(),
      isActive: false
    }

    setRules(prev => [...prev, newRule])
  }

  const deleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const NewRuleForm = () => (
    <div className="bg-white p-6 rounded-lg border max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Create New Automation Rule</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rule Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter rule name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select category</option>
              <option value="Lead Management">Lead Management</option>
              <option value="Sales">Sales</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Task Management">Task Management</option>
              <option value="Project Management">Project Management</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Describe what this rule does"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trigger Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {triggerTemplates.map((template) => {
              const IconComponent = template.icon
              return (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50"
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-gray-500">{template.category}</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{template.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={() => setShowNewRule(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowNewRule(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Rule
          </button>
        </div>
      </div>
    </div>
  )

  if (showNewRule) {
    return <NewRuleForm />
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automation Rules</h2>
          <p className="text-gray-600 mt-1">Configure automated actions and business rules</p>
        </div>
        <button
          onClick={() => setShowNewRule(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Rule</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search rules..."
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
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Activity className="h-4 w-4" />
            <span>{filteredRules.filter(r => r.isActive).length} active rules</span>
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <div key={rule.id} className="bg-white rounded-lg border p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rule.priority)}`}>
                    {rule.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{rule.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>Triggered {rule.triggerCount} times</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="h-4 w-4" />
                    <span className={getSuccessRateColor(rule.successRate)}>
                      {rule.successRate}% success rate
                    </span>
                  </div>
                  {rule.lastTriggered && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Last: {rule.lastTriggered.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{rule.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => toggleRuleStatus(rule.id)}
                  className={`p-2 rounded ${
                    rule.isActive 
                      ? 'text-orange-600 hover:bg-orange-50' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                  title={rule.isActive ? 'Pause Rule' : 'Activate Rule'}
                >
                  {rule.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                  title="Edit Rule"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => duplicateRule(rule)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                  title="Duplicate Rule"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Delete Rule"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-12">
          <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterCategory || filterStatus ? 'No matching rules found' : 'No automation rules yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterCategory || filterStatus 
              ? 'Try adjusting your filters to see more results'
              : 'Create your first automation rule to streamline your workflow'
            }
          </p>
          {!searchTerm && !filterCategory && !filterStatus && (
            <button
              onClick={() => setShowNewRule(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create First Rule
            </button>
          )}
        </div>
      )}
    </div>
  )
}