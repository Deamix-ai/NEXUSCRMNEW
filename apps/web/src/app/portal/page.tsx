'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  title: string;
  status: 'quote-pending' | 'quote-approved' | 'in-progress' | 'completed';
  startDate: string;
  estimatedCompletion: string;
  progress: number;
  description: string;
  totalCost: number;
  address: string;
  projectManager: {
    name: string;
    phone: string;
    email: string;
  };
  timeline: {
    phase: string;
    status: 'completed' | 'in-progress' | 'pending';
    startDate?: string;
    completionDate?: string;
  }[];
  photos: {
    id: string;
    url: string;
    caption: string;
    date: string;
    category: 'before' | 'progress' | 'after';
  }[];
  documents: {
    id: string;
    name: string;
    type: 'quote' | 'contract' | 'invoice' | 'warranty' | 'other';
    url: string;
    date: string;
  }[];
  messages: {
    id: string;
    from: string;
    message: string;
    timestamp: string;
    isFromCustomer: boolean;
  }[];
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  projects: Project[];
}

export default function CustomerPortalPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'photos' | 'documents' | 'messages'>('overview');
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock customer data
  useEffect(() => {
    // Simulate authentication check
    const token = localStorage.getItem('customerToken');
    if (!token) {
      // Would redirect to customer login
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    // Mock customer data
    const mockCustomer: CustomerData = {
      id: 'cust-001',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '07123 456 789',
      address: '123 Oak Street, Manchester, M1 2AB',
      joinDate: '2024-08-15',
      projects: [
        {
          id: 'proj-001',
          title: 'Master Bathroom Renovation',
          status: 'in-progress',
          startDate: '2024-09-01',
          estimatedCompletion: '2024-09-20',
          progress: 65,
          description: 'Complete renovation of master bathroom including new suite, tiling, and lighting.',
          totalCost: 8500,
          address: '123 Oak Street, Manchester',
          projectManager: {
            name: 'Mike Thompson',
            phone: '07987 654 321',
            email: 'mike@bowmanskb.co.uk'
          },
          timeline: [
            { phase: 'Design & Planning', status: 'completed', startDate: '2024-09-01', completionDate: '2024-09-03' },
            { phase: 'Demolition', status: 'completed', startDate: '2024-09-04', completionDate: '2024-09-05' },
            { phase: 'Plumbing & Electrical', status: 'completed', startDate: '2024-09-06', completionDate: '2024-09-10' },
            { phase: 'Tiling & Flooring', status: 'in-progress', startDate: '2024-09-11' },
            { phase: 'Fixture Installation', status: 'pending' },
            { phase: 'Final Finishing', status: 'pending' }
          ],
          photos: [
            { id: '1', url: '/api/placeholder/400/300', caption: 'Before renovation', date: '2024-09-01', category: 'before' },
            { id: '2', url: '/api/placeholder/400/300', caption: 'Demolition complete', date: '2024-09-05', category: 'progress' },
            { id: '3', url: '/api/placeholder/400/300', caption: 'New plumbing installed', date: '2024-09-10', category: 'progress' }
          ],
          documents: [
            { id: '1', name: 'Project Quote', type: 'quote', url: '#', date: '2024-08-20' },
            { id: '2', name: 'Contract Agreement', type: 'contract', url: '#', date: '2024-08-25' },
            { id: '3', name: 'Progress Invoice 1', type: 'invoice', url: '#', date: '2024-09-05' }
          ],
          messages: [
            { id: '1', from: 'Mike Thompson', message: 'Project started today! Demolition going well.', timestamp: '2024-09-04 09:30', isFromCustomer: false },
            { id: '2', from: 'You', message: 'Thanks for the update! Looking forward to seeing progress.', timestamp: '2024-09-04 14:20', isFromCustomer: true },
            { id: '3', from: 'Mike Thompson', message: 'Plumbing work completed ahead of schedule. Starting tiling tomorrow.', timestamp: '2024-09-10 16:45', isFromCustomer: false }
          ]
        },
        {
          id: 'proj-002',
          title: 'Kitchen Backsplash',
          status: 'completed',
          startDate: '2024-07-15',
          estimatedCompletion: '2024-07-20',
          progress: 100,
          description: 'Installation of new ceramic backsplash in kitchen.',
          totalCost: 1200,
          address: '123 Oak Street, Manchester',
          projectManager: {
            name: 'Sarah Wilson',
            phone: '07789 123 456',
            email: 'sarah@bowmanskb.co.uk'
          },
          timeline: [
            { phase: 'Design & Planning', status: 'completed', startDate: '2024-07-15', completionDate: '2024-07-15' },
            { phase: 'Installation', status: 'completed', startDate: '2024-07-16', completionDate: '2024-07-19' },
            { phase: 'Final Inspection', status: 'completed', startDate: '2024-07-20', completionDate: '2024-07-20' }
          ],
          photos: [
            { id: '4', url: '/api/placeholder/400/300', caption: 'Completed backsplash', date: '2024-07-20', category: 'after' }
          ],
          documents: [
            { id: '4', name: 'Completion Certificate', type: 'warranty', url: '#', date: '2024-07-20' },
            { id: '5', name: 'Final Invoice', type: 'invoice', url: '#', date: '2024-07-20' }
          ],
          messages: [
            { id: '4', from: 'Sarah Wilson', message: 'Backsplash installation completed! Looks fantastic.', timestamp: '2024-07-20 15:30', isFromCustomer: false }
          ]
        }
      ]
    };

    setCustomer(mockCustomer);
    setActiveProject(mockCustomer.projects[0]?.id || null);
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !customer || !activeProject) return;

    const project = customer.projects.find(p => p.id === activeProject);
    if (!project) return;

    const message = {
      id: Date.now().toString(),
      from: 'You',
      message: newMessage,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      isFromCustomer: true
    };

    project.messages.push(message);
    setCustomer({ ...customer });
    setNewMessage('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Customer Portal Login</h1>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button 
              type="button" 
              onClick={() => setIsAuthenticated(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!customer) return null;

  const currentProject = customer.projects.find(p => p.id === activeProject);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'quote-pending': return 'bg-yellow-100 text-yellow-800';
      case 'quote-approved': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Customer Portal</h1>
              <div className="text-sm text-gray-500">
                Welcome back, {customer.name}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
              <button 
                onClick={() => setIsAuthenticated(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Your Projects</h2>
              </div>
              <div className="divide-y">
                {customer.projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setActiveProject(project.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 ${activeProject === project.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''}`}
                  >
                    <div className="font-medium text-gray-900 mb-1">{project.title}</div>
                    <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                      {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">£{project.totalCost.toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm mt-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    0161 123 4567
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    info@bowmanskb.co.uk
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentProject && (
              <>
                {/* Project Header */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">{currentProject.title}</h1>
                        <p className="text-gray-600 mt-1">{currentProject.address}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentProject.status)}`}>
                        {currentProject.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-sm text-gray-500">Progress</div>
                        <div className="flex items-center mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${currentProject.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{currentProject.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Start Date</div>
                        <div className="font-medium">{new Date(currentProject.startDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Est. Completion</div>
                        <div className="font-medium">{new Date(currentProject.estimatedCompletion).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-t-lg shadow-sm">
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                      {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'timeline', label: 'Timeline' },
                        { id: 'photos', label: 'Photos' },
                        { id: 'documents', label: 'Documents' },
                        { id: 'messages', label: 'Messages' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-b-lg shadow-sm p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Project Description</h3>
                        <p className="text-gray-600">{currentProject.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Project Manager</h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="font-medium">{currentProject.projectManager.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{currentProject.projectManager.phone}</div>
                            <div className="text-sm text-gray-600">{currentProject.projectManager.email}</div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Project Value</h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-2xl font-bold text-green-600">£{currentProject.totalCost.toLocaleString()}</div>
                            <div className="text-sm text-gray-600 mt-1">Total project cost</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'timeline' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Project Timeline</h3>
                      <div className="space-y-4">
                        {currentProject.timeline.map((phase, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <div className={`w-4 h-4 rounded-full ${
                              phase.status === 'completed' ? 'bg-green-500' :
                              phase.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                            }`}></div>
                            <div className="flex-1">
                              <div className="font-medium">{phase.phase}</div>
                              <div className="text-sm text-gray-600">
                                {phase.startDate && `Started: ${new Date(phase.startDate).toLocaleDateString()}`}
                                {phase.completionDate && ` • Completed: ${new Date(phase.completionDate).toLocaleDateString()}`}
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                              phase.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {phase.status.replace('-', ' ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'photos' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Project Photos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentProject.photos.map((photo) => (
                          <div key={photo.id} className="bg-gray-50 rounded-lg overflow-hidden">
                            <div className="aspect-w-4 aspect-h-3 bg-gray-200 flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="p-3">
                              <div className="font-medium text-sm">{photo.caption}</div>
                              <div className="text-xs text-gray-500">{new Date(photo.date).toLocaleDateString()}</div>
                              <div className={`inline-flex px-2 py-1 text-xs rounded mt-1 ${
                                photo.category === 'before' ? 'bg-red-100 text-red-600' :
                                photo.category === 'progress' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                              }`}>
                                {photo.category}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'documents' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Project Documents</h3>
                      <div className="space-y-3">
                        {currentProject.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <div>
                                <div className="font-medium">{doc.name}</div>
                                <div className="text-sm text-gray-600">{doc.type} • {new Date(doc.date).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-800 font-medium">Download</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'messages' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Messages</h3>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {currentProject.messages.map((message) => (
                          <div key={message.id} className={`flex ${message.isFromCustomer ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.isFromCustomer ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                            }`}>
                              <div className="font-medium text-sm mb-1">{message.from}</div>
                              <div>{message.message}</div>
                              <div className={`text-xs mt-1 ${message.isFromCustomer ? 'text-blue-100' : 'text-gray-500'}`}>
                                {message.timestamp}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <button
                            onClick={handleSendMessage}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
