import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Send, 
  Reply, 
  Forward, 
  Archive, 
  Star, 
  Paperclip, 
  Calendar,
  Clock,
  User,
  Building,
  Filter,
  Search,
  Plus,
  MoreVertical,
  Eye,
  EyeOff,
  Download,
  Trash2,
  Flag,
  Tag,
  ChevronDown,
  X
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: 'enquiry_response' | 'follow_up' | 'proposal' | 'project_update' | 'general';
  variables: string[]; // e.g., ['{{firstName}}', '{{companyName}}', '{{projectTitle}}']
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EmailThread {
  id: string;
  subject: string;
  participants: {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'internal' | 'supplier';
  }[];
  relatedTo: {
    type: 'enquiry' | 'lead' | 'project' | 'account';
    id: string;
    title: string;
  };
  status: 'unread' | 'read' | 'replied' | 'flagged' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  createdAt: string;
  lastActivity: string;
  messageCount: number;
  hasAttachments: boolean;
}

interface EmailMessage {
  id: string;
  threadId: string;
  from: {
    id: string;
    name: string;
    email: string;
  };
  to: {
    id: string;
    name: string;
    email: string;
  }[];
  cc?: {
    id: string;
    name: string;
    email: string;
  }[];
  bcc?: {
    id: string;
    name: string;
    email: string;
  }[];
  subject: string;
  content: string;
  htmlContent?: string;
  attachments: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
  sentAt: string;
  isRead: boolean;
  isInternal: boolean;
  metadata?: {
    opened?: boolean;
    openedAt?: string;
    clicked?: boolean;
    clickedAt?: string;
    bounced?: boolean;
    delivered?: boolean;
  };
}

interface EmailCenterProps {
  threads: EmailThread[];
  messages: EmailMessage[];
  templates: EmailTemplate[];
  onSendEmail: (email: Partial<EmailMessage>) => void;
  onReplyToEmail: (messageId: string, reply: Partial<EmailMessage>) => void;
  onForwardEmail: (messageId: string, forward: Partial<EmailMessage>) => void;
  onUpdateThread: (threadId: string, updates: Partial<EmailThread>) => void;
  onCreateTemplate: (template: Partial<EmailTemplate>) => void;
  onUpdateTemplate: (templateId: string, updates: Partial<EmailTemplate>) => void;
  readonly?: boolean;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'border-red-500 bg-red-50';
    case 'high': return 'border-orange-500 bg-orange-50';
    case 'medium': return 'border-yellow-500 bg-yellow-50';
    case 'low': return 'border-gray-500 bg-gray-50';
    default: return 'border-gray-300 bg-white';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'unread': return 'text-blue-600 bg-blue-50';
    case 'read': return 'text-gray-600 bg-gray-50';
    case 'replied': return 'text-green-600 bg-green-50';
    case 'flagged': return 'text-red-600 bg-red-50';
    case 'archived': return 'text-gray-400 bg-gray-100';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export function EmailCenter({ 
  threads, 
  messages, 
  templates, 
  onSendEmail, 
  onReplyToEmail, 
  onForwardEmail, 
  onUpdateThread, 
  onCreateTemplate, 
  onUpdateTemplate, 
  readonly = false 
}: EmailCenterProps) {
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'inbox' | 'sent' | 'drafts' | 'archived'>('inbox');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-GB', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }
  };

