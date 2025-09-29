'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { projectsApi } from '@/lib/api-client';



interface Project {
  id: string;
  title: string;
  description: string;
  value: string;
  probability: number;
  stage: {
    id: string;
    name: string;
    description: string;
    probability: number;
  };
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
  };
  owner: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

function formatCurrency(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(numValue);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      try {
        setLoading(true);
        const data = await projectsApi.getById(projectId);
        setProject(data as Project);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600">{error || 'The requested project could not be found.'}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-lg text-gray-600 mt-2">{project.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(project.value)}
                </div>
                <div className="text-sm text-gray-500">Project Value</div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center space-x-6">
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {project.stage.name}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Probability: {project.probability}%
              </div>
              <div className="text-sm text-gray-500">
                Created: {formatDate(project.createdAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Details */}
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-6 py-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900">{project.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Value</label>
                      <p className="mt-1 text-sm text-gray-900">{formatCurrency(project.value)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Probability</label>
                      <p className="mt-1 text-sm text-gray-900">{project.probability}%</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stage</label>
                    <p className="mt-1 text-sm text-gray-900">{project.stage.name}</p>
                    <p className="text-xs text-gray-500">{project.stage.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {project.client.firstName} {project.client.lastName}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{project.client.email}</p>
                    </div>
                    {project.client.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-sm text-gray-900">{project.client.phone}</p>
                      </div>
                    )}
                  </div>
                  {project.client.address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="mt-1 text-sm text-gray-900">{project.client.address}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                    Edit Project
                  </button>
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                    Contact Client
                  </button>
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                    Create Invoice
                  </button>
                  <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    View Timeline
                  </button>
                </div>
              </div>
            </div>

            {/* Project Owner */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Project Owner</h3>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600">
                      {project.owner.firstName[0]}{project.owner.lastName[0]}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {project.owner.firstName} {project.owner.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{project.owner.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Progress */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Stage Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Stage</span>
                    <span className="font-medium">{project.stage.name}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${project.stage.probability}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0%</span>
                    <span>{project.stage.probability}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
