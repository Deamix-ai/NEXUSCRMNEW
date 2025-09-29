import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  Phone,
  Plus,
  Edit,
  Trash2,
  Copy,
  Send,
  User,
  Building,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Filter,
  Search
} from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  type: 'in_person' | 'video_call' | 'phone_call';
  location?: string;
  videoUrl?: string;
  phoneNumber?: string;
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  attendees: {
    id: string;
    name: string;
    email: string;
    role: 'required' | 'optional';
    status: 'pending' | 'accepted' | 'declined' | 'tentative';
    isExternal: boolean;
  }[];
  relatedTo?: {
    type: 'enquiry' | 'lead' | 'project' | 'account';
    id: string;
    title: string;
  };
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  agenda?: string;
  notes?: string;
  outcome?: string;
  nextSteps?: string;
  recording?: {
    id: string;
    url: string;
    duration: number;
  };
  tags: string[];
  reminders: {
    type: 'email' | 'sms' | 'notification';
    minutesBefore: number;
    sent: boolean;
  }[];
  isRecurring: boolean;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
    count?: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface MeetingSchedulerProps {
  meetings: Meeting[];
  onCreateMeeting: (meeting: Partial<Meeting>) => void;
  onUpdateMeeting: (meetingId: string, updates: Partial<Meeting>) => void;
  onDeleteMeeting: (meetingId: string) => void;
  onSendInvites: (meetingId: string) => void;
  readonly?: boolean;
}

