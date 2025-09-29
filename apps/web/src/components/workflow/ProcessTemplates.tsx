'use client'

import React, { useState } from 'react'
import { 
  FileText, Plus, Search, Filter, Download, Upload,
  Settings, Play, Copy, Edit3, Trash2, FolderPlus,
  Tag, Clock, Users, Zap, Target, Database,
  Mail, Phone, CheckCircle, BarChart3, Archive
} from 'lucide-react'

interface ProcessTemplate {
  id: string
  name: string
  description: string
  category: string
  version: string
  isPublic: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
  usageCount: number
  rating: number
  tags: string[]
  steps: Array<{
    id: string
    title: string
    description: string
    type: 'manual' | 'automated'
    estimatedTime: number
    assignedRole?: string
    dependencies: string[]
  }>
  variables: Array<{
    name: string
    type: 'text' | 'number' | 'date' | 'boolean' | 'select'
    label: string
    required: boolean
    defaultValue?: any
    options?: string[]
  }>
}

interface TemplateCategory {
  id: string
  name: string
  description: string
  color: string
  icon: React.ComponentType<any>
  templateCount: number
}

export function ProcessTemplates() {
  const [templates, setTemplates] = useState<ProcessTemplate[]>([
    {
      id: '1',
      name: 'New Customer Onboarding',
      description: 'Complete process for onboarding new customers from initial contact to project kickoff',
      category: 'Customer Management',
      version: '1.2',
      isPublic: true,
      createdBy: 'System Admin',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
      usageCount: 45,
      rating: 4.8,
      tags: ['onboarding', 'customer', 'process'],
      steps: [
        {
          id: 'step1',
          title: 'Initial Contact Setup',
          description: 'Create customer record and initial project briefing',
          type: 'manual',
          estimatedTime: 30,
          assignedRole: 'Sales Representative',
          dependencies: []
        },
        {
          id: 'step2',
          title: 'Send Welcome Package',
          description: 'Automatically send welcome email with company information',
          type: 'automated',
          estimatedTime: 2,
          dependencies: ['step1']
        },
        {
          id: 'step3',
          title: 'Schedule Design Consultation',
          description: 'Book initial design meeting with customer',
          type: 'manual',
          estimatedTime: 15,
          assignedRole: 'Design Team',
          dependencies: ['step2']
        }
      ],
      variables: [
        { name: 'customer_name', type: 'text', label: 'Customer Name', required: true },
        { name: 'project_type', type: 'select', label: 'Project Type', required: true, options: ['Kitchen', 'Bathroom', 'Both'] },
        { name: 'budget_range', type: 'select', label: 'Budget Range', required: false, options: ['£5k-£10k', '£10k-£20k', '£20k+'] }
      ]
    },
    {
      id: '2',
      name: 'Lead Qualification Process',
      description: 'Systematic approach to qualifying and scoring new leads',
      category: 'Sales',
      version: '2.0',
      isPublic: true,
      createdBy: 'Sales Manager',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-18'),
      usageCount: 128,
      rating: 4.6,
      tags: ['lead', 'qualification', 'sales'],
      steps: [
        {
          id: 'step1',
          title: 'Initial Lead Assessment',
          description: 'Review lead information and basic qualification',
          type: 'manual',
          estimatedTime: 20,
          assignedRole: 'Sales Representative',
          dependencies: []
        },
        {
          id: 'step2',
          title: 'BANT Qualification',
          description: 'Assess Budget, Authority, Need, and Timeline',
          type: 'manual',
          estimatedTime: 45,
          assignedRole: 'Sales Representative',
          dependencies: ['step1']
        },
        {
          id: 'step3',
          title: 'Lead Scoring Update',
          description: 'Update lead score based on qualification',
          type: 'automated',
          estimatedTime: 1,
          dependencies: ['step2']
        }
      ],
      variables: [
        { name: 'lead_source', type: 'select', label: 'Lead Source', required: true, options: ['Website', 'Referral', 'Social Media', 'Advertisement'] },
        { name: 'urgency_level', type: 'select', label: 'Urgency Level', required: true, options: ['Immediate', 'Within 3 months', '3-6 months', '6+ months'] },
        { name: 'decision_maker', type: 'boolean', label: 'Is Decision Maker?', required: true }
      ]
    },
    {
      id: '3',
      name: 'Project Handover Process',
      description: 'Smooth transition from sales to project management team',
      category: 'Project Management',
      version: '1.0',
      isPublic: false,
      createdBy: 'Project Manager',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      usageCount: 23,
      rating: 4.9,
      tags: ['handover', 'project', 'transition'],
      steps: [
        {
          id: 'step1',
          title: 'Compile Project Documentation',
          description: 'Gather all sales documents, contracts, and specifications',
          type: 'manual',
          estimatedTime: 60,
          assignedRole: 'Sales Representative',
          dependencies: []
        },
        {
          id: 'step2',
          title: 'Project Manager Assignment',
          description: 'Assign dedicated project manager based on workload and expertise',
          type: 'automated',
          estimatedTime: 5,
          dependencies: ['step1']
        },
        {
          id: 'step3',
          title: 'Handover Meeting',
          description: 'Meeting between sales and project teams',
          type: 'manual',
          estimatedTime: 30,
          assignedRole: 'Project Manager',
          dependencies: ['step2']
        }
      ],
      variables: [
        { name: 'project_complexity', type: 'select', label: 'Project Complexity', required: true, options: ['Simple', 'Medium', 'Complex'] },
        { name: 'special_requirements', type: 'text', label: 'Special Requirements', required: false },
        { name: 'target_start_date', type: 'date', label: 'Target Start Date', required: true }
      ]
    }
  ])

  const [categories] = useState<TemplateCategory[]>([
    {
      id: '1',
      name: 'Customer Management',
      description: 'Templates for customer lifecycle processes',
      color: 'bg-blue-100 text-blue-800',
      icon: Users,
      templateCount: 8
    },
    {
      id: '2',
      name: 'Sales',
      description: 'Sales process templates and workflows',
      color: 'bg-green-100 text-green-800',
      icon: Target,
      templateCount: 12
    },
    {
      id: '3',
      name: 'Project Management',
      description: 'Project execution and management templates',
      color: 'bg-purple-100 text-purple-800',
      icon: BarChart3,
      templateCount: 6
    },
    {
      id: '4',
      name: 'Communication',
      description: 'Email and communication templates',
      color: 'bg-orange-100 text-orange-800',
      icon: Mail,
      templateCount: 15
    },
    {
      id: '5',
      name: 'Quality Assurance',
      description: 'QA and compliance process templates',
      color: 'bg-red-100 text-red-800',
      icon: CheckCircle,
      templateCount: 4
    }
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<ProcessTemplate | null>(null)
  const [showNewTemplate, setShowNewTemplate] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterType, setFilterType] = useState('')

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = !filterCategory || template.category === filterCategory
    const matchesType = !filterType || 
                       (filterType === 'public' && template.isPublic) ||
                       (filterType === 'private' && !template.isPublic)
    
    return matchesSearch && matchesCategory && matchesType
  })

  const useTemplate = (template: ProcessTemplate) => {
    // Implementation for using template
    console.log('Using template:', template.name)
  }

  const duplicateTemplate = (template: ProcessTemplate) => {
    const newTemplate: ProcessTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdBy: 'Current User',
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      rating: 0,
      isPublic: false
    }

    setTemplates(prev => [...prev, newTemplate])
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId))
  }

  const exportTemplate = (template: ProcessTemplate) => {
    const dataStr = JSON.stringify(template, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${template.name.replace(/\s+/g, '_')}_template.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ))
  }

  if (selectedTemplate) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Templates
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedTemplate.name}</h2>
              <p className="text-gray-600">{selectedTemplate.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => useTemplate(selectedTemplate)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Use Template</span>
            </button>
            <button
              onClick={() => duplicateTemplate(selectedTemplate)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2"
            >
              <Copy className="h-4 w-4" />
              <span>Duplicate</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Process Steps</h3>
              <div className="space-y-4">
                {selectedTemplate.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          step.type === 'automated' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {step.type === 'automated' ? 'Automated' : 'Manual'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{step.estimatedTime} min</span>
                        </div>
                        {step.assignedRole && (
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{step.assignedRole}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Template Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium">{selectedTemplate.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{selectedTemplate.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created by:</span>
                  <span className="font-medium">{selectedTemplate.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Usage count:</span>
                  <span className="font-medium">{selectedTemplate.usageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center space-x-1">
                    {renderStars(selectedTemplate.rating)}
                    <span className="ml-1 font-medium">{selectedTemplate.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Visibility:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedTemplate.isPublic 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedTemplate.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </div>

            {selectedTemplate.variables.length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Template Variables</h3>
                <div className="space-y-3">
                  {selectedTemplate.variables.map((variable) => (
                    <div key={variable.name} className="border border-gray-200 rounded p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{variable.label}</span>
                        {variable.required && (
                          <span className="text-red-500 text-xs">Required</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Type: {variable.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showNewTemplate) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Create New Process Template</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
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
                  placeholder="Describe what this template does"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Version
                  </label>
                  <input
                    type="text"
                    defaultValue="1.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visibility
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. onboarding, customer, process"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowNewTemplate(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowNewTemplate(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Template
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
          <h2 className="text-2xl font-bold text-gray-900">Process Templates</h2>
          <p className="text-gray-600 mt-1">Reusable templates for common business processes</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </button>
          <button
            onClick={() => setShowNewTemplate(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
                  <p className="text-sm text-gray-500">{category.templateCount} templates</p>
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
              placeholder="Search templates..."
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FileText className="h-4 w-4" />
            <span>{filteredTemplates.length} templates</span>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{template.category}</p>
                <div className="flex items-center space-x-1 mb-2">
                  {renderStars(template.rating)}
                  <span className="text-sm text-gray-500">({template.usageCount})</span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                template.isPublic 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {template.isPublic ? 'Public' : 'Private'}
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{template.tags.length - 3} more</span>
              )}
            </div>

            <div className="text-xs text-gray-500 mb-4">
              <div>v{template.version} • {template.steps.length} steps</div>
              <div>Updated {template.updatedAt.toLocaleDateString()}</div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedTemplate(template)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
              >
                View Details
              </button>
              <button
                onClick={() => useTemplate(template)}
                className="p-2 text-green-600 hover:bg-green-50 rounded"
                title="Use Template"
              >
                <Play className="h-4 w-4" />
              </button>
              <button
                onClick={() => exportTemplate(template)}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                title="Export Template"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={() => duplicateTemplate(template)}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                title="Duplicate Template"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterCategory || filterType ? 'No matching templates found' : 'No process templates yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterCategory || filterType 
              ? 'Try adjusting your filters to see more results'
              : 'Create your first process template to standardize workflows'
            }
          </p>
          {!searchTerm && !filterCategory && !filterType && (
            <button
              onClick={() => setShowNewTemplate(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create First Template
            </button>
          )}
        </div>
      )}
    </div>
  )
}