'use client'

import React, { useState } from 'react'
import { 
  Shield, Users, Settings, Plus, Search, Filter,
  Edit3, Trash2, Lock, Unlock, Key, UserCheck,
  AlertTriangle, CheckCircle, Clock, Eye, EyeOff,
  Crown, User, Building, Database, FileText,
  Calendar, Activity, BarChart3, Zap, Globe,
  Mail, Phone, CreditCard, Download, Upload,
  RotateCcw, RefreshCw, Copy, ExternalLink
} from 'lucide-react'

interface Permission {
  id: string
  name: string
  description: string
  module: string
  action: 'read' | 'write' | 'delete' | 'admin'
  resource: string
}

interface Role {
  id: string
  name: string
  description: string
  type: 'system' | 'custom'
  permissions: string[]
  userCount: number
  isActive: boolean
  createdAt: Date
  lastModified: Date
  color: string
}

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  roles: string[]
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: Date | null
  createdAt: Date
  department: string
  isOnline: boolean
}

interface RoleAssignment {
  userId: string
  roleId: string
  assignedBy: string
  assignedAt: Date
  expiresAt?: Date
}

export function RoleManager() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Super Administrator',
      description: 'Full system access with all administrative privileges',
      type: 'system',
      permissions: ['*'],
      userCount: 2,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      lastModified: new Date('2024-01-15'),
      color: 'red'
    },
    {
      id: '2',
      name: 'Sales Manager',
      description: 'Access to sales pipeline, leads, and customer management',
      type: 'custom',
      permissions: [
        'leads.read', 'leads.write', 'customers.read', 'customers.write',
        'quotes.read', 'quotes.write', 'pipeline.read', 'pipeline.write',
        'reports.sales.read'
      ],
      userCount: 5,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      lastModified: new Date('2024-01-18'),
      color: 'blue'
    },
    {
      id: '3',
      name: 'Project Manager',
      description: 'Project oversight and resource management capabilities',
      type: 'custom',
      permissions: [
        'projects.read', 'projects.write', 'tasks.read', 'tasks.write',
        'resources.read', 'resources.write', 'timesheets.read',
        'reports.projects.read'
      ],
      userCount: 8,
      isActive: true,
      createdAt: new Date('2024-01-02'),
      lastModified: new Date('2024-01-16'),
      color: 'green'
    },
    {
      id: '4',
      name: 'Customer Service',
      description: 'Customer support and communication tools access',
      type: 'custom',
      permissions: [
        'customers.read', 'tickets.read', 'tickets.write',
        'communications.read', 'communications.write', 'knowledge_base.read'
      ],
      userCount: 12,
      isActive: true,
      createdAt: new Date('2024-01-03'),
      lastModified: new Date('2024-01-14'),
      color: 'purple'
    },
    {
      id: '5',
      name: 'Finance Team',
      description: 'Financial data access and invoice management',
      type: 'custom',
      permissions: [
        'invoices.read', 'invoices.write', 'payments.read', 'payments.write',
        'financial_reports.read', 'accounting.read'
      ],
      userCount: 3,
      isActive: true,
      createdAt: new Date('2024-01-04'),
      lastModified: new Date('2024-01-12'),
      color: 'yellow'
    },
    {
      id: '6',
      name: 'Read Only User',
      description: 'View-only access to basic CRM information',
      type: 'system',
      permissions: [
        'customers.read', 'leads.read', 'projects.read', 'reports.basic.read'
      ],
      userCount: 15,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      lastModified: new Date('2024-01-10'),
      color: 'gray'
    }
  ])

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@bowmanskb.co.uk',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      roles: ['1'],
      status: 'active',
      lastLogin: new Date('2024-01-20T10:30:00'),
      createdAt: new Date('2024-01-01'),
      department: 'Management',
      isOnline: true
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@bowmanskb.co.uk',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=32&h=32&fit=crop&crop=face',
      roles: ['2'],
      status: 'active',
      lastLogin: new Date('2024-01-20T09:45:00'),
      createdAt: new Date('2024-01-05'),
      department: 'Sales',
      isOnline: true
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.wilson@bowmanskb.co.uk',
      roles: ['3'],
      status: 'active',
      lastLogin: new Date('2024-01-19T16:20:00'),
      createdAt: new Date('2024-01-08'),
      department: 'Projects',
      isOnline: false
    },
    {
      id: '4',
      name: 'Emma Brown',
      email: 'emma.brown@bowmanskb.co.uk',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      roles: ['4'],
      status: 'active',
      lastLogin: new Date('2024-01-20T11:00:00'),
      createdAt: new Date('2024-01-10'),
      department: 'Customer Service',
      isOnline: true
    },
    {
      id: '5',
      name: 'David Lee',
      email: 'david.lee@bowmanskb.co.uk',
      roles: ['5'],
      status: 'inactive',
      lastLogin: new Date('2024-01-15T14:30:00'),
      createdAt: new Date('2024-01-12'),
      department: 'Finance',
      isOnline: false
    }
  ])

  const [permissions] = useState<Permission[]>([
    // Customer Management
    { id: '1', name: 'View Customers', description: 'View customer information', module: 'customers', action: 'read', resource: 'customer' },
    { id: '2', name: 'Edit Customers', description: 'Create and edit customer records', module: 'customers', action: 'write', resource: 'customer' },
    { id: '3', name: 'Delete Customers', description: 'Delete customer records', module: 'customers', action: 'delete', resource: 'customer' },
    
    // Lead Management
    { id: '4', name: 'View Leads', description: 'View lead information', module: 'leads', action: 'read', resource: 'lead' },
    { id: '5', name: 'Manage Leads', description: 'Create, edit, and convert leads', module: 'leads', action: 'write', resource: 'lead' },
    { id: '6', name: 'Delete Leads', description: 'Delete lead records', module: 'leads', action: 'delete', resource: 'lead' },
    
    // Project Management
    { id: '7', name: 'View Projects', description: 'View project information', module: 'projects', action: 'read', resource: 'project' },
    { id: '8', name: 'Manage Projects', description: 'Create and manage projects', module: 'projects', action: 'write', resource: 'project' },
    { id: '9', name: 'Delete Projects', description: 'Delete project records', module: 'projects', action: 'delete', resource: 'project' },
    
    // Financial Management
    { id: '10', name: 'View Invoices', description: 'View invoice information', module: 'finance', action: 'read', resource: 'invoice' },
    { id: '11', name: 'Manage Invoices', description: 'Create and edit invoices', module: 'finance', action: 'write', resource: 'invoice' },
    { id: '12', name: 'Process Payments', description: 'Process payment transactions', module: 'finance', action: 'write', resource: 'payment' },
    
    // Reporting
    { id: '13', name: 'View Reports', description: 'Access standard reports', module: 'reports', action: 'read', resource: 'report' },
    { id: '14', name: 'Create Reports', description: 'Create custom reports', module: 'reports', action: 'write', resource: 'report' },
    { id: '15', name: 'Admin Reports', description: 'Access administrative reports', module: 'reports', action: 'admin', resource: 'report' },
    
    // System Administration
    { id: '16', name: 'User Management', description: 'Manage user accounts', module: 'admin', action: 'admin', resource: 'user' },
    { id: '17', name: 'System Settings', description: 'Modify system settings', module: 'admin', action: 'admin', resource: 'system' },
    { id: '18', name: 'Security Settings', description: 'Manage security configuration', module: 'admin', action: 'admin', resource: 'security' }
  ])

  const [selectedTab, setSelectedTab] = useState<'roles' | 'users' | 'permissions'>('roles')
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showCreateRole, setShowCreateRole] = useState(false)
  const [showAssignRole, setShowAssignRole] = useState(false)

  const getRoleColor = (color: string) => {
    const colors = {
      red: 'bg-red-100 text-red-800 border-red-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  const getRoleIcon = (roleType: string) => {
    return roleType === 'system' ? <Crown className="h-4 w-4" /> : <User className="h-4 w-4" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inactive': return <Clock className="h-4 w-4 text-gray-500" />
      case 'suspended': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const toggleRoleStatus = (roleId: string) => {
    setRoles(prev =>
      prev.map(role =>
        role.id === roleId ? { ...role, isActive: !role.isActive } : role
      )
    )
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    )
  }

  const assignRoleToUser = (userId: string, roleId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId 
          ? { ...user, roles: [...user.roles, roleId] }
          : user
      )
    )
  }

  const removeRoleFromUser = (userId: string, roleId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId 
          ? { ...user, roles: user.roles.filter(r => r !== roleId) }
          : user
      )
    )
  }

  const getUserRoles = (user: User) => {
    return roles.filter(role => user.roles.includes(role.id))
  }

  const getPermissionsByRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    if (!role) return []
    
    if (role.permissions.includes('*')) {
      return permissions
    }
    
    return permissions.filter(p => role.permissions.includes(p.id))
  }

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'active' && role.isActive) ||
                         (filterStatus === 'inactive' && !role.isActive) ||
                         (filterStatus === 'system' && role.type === 'system') ||
                         (filterStatus === 'custom' && role.type === 'custom')
    
    return matchesSearch && matchesStatus
  })

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || user.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  if (selectedRole) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedRole(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Roles
            </button>
            <div className="flex items-center space-x-3">
              {getRoleIcon(selectedRole.type)}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedRole.name}</h2>
                <p className="text-gray-600">{selectedRole.description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2">
              <Copy className="h-4 w-4" />
              <span>Duplicate Role</span>
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2">
              <Edit3 className="h-4 w-4" />
              <span>Edit Role</span>
            </button>
            <button
              onClick={() => toggleRoleStatus(selectedRole.id)}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                selectedRole.isActive
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {selectedRole.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              <span>{selectedRole.isActive ? 'Deactivate' : 'Activate'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Role Information */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Role Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                  <p className="text-sm text-gray-900">{selectedRole.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
                    selectedRole.type === 'system' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {getRoleIcon(selectedRole.type)}
                    <span>{selectedRole.type.charAt(0).toUpperCase() + selectedRole.type.slice(1)}</span>
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedRole.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedRole.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Users</label>
                  <p className="text-sm text-gray-900">{selectedRole.userCount} users</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-sm text-gray-900">{selectedRole.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Modified</label>
                  <p className="text-sm text-gray-900">{selectedRole.lastModified.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-sm text-gray-900">{selectedRole.description}</p>
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Permissions</h3>
              <div className="space-y-4">
                {selectedRole.permissions.includes('*') ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-900">Super Administrator</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      This role has full system access and all permissions.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['customers', 'leads', 'projects', 'finance', 'reports', 'admin'].map((module) => {
                      const modulePermissions = getPermissionsByRole(selectedRole.id).filter(p => p.module === module)
                      if (modulePermissions.length === 0) return null
                      
                      return (
                        <div key={module} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2 capitalize">
                            {module} Management
                          </h4>
                          <div className="space-y-2">
                            {modulePermissions.map((permission) => (
                              <div key={permission.id} className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-gray-700">{permission.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Users */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Assigned Users</h3>
                <button 
                  onClick={() => setShowAssignRole(true)}
                  className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Assign User</span>
                </button>
              </div>
              <div className="space-y-3">
                {users.filter(user => user.roles.includes(selectedRole.id)).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div className="flex items-center space-x-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                      ) : (
                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      {user.isOnline && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                      <button
                        onClick={() => removeRoleFromUser(user.id, selectedRole.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Remove role"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Permissions:</span>
                  <span className="font-medium">
                    {selectedRole.permissions.includes('*') ? 'All' : getPermissionsByRole(selectedRole.id).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Assigned Users:</span>
                  <span className="font-medium">{selectedRole.userCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Users:</span>
                  <span className="font-medium text-green-600">
                    {users.filter(u => u.roles.includes(selectedRole.id) && u.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role Type:</span>
                  <span className="font-medium">{selectedRole.type}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Edit Permissions
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Duplicate Role
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Export User List
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  View Audit Log
                </button>
                {selectedRole.type === 'custom' && (
                  <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                    Delete Role
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (selectedUser) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedUser(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Users
            </button>
            <div className="flex items-center space-x-3">
              {selectedUser.avatar ? (
                <img src={selectedUser.avatar} alt={selectedUser.name} className="h-10 w-10 rounded-full" />
              ) : (
                <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>
              {selectedUser.isOnline && (
                <div className="flex items-center space-x-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Online</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Assign Role</span>
            </button>
            <button
              onClick={() => toggleUserStatus(selectedUser.id)}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                selectedUser.status === 'active'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {selectedUser.status === 'active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              <span>{selectedUser.status === 'active' ? 'Deactivate' : 'Activate'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* User Information */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-sm text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <p className="text-sm text-gray-900">{selectedUser.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-sm text-gray-900">{selectedUser.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                  <p className="text-sm text-gray-900">
                    {selectedUser.lastLogin ? selectedUser.lastLogin.toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>

            {/* Assigned Roles */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Assigned Roles</h3>
              <div className="space-y-3">
                {getUserRoles(selectedUser).map((role) => (
                  <div key={role.id} className={`border rounded-lg p-4 ${getRoleColor(role.color)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getRoleIcon(role.type)}
                        <div>
                          <h4 className="font-medium">{role.name}</h4>
                          <p className="text-sm opacity-80">{role.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeRoleFromUser(selectedUser.id, role.id)}
                        className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
                        title="Remove role"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Effective Permissions */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Effective Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['customers', 'leads', 'projects', 'finance', 'reports', 'admin'].map((module) => {
                  const userPermissions = selectedUser.roles.flatMap(roleId => 
                    getPermissionsByRole(roleId).filter(p => p.module === module)
                  )
                  const uniquePermissions = userPermissions.filter((p, index, self) => 
                    index === self.findIndex(perm => perm.id === p.id)
                  )
                  
                  if (uniquePermissions.length === 0) return null
                  
                  return (
                    <div key={module} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 capitalize">
                        {module} Management
                      </h4>
                      <div className="space-y-1">
                        {uniquePermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-gray-700">{permission.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Activity Summary */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Roles:</span>
                  <span className="font-medium">{selectedUser.roles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Login:</span>
                  <span className="font-medium">
                    {selectedUser.lastLogin ? selectedUser.lastLogin.toLocaleDateString() : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">{selectedUser.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Online:</span>
                  <span className={`font-medium ${selectedUser.isOnline ? 'text-green-600' : 'text-gray-600'}`}>
                    {selectedUser.isOnline ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Reset Password
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Send Welcome Email
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  View Login History
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                  Generate API Key
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                  Delete User
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
          <h2 className="text-2xl font-bold text-gray-900">Role Manager</h2>
          <p className="text-gray-600 mt-1">Manage user roles and permissions across the system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowCreateRole(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Role</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Roles</p>
              <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Key className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Permissions</p>
              <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Crown className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">System Roles</p>
              <p className="text-2xl font-bold text-gray-900">
                {roles.filter(r => r.type === 'system').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'roles', label: 'Roles', icon: Shield },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'permissions', label: 'Permissions', icon: Key }
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
          {selectedTab === 'roles' && (
            <div>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search roles..."
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
                  <option value="">All Roles</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="system">System Roles</option>
                  <option value="custom">Custom Roles</option>
                </select>
                <div className="col-span-2 flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>{filteredRoles.length} roles</span>
                </div>
              </div>

              {/* Roles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoles.map((role) => (
                  <div key={role.id} className={`border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer ${getRoleColor(role.color)}`}
                       onClick={() => setSelectedRole(role)}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(role.type)}
                        <span className="font-medium text-sm">
                          {role.type === 'system' ? 'System Role' : 'Custom Role'}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        role.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{role.name}</h3>
                    <p className="text-sm opacity-80 mb-4">{role.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{role.userCount} users</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Key className="h-4 w-4" />
                          <span>
                            {role.permissions.includes('*') ? 'All' : role.permissions.length} perms
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'users' && (
            <div>
              {/* User Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
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
                  <option value="suspended">Suspended</option>
                </select>
                <div className="col-span-2 flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{filteredUsers.length} users</span>
                </div>
              </div>

              {/* Users List */}
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                       onClick={() => setSelectedUser(user)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                        ) : (
                          <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{user.name}</h3>
                            {user.isOnline && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.department}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {user.roles.length} role{user.roles.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {getUserRoles(user).slice(0, 2).map((role) => (
                            <span
                              key={role.id}
                              className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(role.color)}`}
                            >
                              {role.name}
                            </span>
                          ))}
                          {user.roles.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                              +{user.roles.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'permissions' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">System Permissions</h3>
                <p className="text-gray-600">
                  All available permissions that can be assigned to roles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['customers', 'leads', 'projects', 'finance', 'reports', 'admin'].map((module) => {
                  const modulePermissions = permissions.filter(p => p.module === module)
                  
                  return (
                    <div key={module} className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-lg mb-4 capitalize flex items-center space-x-2">
                        {module === 'customers' && <Users className="h-5 w-5 text-blue-600" />}
                        {module === 'leads' && <UserCheck className="h-5 w-5 text-green-600" />}
                        {module === 'projects' && <Building className="h-5 w-5 text-purple-600" />}
                        {module === 'finance' && <CreditCard className="h-5 w-5 text-yellow-600" />}
                        {module === 'reports' && <BarChart3 className="h-5 w-5 text-red-600" />}
                        {module === 'admin' && <Settings className="h-5 w-5 text-gray-600" />}
                        <span>{module} Management</span>
                      </h4>
                      
                      <div className="space-y-3">
                        {modulePermissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-3">
                            <div className={`p-1 rounded mt-0.5 ${
                              permission.action === 'read' ? 'bg-blue-100' :
                              permission.action === 'write' ? 'bg-green-100' :
                              permission.action === 'delete' ? 'bg-red-100' :
                              'bg-purple-100'
                            }`}>
                              {permission.action === 'read' && <Eye className="h-3 w-3 text-blue-600" />}
                              {permission.action === 'write' && <Edit3 className="h-3 w-3 text-green-600" />}
                              {permission.action === 'delete' && <Trash2 className="h-3 w-3 text-red-600" />}
                              {permission.action === 'admin' && <Crown className="h-3 w-3 text-purple-600" />}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-900">{permission.name}</p>
                              <p className="text-xs text-gray-500">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}