const getMeetingTypeIcon = (type: string) => {
  switch (type) {
    case 'video_call': return <Video className="h-4 w-4" />;
    case 'phone_call': return <Phone className="h-4 w-4" />;
    case 'in_person': return <MapPin className="h-4 w-4" />;
    default: return <Calendar className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled': return 'text-blue-600 bg-blue-50';
    case 'confirmed': return 'text-green-600 bg-green-50';
    case 'in_progress': return 'text-yellow-600 bg-yellow-50';
    case 'completed': return 'text-green-600 bg-green-50';
    case 'cancelled': return 'text-red-600 bg-red-50';
    case 'no_show': return 'text-gray-600 bg-gray-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getAttendeeStatusColor = (status: string) => {
  switch (status) {
    case 'accepted': return 'text-green-600';
    case 'declined': return 'text-red-600';
    case 'tentative': return 'text-yellow-600';
    case 'pending': return 'text-gray-600';
    default: return 'text-gray-600';
  }
};

export function MeetingScheduler({ 
  meetings, 
  onCreateMeeting, 
  onUpdateMeeting, 
  onDeleteMeeting, 
  onSendInvites, 
  readonly = false 
}: MeetingSchedulerProps) {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'agenda'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes}m`;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesStatus = !filterStatus || meeting.status === filterStatus;
    const matchesType = !filterType || meeting.type === filterType;
    const matchesSearch = !searchQuery || 
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.attendees.some(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      meeting.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const upcomingMeetings = filteredMeetings
    .filter(m => new Date(m.startTime) > new Date() && m.status !== 'cancelled')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  const todaysMeetings = filteredMeetings
    .filter(m => {
      const meetingDate = new Date(m.startTime).toDateString();
      const today = new Date().toDateString();
      return meetingDate === today && m.status !== 'cancelled';
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const CreateMeetingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Schedule Meeting</h3>
            <button 
              onClick={() => setShowCreateMeeting(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter meeting title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="video_call">Video Call</option>
                <option value="phone_call">Phone Call</option>
                <option value="in_person">In Person</option>
              </select>
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
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location / Video URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Meeting location or video call URL"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add attendees (comma separated emails)"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Meeting description..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agenda</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Meeting agenda..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Related To</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select relation...</option>
                <option value="enquiry">Enquiry</option>
                <option value="lead">Lead</option>
                <option value="project">Project</option>
                <option value="account">Account</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add tags (comma separated)"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Send calendar invites</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Set reminders</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Recurring meeting</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCreateMeeting(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log('Create meeting');
              setShowCreateMeeting(false);
            }}>
              Schedule Meeting
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const MeetingDetailModal = () => (
    selectedMeeting && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded border ${
                  selectedMeeting.type === 'video_call' ? 'bg-blue-100 text-blue-600 border-blue-200' :
                  selectedMeeting.type === 'phone_call' ? 'bg-green-100 text-green-600 border-green-200' :
                  'bg-purple-100 text-purple-600 border-purple-200'
                }`}>
                  {getMeetingTypeIcon(selectedMeeting.type)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedMeeting.title}</h3>
                  <p className="text-gray-600">
                    {formatDateTime(selectedMeeting.startTime)} - {formatTime(selectedMeeting.endTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!readonly && (
                  <>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Send Invites
                    </Button>
                  </>
                )}
                <button 
                  onClick={() => setSelectedMeeting(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Meeting Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Meeting Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatDateTime(selectedMeeting.startTime)} - {formatTime(selectedMeeting.endTime)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({getDuration(selectedMeeting.startTime, selectedMeeting.endTime)})
                      </span>
                    </div>
                    
                    {(selectedMeeting.location || selectedMeeting.videoUrl) && (
                      <div className="flex items-center space-x-3">
                        {getMeetingTypeIcon(selectedMeeting.type)}
                        <span className="text-sm text-gray-600">
                          {selectedMeeting.location || selectedMeeting.videoUrl}
                        </span>
                        {selectedMeeting.videoUrl && (
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            Join Meeting
                          </button>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Organized by {selectedMeeting.organizer.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMeeting.status)}`}>
                        {selectedMeeting.status.replace('_', ' ')}
                      </span>
                      {selectedMeeting.priority !== 'medium' && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedMeeting.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          selectedMeeting.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedMeeting.priority} priority
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Attendees */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Attendees ({selectedMeeting.attendees.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedMeeting.attendees.map(attendee => (
                      <div key={attendee.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{attendee.name}</div>
                            <div className="text-sm text-gray-600">{attendee.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getAttendeeStatusColor(attendee.status)}`}>
                            {attendee.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {attendee.role}
                          </span>
                          {attendee.isExternal && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              External
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description & Agenda */}
                {selectedMeeting.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {selectedMeeting.description}
                    </div>
                  </div>
                )}

                {selectedMeeting.agenda && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Agenda</h4>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                      {selectedMeeting.agenda}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Related Information */}
                {selectedMeeting.relatedTo && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Related To</h4>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-900 capitalize">
                          {selectedMeeting.relatedTo.type}
                        </span>
                      </div>
                      <div className="text-sm text-blue-700 mt-1">
                        {selectedMeeting.relatedTo.title}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedMeeting.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMeeting.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reminders */}
                {selectedMeeting.reminders.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Reminders</h4>
                    <div className="space-y-1">
                      {selectedMeeting.reminders.map((reminder, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {reminder.type} - {reminder.minutesBefore}m before
                          </span>
                          {reminder.sent ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recording */}
                {selectedMeeting.recording && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recording</h4>
                    <div className="p-3 bg-gray-50 rounded border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          Meeting Recording ({Math.round(selectedMeeting.recording.duration / 60)}m)
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes & Outcome (for completed meetings) */}
            {(selectedMeeting.notes || selectedMeeting.outcome || selectedMeeting.nextSteps) && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Meeting Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedMeeting.notes && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Notes</h5>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {selectedMeeting.notes}
                      </div>
                    </div>
                  )}
                  
                  {selectedMeeting.outcome && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Outcome</h5>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {selectedMeeting.outcome}
                      </div>
                    </div>
                  )}
                  
                  {selectedMeeting.nextSteps && (
                    <div className="md:col-span-2">
                      <h5 className="font-medium text-gray-700 mb-2">Next Steps</h5>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {selectedMeeting.nextSteps}
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

  const ListView = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4">Meeting</th>
              <th className="text-left p-4">Date & Time</th>
              <th className="text-left p-4">Duration</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Attendees</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMeetings.map(meeting => (
              <tr key={meeting.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{meeting.title}</div>
                  {meeting.relatedTo && (
                    <div className="text-sm text-gray-600">
                      Related to {meeting.relatedTo.type}: {meeting.relatedTo.title}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-gray-900">{formatDate(meeting.startTime)}</div>
                  <div className="text-sm text-gray-600">{formatTime(meeting.startTime)}</div>
                </td>
                <td className="p-4 text-gray-900">
                  {getDuration(meeting.startTime, meeting.endTime)}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    {getMeetingTypeIcon(meeting.type)}
                    <span className="text-gray-900 capitalize">
                      {meeting.type.replace('_', ' ')}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-gray-900">{meeting.attendees.length} attendees</div>
                  <div className="text-sm text-gray-600">
                    {meeting.attendees.filter(a => a.status === 'accepted').length} accepted
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                    {meeting.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedMeeting(meeting)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredMeetings.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No meetings found</h3>
            <p className="text-gray-600">Try adjusting your filters or schedule a new meeting.</p>
          </div>
        )}
      </div>
    </div>
  );

  const AgendaView = () => (
    <div className="space-y-6">
      {/* Today's Meetings */}
      {todaysMeetings.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Today's Meetings</h3>
          <div className="space-y-3">
            {todaysMeetings.map(meeting => (
              <div
                key={meeting.id}
                onClick={() => setSelectedMeeting(meeting)}
                className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer"
              >
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded border ${
                    meeting.type === 'video_call' ? 'bg-blue-100 text-blue-600 border-blue-200' :
                    meeting.type === 'phone_call' ? 'bg-green-100 text-green-600 border-green-200' :
                    'bg-purple-100 text-purple-600 border-purple-200'
                  }`}>
                    {getMeetingTypeIcon(meeting.type)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                    <span className="text-sm text-gray-600">
                      {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{meeting.attendees.length} attendees</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                      {meeting.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Upcoming Meetings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming Meetings</h3>
        <div className="space-y-3">
          {upcomingMeetings.map(meeting => (
            <div
              key={meeting.id}
              onClick={() => setSelectedMeeting(meeting)}
              className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer"
            >
              <div className="flex-shrink-0">
                <div className={`p-2 rounded border ${
                  meeting.type === 'video_call' ? 'bg-blue-100 text-blue-600 border-blue-200' :
                  meeting.type === 'phone_call' ? 'bg-green-100 text-green-600 border-green-200' :
                  'bg-purple-100 text-purple-600 border-purple-200'
                }`}>
                  {getMeetingTypeIcon(meeting.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                  <span className="text-sm text-gray-600">
                    {formatDateTime(meeting.startTime)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{meeting.attendees.length} attendees</span>
                  <span>{getDuration(meeting.startTime, meeting.endTime)}</span>
                  {meeting.relatedTo && (
                    <span className="text-blue-600">
                      {meeting.relatedTo.type}: {meeting.relatedTo.title}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {upcomingMeetings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No upcoming meetings</h3>
              <p className="text-gray-600">Schedule your next meeting to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Meeting Scheduler</h2>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {filteredMeetings.length} meetings
          </span>
        </div>
        
        <div className="flex space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: 'agenda', label: 'Agenda' },
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
          
          {!readonly && (
            <Button onClick={() => setShowCreateMeeting(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search meetings, attendees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="video_call">Video Call</option>
                <option value="phone_call">Phone Call</option>
                <option value="in_person">In Person</option>
              </select>
              
              <Button variant="outline" onClick={() => {
                setFilterStatus('');
                setFilterType('');
                setSearchQuery('');
              }}>
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === 'agenda' && <AgendaView />}
      {viewMode === 'list' && <ListView />}

      {/* Modals */}
      {showCreateMeeting && <CreateMeetingModal />}
      {selectedMeeting && <MeetingDetailModal />}
    </div>
  );
}