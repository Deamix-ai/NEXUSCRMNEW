import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed,
  Clock,
  Calendar,
  User,
  Building,
  FileText,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Star,
  Flag,
  Tag,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  ChevronRight,
  X
} from 'lucide-react';

interface CallRecord {
  id: string;
  type: 'inbound' | 'outbound' | 'missed';
  phoneNumber: string;
  contactId?: string;
  contactName?: string;
  accountId?: string;
  accountName?: string;
  relatedTo?: {
    type: 'enquiry' | 'lead' | 'project';
    id: string;
    title: string;
  };
  startTime: string;
  endTime?: string;
  duration?: number; // seconds
  status: 'completed' | 'missed' | 'busy' | 'no_answer' | 'voicemail';
  outcome?: 'positive' | 'neutral' | 'negative' | 'follow_up_required';
  ownerId: string;
  ownerName: string;
  notes?: string;
  summary?: string;
  nextAction?: {
    type: string;
    description: string;
    dueDate: string;
  };
  recording?: {
    id: string;
    url: string;
    duration: number;
    transcription?: string;
  };
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isStarred: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CallLogProps {
  calls: CallRecord[];
  onCreateCall: (call: Partial<CallRecord>) => void;
  onUpdateCall: (callId: string, updates: Partial<CallRecord>) => void;
  onDeleteCall: (callId: string) => void;
  onPlayRecording: (recordingUrl: string) => void;
  readonly?: boolean;
}

const getCallTypeIcon = (type: string, status: string) => {
  if (status === 'missed') return <PhoneMissed className="h-4 w-4 text-red-500" />;
  if (type === 'inbound') return <PhoneIncoming className="h-4 w-4 text-green-500" />;
  if (type === 'outbound') return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
  return <Phone className="h-4 w-4 text-gray-500" />;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-50';
    case 'missed': return 'text-red-600 bg-red-50';
    case 'busy': return 'text-yellow-600 bg-yellow-50';
    case 'no_answer': return 'text-orange-600 bg-orange-50';
    case 'voicemail': return 'text-blue-600 bg-blue-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getOutcomeColor = (outcome: string) => {
  switch (outcome) {
    case 'positive': return 'text-green-600 bg-green-50';
    case 'neutral': return 'text-gray-600 bg-gray-50';
    case 'negative': return 'text-red-600 bg-red-50';
    case 'follow_up_required': return 'text-yellow-600 bg-yellow-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatPhoneNumber = (phoneNumber: string) => {
  // Basic UK phone number formatting
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.startsWith('44')) {
    return `+44 ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`;
  } else if (cleaned.startsWith('07')) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phoneNumber;
};

export function CallLog({ 
  calls, 
  onCreateCall, 
  onUpdateCall, 
  onDeleteCall, 
  onPlayRecording, 
  readonly = false 
}: CallLogProps) {
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [showLogCall, setShowLogCall] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterOutcome, setFilterOutcome] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [playingRecording, setPlayingRecording] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredCalls = calls.filter(call => {
    const matchesType = !filterType || call.type === filterType;
    const matchesStatus = !filterStatus || call.status === filterStatus;
    const matchesOutcome = !filterOutcome || call.outcome === filterOutcome;
    const matchesSearch = !searchQuery || 
      call.phoneNumber.includes(searchQuery) ||
      call.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.accountName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesOutcome && matchesSearch;
  });

  const handlePlayRecording = (recordingUrl: string, recordingId: string) => {
    if (playingRecording === recordingId) {
      setPlayingRecording(null);
      audioRef.current?.pause();
    } else {
      setPlayingRecording(recordingId);
      onPlayRecording(recordingUrl);
    }
  };

