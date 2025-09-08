'use client';

import React, { useState, useEffect } from 'react';

interface KPI {
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    color: string;
  }>;
}

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [revenueData, setRevenueData] = useState<ChartData | null>(null);
  const [conversionData, setConversionData] = useState<ChartData | null>(null);

  useEffect(() => {
    // Mock analytics data
    setKpis([
      {
        name: 'Total Revenue',
        value: '£147,250',
        change: 12.5,
        trend: 'up',
        icon: '💰'
      },
      {
        name: 'Lead Conversion',
        value: '24.8%',
        change: 5.2,
        trend: 'up',
        icon: '🎯'
      },
      {
        name: 'Avg. Project Value',
        value: '£8,450',
        change: -2.1,
        trend: 'down',
        icon: '📊'
      },
      {
        name: 'Customer Satisfaction',
        value: '4.7/5',
        change: 0.3,
        trend: 'up',
        icon: '⭐'
      },
      {
        name: 'Project Completion',
        value: '96.2%',
        change: 1.8,
        trend: 'up',
        icon: '✅'
      },
      {
        name: 'Response Time',
        value: '2.4 hrs',
        change: -15.3,
        trend: 'up',
        icon: '⚡'
      }
    ]);

    setRevenueData({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      datasets: [
        {
          label: 'Revenue',
          data: [15000, 18500, 22000, 19500, 25000, 28500, 24000, 31000, 29500],
          color: '#3B82F6'
        },
        {
          label: 'Target',
          data: [20000, 20000, 20000, 20000, 25000, 25000, 25000, 30000, 30000],
          color: '#EF4444'
        }
      ]
    });

    setConversionData({
      labels: ['Leads', 'Consultations', 'Quotes', 'Won'],
      datasets: [
        {
          label: 'This Month',
          data: [124, 67, 45, 28],
          color: '#10B981'
        },
        {
          label: 'Last Month',
          data: [98, 52, 38, 21],
          color: '#6B7280'
        }
      ]
    });
  }, [timeRange]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Business Analytics</h1>
            <div className="flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{kpi.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{kpi.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center text-sm font-medium ${getTrendColor(kpi.trend)}`}>
                  <span className="mr-1">{getTrendIcon(kpi.trend)}</span>
                  {Math.abs(kpi.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {revenueData?.labels.map((label, index) => {
                const revenueValue = revenueData.datasets[0].data[index];
                const targetValue = revenueData.datasets[1].data[index];
                const maxValue = Math.max(...revenueData.datasets.flatMap(d => d.data));
                const revenueHeight = (revenueValue / maxValue) * 200;
                const targetHeight = (targetValue / maxValue) * 200;
                
                return (
                  <div key={label} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full mb-2" style={{ height: '200px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-blue-500 rounded-t"
                        style={{ height: `${revenueHeight}px` }}
                        title={`Revenue: £${revenueValue.toLocaleString()}`}
                      />
                      <div
                        className="absolute bottom-0 w-full border-2 border-red-500 border-dashed"
                        style={{ height: `${targetHeight}px` }}
                        title={`Target: £${targetValue.toLocaleString()}`}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{label}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 border-2 border-red-500 border-dashed rounded mr-2"></div>
                <span className="text-sm text-gray-600">Target</span>
              </div>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
            <div className="space-y-4">
              {conversionData?.labels.map((label, index) => {
                const thisMonth = conversionData.datasets[0].data[index];
                const lastMonth = conversionData.datasets[1].data[index];
                const maxValue = Math.max(...conversionData.datasets[0].data);
                const width = (thisMonth / maxValue) * 100;
                const change = ((thisMonth - lastMonth) / lastMonth) * 100;
                
                return (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900 font-medium">{thisMonth}</span>
                        <span className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Services */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Services</h3>
            <div className="space-y-4">
              {[
                { name: 'Bathroom Renovation', revenue: 89500, projects: 12 },
                { name: 'Kitchen Installation', revenue: 67200, projects: 8 },
                { name: 'Wet Room Conversion', revenue: 45800, projects: 15 },
                { name: 'Boiler Replacement', revenue: 23400, projects: 18 },
                { name: 'Tiling Services', revenue: 18600, projects: 22 }
              ].map((service, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-600">{service.projects} projects</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">£{service.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Insights */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600">Repeat Customers</div>
                <div className="text-2xl font-bold text-green-600">32%</div>
                <div className="text-xs text-gray-500">+8% from last month</div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600">Avg. Customer Lifetime Value</div>
                <div className="text-2xl font-bold text-blue-600">£12,450</div>
                <div className="text-xs text-gray-500">+15% from last quarter</div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-600">Referral Rate</div>
                <div className="text-2xl font-bold text-purple-600">18%</div>
                <div className="text-xs text-gray-500">+3% from last month</div>
              </div>
            </div>
          </div>

          {/* Team Performance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
            <div className="space-y-4">
              {[
                { name: 'Mike Johnson', role: 'Senior Installer', efficiency: 96, projects: 8 },
                { name: 'Sarah Wilson', role: 'Project Manager', efficiency: 94, projects: 12 },
                { name: 'Tom Brown', role: 'Designer', efficiency: 91, projects: 15 },
                { name: 'Lisa Davis', role: 'Sales Consultant', efficiency: 89, projects: 24 }
              ].map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{member.efficiency}%</div>
                    <div className="text-xs text-gray-500">{member.projects} projects</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Business Activity</h3>
          <div className="space-y-3">
            {[
              { time: '2 minutes ago', event: 'New lead generated from website contact form', type: 'lead' },
              { time: '15 minutes ago', event: 'Payment received: £2,450 from John Smith', type: 'payment' },
              { time: '1 hour ago', event: 'Project "Modern Bathroom Suite" marked as completed', type: 'project' },
              { time: '2 hours ago', event: 'Quote sent to Emma Davis for kitchen renovation', type: 'quote' },
              { time: '3 hours ago', event: 'New 5-star review received on Google', type: 'review' },
              { time: '4 hours ago', event: 'Consultation scheduled with Michael Brown for next Tuesday', type: 'booking' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'lead' ? 'bg-blue-500' :
                  activity.type === 'payment' ? 'bg-green-500' :
                  activity.type === 'project' ? 'bg-purple-500' :
                  activity.type === 'quote' ? 'bg-yellow-500' :
                  activity.type === 'review' ? 'bg-pink-500' : 'bg-gray-500'
                }`}></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">{activity.event}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
