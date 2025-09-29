import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  FileText,
  Clock,
  User,
  Building,
  Tag,
  Filter,
  Search,
  Download,
  Eye,
  Star,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Send,
  Reply,
  Forward,
  Archive,
  Trash2,
  Play,
  Pause,
  Download as DownloadIcon,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface CommunicationItem {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'sms' | 'note' | 'task' | 'proposal' | 'quote';
  direction: 'inbound' | 'outbound' | 'internal';
  subject: string;
  content?: string;
  summary?: string;
  participants: {
    id: string;
    name: string;
    email?: string;
    role: 'from' | 'to' | 'cc' | 'bcc' | 'organizer' | 'attendee';
    isInternal: boolean;
  }[];
  relatedTo: {
    type: 'enquiry' | 'lead' | 'project' | 'account';
    id: string;
    title: string;
  };
  status: 'sent' | 'delivered' | 'read' | 'replied' | 'completed' | 'scheduled' | 'cancelled' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  attachments?: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
  metadata?: {
    duration?: number; // for calls/meetings in seconds
    recording?: {
      id: string;
      url: string;
      duration: number;
    };
    emailThreadId?: string;
    meetingUrl?: string;
    outcome?: string;
    nextSteps?: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
    satisfaction?: number; // 1-5 rating
  };
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

interface CommunicationHistoryProps {
  communications: CommunicationItem[];
  relatedTo?: {
    type: 'enquiry' | 'lead' | 'project' | 'account';
    id: string;
    title: string;
  };
  showFilters?: boolean;
  readonly?: boolean;
  compact?: boolean;
  onCreateCommunication?: (type: string) => void;
  onUpdateCommunication?: (id: string, updates: Partial<CommunicationItem>) => void;
  onDeleteCommunication?: (id: string) => void;
}

const getCommunicationIcon = (type: string) => {
  switch (type) {
    case 'email': return <Mail className="h-4 w-4" />;
    case 'call': return <Phone className="h-4 w-4" />;
    case 'meeting': return <Calendar className="h-4 w-4" />;
    case 'sms': return <MessageCircle className="h-4 w-4" />;
    case 'note': return <FileText className="h-4 w-4" />;
    case 'task': return <CheckCircle className="h-4 w-4" />;
    case 'proposal': return <FileText className="h-4 w-4" />;
    case 'quote': return <FileText className="h-4 w-4" />;
    default: return <MessageCircle className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'email': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'call': return 'bg-green-100 text-green-700 border-green-200';
    case 'meeting': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'sms': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'note': return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'task': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'proposal': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'quote': return 'bg-pink-100 text-pink-700 border-pink-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getDirectionIcon = (direction: string) => {
  switch (direction) {
    case 'inbound': return '←';
    case 'outbound': return '→';
    case 'internal': return '↔';
    default: return '';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'sent': return 'text-blue-600';
    case 'delivered': return 'text-green-600';
    case 'read': return 'text-green-600';
    case 'replied': return 'text-green-600';
    case 'completed': return 'text-green-600';
    case 'scheduled': return 'text-yellow-600';
    case 'cancelled': return 'text-red-600';
    case 'failed': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export function CommunicationHistory({ 
  communications, 
  relatedTo,
  showFilters = true,
  readonly = false,
  compact = false,
  onCreateCommunication,
  onUpdateCommunication,
  onDeleteCommunication
}: CommunicationHistoryProps) {
  const [selectedCommunication, setSelectedCommunication] = useState<CommunicationItem | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState('');
  const [filterDirection, setFilterDirection] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'grouped' | 'list'>('timeline');
  const [dateRange, setDateRange] = useState('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    }
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredCommunications = communications.filter(comm => {
    const matchesType = !filterType || comm.type === filterType;
    const matchesDirection = !filterDirection || comm.direction === filterDirection;
    const matchesStatus = !filterStatus || comm.status === filterStatus;
    const matchesSearch = !searchQuery || 
      comm.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDate = dateRange === 'all' || (() => {
      const commDate = new Date(comm.createdAt);
      const now = new Date();
      
      switch (dateRange) {
        case 'today':
          return commDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return commDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return commDate >= monthAgo;
        default:
          return true;
      }
    })();
    
    return matchesType && matchesDirection && matchesStatus && matchesSearch && matchesDate;
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const groupedCommunications = filteredCommunications.reduce((groups, comm) => {
    const date = new Date(comm.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(comm);
    return groups;
  }, {} as Record<string, CommunicationItem[]>);

  const CommunicationDetailModal = () => (
    selectedCommunication && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded border ${getTypeColor(selectedCommunication.type)}`}>
                  {getCommunicationIcon(selectedCommunication.type)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedCommunication.subject}</h3>
                  <p className="text-gray-600">
                    {formatFullDate(selectedCommunication.createdAt)} by {selectedCommunication.createdBy.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!readonly && selectedCommunication.type === 'email' && (
                  <>
                    <Button variant="outline" size="sm">
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button variant="outline" size="sm">
                      <Forward className="h-4 w-4 mr-2" />
                      Forward
                    </Button>
                  </>
                )}
                <button 
                  onClick={() => setSelectedCommunication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ExternalLink className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Content */}
                {selectedCommunication.content && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Content</h4>
                    <div className="prose max-w-none">
                      <div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                        {selectedCommunication.content}
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary */}
                {selectedCommunication.summary && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Summary</h4>
                    <div className="text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      {selectedCommunication.summary}
                    </div>
                  </div>
                )}

                {/* Participants */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Participants</h4>
                  <div className="space-y-2">
                    {selectedCommunication.participants.map(participant => (
                      <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{participant.name}</div>
                            {participant.email && (
                              <div className="text-sm text-gray-600">{participant.email}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 capitalize">{participant.role}</span>
                          {!participant.isInternal && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              External
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attachments */}
                {selectedCommunication.attachments && selectedCommunication.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Attachments</h4>
                    <div className="space-y-2">
                      {selectedCommunication.attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">{attachment.name}</div>
                              <div className="text-sm text-gray-600">{formatFileSize(attachment.size)}</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <DownloadIcon className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Metadata */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Type</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">{getDirectionIcon(selectedCommunication.direction)}</span>
                        <span className="text-sm text-gray-900 capitalize">
                          {selectedCommunication.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`text-sm font-medium ${getStatusColor(selectedCommunication.status)}`}>
                        {selectedCommunication.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Priority</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedCommunication.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        selectedCommunication.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        selectedCommunication.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedCommunication.priority}
                      </span>
                    </div>

                    {selectedCommunication.metadata?.duration && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Duration</span>
                        <span className="text-sm text-gray-900">
                          {formatDuration(selectedCommunication.metadata.duration)}
                        </span>
                      </div>
                    )}

                    {selectedCommunication.metadata?.sentiment && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Sentiment</span>
                        <span className={`text-sm font-medium ${
                          selectedCommunication.metadata.sentiment === 'positive' ? 'text-green-600' :
                          selectedCommunication.metadata.sentiment === 'negative' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {selectedCommunication.metadata.sentiment}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Related To */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Related To</h4>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900 capitalize">
                        {selectedCommunication.relatedTo.type}
                      </span>
                    </div>
                    <div className="text-sm text-blue-700 mt-1">
                      {selectedCommunication.relatedTo.title}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {selectedCommunication.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCommunication.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recording */}
                {selectedCommunication.metadata?.recording && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recording</h4>
                    <div className="p-3 bg-gray-50 rounded border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          Recording ({formatDuration(selectedCommunication.metadata.recording.duration)})
                        </span>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Play className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-800">
                            <DownloadIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Outcome & Next Steps */}
            {(selectedCommunication.metadata?.outcome || selectedCommunication.metadata?.nextSteps) && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Follow-up</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCommunication.metadata?.outcome && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Outcome</h5>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {selectedCommunication.metadata.outcome}
                      </div>
                    </div>
                  )}
                  
                  {selectedCommunication.metadata?.nextSteps && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Next Steps</h5>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {selectedCommunication.metadata.nextSteps}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );

  const TimelineView = () => (
    <div className="space-y-4">
      {Object.entries(groupedCommunications)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .map(([date, comms]) => (
          <div key={date} className="space-y-3">
            <div className="sticky top-0 bg-white py-2 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">
                {new Date(date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
            </div>
            
            <div className="space-y-3">
              {comms
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map(comm => (
                  <div key={comm.id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded border ${getTypeColor(comm.type)} flex-shrink-0`}>
                          {getCommunicationIcon(comm.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900">{comm.subject}</h4>
                              <span className="text-sm text-gray-500">
                                {getDirectionIcon(comm.direction)}
                              </span>
                              <span className={`text-sm ${getStatusColor(comm.status)}`}>
                                {comm.status}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">
                                {formatDate(comm.createdAt)}
                              </span>
                              {!readonly && (
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span>{comm.createdBy.name}</span>
                            <span>→</span>
                            <span>
                              {comm.participants
                                .filter(p => p.role === 'to')
                                .map(p => p.name)
                                .join(', ')}
                            </span>
                            {comm.metadata?.duration && (
                              <span className="text-gray-500">
                                {formatDuration(comm.metadata.duration)}
                              </span>
                            )}
                          </div>
                          
                          {(comm.summary || comm.content) && (
                            <div className="text-sm text-gray-600 mb-3">
                              {comm.summary || (comm.content && comm.content.substring(0, 150) + '...')}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {comm.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                              {comm.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{comm.tags.length - 3} more
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {comm.attachments && comm.attachments.length > 0 && (
                                <span className="text-xs text-gray-500">
                                  {comm.attachments.length} attachment{comm.attachments.length !== 1 ? 's' : ''}
                                </span>
                              )}
                              <button
                                onClick={() => setSelectedCommunication(comm)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
        
      {filteredCommunications.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">No communications found</h3>
          <p className="text-gray-600">Try adjusting your filters or create a new communication.</p>
        </div>
      )}
    </div>
  );

  const ListView = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Subject</th>
              <th className="text-left p-4">Participants</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommunications.map(comm => (
              <tr key={comm.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded border ${getTypeColor(comm.type)}`}>
                      {getCommunicationIcon(comm.type)}
                    </div>
                    <span className="text-gray-900 capitalize">
                      {comm.type}
                    </span>
                    <span className="text-gray-500">
                      {getDirectionIcon(comm.direction)}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">{comm.subject}</div>
                  {comm.summary && (
                    <div className="text-sm text-gray-600 truncate max-w-xs">
                      {comm.summary}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-gray-900">{comm.createdBy.name}</div>
                  <div className="text-sm text-gray-600">
                    {comm.participants.filter(p => p.role === 'to').length} recipients
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-gray-900">{formatDate(comm.createdAt)}</div>
                  {comm.metadata?.duration && (
                    <div className="text-sm text-gray-600">
                      {formatDuration(comm.metadata.duration)}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    comm.status === 'completed' || comm.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    comm.status === 'failed' || comm.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {comm.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedCommunication(comm)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Communication History
            {relatedTo && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                for {relatedTo.type}: {relatedTo.title}
              </span>
            )}
          </h2>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {filteredCommunications.length} items
          </span>
        </div>
        
        <div className="flex space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: 'timeline', label: 'Timeline' },
              { id: 'list', label: 'List' }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setViewMode(view.id as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === view.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
          
          {!readonly && onCreateCommunication && (
            <div className="relative">
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                New Communication
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search communications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="email">Email</option>
              <option value="call">Call</option>
              <option value="meeting">Meeting</option>
              <option value="sms">SMS</option>
              <option value="note">Note</option>
            </select>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
            
            <Button variant="outline" onClick={() => {
              setFilterType('');
              setFilterDirection('');
              setFilterStatus('');
              setSearchQuery('');
              setDateRange('all');
            }}>
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === 'timeline' && <TimelineView />}
      {viewMode === 'list' && <ListView />}

      {/* Detail Modal */}
      {selectedCommunication && <CommunicationDetailModal />}
    </div>
  );
}