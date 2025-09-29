import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Calendar,
  DollarSign,
  Target,
  BarChart3,
  LineChart,
  PieChart,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  Users,
  Clock,
  Percent
} from 'lucide-react';

interface ForecastData {
  period: string;
  periodType: 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  forecast: {
    bestCase: number;
    mostLikely: number;
    worstCase: number;
    confidence: 'high' | 'medium' | 'low';
    deals: {
      total: number;
      closing: number;
      averageValue: number;
    };
  };
  actual?: number;
  variance?: number;
  accuracy?: number;
}

interface ForecastBreakdown {
  byStage: {
    stageId: string;
    stageName: string;
    dealCount: number;
    totalValue: number;
    weightedValue: number;
    probability: number;
    contribution: number;
  }[];
  byOwner: {
    ownerId: string;
    ownerName: string;
    dealCount: number;
    totalValue: number;
    weightedValue: number;
    quota: number;
    achievement: number;
    confidence: 'high' | 'medium' | 'low';
  }[];
  byProduct: {
    productId: string;
    productName: string;
    dealCount: number;
    totalValue: number;
    avgDealSize: number;
    growthRate: number;
  }[];
  risks: {
    type: 'stagnant' | 'competitor' | 'budget' | 'timing' | 'authority';
    description: string;
    impact: 'high' | 'medium' | 'low';
    probability: number;
    deals: string[];
    mitigation?: string;
  }[];
}

interface DealForecastingProps {
  forecasts: ForecastData[];
  breakdown: ForecastBreakdown;
  onUpdateForecast: (period: string, updates: Partial<ForecastData>) => void;
  onExportForecast: (period: string) => void;
  readonly?: boolean;
}

const getConfidenceColor = (confidence: string) => {
  switch (confidence) {
    case 'high': return 'text-green-600 bg-green-50 border-green-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getRiskColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'border-red-500 bg-red-50';
    case 'medium': return 'border-yellow-500 bg-yellow-50';
    case 'low': return 'border-blue-500 bg-blue-50';
    default: return 'border-gray-300 bg-gray-50';
  }
};

export function DealForecasting({ 
  forecasts, 
  breakdown, 
  onUpdateForecast, 
  onExportForecast, 
  readonly = false 
}: DealForecastingProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(forecasts[0]?.period || '');
  const [viewType, setViewType] = useState<'summary' | 'breakdown' | 'risks'>('summary');
  const [periodFilter, setPeriodFilter] = useState<'month' | 'quarter' | 'year'>('month');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      notation: 'compact'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const filteredForecasts = useMemo(() => {
    return forecasts.filter(f => f.periodType === periodFilter);
  }, [forecasts, periodFilter]);

  const selectedForecast = forecasts.find(f => f.period === selectedPeriod);

  const ForecastSummary = () => (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Forecast Periods</h3>
          <div className="flex space-x-2">
            {['month', 'quarter', 'year'].map(period => (
              <button
                key={period}
                onClick={() => setPeriodFilter(period as any)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  periodFilter === period
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredForecasts.map(forecast => (
            <div
              key={forecast.period}
              onClick={() => setSelectedPeriod(forecast.period)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedPeriod === forecast.period
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{forecast.period}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                  getConfidenceColor(forecast.forecast.confidence)
                }`}>
                  {forecast.forecast.confidence}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Most Likely:</span>
                  <span className="font-medium">{formatCurrency(forecast.forecast.mostLikely)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Range:</span>
                  <span className="text-gray-600">
                    {formatCurrency(forecast.forecast.worstCase)} - {formatCurrency(forecast.forecast.bestCase)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deals:</span>
                  <span className="font-medium">{forecast.forecast.deals.closing}/{forecast.forecast.deals.total}</span>
                </div>
                
                {forecast.actual !== undefined && (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Actual:</span>
                      <span className={`font-medium ${
                        (forecast.variance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(forecast.actual)}
                      </span>
                    </div>
                    
                    {forecast.variance !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Variance:</span>
                        <span className={`font-medium ${
                          forecast.variance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {forecast.variance >= 0 ? '+' : ''}{formatPercentage(forecast.variance)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Period Detail */}
      {selectedForecast && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">{selectedForecast.period} Forecast</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => onExportForecast(selectedForecast.period)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {!readonly && (
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recalculate
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Forecast Scenarios */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Forecast Scenarios</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Best Case</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {formatCurrency(selectedForecast.forecast.bestCase)}
                  </div>
                  <div className="text-sm text-green-700">
                    90% probability range
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Most Likely</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatCurrency(selectedForecast.forecast.mostLikely)}
                  </div>
                  <div className="text-sm text-blue-700">
                    Expected outcome
                  </div>
                </div>
                
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-900">Worst Case</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-900">
                    {formatCurrency(selectedForecast.forecast.worstCase)}
                  </div>
                  <div className="text-sm text-orange-700">
                    10% probability range
                  </div>
                </div>
              </div>
            </div>

            {/* Deal Metrics */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Deal Metrics</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Total Deals</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {selectedForecast.forecast.deals.total}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Expected to Close</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {selectedForecast.forecast.deals.closing}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Average Deal Size</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(selectedForecast.forecast.deals.averageValue)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Percent className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Close Rate</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatPercentage((selectedForecast.forecast.deals.closing / selectedForecast.forecast.deals.total) * 100)}
                  </span>
                </div>
              </div>
            </div>

            {/* Confidence Indicators */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Confidence Analysis</h4>
              
              <div className={`p-4 border rounded-lg ${getConfidenceColor(selectedForecast.forecast.confidence)}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {selectedForecast.forecast.confidence === 'high' && <CheckCircle className="h-5 w-5" />}
                  {selectedForecast.forecast.confidence === 'medium' && <Clock className="h-5 w-5" />}
                  {selectedForecast.forecast.confidence === 'low' && <AlertCircle className="h-5 w-5" />}
                  <span className="font-medium capitalize">
                    {selectedForecast.forecast.confidence} Confidence
                  </span>
                </div>
                
                <div className="text-sm space-y-1">
                  {selectedForecast.forecast.confidence === 'high' && (
                    <div>
                      <p>Strong pipeline with qualified deals</p>
                      <p>Historical accuracy: 85-95%</p>
                      <p>Low variance expected</p>
                    </div>
                  )}
                  {selectedForecast.forecast.confidence === 'medium' && (
                    <div>
                      <p>Moderate pipeline strength</p>
                      <p>Historical accuracy: 70-84%</p>
                      <p>Some deals may slip</p>
                    </div>
                  )}
                  {selectedForecast.forecast.confidence === 'low' && (
                    <div>
                      <p>Pipeline needs attention</p>
                      <p>Historical accuracy: &lt;70%</p>
                      <p>High variance risk</p>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedForecast.accuracy !== undefined && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Historical Accuracy</div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatPercentage(selectedForecast.accuracy)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Based on last 12 months
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const BreakdownView = () => (
    <div className="space-y-6">
      {/* By Stage */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Forecast by Stage</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Stage</th>
                <th className="text-right p-3">Deals</th>
                <th className="text-right p-3">Total Value</th>
                <th className="text-right p-3">Weighted Value</th>
                <th className="text-right p-3">Probability</th>
                <th className="text-right p-3">Contribution</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.byStage.map(stage => (
                <tr key={stage.stageId} className="border-t">
                  <td className="p-3 font-medium">{stage.stageName}</td>
                  <td className="p-3 text-right">{stage.dealCount}</td>
                  <td className="p-3 text-right">{formatCurrency(stage.totalValue)}</td>
                  <td className="p-3 text-right font-medium">{formatCurrency(stage.weightedValue)}</td>
                  <td className="p-3 text-right">{formatPercentage(stage.probability)}</td>
                  <td className="p-3 text-right">{formatPercentage(stage.contribution)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* By Owner */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Forecast by Sales Rep</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Sales Rep</th>
                <th className="text-right p-3">Deals</th>
                <th className="text-right p-3">Forecast</th>
                <th className="text-right p-3">Quota</th>
                <th className="text-right p-3">Achievement</th>
                <th className="text-right p-3">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.byOwner.map(owner => (
                <tr key={owner.ownerId} className="border-t">
                  <td className="p-3 font-medium">{owner.ownerName}</td>
                  <td className="p-3 text-right">{owner.dealCount}</td>
                  <td className="p-3 text-right">{formatCurrency(owner.weightedValue)}</td>
                  <td className="p-3 text-right">{formatCurrency(owner.quota)}</td>
                  <td className={`p-3 text-right font-medium ${
                    owner.achievement >= 100 ? 'text-green-600' :
                    owner.achievement >= 80 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(owner.achievement)}
                  </td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getConfidenceColor(owner.confidence)
                    }`}>
                      {owner.confidence}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* By Product */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Forecast by Product/Service</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Product/Service</th>
                <th className="text-right p-3">Deals</th>
                <th className="text-right p-3">Total Value</th>
                <th className="text-right p-3">Avg Deal Size</th>
                <th className="text-right p-3">Growth Rate</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.byProduct.map(product => (
                <tr key={product.productId} className="border-t">
                  <td className="p-3 font-medium">{product.productName}</td>
                  <td className="p-3 text-right">{product.dealCount}</td>
                  <td className="p-3 text-right">{formatCurrency(product.totalValue)}</td>
                  <td className="p-3 text-right">{formatCurrency(product.avgDealSize)}</td>
                  <td className={`p-3 text-right font-medium ${
                    product.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.growthRate >= 0 ? '+' : ''}{formatPercentage(product.growthRate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const RisksView = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Forecast Risks</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <AlertCircle className="h-4 w-4" />
          <span>{breakdown.risks.length} risks identified</span>
        </div>
      </div>

      <div className="space-y-4">
        {breakdown.risks.map((risk, index) => (
          <div key={index} className={`border rounded-lg p-4 ${getRiskColor(risk.impact)}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    risk.impact === 'high' ? 'bg-red-100 text-red-700' :
                    risk.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {risk.impact.toUpperCase()} IMPACT
                  </span>
                  <span className="text-sm font-medium capitalize">
                    {risk.type.replace('_', ' ')} Risk
                  </span>
                </div>
                <p className="text-sm text-gray-700">{risk.description}</p>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {formatPercentage(risk.probability)} probability
                </div>
                <div className="text-xs text-gray-600">
                  {risk.deals.length} deals affected
                </div>
              </div>
            </div>
            
            {risk.mitigation && (
              <div className="mt-3 p-3 bg-white bg-opacity-50 rounded border">
                <div className="text-xs font-medium text-gray-700 mb-1">Mitigation Strategy</div>
                <div className="text-sm text-gray-600">{risk.mitigation}</div>
              </div>
            )}
          </div>
        ))}
        
        {breakdown.risks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
            <div className="text-sm">No significant risks identified</div>
            <div className="text-xs text-gray-400">Forecast appears stable</div>
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
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Sales Forecasting</h2>
        </div>
        
        <div className="flex space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: 'summary', label: 'Summary', icon: BarChart3 },
              { id: 'breakdown', label: 'Breakdown', icon: PieChart },
              { id: 'risks', label: 'Risks', icon: AlertCircle }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setViewType(view.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewType === view.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <view.icon className="h-4 w-4" />
                <span>{view.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {viewType === 'summary' && <ForecastSummary />}
      {viewType === 'breakdown' && <BreakdownView />}
      {viewType === 'risks' && <RisksView />}
    </div>
  );
}