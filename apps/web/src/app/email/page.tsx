'use client';

import React, { useState, useEffect } from 'react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: 'booking_confirmation' | 'quote_sent' | 'project_update' | 'completion_notification' | 'follow_up';
  content: string;
  variables: string[];
  isActive: boolean;
}

interface EmailCampaign {
  id: string;
  name: string;
  type: 'automated' | 'manual';
  templateId: string;
  recipients: string;
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  sentCount: number;
  openRate: number;
  clickRate: number;
  scheduledDate?: string;
  createdAt: string;
}

const EmailAutomationPage = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'campaigns' | 'automation' | 'analytics'>('templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Mock data
    setTemplates([
      {
        id: '1',
        name: 'Booking Confirmation',
        subject: 'Your consultation is confirmed - {{customerName}}',
        type: 'booking_confirmation',
        content: `Hi {{customerName}},

Great news! Your consultation has been confirmed for {{date}} at {{time}}.

Consultation Details:
• Service: {{serviceType}}
• Address: {{address}}
• Our Expert: {{technicianName}}
• Contact: {{technicianPhone}}

What to expect:
• Professional assessment of your requirements
• Detailed quote provided on the spot
• No obligation, completely free service
• Duration: approximately 1 hour

Need to reschedule? Simply reply to this email or call us on 0161 123 4567.

We look forward to meeting you!

Best regards,
The Bowmans Team
www.bowmanskb.co.uk`,
        variables: ['customerName', 'date', 'time', 'serviceType', 'address', 'technicianName', 'technicianPhone'],
        isActive: true
      },
      {
        id: '2',
        name: 'Quote Sent',
        subject: 'Your quote is ready - {{projectTitle}}',
        type: 'quote_sent',
        content: `Dear {{customerName}},

Thank you for choosing Bowmans Kitchens & Bathrooms for your {{projectTitle}} project.

Your detailed quote is attached to this email. Here's a summary:

Project: {{projectTitle}}
Total Cost: £{{totalCost}}
Valid Until: {{validUntil}}

Quote Highlights:
• All materials and labour included
• 12-month labour warranty
• Professional project management
• Experienced certified installers

Next Steps:
1. Review the detailed quote
2. Contact us with any questions
3. Accept the quote to secure your booking

We're confident you'll love the quality of our work. Check out our recent projects on our website.

Questions? Reply to this email or call {{projectManagerPhone}}.

Best regards,
{{projectManagerName}}
Bowmans Kitchens & Bathrooms`,
        variables: ['customerName', 'projectTitle', 'totalCost', 'validUntil', 'projectManagerName', 'projectManagerPhone'],
        isActive: true
      },
      {
        id: '3',
        name: 'Project Update',
        subject: 'Progress update - {{projectTitle}}',
        type: 'project_update',
        content: `Hi {{customerName}},

Quick update on your {{projectTitle}} project:

Current Status: {{currentPhase}}
Progress: {{progressPercentage}}% complete
Next Phase: {{nextPhase}}
Expected Completion: {{expectedCompletion}}

Recent Work Completed:
{{recentWork}}

Photos of progress are available in your customer portal:
{{portalLink}}

Your project manager {{projectManagerName}} will be in touch if any questions arise.

Thanks for your patience!

The Bowmans Team`,
        variables: ['customerName', 'projectTitle', 'currentPhase', 'progressPercentage', 'nextPhase', 'expectedCompletion', 'recentWork', 'portalLink', 'projectManagerName'],
        isActive: true
      }
    ]);

    setCampaigns([
      {
        id: '1',
        name: 'Welcome New Customers',
        type: 'automated',
        templateId: '1',
        recipients: 'New bookings',
        status: 'sent',
        sentCount: 45,
        openRate: 78,
        clickRate: 23,
        createdAt: '2025-09-01T09:00:00Z'
      },
      {
        id: '2',
        name: 'Monthly Newsletter',
        type: 'manual',
        templateId: '2',
        recipients: 'All customers',
        status: 'scheduled',
        sentCount: 0,
        openRate: 0,
        clickRate: 0,
        scheduledDate: '2025-09-15T10:00:00Z',
        createdAt: '2025-09-08T14:30:00Z'
      }
    ]);
  }, []);

  const handleSaveTemplate = (template: EmailTemplate) => {
    if (isEditing && selectedTemplate) {
      setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    } else {
      setTemplates(prev => [...prev, { ...template, id: Date.now().toString() }]);
    }
    setSelectedTemplate(null);
    setIsEditing(false);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Email Automation</h1>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                New Template
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                New Campaign
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'templates', label: 'Email Templates', count: templates.length },
              { id: 'campaigns', label: 'Campaigns', count: campaigns.length },
              { id: 'automation', label: 'Automation Rules', count: 5 },
              { id: 'analytics', label: 'Analytics', count: null }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{template.type.replace('_', ' ')}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          template.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-700">Subject:</div>
                        <div className="text-sm text-gray-600 truncate">{template.subject}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700">Variables:</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.variables.slice(0, 3).map((variable) => (
                            <span key={variable} className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {variable}
                            </span>
                          ))}
                          {template.variables.length > 3 && (
                            <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{template.variables.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-6">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add New Template Card */}
              <div className="bg-white rounded-lg shadow-sm border border-dashed border-gray-300 hover:border-gray-400">
                <div className="p-6 text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Template</h3>
                  <p className="text-sm text-gray-600 mb-4">Build custom email templates for your workflows</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    New Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Email Campaigns</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Campaign</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Recipients</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Performance</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          campaign.type === 'automated' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {campaign.recipients}
                        {campaign.sentCount > 0 && (
                          <div className="text-xs">({campaign.sentCount} sent)</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {campaign.sentCount > 0 ? (
                          <div>
                            <div>Open: {campaign.openRate}%</div>
                            <div>Click: {campaign.clickRate}%</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                          <button className="text-gray-600 hover:text-gray-800 text-sm">Edit</button>
                          <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Automation Tab */}
        {activeTab === 'automation' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Automation Rules</h2>
              
              <div className="space-y-4">
                {[
                  {
                    name: 'Booking Confirmation',
                    trigger: 'When new booking is created',
                    action: 'Send booking confirmation email',
                    status: 'Active',
                    lastTriggered: '2 hours ago'
                  },
                  {
                    name: 'Quote Follow-up',
                    trigger: '3 days after quote is sent',
                    action: 'Send follow-up email if no response',
                    status: 'Active',
                    lastTriggered: '1 day ago'
                  },
                  {
                    name: 'Project Completion',
                    trigger: 'When project status = completed',
                    action: 'Send satisfaction survey',
                    status: 'Active',
                    lastTriggered: '5 days ago'
                  },
                  {
                    name: 'Birthday Campaign',
                    trigger: 'Customer birthday',
                    action: 'Send birthday discount offer',
                    status: 'Paused',
                    lastTriggered: '2 weeks ago'
                  }
                ].map((rule, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{rule.name}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Trigger:</span> {rule.trigger}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Action:</span> {rule.action}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Last triggered: {rule.lastTriggered}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 ml-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          rule.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {rule.status}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">1,248</div>
                    <div className="text-sm text-gray-600">Emails Sent</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">72.4%</div>
                    <div className="text-sm text-gray-600">Open Rate</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">28.1%</div>
                    <div className="text-sm text-gray-600">Click Rate</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">15.6%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Recent Email Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { time: '2 minutes ago', action: 'john.smith@email.com opened "Booking Confirmation"', type: 'open' },
                    { time: '15 minutes ago', action: 'emma.davis@email.com clicked "View Quote" in quote email', type: 'click' },
                    { time: '1 hour ago', action: 'Automated email "Quote Follow-up" sent to 12 recipients', type: 'sent' },
                    { time: '3 hours ago', action: 'sarah.wilson@email.com replied to project update email', type: 'reply' },
                    { time: '5 hours ago', action: 'michael.brown@email.com bounced - invalid email address', type: 'bounce' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'open' ? 'bg-green-500' :
                        activity.type === 'click' ? 'bg-blue-500' :
                        activity.type === 'sent' ? 'bg-purple-500' :
                        activity.type === 'reply' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">{activity.action}</div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
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
  );
};

export default EmailAutomationPage;
