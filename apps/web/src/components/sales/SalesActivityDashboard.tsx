import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Download,
  BarChart3,
  Activity,
  User,
  Building,
  FileText,
  DollarSign,
  Zap,
  X
} from 'lucide-react';

interface SalesActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'follow_up' | 'note';
  title: string;
  description?: string;
  date: string;
  duration?: number; // minutes
  ownerId: string;
  ownerName: string;
  accountId?: string;
  accountName?: string;
  contactId?: string;
  contactName?: string;
  dealId?: string;
  dealTitle?: string;
  outcome?: 'completed' | 'no_show' | 'reschedule' | 'cancelled';
  nextAction?: {
    type: string;
    description: string;
    dueDate: string;
  };
  metadata?: {
    emailOpened?: boolean;
    emailClicked?: boolean;
    callConnected?: boolean;
    meetingAttendees?: number;
    proposalValue?: number;
  };
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface ActivityMetrics {
  totalActivities: number;
  activitiesByType: Record<string, number>;
  activitiesByOutcome: Record<string, number>;
  averageCallDuration: number;
  emailOpenRate: number;
  emailClickRate: number;
  meetingShowRate: number;
  activitiesPerRep: {
    ownerId: string;
    ownerName: string;
    total: number;
    byType: Record<string, number>;
    averagePerDay: number;
    conversion: number;
  }[];
  trends: {
    period: string;
    activities: number;
    change: number;
  }[];
}

interface SalesActivityDashboardProps {
  activities: SalesActivity[];
  metrics: ActivityMetrics;
  onCreateActivity: (activity: Partial<SalesActivity>) => void;
  onUpdateActivity: (activityId: string, updates: Partial<SalesActivity>) => void;
  onDeleteActivity: (activityId: string) => void;
  readonly?: boolean;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'call': return <Phone className="h-4 w-4" />;
    case 'email': return <Mail className="h-4 w-4" />;
    case 'meeting': return <Users className="h-4 w-4" />;
    case 'demo': return <BarChart3 className="h-4 w-4" />;
    case 'proposal': return <FileText className="h-4 w-4" />;
    case 'follow_up': return <Clock className="h-4 w-4" />;
    case 'note': return <MessageSquare className="h-4 w-4" />;
    default: return <Activity className="h-4 w-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'call': return 'bg-blue-100 text-blue-600 border-blue-200';
    case 'email': return 'bg-green-100 text-green-600 border-green-200';
    case 'meeting': return 'bg-purple-100 text-purple-600 border-purple-200';
    case 'demo': return 'bg-orange-100 text-orange-600 border-orange-200';
    case 'proposal': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
    case 'follow_up': return 'bg-pink-100 text-pink-600 border-pink-200';
    case 'note': return 'bg-gray-100 text-gray-600 border-gray-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const getOutcomeColor = (outcome: string) => {
  switch (outcome) {
    case 'completed': return 'text-green-600 bg-green-50';
    case 'no_show': return 'text-red-600 bg-red-50';
    case 'reschedule': return 'text-yellow-600 bg-yellow-50';
    case 'cancelled': return 'text-gray-600 bg-gray-50';
    default: return 'text-blue-600 bg-blue-50';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'border-red-500 bg-red-50';
    case 'high': return 'border-orange-500 bg-orange-50';
    case 'medium': return 'border-yellow-500 bg-yellow-50';
    case 'low': return 'border-gray-500 bg-gray-50';
    default: return 'border-gray-300 bg-white';
  }
};

