'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import ProjectDashboard from '@/components/projects/ProjectDashboard';
import TaskManager from '@/components/projects/TaskManager';
import ResourceManager from '@/components/projects/ResourceManager';
import {
  FolderOpen,
  BarChart3,
  CheckSquare,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign
} from 'lucide-react';

// Sample data for the projects system
const sampleProjects = [
  {
    id: 'proj-1',
    name: 'Modern Bathroom Renovation',
    description: 'Complete luxury bathroom renovation including heated floors, rainfall shower, and custom vanity',
    status: 'in-progress' as const,
    priority: 'high' as const,
    startDate: '2024-09-01',
    endDate: '2024-10-15',
    actualStartDate: '2024-09-01',
    budget: 25000,
    actualCost: 18500,
    progress: 74,
    quoteId: 'quote-1',
    accountId: 'acc-1',
    contactId: 'cont-1',
    managerId: 'user-1',
    category: 'bathroom',
    tags: ['renovation', 'luxury', 'residential'],
    customFields: {
      permits: 'Required',
      accessibility: 'Standard'
    },
    members: [
      {
        id: 'mem-1',
        userId: 'user-1',
        projectId: 'proj-1',
        role: 'Project Manager' as const,
        hourlyRate: 45,
        allocatedHours: 80,
        actualHours: 58,
        startDate: '2024-09-01',
        permissions: ['manage_tasks', 'manage_budget', 'manage_team'],
        status: 'active' as const,
        addedAt: '2024-09-01T09:00:00Z',
        user: {
          id: 'user-1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@company.com',
          phone: '01234 567890',
          department: 'Project Management',
          skills: ['Project Management', 'Quality Control', 'Client Relations']
        }
      },
      {
        id: 'mem-2',
        userId: 'user-2',
        projectId: 'proj-1',
        role: 'Installer' as const,
        hourlyRate: 35,
        allocatedHours: 120,
        actualHours: 89,
        startDate: '2024-09-05',
        permissions: ['view_tasks', 'update_progress'],
        status: 'active' as const,
        addedAt: '2024-09-01T09:00:00Z',
        user: {
          id: 'user-2',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@company.com',
          phone: '01234 567891',
          department: 'Installation',
          skills: ['Plumbing', 'Tiling', 'Electrical']
        }
      }
    ],
    tasks: [
      {
        id: 'task-1',
        projectId: 'proj-1',
        title: 'Remove existing bathroom fixtures',
        description: 'Safely remove and dispose of old toilet, bathtub, vanity, and tiles',
        status: 'completed' as const,
        priority: 'high' as const,
        assigneeId: 'user-2',
        startDate: '2024-09-01',
        dueDate: '2024-09-03',
        completedAt: '2024-09-03T16:00:00Z',
        estimatedHours: 16,
        actualHours: 14,
        dependencies: [],
        tags: ['demolition', 'disposal'],
        attachments: [],
        comments: [
          {
            id: 'comment-1',
            content: 'Demolition completed ahead of schedule. Found some water damage behind tiles that needs attention.',
            authorId: 'user-2',
            createdAt: '2024-09-03T16:30:00Z',
            author: {
              firstName: 'Mike',
              lastName: 'Johnson'
            }
          }
        ],
        createdAt: '2024-08-28T10:00:00Z',
        updatedAt: '2024-09-03T16:30:00Z',
        assignee: {
          id: 'user-2',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@company.com'
        }
      },
      {
        id: 'task-2',
        projectId: 'proj-1',
        title: 'Install new plumbing and electrical',
        description: 'Run new water lines and electrical for heated floors and modern fixtures',
        status: 'in-progress' as const,
        priority: 'high' as const,
        assigneeId: 'user-2',
        startDate: '2024-09-04',
        dueDate: '2024-09-10',
        estimatedHours: 24,
        actualHours: 18,
        dependencies: ['task-1'],
        tags: ['plumbing', 'electrical'],
        attachments: [],
        comments: [],
        createdAt: '2024-08-28T10:00:00Z',
        updatedAt: '2024-09-08T14:00:00Z',
        assignee: {
          id: 'user-2',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@company.com'
        }
      }
    ],
    milestones: [
      {
        id: 'milestone-1',
        projectId: 'proj-1',
        title: 'Demolition Complete',
        description: 'All existing fixtures and materials removed',
        dueDate: '2024-09-03',
        status: 'completed' as const,
        completedAt: '2024-09-03T16:00:00Z',
        tasks: ['task-1'],
        createdAt: '2024-08-28T10:00:00Z'
      },
      {
        id: 'milestone-2',
        projectId: 'proj-1',
        title: 'Rough-in Complete',
        description: 'All plumbing and electrical rough-in work finished',
        dueDate: '2024-09-10',
        status: 'pending' as const,
        tasks: ['task-2'],
        createdAt: '2024-08-28T10:00:00Z'
      }
    ],
    createdAt: '2024-08-28T10:00:00Z',
    updatedAt: '2024-09-08T14:00:00Z',
    account: {
      id: 'acc-1',
      name: 'Johnson Construction Ltd'
    },
    contact: {
      id: 'cont-1',
      firstName: 'James',
      lastName: 'Johnson',
      email: 'james@johnsonconstruction.com'
    },
    manager: {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Smith'
    }
  }
];

