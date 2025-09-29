'use client';

import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  Wrench,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  User,
  Settings,
  BarChart3,
  PieChart,
  Target,
  Award,
  Activity,
  Briefcase,
  Home,
  Phone,
  Mail,
  MapPin,
  FileText,
  Download
} from 'lucide-react';

// TypeScript interfaces for Resource Management
interface ProjectResource {
  id: string;
  projectId: string;
  type: 'personnel' | 'equipment' | 'material' | 'budget';
  name: string;
  description: string;
  cost: number;
  quantity: number;
  unit: string;
  allocatedDate: string;
  startDate?: string;
  endDate?: string;
  status: 'allocated' | 'in-use' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: 'Project Manager' | 'Designer' | 'Installer' | 'Supervisor' | 'Client' | 'Subcontractor';
  hourlyRate: number;
  allocatedHours: number;
  actualHours: number;
  startDate: string;
  endDate?: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'completed';
  addedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
    department?: string;
    skills: string[];
  };
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  description: string;
  dailyCost: number;
  status: 'available' | 'in-use' | 'maintenance' | 'unavailable';
  location: string;
  specifications: Record<string, string>;
  lastMaintenance?: string;
  nextMaintenance?: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  allocatedAmount: number;
  spentAmount: number;
  remaining: number;
  percentage: number;
  items: BudgetItem[];
}

interface BudgetItem {
  id: string;
  categoryId: string;
  description: string;
  budgetedAmount: number;
  actualAmount: number;
  status: 'planned' | 'committed' | 'paid';
  date: string;
  vendor?: string;
  notes?: string;
}

interface ResourceManagerProps {
  projectId: string;
  projectBudget: number;
  members: ProjectMember[];
  resources: ProjectResource[];
  equipment: Equipment[];
  budgetCategories: BudgetCategory[];
  onAddMember: (member: Partial<ProjectMember>) => void;
  onUpdateMember: (memberId: string, updates: Partial<ProjectMember>) => void;
  onRemoveMember: (memberId: string) => void;
  onAllocateResource: (resource: Partial<ProjectResource>) => void;
  onUpdateResource: (resourceId: string, updates: Partial<ProjectResource>) => void;
  onRemoveResource: (resourceId: string) => void;
  onUpdateBudget: (categoryId: string, updates: Partial<BudgetCategory>) => void;
}

