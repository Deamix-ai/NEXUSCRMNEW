import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Users,
  Clock,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  PieChart,
  Filter,
  Download,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Award,
  AlertTriangle,
  CheckCircle,
  Star,
  Zap,
  Eye,
  Settings
} from 'lucide-react';

interface PerformanceMetric {
  id: string;
  category: 'sales' | 'pipeline' | 'activity' | 'team' | 'customer';
  name: string;
  value: number;
  previousValue?: number;
  target?: number;
  unit: 'currency' | 'percentage' | 'number' | 'duration';
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  status: 'excellent' | 'good' | 'average' | 'needs_attention';
  description: string;
  benchmark?: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  metrics: {
    revenue: number;
    deals: number;
    conversionRate: number;
    activities: number;
    responseTime: number; // hours
  };
  targets: {
    revenue: number;
    deals: number;
    conversionRate: number;
  };
  performance: {
    rank: number;
    score: number; // 0-100
    trend: 'up' | 'down' | 'stable';
  };
}

interface PipelineMetric {
  stage: string;
  count: number;
  value: number;
  averageAge: number; // days
  conversionRate: number;
  velocity: number; // deals per week
}

interface ActivityMetric {
  type: 'calls' | 'emails' | 'meetings' | 'proposals';
  count: number;
  successRate: number;
  averageResponseTime: number; // hours
  trend: 'up' | 'down' | 'stable';
}

interface PerformanceAnalyticsProps {
  metrics: PerformanceMetric[];
  teamMembers: TeamMember[];
  pipelineMetrics: PipelineMetric[];
  activityMetrics: ActivityMetric[];
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onRefresh: () => void;
  readonly?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
    case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'average': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'needs_attention': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
    case 'stable': return <Activity className="h-4 w-4 text-gray-600" />;
    default: return <Activity className="h-4 w-4 text-gray-600" />;
  }
};