const sampleUsers = [
  {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    avatar: undefined,
    role: 'Project Manager'
  },
  {
    id: 'user-2',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@company.com',
    avatar: undefined,
    role: 'Senior Installer'
  },
  {
    id: 'user-3',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@company.com',
    avatar: undefined,
    role: 'Designer'
  }
];

const sampleEquipment = [
  {
    id: 'eq-1',
    name: 'Tile Cutting Station',
    type: 'Power Tools',
    description: 'Professional wet tile cutting equipment',
    dailyCost: 45,
    status: 'available' as const,
    location: 'Warehouse A',
    specifications: {
      'Blade Size': '10 inch',
      'Max Cut': '24 inch',
      'Water System': 'Integrated'
    },
    lastMaintenance: '2024-08-15',
    nextMaintenance: '2024-11-15'
  }
];

const sampleResources = [
  {
    id: 'res-1',
    projectId: 'proj-1',
    type: 'equipment' as const,
    name: 'Tile Cutting Station',
    description: 'Professional wet tile cutting equipment',
    cost: 315,
    quantity: 1,
    unit: 'week',
    allocatedDate: '2024-09-10',
    startDate: '2024-09-10',
    endDate: '2024-09-17',
    status: 'allocated' as const,
    notes: 'Reserved for tile installation phase',
    createdAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-09-01T10:00:00Z'
  },
  {
    id: 'res-2',
    projectId: 'proj-1',
    type: 'material' as const,
    name: 'Premium Porcelain Tiles',
    description: 'Large format porcelain tiles for walls and floors',
    cost: 2850,
    quantity: 35,
    unit: 'sqm',
    allocatedDate: '2024-09-08',
    status: 'in-use' as const,
    notes: 'Delivered and ready for installation',
    createdAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-09-08T09:00:00Z'
  }
];

const sampleBudgetCategories = [
  {
    id: 'cat-1',
    name: 'Labour',
    allocatedAmount: 8000,
    spentAmount: 5850,
    remaining: 2150,
    percentage: 73.1,
    items: [
      {
        id: 'item-1',
        categoryId: 'cat-1',
        description: 'Project Management (58h @ £45/h)',
        budgetedAmount: 3600,
        actualAmount: 2610,
        status: 'committed' as const,
        date: '2024-09-08',
        notes: 'Ongoing project management'
      },
      {
        id: 'item-2',
        categoryId: 'cat-1',
        description: 'Installation Work (89h @ £35/h)',
        budgetedAmount: 4200,
        actualAmount: 3115,
        status: 'committed' as const,
        date: '2024-09-08',
        notes: 'Installation work to date'
      }
    ]
  },
  {
    id: 'cat-2',
    name: 'Materials',
    allocatedAmount: 12000,
    spentAmount: 8950,
    remaining: 3050,
    percentage: 74.6,
    items: [
      {
        id: 'item-3',
        categoryId: 'cat-2',
        description: 'Premium Porcelain Tiles',
        budgetedAmount: 3000,
        actualAmount: 2850,
        status: 'paid' as const,
        date: '2024-09-05',
        vendor: 'Premium Tiles Ltd'
      },
      {
        id: 'item-4',
        categoryId: 'cat-2',
        description: 'Luxury Bathroom Suite',
        budgetedAmount: 4500,
        actualAmount: 4200,
        status: 'paid' as const,
        date: '2024-09-03',
        vendor: 'Bathroom Specialists'
      }
    ]
  },
  {
    id: 'cat-3',
    name: 'Equipment',
    allocatedAmount: 3000,
    spentAmount: 1200,
    remaining: 1800,
    percentage: 40.0,
    items: [
      {
        id: 'item-5',
        categoryId: 'cat-3',
        description: 'Tool Rental',
        budgetedAmount: 800,
        actualAmount: 685,
        status: 'paid' as const,
        date: '2024-09-01',
        vendor: 'Tool Hire Co'
      }
    ]
  }
];

