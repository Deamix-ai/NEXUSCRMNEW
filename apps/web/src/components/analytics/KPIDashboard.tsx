import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Calendar,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Filter,
  Download,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Eye,
  Settings,
  Zap,
  Award
} from 'lucide-react';

interface KPIMetric {
  id: string;
  title: string;
  value: number | string;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  target?: number;
  unit?: 'currency' | 'percentage' | 'number' | 'duration';
  format?: string;
  category: 'sales' | 'pipeline' | 'activity' | 'performance' | 'customer';
  trend?: number[]; // Last 7 data points for sparkline
  status?: 'good' | 'warning' | 'critical';
  description?: string;
}

interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  data: any[];
  category: 'sales' | 'pipeline' | 'activity' | 'performance' | 'customer';
}

interface KPIDashboardProps {
  metrics: KPIMetric[];
  charts: ChartData[];
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onRefresh: () => void;
  readonly?: boolean;
}

const formatValue = (value: number | string, unit?: string, format?: string) => {
  if (typeof value === 'string') return value;
  
  switch (unit) {
    case 'currency':
      return new Intl.NumberFormat('en-GB', { 
        style: 'currency', 
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'duration':
      if (value < 60) return `${value}s`;
      if (value < 3600) return `${Math.floor(value / 60)}m`;
      return `${Math.floor(value / 3600)}h ${Math.floor((value % 3600) / 60)}m`;
    default:
      return new Intl.NumberFormat('en-GB').format(value);
  }
};

const getChangeIcon = (changeType?: string, change?: number) => {
  if (!change || !changeType) return null;
  
  return changeType === 'increase' ? (
    <TrendingUp className="h-4 w-4 text-green-600" />
  ) : (
    <TrendingDown className="h-4 w-4 text-red-600" />
  );
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'good': return 'text-green-600 bg-green-50 border-green-200';
    case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'critical': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-blue-600 bg-blue-50 border-blue-200';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'sales': return <DollarSign className="h-5 w-5" />;
    case 'pipeline': return <Target className="h-5 w-5" />;
    case 'activity': return <Activity className="h-5 w-5" />;
    case 'performance': return <BarChart3 className="h-5 w-5" />;
    case 'customer': return <Users className="h-5 w-5" />;
    default: return <BarChart3 className="h-5 w-5" />;
  }
};

export function KPIDashboard({ 
  metrics, 
  charts, 
  dateRange, 
  onDateRangeChange, 
  onRefresh, 
  readonly = false 
}: KPIDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showTrends, setShowTrends] = useState(true);

  const categories = [
    { id: 'all', label: 'All Metrics', icon: BarChart3 },
    { id: 'sales', label: 'Sales', icon: DollarSign },
    { id: 'pipeline', label: 'Pipeline', icon: Target },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'performance', label: 'Performance', icon: Award },
    { id: 'customer', label: 'Customer', icon: Users }
  ];

  const filteredMetrics = useMemo(() => {
    if (selectedCategory === 'all') return metrics;
    return metrics.filter(metric => metric.category === selectedCategory);
  }, [metrics, selectedCategory]);

  const summaryStats = useMemo(() => {
    const totalRevenue = metrics.find(m => m.id === 'total_revenue')?.value as number || 0;
    const totalDeals = metrics.find(m => m.id === 'total_deals')?.value as number || 0;
    const conversionRate = metrics.find(m => m.id === 'conversion_rate')?.value as number || 0;
    const averageDealSize = totalDeals > 0 ? totalRevenue / totalDeals : 0;
    
    return {
      totalRevenue,
      totalDeals,
      conversionRate,
      averageDealSize
    };
  }, [metrics]);

  const MetricCard = ({ metric }: { metric: KPIMetric }) => (
    <div className={`bg-white rounded-lg border p-6 hover:shadow-md transition-shadow ${
      metric.status ? `border-l-4 ${getStatusColor(metric.status)}` : 'border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${
            metric.category === 'sales' ? 'bg-green-100 text-green-600' :
            metric.category === 'pipeline' ? 'bg-blue-100 text-blue-600' :
            metric.category === 'activity' ? 'bg-purple-100 text-purple-600' :
            metric.category === 'performance' ? 'bg-orange-100 text-orange-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            {getCategoryIcon(metric.category)}
          </div>
          <h3 className="font-medium text-gray-900">{metric.title}</h3>
        </div>
        
        {!readonly && (
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">
            {formatValue(metric.value, metric.unit, metric.format)}
          </span>
          
          {metric.change !== undefined && (
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {getChangeIcon(metric.changeType, metric.change)}
              <span>{Math.abs(metric.change).toFixed(1)}%</span>
            </div>
          )}
        </div>

        {metric.target && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Target</span>
              <span className="font-medium">
                {formatValue(metric.target, metric.unit, metric.format)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  (metric.value as number) >= metric.target ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ 
                  width: `${Math.min(((metric.value as number) / metric.target) * 100, 100)}%` 
                }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {(((metric.value as number) / metric.target) * 100).toFixed(1)}% of target
            </div>
          </div>
        )}

        {metric.trend && showTrends && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>7-day trend</span>
              <span className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Trend</span>
              </span>
            </div>
            <div className="h-8 bg-gray-50 rounded flex items-end space-x-1">
              {metric.trend.map((value, index) => (
                <div
                  key={index}
                  className="bg-blue-300 rounded-sm flex-1"
                  style={{ 
                    height: `${(value / Math.max(...metric.trend!)) * 100}%`,
                    minHeight: '2px'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {metric.description && (
          <p className="text-sm text-gray-600">{metric.description}</p>
        )}

        {metric.previousValue && (
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            Previous: {formatValue(metric.previousValue, metric.unit, metric.format)}
          </div>
        )}
      </div>
    </div>
  );

  const QuickInsights = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Quick Insights</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="p-2 bg-green-100 rounded-full">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <div className="font-medium text-green-900">Strong Sales Performance</div>
            <div className="text-sm text-green-700">
              Revenue increased by 15% this month compared to last month
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="p-2 bg-yellow-100 rounded-full">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </div>
          <div>
            <div className="font-medium text-yellow-900">Pipeline Attention Needed</div>
            <div className="text-sm text-yellow-700">
              12 deals in pipeline for over 30 days without activity
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="p-2 bg-blue-100 rounded-full">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-blue-900">Customer Engagement Up</div>
            <div className="text-sm text-blue-700">
              Email response rates improved by 8% this quarter
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="p-2 bg-purple-100 rounded-full">
            <Target className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <div className="font-medium text-purple-900">Goal Achievement</div>
            <div className="text-sm text-purple-700">
              Monthly revenue target achieved 5 days ahead of schedule
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SummaryCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100">Total Revenue</p>
            <p className="text-3xl font-bold">
              {formatValue(summaryStats.totalRevenue, 'currency')}
            </p>
          </div>
          <DollarSign className="h-8 w-8 text-green-200" />
        </div>
        <div className="mt-4 flex items-center text-green-100">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm">+12% from last month</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100">Total Deals</p>
            <p className="text-3xl font-bold">
              {formatValue(summaryStats.totalDeals, 'number')}
            </p>
          </div>
          <Target className="h-8 w-8 text-blue-200" />
        </div>
        <div className="mt-4 flex items-center text-blue-100">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm">+8% from last month</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100">Conversion Rate</p>
            <p className="text-3xl font-bold">
              {formatValue(summaryStats.conversionRate, 'percentage')}
            </p>
          </div>
          <Activity className="h-8 w-8 text-purple-200" />
        </div>
        <div className="mt-4 flex items-center text-purple-100">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm">+2.3% from last month</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100">Avg Deal Size</p>
            <p className="text-3xl font-bold">
              {formatValue(summaryStats.averageDealSize, 'currency')}
            </p>
          </div>
          <Award className="h-8 w-8 text-orange-200" />
        </div>
        <div className="mt-4 flex items-center text-orange-100">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm">+5% from last month</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">KPI Dashboard</h2>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {filteredMetrics.length} metrics
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: 'grid', label: 'Grid', icon: BarChart3 },
              { id: 'list', label: 'List', icon: Activity }
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
                <view.icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          {!readonly && (
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <category.icon className="h-4 w-4" />
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Metrics */}
        <div className="lg:col-span-3">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMetrics.map(metric => (
                <MetricCard key={metric.id} metric={metric} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4">Metric</th>
                      <th className="text-left p-4">Value</th>
                      <th className="text-left p-4">Change</th>
                      <th className="text-left p-4">Target</th>
                      <th className="text-left p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMetrics.map(metric => (
                      <tr key={metric.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded ${
                              metric.category === 'sales' ? 'bg-green-100 text-green-600' :
                              metric.category === 'pipeline' ? 'bg-blue-100 text-blue-600' :
                              metric.category === 'activity' ? 'bg-purple-100 text-purple-600' :
                              metric.category === 'performance' ? 'bg-orange-100 text-orange-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {getCategoryIcon(metric.category)}
                            </div>
                            <span className="font-medium text-gray-900">{metric.title}</span>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-gray-900">
                          {formatValue(metric.value, metric.unit, metric.format)}
                        </td>
                        <td className="p-4">
                          {metric.change !== undefined && (
                            <div className={`flex items-center space-x-1 ${
                              metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {getChangeIcon(metric.changeType, metric.change)}
                              <span>{Math.abs(metric.change).toFixed(1)}%</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          {metric.target && (
                            <span className="text-gray-900">
                              {formatValue(metric.target, metric.unit, metric.format)}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {metric.status && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              metric.status === 'good' ? 'bg-green-100 text-green-700' :
                              metric.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {metric.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredMetrics.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No metrics found</h3>
              <p className="text-gray-600">Try selecting a different category or date range.</p>
            </div>
          )}
        </div>

        {/* Quick Insights Sidebar */}
        <div className="lg:col-span-1">
          <QuickInsights />
        </div>
      </div>

      {/* Options */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={showTrends}
              onChange={(e) => setShowTrends(e.target.checked)}
              className="rounded border-gray-300" 
            />
            <span className="text-sm text-gray-700">Show trend lines</span>
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Full Report
          </Button>
        </div>
      </div>
    </div>
  );
}