  const LogCallModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Log Call</h3>
            <button 
              onClick={() => setShowLogCall(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Call Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="outbound">Outbound</option>
                <option value="inbound">Inbound</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+44 7XXX XXXXXX"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact/Account</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search contacts..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Related To</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select relation...</option>
                <option value="enquiry">Enquiry</option>
                <option value="lead">Lead</option>
                <option value="project">Project</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
                <option value="busy">Busy</option>
                <option value="no_answer">No Answer</option>
                <option value="voicemail">Voicemail</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select outcome...</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
                <option value="follow_up_required">Follow-up Required</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5:30"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Call Notes</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add notes about the call..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add tags (comma separated)"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowLogCall(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log('Save call log');
              setShowLogCall(false);
            }}>
              Save Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const CallDetailModal = () => (
    selectedCall && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getCallTypeIcon(selectedCall.type, selectedCall.status)}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedCall.contactName || formatPhoneNumber(selectedCall.phoneNumber)}
                  </h3>
                  <p className="text-gray-600">
                    {selectedCall.type} call • {formatDate(selectedCall.startTime)} at {formatTime(selectedCall.startTime)}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCall(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Call Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone Number:</span>
                      <span className="font-medium">{formatPhoneNumber(selectedCall.phoneNumber)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {selectedCall.duration ? formatDuration(selectedCall.duration) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCall.status)}`}>
                        {selectedCall.status.replace('_', ' ')}
                      </span>
                    </div>
                    {selectedCall.outcome && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Outcome:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOutcomeColor(selectedCall.outcome)}`}>
                          {selectedCall.outcome.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Owner:</span>
                      <span className="font-medium">{selectedCall.ownerName}</span>
                    </div>
                  </div>
                </div>
                
                {selectedCall.recording && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recording</h4>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          Call Recording ({formatDuration(selectedCall.recording.duration)})
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePlayRecording(selectedCall.recording!.url, selectedCall.recording!.id)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                          >
                            {playingRecording === selectedCall.recording.id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                            <span className="text-sm">{playingRecording === selectedCall.recording.id ? 'Pause' : 'Play'}</span>
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {selectedCall.recording.transcription && (
                        <div className="mt-3 p-3 bg-white rounded border">
                          <div className="text-sm font-medium text-gray-900 mb-2">Transcription</div>
                          <div className="text-sm text-gray-700">
                            {selectedCall.recording.transcription}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {(selectedCall.contactName || selectedCall.accountName || selectedCall.relatedTo) && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Related Records</h4>
                    <div className="space-y-2 text-sm">
                      {selectedCall.contactName && (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Contact:</span>
                          <span className="font-medium">{selectedCall.contactName}</span>
                        </div>
                      )}
                      {selectedCall.accountName && (
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Account:</span>
                          <span className="font-medium">{selectedCall.accountName}</span>
                        </div>
                      )}
                      {selectedCall.relatedTo && (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{selectedCall.relatedTo.type}:</span>
                          <span className="font-medium">{selectedCall.relatedTo.title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedCall.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCall.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedCall.nextAction && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Next Action</h4>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="font-medium text-blue-900">{selectedCall.nextAction.type}</div>
                      <div className="text-sm text-blue-700">{selectedCall.nextAction.description}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        Due: {formatDate(selectedCall.nextAction.dueDate)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {selectedCall.notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Call Notes</h4>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {selectedCall.notes}
                </div>
              </div>
            )}
            
            {selectedCall.summary && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Call Summary</h4>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {selectedCall.summary}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );

  const ListView = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4">Call</th>
              <th className="text-left p-4">Contact</th>
              <th className="text-left p-4">Date & Time</th>
              <th className="text-left p-4">Duration</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Outcome</th>
              <th className="text-left p-4">Owner</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalls.map(call => (
              <tr key={call.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    {getCallTypeIcon(call.type, call.status)}
                    <div>
                      <div className="font-medium text-gray-900">
                        {formatPhoneNumber(call.phoneNumber)}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {call.type} call
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {call.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                      {call.recording && <Volume2 className="h-3 w-3 text-blue-500" />}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-gray-900">{call.contactName || 'Unknown'}</div>
                  {call.accountName && (
                    <div className="text-sm text-gray-600">{call.accountName}</div>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-gray-900">{formatDate(call.startTime)}</div>
                  <div className="text-sm text-gray-600">{formatTime(call.startTime)}</div>
                </td>
                <td className="p-4 text-gray-900">
                  {call.duration ? formatDuration(call.duration) : 'N/A'}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                    {call.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  {call.outcome ? (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOutcomeColor(call.outcome)}`}>
                      {call.outcome.replace('_', ' ')}
                    </span>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="p-4 text-gray-900">{call.ownerName}</td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedCall(call)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredCalls.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Phone className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No calls found</h3>
            <p className="text-gray-600">Try adjusting your filters or log a new call.</p>
          </div>
        )}
      </div>
    </div>
  );

  const TimelineView = () => {
    const groupedByDate = filteredCalls.reduce((acc, call) => {
      const date = call.startTime.split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(call);
      return acc;
    }, {} as Record<string, CallRecord[]>);

    return (
      <div className="space-y-6">
        {Object.entries(groupedByDate)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .map(([date, dayCalls]) => (
            <div key={date} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{formatDate(date)}</h3>
                <span className="text-sm text-gray-600">{dayCalls.length} calls</span>
              </div>

              <div className="space-y-3">
                {dayCalls
                  .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                  .map(call => (
                    <div
                      key={call.id}
                      onClick={() => setSelectedCall(call)}
                      className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer"
                    >
                      <div className="flex-shrink-0">
                        {getCallTypeIcon(call.type, call.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">
                              {call.contactName || formatPhoneNumber(call.phoneNumber)}
                            </h4>
                            {call.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                            {call.recording && <Volume2 className="h-3 w-3 text-blue-500" />}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{formatTime(call.startTime)}</span>
                            <span className="text-sm text-gray-600">
                              {call.duration ? formatDuration(call.duration) : 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {call.accountName && (
                            <span className="flex items-center space-x-1">
                              <Building className="h-3 w-3" />
                              <span>{call.accountName}</span>
                            </span>
                          )}
                          
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                            {call.status.replace('_', ' ')}
                          </span>
                          
                          {call.outcome && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOutcomeColor(call.outcome)}`}>
                              {call.outcome.replace('_', ' ')}
                            </span>
                          )}
                        </div>

                        {call.notes && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{call.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}

        {Object.keys(groupedByDate).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Phone className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No calls found</h3>
            <p className="text-gray-600">Try adjusting your filters or log a new call.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Phone className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Call Log</h2>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {filteredCalls.length} calls
          </span>
        </div>
        
        <div className="flex space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Timeline
            </button>
          </div>
          
          {!readonly && (
            <Button onClick={() => setShowLogCall(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Log Call
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search calls, contacts, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
              <option value="busy">Busy</option>
              <option value="no_answer">No Answer</option>
              <option value="voicemail">Voicemail</option>
            </select>
            
            <select
              value={filterOutcome}
              onChange={(e) => setFilterOutcome(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Outcomes</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
              <option value="follow_up_required">Follow-up Required</option>
            </select>
            
            <Button variant="outline" onClick={() => {
              setFilterType('');
              setFilterStatus('');
              setFilterOutcome('');
              setSearchQuery('');
            }}>
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' && <ListView />}
      {viewMode === 'timeline' && <TimelineView />}

      {/* Modals */}
      {showLogCall && <LogCallModal />}
      {selectedCall && <CallDetailModal />}

      {/* Hidden audio element for playing recordings */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}