const formatValue = (value: number, unit: string) => {
  switch (unit) {
    case 'currency':
      return new Intl.NumberFormat('en-GB', { 
        style: 'currency', 
        currency: 'GBP',
        minimumFractionDigits: 0
      }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'duration':
      if (value < 1) return `${Math.round(value * 60)}m`;
      return `${value.toFixed(1)}h`;
    default:
      return new Intl.NumberFormat('en-GB').format(value);
  }
};

const getPerformanceLevel = (score: number) => {
  if (score >= 90) return { label: 'Excellent', color: 'text-green-600 bg-green-100' };
  if (score >= 75) return { label: 'Good', color: 'text-blue-600 bg-blue-100' };
  if (score >= 60) return { label: 'Average', color: 'text-yellow-600 bg-yellow-100' };
  return { label: 'Needs Improvement', color: 'text-red-600 bg-red-100' };
};

export function PerformanceAnalytics({ 
  metrics, 
  teamMembers, 
  pipelineMetrics, 
  activityMetrics,
  dateRange, 
  onDateRangeChange, 
  onRefresh, 
  readonly = false 
}: PerformanceAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'pipeline' | 'activities'>('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'performance' | 'revenue' | 'deals'>('performance');

  const categories = [
    { id: 'all', label: 'All Metrics' },
    { id: 'sales', label: 'Sales' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'activity', label: 'Activity' },
    { id: 'team', label: 'Team' },
    { id: 'customer', label: 'Customer' }
  ];

  const filteredMetrics = useMemo(() => {
    if (selectedCategory === 'all') return metrics;
    return metrics.filter(metric => metric.category === selectedCategory);
  }, [metrics, selectedCategory]);

  const sortedTeamMembers = useMemo(() => {
    return [...teamMembers].sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.metrics.revenue - a.metrics.revenue;
        case 'deals':
          return b.metrics.deals - a.metrics.deals;
        case 'performance':
        default:
          return b.performance.score - a.performance.score;
      }
    });
  }, [teamMembers, sortBy]);

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMetrics.slice(0, 8).map(metric => (
          <div key={metric.id} className={`bg-white rounded-lg border p-6 ${getStatusColor(metric.status)}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">{metric.name}</h3>
              {getTrendIcon(metric.trend)}
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                {formatValue(metric.value, metric.unit)}
              </div>
              
              <div className={`text-sm font-medium ${
                metric.changePercent > 0 ? 'text-green-600' : 
                metric.changePercent < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}% vs last period
              </div>
              
              {metric.target && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Target</span>
                    <span>{formatValue(metric.target, metric.unit)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        metric.value >= metric.target ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Performance Trends</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Performance trend chart would be displayed here</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Insights</h3>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">Top Performer</span>
              </div>
              <p className="text-sm text-green-700">
                {sortedTeamMembers[0]?.name} leading with {sortedTeamMembers[0]?.performance.score}% performance score
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-1">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Pipeline Health</span>
              </div>
              <p className="text-sm text-blue-700">
                {pipelineMetrics.reduce((sum, stage) => sum + stage.count, 0)} deals worth{' '}
                {formatValue(pipelineMetrics.reduce((sum, stage) => sum + stage.value, 0), 'currency')}
              </p>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-900">Attention Needed</span>
              </div>
              <p className="text-sm text-yellow-700">
                {metrics.filter(m => m.status === 'needs_attention').length} metrics below target
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TeamTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Team Performance</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="performance">Sort by Performance</option>
          <option value="revenue">Sort by Revenue</option>
          <option value="deals">Sort by Deals</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedTeamMembers.map((member, index) => {
          const performanceLevel = getPerformanceLevel(member.performance.score);
          const revenueProgress = (member.metrics.revenue / member.targets.revenue) * 100;
          const dealsProgress = (member.metrics.deals / member.targets.deals) * 100;
          
          return (
            <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${performanceLevel.color}`}>
                    #{member.performance.rank} • {performanceLevel.label}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {member.performance.score}% score
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Revenue</div>
                  <div className="font-semibold text-gray-900">
                    {formatValue(member.metrics.revenue, 'currency')}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="h-1.5 bg-green-500 rounded-full"
                      style={{ width: `${Math.min(revenueProgress, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {revenueProgress.toFixed(0)}% of target
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Deals</div>
                  <div className="font-semibold text-gray-900">
                    {member.metrics.deals}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="h-1.5 bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(dealsProgress, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {dealsProgress.toFixed(0)}% of target
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-gray-100">
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {member.metrics.conversionRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">Conversion Rate</div>
                </div>
                
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {member.metrics.activities}
                  </div>
                  <div className="text-xs text-gray-600">Activities</div>
                </div>
                
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {member.metrics.responseTime.toFixed(1)}h
                  </div>
                  <div className="text-xs text-gray-600">Avg Response</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const PipelineTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Pipeline Overview</h3>
          <div className="space-y-4">
            {pipelineMetrics.map(stage => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{stage.stage}</span>
                  <span className="text-sm text-gray-600">
                    {stage.count} deals • {formatValue(stage.value, 'currency')}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ 
                      width: `${Math.max((stage.value / Math.max(...pipelineMetrics.map(s => s.value))) * 100, 5)}%` 
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{stage.conversionRate.toFixed(1)}% conversion</span>
                  <span>{stage.averageAge} days avg age</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Pipeline Health Metrics</h3>
          <div className="space-y-6">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatValue(pipelineMetrics.reduce((sum, stage) => sum + stage.value, 0), 'currency')}
              </div>
              <div className="text-sm text-gray-600">Total Pipeline Value</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-gray-900">
                {pipelineMetrics.reduce((sum, stage) => sum + stage.count, 0)}
              </div>
              <div className="text-sm text-gray-600">Active Deals</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(pipelineMetrics.reduce((sum, stage) => sum + stage.conversionRate, 0) / pipelineMetrics.length).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Average Conversion Rate</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(pipelineMetrics.reduce((sum, stage) => sum + stage.averageAge, 0) / pipelineMetrics.length).toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Average Deal Age (days)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ActivitiesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activityMetrics.map(activity => (
          <div key={activity.type} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {activity.type === 'calls' && <Phone className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'emails' && <Mail className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'meetings' && <Calendar className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'proposals' && <Target className="h-4 w-4 text-blue-600" />}
                </div>
                <h3 className="font-medium text-gray-900 capitalize">{activity.type}</h3>
              </div>
              {getTrendIcon(activity.trend)}
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-gray-900">{activity.count}</div>
                <div className="text-sm text-gray-600">Total {activity.type}</div>
              </div>

              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {activity.successRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>

              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatValue(activity.averageResponseTime, 'duration')}
                </div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Activity Performance Comparison</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-2" />
            <p>Activity comparison chart would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          {!readonly && (
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      {activeTab === 'overview' && (
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'team', label: 'Team Performance', icon: Users },
            { id: 'pipeline', label: 'Pipeline Health', icon: Target },
            { id: 'activities', label: 'Activities', icon: Activity }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'team' && <TeamTab />}
      {activeTab === 'pipeline' && <PipelineTab />}
      {activeTab === 'activities' && <ActivitiesTab />}
    </div>
  );
}