  const filteredThreads = threads.filter(thread => {
    const matchesStatus = !filterStatus || thread.status === filterStatus;
    const matchesPriority = !filterPriority || thread.priority === filterPriority;
    const matchesSearch = !searchQuery || 
      thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const threadMessages = selectedThread 
    ? messages.filter(m => m.threadId === selectedThread.id).sort((a, b) => 
        new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      )
    : [];

  const ComposeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Compose Email</h3>
            <button 
              onClick={() => setShowCompose(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Email Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="recipient@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select template...</option>
                  {templates.filter(t => t.isActive).map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CC</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="cc@example.com (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email subject"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your message..."
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                >
                  <Paperclip className="h-4 w-4" />
                  <span className="text-sm">Attach Files</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    // Handle file upload
                    console.log('Files selected:', e.target.files);
                  }}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowCompose(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Handle send email
                  console.log('Send email');
                  setShowCompose(false);
                }}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TemplatesModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Email Templates</h3>
            <div className="flex space-x-2">
              <Button onClick={() => console.log('Create template')}>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
              <button 
                onClick={() => setShowTemplates(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">Subject:</div>
                  <div className="text-sm font-medium text-gray-900">{template.subject}</div>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">Category:</div>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                    {template.category.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">Preview:</div>
                  <div className="text-sm text-gray-700 line-clamp-3">
                    {template.content.substring(0, 100)}...
                  </div>
                </div>
                
                {template.variables.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-1">Variables:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 3).map(variable => (
                        <span key={variable} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {variable}
                        </span>
                      ))}
                      {template.variables.length > 3 && (
                        <span className="text-xs text-gray-400">+{template.variables.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded ${
                    template.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                  
                  <div className="flex space-x-1">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                    <button className="text-green-600 hover:text-green-800 text-sm">Use</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-2">
            <Button onClick={() => setShowCompose(true)} className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Compose
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <nav className="p-2">
            <div className="space-y-1">
              {[
                { id: 'inbox', label: 'Inbox', icon: Mail, count: threads.filter(t => t.status === 'unread').length },
                { id: 'sent', label: 'Sent', icon: Send, count: 0 },
                { id: 'drafts', label: 'Drafts', icon: Clock, count: 0 },
                { id: 'archived', label: 'Archived', icon: Archive, count: threads.filter(t => t.status === 'archived').length }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setViewMode(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
                    viewMode === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowTemplates(true)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Tag className="h-4 w-4" />
                <span>Templates</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Thread List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Filter className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="flagged">Flagged</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredThreads.map(thread => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedThread?.id === thread.id ? 'bg-blue-50 border-blue-200' : ''
              } ${thread.status === 'unread' ? 'bg-blue-25' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`font-medium text-sm truncate ${
                      thread.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {thread.participants.find(p => p.role === 'customer')?.name || 'Unknown'}
                    </div>
                    {thread.priority === 'urgent' && (
                      <Flag className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                  
                  <div className={`text-sm truncate ${
                    thread.status === 'unread' ? 'text-gray-900 font-medium' : 'text-gray-600'
                  }`}>
                    {thread.subject}
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-xs text-gray-500">{formatDate(thread.lastActivity)}</span>
                  {thread.hasAttachments && (
                    <Paperclip className="h-3 w-3 text-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(thread.status)}`}>
                    {thread.status}
                  </span>
                  
                  {thread.relatedTo && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {thread.relatedTo.type}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  {thread.messageCount > 1 && (
                    <span className="text-xs text-gray-500">{thread.messageCount}</span>
                  )}
                  {thread.status === 'unread' && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredThreads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Mail className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No emails found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>

      {/* Message View */}
      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedThread.subject}</h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {selectedThread.participants.length} participants
                    </span>
                    <span className="text-sm text-gray-600">
                      {threadMessages.length} messages
                    </span>
                    {selectedThread.relatedTo && (
                      <span className="text-sm text-blue-600">
                        Related to {selectedThread.relatedTo.type}: {selectedThread.relatedTo.title}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button variant="outline" size="sm">
                    <Forward className="h-4 w-4 mr-2" />
                    Forward
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                </div>
              </div>
              
              {selectedThread.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedThread.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {threadMessages.map(message => (
                <div key={message.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{message.from.name}</div>
                        <div className="text-sm text-gray-600">{message.from.email}</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {formatDate(message.sentAt)}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-1">
                      To: {message.to.map(t => t.name).join(', ')}
                    </div>
                    {message.cc && message.cc.length > 0 && (
                      <div className="text-sm text-gray-600">
                        CC: {message.cc.map(c => c.name).join(', ')}
                      </div>
                    )}
                  </div>
                  
                  <div className="prose max-w-none">
                    <div className="text-gray-900 whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                  
                  {message.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm font-medium text-gray-900 mb-2">Attachments</div>
                      <div className="space-y-2">
                        {message.attachments.map(attachment => (
                          <div key={attachment.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                            <Paperclip className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{attachment.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(attachment.size / 1024).toFixed(1)} KB)
                            </span>
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {message.metadata && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {message.metadata.delivered && (
                          <span className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                            <span>Delivered</span>
                          </span>
                        )}
                        {message.metadata.opened && (
                          <span className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>Opened {message.metadata.openedAt && formatDate(message.metadata.openedAt)}</span>
                          </span>
                        )}
                        {message.metadata.clicked && (
                          <span className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                            <span>Clicked</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Mail className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select an email thread</h3>
              <p className="text-gray-600">Choose a conversation from the list to view messages</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCompose && <ComposeModal />}
      {showTemplates && <TemplatesModal />}
    </div>
  );
}