const ResourceManager: React.FC<ResourceManagerProps> = ({
  projectId,
  projectBudget,
  members,
  resources,
  equipment,
  budgetCategories,
  onAddMember,
  onUpdateMember,
  onRemoveMember,
  onAllocateResource,
  onUpdateResource,
  onRemoveResource,
  onUpdateBudget
}) => {
  const [activeTab, setActiveTab] = useState<'team' | 'equipment' | 'budget' | 'overview'>('overview');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAllocateResourceModal, setShowAllocateResourceModal] = useState(false);

  // Calculate resource statistics
  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'active').length,
    totalBudget: projectBudget,
    spentBudget: budgetCategories.reduce((sum, cat) => sum + cat.spentAmount, 0),
    remainingBudget: projectBudget - budgetCategories.reduce((sum, cat) => sum + cat.spentAmount, 0),
    budgetUtilization: (budgetCategories.reduce((sum, cat) => sum + cat.spentAmount, 0) / projectBudget) * 100,
    totalLaborHours: members.reduce((sum, m) => sum + m.actualHours, 0),
    allocatedLaborHours: members.reduce((sum, m) => sum + m.allocatedHours, 0),
    laborCost: members.reduce((sum, m) => sum + (m.actualHours * m.hourlyRate), 0),
    equipmentCost: resources.filter(r => r.type === 'equipment').reduce((sum, r) => sum + r.cost, 0),
    materialCost: resources.filter(r => r.type === 'material').reduce((sum, r) => sum + r.cost, 0)
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getBudgetStatus = (allocated: number, spent: number) => {
    const percentage = (spent / allocated) * 100;
    if (percentage > 100) return { color: 'text-red-600', status: 'Over Budget' };
    if (percentage > 90) return { color: 'text-orange-600', status: 'Near Limit' };
    if (percentage > 75) return { color: 'text-yellow-600', status: 'On Track' };
    return { color: 'text-green-600', status: 'Under Budget' };
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Project Manager': return 'bg-purple-100 text-purple-800';
      case 'Designer': return 'bg-blue-100 text-blue-800';
      case 'Installer': return 'bg-green-100 text-green-800';
      case 'Supervisor': return 'bg-orange-100 text-orange-800';
      case 'Client': return 'bg-gray-100 text-gray-800';
      case 'Subcontractor': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resource Management</h2>
          <p className="text-gray-600 mt-1">
            Manage team members, equipment, and budget allocation for your project
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'team', label: 'Team Management', icon: Users },
            { id: 'equipment', label: 'Equipment & Materials', icon: Wrench },
            { id: 'budget', label: 'Budget Tracking', icon: DollarSign }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Team Members</p>
                  <p className="text-2xl font-bold">{stats.activeMembers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
              <div className="mt-4 flex items-center">
                <Activity className="h-4 w-4 mr-1" />
                <span className="text-sm">{stats.totalMembers} total</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Budget Used</p>
                  <p className="text-2xl font-bold">{Math.round(stats.budgetUtilization)}%</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
              <div className="mt-4 flex items-center">
                <Target className="h-4 w-4 mr-1" />
                <span className="text-sm">{formatCurrency(stats.spentBudget)} spent</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Labor Hours</p>
                  <p className="text-2xl font-bold">{stats.totalLaborHours}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-200" />
              </div>
              <div className="mt-4 flex items-center">
                <Award className="h-4 w-4 mr-1" />
                <span className="text-sm">of {stats.allocatedLaborHours} allocated</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Labor Cost</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.laborCost)}</p>
                </div>
                <Briefcase className="h-8 w-8 text-orange-200" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">Active rates</span>
              </div>
            </div>
          </div>

          {/* Resource Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Breakdown</h3>
              <div className="space-y-4">
                {budgetCategories.map((category) => {
                  const budgetStatus = getBudgetStatus(category.allocatedAmount, category.spentAmount);
                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                        <span className={`text-sm ${budgetStatus.color}`}>
                          {formatCurrency(category.spentAmount)} / {formatCurrency(category.allocatedAmount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            category.percentage > 100 ? 'bg-red-500' :
                            category.percentage > 90 ? 'bg-orange-500' :
                            category.percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(category.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{Math.round(category.percentage)}% used</span>
                        <span className={budgetStatus.color}>{budgetStatus.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Overview</h3>
              <div className="space-y-4">
                {members.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {member.user.firstName} {member.user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">
                        {member.actualHours}h / {member.allocatedHours}h
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(member.hourlyRate)}/hr
                      </p>
                    </div>
                  </div>
                ))}
                {members.length > 5 && (
                  <div className="text-center">
                    <button
                      onClick={() => setActiveTab('team')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View all {members.length} team members
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cost Breakdown Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.laborCost)}</div>
                <div className="text-sm text-gray-600">Labor Costs</div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((stats.laborCost / stats.spentBudget) * 100)}% of budget
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.equipmentCost)}</div>
                <div className="text-sm text-gray-600">Equipment Costs</div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((stats.equipmentCost / stats.spentBudget) * 100)}% of budget
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.materialCost)}</div>
                <div className="text-sm text-gray-600">Material Costs</div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((stats.materialCost / stats.spentBudget) * 100)}% of budget
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Management Tab */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Member</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {member.user.firstName} {member.user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{member.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(member.role)}`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.actualHours} / {member.allocatedHours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(member.hourlyRate)}/hr
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(member.actualHours * member.hourlyRate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.status === 'active' ? 'bg-green-100 text-green-800' :
                          member.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onUpdateMember(member.id, {})}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onRemoveMember(member.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Equipment & Materials Tab */}
      {activeTab === 'equipment' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Equipment & Materials</h3>
            <button
              onClick={() => setShowAllocateResourceModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Allocate Resource</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Equipment */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Equipment</h4>
              <div className="space-y-4">
                {resources.filter(r => r.type === 'equipment').map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{resource.name}</p>
                      <p className="text-xs text-gray-500">{resource.description}</p>
                      <p className="text-xs text-gray-500">Qty: {resource.quantity} {resource.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(resource.cost)}</p>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        resource.status === 'allocated' ? 'bg-yellow-100 text-yellow-800' :
                        resource.status === 'in-use' ? 'bg-blue-100 text-blue-800' :
                        resource.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {resource.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Materials</h4>
              <div className="space-y-4">
                {resources.filter(r => r.type === 'material').map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{resource.name}</p>
                      <p className="text-xs text-gray-500">{resource.description}</p>
                      <p className="text-xs text-gray-500">Qty: {resource.quantity} {resource.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(resource.cost)}</p>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        resource.status === 'allocated' ? 'bg-yellow-100 text-yellow-800' :
                        resource.status === 'in-use' ? 'bg-blue-100 text-blue-800' :
                        resource.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {resource.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Tracking Tab */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Budget Tracking</h3>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                <span>Add Expense</span>
              </button>
            </div>
          </div>

          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBudget)}</p>
                </div>
                <Target className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Spent</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.spentBudget)}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.remainingBudget)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </div>

          {/* Budget Categories */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">Budget Categories</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Allocated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remaining
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {budgetCategories.map((category) => {
                    const budgetStatus = getBudgetStatus(category.allocatedAmount, category.spentAmount);
                    return (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          <div className="text-sm text-gray-500">{category.items.length} items</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(category.allocatedAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(category.spentAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(category.remaining)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm ${budgetStatus.color}`}>
                            {budgetStatus.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full ${
                                  category.percentage > 100 ? 'bg-red-500' :
                                  category.percentage > 90 ? 'bg-orange-500' :
                                  category.percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(category.percentage, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{Math.round(category.percentage)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManager;