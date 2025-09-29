import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Calendar,
  MessageSquare,
  Star,
  Award,
  Target,
  Activity
} from 'lucide-react';

interface AccountHealthMetrics {
  overallScore: number;
  lastUpdated: string;
  metrics: {
    financial: {
      score: number;
      revenue: number;
      profitMargin: number;
      paymentHistory: 'excellent' | 'good' | 'fair' | 'poor';
      outstandingInvoices: number;
      trend: 'up' | 'down' | 'stable';
    };
    engagement: {
      score: number;
      lastContactDate: string;
      contactFrequency: number; // contacts per month
      responseRate: number; // percentage
      meetingsHeld: number;
      trend: 'up' | 'down' | 'stable';
    };
    satisfaction: {
      score: number;
      surveyScore?: number;
      complaints: number;
      compliments: number;
      renewalLikelihood: number; // percentage
      trend: 'up' | 'down' | 'stable';
    };
    growth: {
      score: number;
      revenueGrowth: number; // percentage
      projectsGrowth: number; // percentage
      potentialValue: number;
      expansionOpportunities: number;
      trend: 'up' | 'down' | 'stable';
    };
    risk: {
      score: number;
      churnRisk: number; // percentage
      competitorThreats: number;
      contractExpiry: string;
      supportTickets: number;
      trend: 'up' | 'down' | 'stable';
    };
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    reason: string;
    impact: string;
  }[];
}

interface AccountHealthProps {
  accountId: string;
  metrics?: AccountHealthMetrics;
  onRefresh?: () => void;
  compact?: boolean;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600 bg-green-100';
  if (score >= 60) return 'text-yellow-600 bg-yellow-100';
  if (score >= 40) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};

const getScoreIcon = (score: number) => {
  if (score >= 80) return <CheckCircle className="h-5 w-5" />;
  if (score >= 60) return <Clock className="h-5 w-5" />;
  return <AlertTriangle className="h-5 w-5" />;
};

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <Minus className="h-4 w-4 text-gray-400" />;
  }
};

const getRiskLevel = (score: number) => {
  if (score >= 80) return { level: 'Low Risk', color: 'text-green-600 bg-green-100' };
  if (score >= 60) return { level: 'Medium Risk', color: 'text-yellow-600 bg-yellow-100' };
  if (score >= 40) return { level: 'High Risk', color: 'text-orange-600 bg-orange-100' };
  return { level: 'Critical Risk', color: 'text-red-600 bg-red-100' };
};

// Mock data for demonstration
const mockMetrics: AccountHealthMetrics = {
  overallScore: 72,
  lastUpdated: new Date().toISOString(),
  metrics: {
    financial: {
      score: 85,
      revenue: 125000,
      profitMargin: 23.5,
      paymentHistory: 'excellent',
      outstandingInvoices: 2500,
      trend: 'up'
    },
    engagement: {
      score: 68,
      lastContactDate: '2024-01-15',
      contactFrequency: 3.2,
      responseRate: 85,
      meetingsHeld: 4,
      trend: 'stable'
    },
    satisfaction: {
      score: 78,
      surveyScore: 8.2,
      complaints: 1,
      compliments: 5,
      renewalLikelihood: 87,
      trend: 'up'
    },
    growth: {
      score: 65,
      revenueGrowth: 12.5,
      projectsGrowth: 8.3,
      potentialValue: 50000,
      expansionOpportunities: 3,
      trend: 'up'
    },
    risk: {
      score: 75,
      churnRisk: 15,
      competitorThreats: 2,
      contractExpiry: '2024-12-31',
      supportTickets: 3,
      trend: 'stable'
    }
  },
  recommendations: [
    {
      priority: 'high',
      action: 'Schedule quarterly business review',
      reason: 'Last meeting was 3 months ago',
      impact: 'Improve engagement and identify expansion opportunities'
    },
    {
      priority: 'medium',
      action: 'Follow up on outstanding invoices',
      reason: '£2,500 overdue payments',
      impact: 'Improve cash flow and payment relationship'
    },
    {
      priority: 'low',
      action: 'Send customer satisfaction survey',
      reason: 'No recent feedback collected',
      impact: 'Monitor satisfaction levels and identify issues early'
    }
  ]
};

export function AccountHealth({ accountId, metrics = mockMetrics, onRefresh, compact = false }: AccountHealthProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'recommendations'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const MetricCard = ({ 
    title, 
    score, 
    icon, 
    trend, 
    children 
  }: { 
    title: string; 
    score: number; 
    icon: React.ReactNode; 
    trend: 'up' | 'down' | 'stable';
    children: React.ReactNode; 
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-gray-600">{icon}</div>
          <h4 className="font-medium text-gray-900">{title}</h4>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
            {score}
          </span>
          {getTrendIcon(trend)}
        </div>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        {children}
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span>Account Health</span>
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(metrics.overallScore)}`}>
              {metrics.overallScore}/100
            </span>
            {getScoreIcon(metrics.overallScore)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{metrics.metrics.financial.score}</div>
            <div className="text-xs text-gray-500">Financial</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{metrics.metrics.engagement.score}</div>
            <div className="text-xs text-gray-500">Engagement</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{metrics.metrics.satisfaction.score}</div>
            <div className="text-xs text-gray-500">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{metrics.metrics.growth.score}</div>
            <div className="text-xs text-gray-500">Growth</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{metrics.metrics.risk.score}</div>
            <div className="text-xs text-gray-500">Risk</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Account Health Score</h3>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(metrics.lastUpdated).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(metrics.overallScore).split(' ')[0]}`}>
                {metrics.overallScore}
              </div>
              <div className="text-sm text-gray-500">Overall Score</div>
            </div>
            <div className={`p-2 rounded-full ${getScoreColor(metrics.overallScore)}`}>
              {getScoreIcon(metrics.overallScore)}
            </div>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <Activity className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'details', label: 'Details' },
            { id: 'recommendations', label: 'Recommendations' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Financial Health"
              score={metrics.metrics.financial.score}
              icon={<DollarSign className="h-5 w-5" />}
              trend={metrics.metrics.financial.trend}
            >
              <div>Revenue: {formatCurrency(metrics.metrics.financial.revenue)}</div>
              <div>Profit Margin: {metrics.metrics.financial.profitMargin}%</div>
              <div>Payment History: {metrics.metrics.financial.paymentHistory}</div>
              <div>Outstanding: {formatCurrency(metrics.metrics.financial.outstandingInvoices)}</div>
            </MetricCard>

            <MetricCard
              title="Engagement"
              score={metrics.metrics.engagement.score}
              icon={<MessageSquare className="h-5 w-5" />}
              trend={metrics.metrics.engagement.trend}
            >
              <div>Last Contact: {new Date(metrics.metrics.engagement.lastContactDate).toLocaleDateString()}</div>
              <div>Monthly Contacts: {metrics.metrics.engagement.contactFrequency}</div>
              <div>Response Rate: {metrics.metrics.engagement.responseRate}%</div>
              <div>Meetings: {metrics.metrics.engagement.meetingsHeld} this quarter</div>
            </MetricCard>

            <MetricCard
              title="Satisfaction"
              score={metrics.metrics.satisfaction.score}
              icon={<Star className="h-5 w-5" />}
              trend={metrics.metrics.satisfaction.trend}
            >
              <div>Survey Score: {metrics.metrics.satisfaction.surveyScore}/10</div>
              <div>Complaints: {metrics.metrics.satisfaction.complaints}</div>
              <div>Compliments: {metrics.metrics.satisfaction.compliments}</div>
              <div>Renewal Likelihood: {metrics.metrics.satisfaction.renewalLikelihood}%</div>
            </MetricCard>

            <MetricCard
              title="Growth Potential"
              score={metrics.metrics.growth.score}
              icon={<TrendingUp className="h-5 w-5" />}
              trend={metrics.metrics.growth.trend}
            >
              <div>Revenue Growth: {formatPercentage(metrics.metrics.growth.revenueGrowth)}</div>
              <div>Project Growth: {formatPercentage(metrics.metrics.growth.projectsGrowth)}</div>
              <div>Potential Value: {formatCurrency(metrics.metrics.growth.potentialValue)}</div>
              <div>Opportunities: {metrics.metrics.growth.expansionOpportunities}</div>
            </MetricCard>

            <MetricCard
              title="Risk Assessment"
              score={metrics.metrics.risk.score}
              icon={<AlertTriangle className="h-5 w-5" />}
              trend={metrics.metrics.risk.trend}
            >
              <div>Churn Risk: {metrics.metrics.risk.churnRisk}%</div>
              <div>Competitor Threats: {metrics.metrics.risk.competitorThreats}</div>
              <div>Contract Expires: {new Date(metrics.metrics.risk.contractExpiry).toLocaleDateString()}</div>
              <div>Support Tickets: {metrics.metrics.risk.supportTickets}</div>
            </MetricCard>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Award className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Risk Level</h4>
              </div>
              <div className="space-y-2">
                <div className={`px-3 py-2 rounded-full text-sm font-medium ${getRiskLevel(metrics.overallScore).color}`}>
                  {getRiskLevel(metrics.overallScore).level}
                </div>
                <p className="text-sm text-blue-700">
                  Based on overall health score of {metrics.overallScore}/100
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-4">Recommended Actions</h4>
            {metrics.recommendations.map((rec, index) => (
              <div 
                key={index}
                className={`border-l-4 p-4 bg-gray-50 rounded-r-lg ${
                  rec.priority === 'high' ? 'border-red-400' :
                  rec.priority === 'medium' ? 'border-yellow-400' :
                  'border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rec.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <h5 className="font-medium text-gray-900 mb-1">{rec.action}</h5>
                    <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                    <p className="text-sm text-gray-500 italic">{rec.impact}</p>
                  </div>
                  <Target className="h-5 w-5 text-gray-400 ml-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}