export default function ProjectsPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'tasks' | 'resources'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<string | null>(sampleProjects[0]?.id || null);

  const currentProject = sampleProjects.find(p => p.id === selectedProject);

  // Sample handlers
  const handleCreateProject = (project: any) => {
    console.log('Creating project:', project);
  };

  const handleUpdateProject = (projectId: string, updates: any) => {
    console.log('Updating project:', { projectId, updates });
  };

  const handleDeleteProject = (projectId: string) => {
    console.log('Deleting project:', projectId);
  };

  const handleViewProject = (projectId: string) => {
    setSelectedProject(projectId);
    setActiveView('tasks');
  };

  const handleEditProject = (projectId: string) => {
    console.log('Editing project:', projectId);
  };

  const handleCreateTask = (task: any) => {
    console.log('Creating task:', task);
  };

  const handleUpdateTask = (taskId: string, updates: any) => {
    console.log('Updating task:', { taskId, updates });
  };

  const handleDeleteTask = (taskId: string) => {
    console.log('Deleting task:', taskId);
  };

  const handleAddComment = (taskId: string, comment: string) => {
    console.log('Adding comment:', { taskId, comment });
  };

  const handleAddAttachment = (taskId: string, file: File) => {
    console.log('Adding attachment:', { taskId, fileName: file.name });
  };

  const handleAddMember = (member: any) => {
    console.log('Adding member:', member);
  };

  const handleUpdateMember = (memberId: string, updates: any) => {
    console.log('Updating member:', { memberId, updates });
  };

  const handleRemoveMember = (memberId: string) => {
    console.log('Removing member:', memberId);
  };

  const handleAllocateResource = (resource: any) => {
    console.log('Allocating resource:', resource);
  };

  const handleUpdateResource = (resourceId: string, updates: any) => {
    console.log('Updating resource:', { resourceId, updates });
  };

  const handleRemoveResource = (resourceId: string) => {
    console.log('Removing resource:', resourceId);
  };

  const handleUpdateBudget = (categoryId: string, updates: any) => {
    console.log('Updating budget:', { categoryId, updates });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-600 rounded-lg">
                <FolderOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Project Management
                </h1>
                <p className="text-gray-600">
                  Complete project lifecycle management from planning to completion
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Active Projects</p>
                    <p className="text-2xl font-bold">{sampleProjects.filter(p => p.status === 'in-progress').length}</p>
                  </div>
                  <FolderOpen className="h-8 w-8 text-green-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">2 starting this week</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Tasks</p>
                    <p className="text-2xl font-bold">
                      {sampleProjects.reduce((sum, p) => sum + p.tasks.length, 0)}
                    </p>
                  </div>
                  <CheckSquare className="h-8 w-8 text-blue-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  <span className="text-sm">68% completion rate</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Team Members</p>
                    <p className="text-2xl font-bold">
                      {sampleProjects.reduce((sum, p) => sum + p.members.length, 0)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">95% utilization</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Project Value</p>
                    <p className="text-2xl font-bold">
                      £{(sampleProjects.reduce((sum, p) => sum + p.budget, 0) / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">On budget</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', label: 'Project Dashboard', icon: BarChart3 },
                { id: 'tasks', label: 'Task Management', icon: CheckSquare },
                { id: 'resources', label: 'Resource Management', icon: Users }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeView === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          {activeView === 'dashboard' && (
            <ProjectDashboard
              projects={sampleProjects}
              onCreateProject={handleCreateProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onViewProject={handleViewProject}
              onEditProject={handleEditProject}
            />
          )}

          {activeView === 'tasks' && currentProject && (
            <div className="space-y-6">
              {/* Project Context */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{currentProject.name}</h3>
                    <p className="text-gray-600">{currentProject.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Progress</div>
                    <div className="text-2xl font-bold text-green-600">{currentProject.progress}%</div>
                  </div>
                </div>
              </div>

              <TaskManager
                projectId={currentProject.id}
                tasks={currentProject.tasks}
                users={sampleUsers}
                onCreateTask={handleCreateTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onAddComment={handleAddComment}
                onAddAttachment={handleAddAttachment}
              />
            </div>
          )}

          {activeView === 'resources' && currentProject && (
            <div className="space-y-6">
              {/* Project Context */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{currentProject.name}</h3>
                    <p className="text-gray-600">Resource allocation and budget tracking</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Budget</div>
                    <div className="text-2xl font-bold text-green-600">
                      £{((currentProject.budget - currentProject.actualCost) / 1000).toFixed(1)}K remaining
                    </div>
                  </div>
                </div>
              </div>

              <ResourceManager
                projectId={currentProject.id}
                projectBudget={currentProject.budget}
                members={currentProject.members}
                resources={sampleResources.filter(r => r.projectId === currentProject.id)}
                equipment={sampleEquipment}
                budgetCategories={sampleBudgetCategories}
                onAddMember={handleAddMember}
                onUpdateMember={handleUpdateMember}
                onRemoveMember={handleRemoveMember}
                onAllocateResource={handleAllocateResource}
                onUpdateResource={handleUpdateResource}
                onRemoveResource={handleRemoveResource}
                onUpdateBudget={handleUpdateBudget}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