export function SalesActivityDashboard({ 
  activities, 
  metrics, 
  onCreateActivity, 
  onUpdateActivity, 
  onDeleteActivity, 
  readonly = false 
}: SalesActivityDashboardProps) {
  const [selectedActivity, setSelectedActivity] = useState<SalesActivity | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [filterOwner, setFilterOwner] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'metrics'>('list');

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

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesType = !filterType || activity.type === filterType;
      const matchesOwner = !filterOwner || activity.ownerId === filterOwner;
      const matchesDate = !filterDate || activity.date.startsWith(filterDate);
      
      return matchesType && matchesOwner && matchesDate;
    });
  }, [activities, filterType, filterOwner, filterDate]);

  const MetricsView = () => (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">Total Activities</h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.totalActivities}</div>
          <div className="text-sm text-gray-600">This period</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-2">
            <Phone className="h-5 w-5 text-green-600" />
            <h3 className="font-medium text-gray-900">Avg Call Duration</h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatDuration(metrics.averageCallDuration)}</div>
          <div className="text-sm text-gray-600">Per call</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-2">
            <Mail className="h-5 w-5 text-purple-600" />
            <h3 className="font-medium text-gray-900">Email Open Rate</h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.emailOpenRate}%</div>
          <div className="text-sm text-gray-600">Click rate: {metrics.emailClickRate}%</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-orange-600" />
            <h3 className="font-medium text-gray-900">Meeting Show Rate</h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.meetingShowRate}%</div>
          <div className="text-sm text-gray-600">Attendance rate</div>
        </div>
      </div>

      {/* Activity by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Activities by Type</h3>
          <div className="space-y-3">
            {Object.entries(metrics.activitiesByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded border ${getActivityColor(type)}`}>
                    {getActivityIcon(type)}
                  </div>
                  <span className="font-medium text-gray-900 capitalize">
                    {type.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500">
                    {((count / metrics.totalActivities) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Activity Outcomes</h3>
          <div className="space-y-3">
            {Object.entries(metrics.activitiesByOutcome).map(([outcome, count]) => (
              <div key={outcome} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    outcome === 'completed' ? 'bg-green-500' :
                    outcome === 'no_show' ? 'bg-red-500' :
                    outcome === 'reschedule' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`} />
                  <span className="font-medium text-gray-900 capitalize">
                    {outcome.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500">
                    {((count / metrics.totalActivities) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rep Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Sales Rep Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Sales Rep</th>
                <th className="text-right p-3">Total Activities</th>
                <th className="text-right p-3">Calls</th>
                <th className="text-right p-3">Emails</th>
                <th className="text-right p-3">Meetings</th>
                <th className="text-right p-3">Daily Avg</th>
                <th className="text-right p-3">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {metrics.activitiesPerRep.map(rep => (
                <tr key={rep.ownerId} className="border-t">
                  <td className="p-3 font-medium">{rep.ownerName}</td>
                  <td className="p-3 text-right">{rep.total}</td>
                  <td className="p-3 text-right">{rep.byType.call || 0}</td>
                  <td className="p-3 text-right">{rep.byType.email || 0}</td>
                  <td className="p-3 text-right">{rep.byType.meeting || 0}</td>
                  <td className="p-3 text-right">{rep.averagePerDay.toFixed(1)}</td>
                  <td className="p-3 text-right font-medium">{rep.conversion.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const TimelineView = () => {
    const groupedByDate = filteredActivities.reduce((acc, activity) => {
      const date = activity.date.split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(activity);
      return acc;
    }, {} as Record<string, SalesActivity[]>);

    return (
      <div className="space-y-6">
        {Object.entries(groupedByDate)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .map(([date, dayActivities]) => (
            <div key={date} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{formatDate(date)}</h3>
                <span className="text-sm text-gray-600">{dayActivities.length} activities</span>
              </div>

              <div className="space-y-3">
                {dayActivities
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(activity => (
                    <div
                      key={activity.id}
                      onClick={() => setSelectedActivity(activity)}
                      className="flex items-start space-x-4 p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer"
                    >
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded border ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{formatTime(activity.date)}</span>
                            {activity.outcome && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOutcomeColor(activity.outcome)}`}>
                                {activity.outcome.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{activity.ownerName}</span>
                          </span>
                          
                          {activity.accountName && (
                            <span className="flex items-center space-x-1">
                              <Building className="h-3 w-3" />
                              <span>{activity.accountName}</span>
                            </span>
                          )}
                          
                          {activity.duration && (
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDuration(activity.duration)}</span>
                            </span>
                          )}
                        </div>

                        {activity.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{activity.description}</p>
                        )}

                        {activity.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {activity.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                            {activity.tags.length > 3 && (
                              <span className="text-xs text-gray-400">+{activity.tags.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}

        {Object.keys(groupedByDate).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600">Try adjusting your filters or create a new activity.</p>
          </div>
        )}
      </div>
    );
  };

  const ListView = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4">Activity</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Account/Contact</th>
              <th className="text-left p-4">Owner</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Duration</th>
              <th className="text-left p-4">Outcome</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map(activity => (
              <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{activity.title}</div>
                  {activity.description && (
                    <div className="text-sm text-gray-600 line-clamp-1">{activity.description}</div>
                  )}
                </td>
                <td className="p-4">
                  <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded border ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                    <span className="text-xs font-medium capitalize">
                      {activity.type.replace('_', ' ')}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-gray-900">{activity.accountName || 'N/A'}</div>
                  {activity.contactName && (
                    <div className="text-sm text-gray-600">{activity.contactName}</div>
                  )}
                </td>
                <td className="p-4 text-gray-900">{activity.ownerName}</td>
                <td className="p-4">
                  <div className="text-gray-900">{formatDate(activity.date)}</div>
                  <div className="text-sm text-gray-600">{formatTime(activity.date)}</div>
                </td>
                <td className="p-4 text-gray-900">
                  {activity.duration ? formatDuration(activity.duration) : 'N/A'}
                </td>
                <td className="p-4">
                  {activity.outcome ? (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOutcomeColor(activity.outcome)}`}>
                      {activity.outcome.replace('_', ' ')}
                    </span>
                  ) : (
                    <span className="text-gray-400">Pending</span>
                  )}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedActivity(activity)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredActivities.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600">Try adjusting your filters or create a new activity.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Sales Activities</h2>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {filteredActivities.length} activities
          </span>
        </div>
        
        <div className="flex space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: 'list', label: 'List', icon: FileText },
              { id: 'timeline', label: 'Timeline', icon: Clock },
              { id: 'metrics', label: 'Metrics', icon: BarChart3 }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setViewMode(view.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === view.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <view.icon className="h-4 w-4" />
                <span>{view.label}</span>
              </button>
            ))}
          </div>
          
          {!readonly && (
            <Button onClick={() => onCreateActivity({})}>
              <Plus className="h-4 w-4 mr-2" />
              New Activity
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {(viewMode === 'list' || viewMode === 'timeline') && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Activity Types</option>
                <option value="call">Calls</option>
                <option value="email">Emails</option>
                <option value="meeting">Meetings</option>
                <option value="demo">Demos</option>
                <option value="proposal">Proposals</option>
                <option value="follow_up">Follow-ups</option>
                <option value="note">Notes</option>
              </select>
            </div>
            
            <div className="flex-1">
              <select
                value={filterOwner}
                onChange={(e) => setFilterOwner(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sales Reps</option>
                {Array.from(new Set(activities.map(a => a.ownerId))).map(ownerId => {
                  const owner = activities.find(a => a.ownerId === ownerId);
                  return (
                    <option key={ownerId} value={ownerId}>{owner?.ownerName}</option>
                  );
                })}
              </select>
            </div>
            
            <div className="flex-1">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setFilterType('');
                setFilterOwner('');
                setFilterDate('');
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === 'list' && <ListView />}
      {viewMode === 'timeline' && <TimelineView />}
      {viewMode === 'metrics' && <MetricsView />}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded border ${getActivityColor(selectedActivity.type)}`}>
                    {getActivityIcon(selectedActivity.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedActivity.title}</h3>
                    <p className="text-gray-600 capitalize">{selectedActivity.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedActivity(null)}
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
                    <h4 className="font-medium text-gray-900 mb-2">Activity Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="font-medium">
                          {formatDate(selectedActivity.date)} at {formatTime(selectedActivity.date)}
                        </span>
                      </div>
                      {selectedActivity.duration && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{formatDuration(selectedActivity.duration)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Owner:</span>
                        <span className="font-medium">{selectedActivity.ownerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className={`font-medium capitalize ${
                          selectedActivity.priority === 'urgent' ? 'text-red-600' :
                          selectedActivity.priority === 'high' ? 'text-orange-600' :
                          selectedActivity.priority === 'medium' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          {selectedActivity.priority}
                        </span>
                      </div>
                      {selectedActivity.outcome && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Outcome:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOutcomeColor(selectedActivity.outcome)}`}>
                            {selectedActivity.outcome.replace('_', ' ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedActivity.nextAction && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Next Action</h4>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="font-medium text-blue-900">{selectedActivity.nextAction.type}</div>
                        <div className="text-sm text-blue-700">{selectedActivity.nextAction.description}</div>
                        <div className="text-xs text-blue-600 mt-1">
                          Due: {formatDate(selectedActivity.nextAction.dueDate)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {(selectedActivity.accountName || selectedActivity.contactName || selectedActivity.dealTitle) && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Related Records</h4>
                      <div className="space-y-2 text-sm">
                        {selectedActivity.accountName && (
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Account:</span>
                            <span className="font-medium">{selectedActivity.accountName}</span>
                          </div>
                        )}
                        {selectedActivity.contactName && (
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Contact:</span>
                            <span className="font-medium">{selectedActivity.contactName}</span>
                          </div>
                        )}
                        {selectedActivity.dealTitle && (
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Deal:</span>
                            <span className="font-medium">{selectedActivity.dealTitle}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {selectedActivity.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedActivity.tags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedActivity.metadata && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Metadata</h4>
                      <div className="space-y-1 text-sm">
                        {selectedActivity.metadata.emailOpened !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email Opened:</span>
                            <span className={`font-medium ${selectedActivity.metadata.emailOpened ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedActivity.metadata.emailOpened ? 'Yes' : 'No'}
                            </span>
                          </div>
                        )}
                        {selectedActivity.metadata.emailClicked !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email Clicked:</span>
                            <span className={`font-medium ${selectedActivity.metadata.emailClicked ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedActivity.metadata.emailClicked ? 'Yes' : 'No'}
                            </span>
                          </div>
                        )}
                        {selectedActivity.metadata.callConnected !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Call Connected:</span>
                            <span className={`font-medium ${selectedActivity.metadata.callConnected ? 'text-green-600' : 'text-red-600'}`}>
                              {selectedActivity.metadata.callConnected ? 'Yes' : 'No'}
                            </span>
                          </div>
                        )}
                        {selectedActivity.metadata.meetingAttendees !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Meeting Attendees:</span>
                            <span className="font-medium">{selectedActivity.metadata.meetingAttendees}</span>
                          </div>
                        )}
                        {selectedActivity.metadata.proposalValue && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Proposal Value:</span>
                            <span className="font-medium">£{selectedActivity.metadata.proposalValue.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedActivity.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedActivity.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}