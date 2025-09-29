'use client'

import React, { useState, useRef, useCallback } from 'react'
import { 
  Play, Plus, Save, Settings, Trash2, Copy, 
  GitBranch, Zap, Clock, Users, Mail, Phone,
  Database, FileText, CheckCircle, XCircle,
  ArrowRight, ArrowDown, RotateCcw, Workflow
} from 'lucide-react'

interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'delay'
  title: string
  description: string
  config: Record<string, any>
  position: { x: number; y: number }
  connections: string[]
}

interface WorkflowTemplate {
  id: string
  name: string
  category: string
  description: string
  nodes: WorkflowNode[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([
    {
      id: '1',
      name: 'New Lead Assignment',
      category: 'Lead Management',
      description: 'Automatically assign new leads to sales team members',
      nodes: [],
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '2',
      name: 'Follow-up Reminder',
      category: 'Customer Service',
      description: 'Send follow-up reminders for overdue tasks',
      nodes: [],
      isActive: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18')
    }
  ])

  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null)
  const [showNewWorkflow, setShowNewWorkflow] = useState(false)
  const [draggedNode, setDraggedNode] = useState<WorkflowNode | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const nodeTypes = [
    { type: 'trigger', icon: Zap, label: 'Trigger', color: 'bg-green-100 text-green-800' },
    { type: 'action', icon: Play, label: 'Action', color: 'bg-blue-100 text-blue-800' },
    { type: 'condition', icon: GitBranch, label: 'Condition', color: 'bg-yellow-100 text-yellow-800' },
    { type: 'delay', icon: Clock, label: 'Delay', color: 'bg-purple-100 text-purple-800' }
  ]

  const actionTypes = [
    { id: 'send_email', label: 'Send Email', icon: Mail, category: 'Communication' },
    { id: 'make_call', label: 'Schedule Call', icon: Phone, category: 'Communication' },
    { id: 'assign_user', label: 'Assign to User', icon: Users, category: 'Assignment' },
    { id: 'update_record', label: 'Update Record', icon: Database, category: 'Data' },
    { id: 'create_task', label: 'Create Task', icon: CheckCircle, category: 'Task Management' },
    { id: 'generate_document', label: 'Generate Document', icon: FileText, category: 'Documents' }
  ]

  const handleDragStart = (nodeType: string) => {
    // Implementation for drag start
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!canvasRef.current || !draggedNode) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newNode: WorkflowNode = {
      ...draggedNode,
      id: `node_${Date.now()}`,
      position: { x, y },
      connections: []
    }

    if (selectedWorkflow) {
      setSelectedWorkflow({
        ...selectedWorkflow,
        nodes: [...selectedWorkflow.nodes, newNode]
      })
    }

    setDraggedNode(null)
  }, [draggedNode, selectedWorkflow])

  const saveWorkflow = () => {
    if (!selectedWorkflow) return

    setWorkflows(prev => 
      prev.map(w => w.id === selectedWorkflow.id ? selectedWorkflow : w)
    )
  }

  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(prev =>
      prev.map(w =>
        w.id === workflowId ? { ...w, isActive: !w.isActive } : w
      )
    )
  }

  const duplicateWorkflow = (workflow: WorkflowTemplate) => {
    const newWorkflow: WorkflowTemplate = {
      ...workflow,
      id: `workflow_${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setWorkflows(prev => [...prev, newWorkflow])
  }

  const deleteWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== workflowId))
    if (selectedWorkflow?.id === workflowId) {
      setSelectedWorkflow(null)
    }
  }

  const NewWorkflowForm = () => (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Create New Workflow</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Workflow Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter workflow name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select category</option>
            <option value="lead_management">Lead Management</option>
            <option value="customer_service">Customer Service</option>
            <option value="sales">Sales</option>
            <option value="project_management">Project Management</option>
            <option value="finance">Finance</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Describe what this workflow does"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowNewWorkflow(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowNewWorkflow(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Workflow
          </button>
        </div>
      </div>
    </div>
  )

  if (showNewWorkflow) {
    return <NewWorkflowForm />
  }

  if (selectedWorkflow) {
    return (
      <div className="h-full flex">
        {/* Sidebar with node palette */}
        <div className="w-64 bg-gray-50 border-r p-4 overflow-y-auto">
          <div className="mb-6">
            <button
              onClick={() => setSelectedWorkflow(null)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
            >
              <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
              Back to Workflows
            </button>
            <h3 className="font-semibold text-gray-900">{selectedWorkflow.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{selectedWorkflow.description}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Node Types</h4>
              <div className="space-y-2">
                {nodeTypes.map(({ type, icon: Icon, label, color }) => (
                  <div
                    key={type}
                    draggable
                    onDragStart={() => handleDragStart(type)}
                    className={`${color} p-2 rounded cursor-grab flex items-center space-x-2 hover:shadow-sm`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
              <div className="space-y-1">
                {actionTypes.map(({ id, label, icon: Icon, category }) => (
                  <div
                    key={id}
                    draggable
                    className="p-2 text-gray-700 rounded cursor-grab flex items-center space-x-2 hover:bg-gray-100"
                  >
                    <Icon className="h-4 w-4" />
                    <div>
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs text-gray-500">{category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <button
              onClick={saveWorkflow}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Workflow</span>
            </button>
          </div>
        </div>

        {/* Canvas area */}
        <div className="flex-1 relative bg-gray-100">
          <div
            ref={canvasRef}
            className="w-full h-full relative overflow-auto"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {selectedWorkflow.nodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Workflow className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Start Building Your Workflow</p>
                  <p className="text-sm mt-1">Drag nodes from the sidebar to get started</p>
                </div>
              </div>
            ) : (
              <div className="p-4">
                {selectedWorkflow.nodes.map((node) => (
                  <div
                    key={node.id}
                    className="absolute bg-white border-2 border-gray-200 rounded-lg p-3 shadow-sm"
                    style={{ left: node.position.x, top: node.position.y }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${nodeTypes.find(t => t.type === node.type)?.color}`}>
                        {React.createElement(nodeTypes.find(t => t.type === node.type)?.icon || Play, { 
                          className: "h-4 w-4" 
                        })}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{node.title}</div>
                        <div className="text-xs text-gray-500">{node.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflow Builder</h2>
          <p className="text-gray-600 mt-1">Create and manage automated business processes</p>
        </div>
        <button
          onClick={() => setShowNewWorkflow(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Workflow</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{workflow.category}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                workflow.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {workflow.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{workflow.description}</p>

            <div className="text-xs text-gray-500 mb-4">
              Updated {workflow.updatedAt.toLocaleDateString()}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedWorkflow(workflow)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => toggleWorkflowStatus(workflow.id)}
                className={`p-2 rounded ${
                  workflow.isActive 
                    ? 'text-red-600 hover:bg-red-50' 
                    : 'text-green-600 hover:bg-green-50'
                }`}
                title={workflow.isActive ? 'Deactivate' : 'Activate'}
              >
                {workflow.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              </button>
              <button
                onClick={() => duplicateWorkflow(workflow)}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                title="Duplicate"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={() => deleteWorkflow(workflow.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {workflows.length === 0 && (
        <div className="text-center py-12">
          <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows yet</h3>
          <p className="text-gray-600 mb-4">Create your first automated workflow to get started</p>
          <button
            onClick={() => setShowNewWorkflow(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create First Workflow
          </button>
        </div>
      )}
    </div>
  )
}