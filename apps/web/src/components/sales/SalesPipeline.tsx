import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Clock,
  User,
  Building,
  Plus,
  Edit,
  Trash2,
  Settings,
  Calendar,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  MoreHorizontal,
  Filter,
  Search,
  X
} from 'lucide-react';

interface PipelineStage {
  id: string;
  name: string;
  description: string;
  order: number;
  probability: number; // 0-100
  color: string;
  isActive: boolean;
  automations?: {
    onEnter?: string[];
    onExit?: string[];
    onStagnant?: string[]; // Actions when deal stays too long
  };
  stagnationDays: number; // Days before considered stagnant
}

interface Deal {
  id: string;
  title: string;
  description?: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  actualCloseDate?: string;
  stageId: string;
  accountId: string;
  accountName: string;
  contactName: string;
  contactEmail: string;
  ownerId: string;
  ownerName: string;
  source: string;
  createdAt: string;
  lastActivity?: string;
  stageHistory: {
    stageId: string;
    enteredAt: string;
    exitedAt?: string;
    duration?: number; // days
  }[];
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  products?: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
  nextAction?: {
    type: string;
    description: string;
    dueDate: string;
    assignedTo: string;
  };
}

interface PipelineMetrics {
  totalValue: number;
  weightedValue: number;
  averageDealSize: number;
  averageSalesCycle: number;
  conversionRate: number;
  stageConversion: {
    [stageId: string]: {
      inStage: number;
      converted: number;
      conversionRate: number;
      averageDuration: number;
    };
  };
  forecast: {
    thisMonth: number;
    nextMonth: number;
    thisQuarter: number;
    confidence: 'high' | 'medium' | 'low';
  };
}

interface SalesPipelineProps {
  deals: Deal[];
  stages: PipelineStage[];
  metrics: PipelineMetrics;
  onUpdateDeal: (dealId: string, updates: Partial<Deal>) => void;
  onMoveDeal: (dealId: string, newStageId: string) => void;
  onCreateDeal: (deal: Partial<Deal>) => void;
  onUpdateStages: (stages: PipelineStage[]) => void;
  readonly?: boolean;
}

// Default pipeline stages
const DEFAULT_STAGES: PipelineStage[] = [
  {
    id: 'lead',
    name: 'Lead',
    description: 'Initial lead qualification',
    order: 1,
    probability: 10,
    color: 'bg-gray-500',
    isActive: true,
    stagnationDays: 14
  },
  {
    id: 'qualified',
    name: 'Qualified',
    description: 'Lead meets qualification criteria',
    order: 2,
    probability: 25,
    color: 'bg-blue-500',
    isActive: true,
    stagnationDays: 21
  },
  {
    id: 'proposal',
    name: 'Proposal',
    description: 'Proposal sent to client',
    order: 3,
    probability: 50,
    color: 'bg-yellow-500',
    isActive: true,
    stagnationDays: 14
  },
  {
    id: 'negotiation',
    name: 'Negotiation',
    description: 'In contract negotiation',
    order: 4,
    probability: 75,
    color: 'bg-orange-500',
    isActive: true,
    stagnationDays: 10
  },
  {
    id: 'closed_won',
    name: 'Closed Won',
    description: 'Deal successfully closed',
    order: 5,
    probability: 100,
    color: 'bg-green-500',
    isActive: true,
    stagnationDays: 0
  },
  {
    id: 'closed_lost',
    name: 'Closed Lost',
    description: 'Deal lost to competitor or cancelled',
    order: 6,
    probability: 0,
    color: 'bg-red-500',
    isActive: true,
    stagnationDays: 0
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'border-red-500 bg-red-50';
    case 'high': return 'border-orange-500 bg-orange-50';
    case 'medium': return 'border-yellow-500 bg-yellow-50';
    case 'low': return 'border-gray-500 bg-gray-50';
    default: return 'border-gray-300 bg-white';
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case 'high': return <TrendingUp className="h-4 w-4 text-orange-600" />;
    case 'medium': return <Target className="h-4 w-4 text-yellow-600" />;
    case 'low': return <Clock className="h-4 w-4 text-gray-600" />;
    default: return null;
  }
};

export function SalesPipeline({ 
  deals, 
  stages = DEFAULT_STAGES, 
  metrics, 
  onUpdateDeal, 
  onMoveDeal, 
  onCreateDeal, 
  onUpdateStages, 
  readonly = false 
}: SalesPipelineProps) {
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showStageEditor, setShowStageEditor] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [filterOwner, setFilterOwner] = useState('');
  const [showMetrics, setShowMetrics] = useState(true);

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    const matchesText = !filterText || 
      deal.title.toLowerCase().includes(filterText.toLowerCase()) ||
      deal.accountName.toLowerCase().includes(filterText.toLowerCase()) ||
      deal.contactName.toLowerCase().includes(filterText.toLowerCase());
    
    const matchesStage = !filterStage || deal.stageId === filterStage;
    const matchesOwner = !filterOwner || deal.ownerId === filterOwner;
    
    return matchesText && matchesStage && matchesOwner;
  });

  // Group deals by stage
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = filteredDeals.filter(deal => deal.stageId === stage.id);
    return acc;
  }, {} as Record<string, Deal[]>);

  // Calculate stage totals
  const stageTotals = stages.map(stage => {
    const stageDeals = dealsByStage[stage.id] || [];
    const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
    const weightedValue = stageDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
    
    return {
      stageId: stage.id,
      count: stageDeals.length,
      totalValue,
      weightedValue
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      notation: 'compact'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getDaysInStage = (deal: Deal) => {
    const currentStageEntry = deal.stageHistory
      .filter(h => h.stageId === deal.stageId && !h.exitedAt)
      .sort((a, b) => new Date(b.enteredAt).getTime() - new Date(a.enteredAt).getTime())[0];
    
    if (!currentStageEntry) return 0;
    
    const enteredDate = new Date(currentStageEntry.enteredAt);
    const now = new Date();
    return Math.floor((now.getTime() - enteredDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const isStagnant = (deal: Deal) => {
    const stage = stages.find(s => s.id === deal.stageId);
    if (!stage || stage.stagnationDays === 0) return false;
    
    return getDaysInStage(deal) > stage.stagnationDays;
  };

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    
    if (draggedDeal && draggedDeal.stageId !== targetStageId) {
      onMoveDeal(draggedDeal.id, targetStageId);
    }
    
    setDraggedDeal(null);
  };

  const DealCard = ({ deal }: { deal: Deal }) => {
    const daysInStage = getDaysInStage(deal);
    const isStagnantDeal = isStagnant(deal);
    
    return (
      <div
        draggable={!readonly}
        onDragStart={() => handleDragStart(deal)}
        onClick={() => setSelectedDeal(deal)}
        className={`bg-white rounded-lg border-2 p-3 mb-3 cursor-pointer hover:shadow-md transition-all ${
          getPriorityColor(deal.priority)
        } ${isStagnantDeal ? 'border-red-300 bg-red-50' : ''}`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm mb-1">{deal.title}</h4>
            <p className="text-xs text-gray-600">{deal.accountName}</p>
          </div>
          
          <div className="flex items-center space-x-1">
            {getPriorityIcon(deal.priority)}
            {isStagnantDeal && (
              <div title="Stagnant deal">
                <AlertTriangle className="h-3 w-3 text-red-500" />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-900">{formatCurrency(deal.value)}</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {deal.probability}%
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>{deal.ownerName}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{daysInStage}d</span>
          </span>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-gray-600">Due: {formatDate(deal.expectedCloseDate)}</span>
          {deal.nextAction && (
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
              Action Due
            </span>
          )}
        </div>
        
        {deal.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {deal.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
            {deal.tags.length > 2 && (
              <span className="text-xs text-gray-400">+{deal.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  const StageColumn = ({ stage }: { stage: PipelineStage }) => {
    const stageDeals = dealsByStage[stage.id] || [];
    const stageTotal = stageTotals.find(t => t.stageId === stage.id);
    
    return (
      <div
        className="bg-gray-50 rounded-lg p-4 min-h-[600px] w-80 flex-shrink-0"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, stage.id)}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${stage.color}`} />
              <h3 className="font-semibold text-gray-900">{stage.name}</h3>
              <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                {stageDeals.length}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{stage.description}</p>
          </div>
          
          {!readonly && (
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="mb-4 p-3 bg-white rounded border">
          <div className="text-sm text-gray-600 mb-1">Total Value</div>
          <div className="font-semibold text-gray-900">{formatCurrency(stageTotal?.totalValue || 0)}</div>
          <div className="text-xs text-gray-500">
            Weighted: {formatCurrency(stageTotal?.weightedValue || 0)}
          </div>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {stageDeals.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
          
          {stageDeals.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-sm">No deals in this stage</div>
            </div>
          )}
        </div>
        
        {!readonly && (
          <button
            onClick={() => {
              // Create new deal in this stage
              onCreateDeal({ stageId: stage.id });
            }}
            className="w-full mt-4 p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">Add Deal</span>
          </button>
        )}
      </div>
    );
  };

  const MetricsPanel = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Pipeline Metrics</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowMetrics(!showMetrics)}
        >
          {showMetrics ? 'Hide' : 'Show'}
        </Button>
      </div>
      
      {showMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Total Pipeline</h4>
            </div>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(metrics.totalValue)}</div>
            <div className="text-sm text-blue-700">Weighted: {formatCurrency(metrics.weightedValue)}</div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-green-900">Average Deal</h4>
            </div>
            <div className="text-2xl font-bold text-green-900">{formatCurrency(metrics.averageDealSize)}</div>
            <div className="text-sm text-green-700">Per deal value</div>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <h4 className="font-medium text-orange-900">Sales Cycle</h4>
            </div>
            <div className="text-2xl font-bold text-orange-900">{metrics.averageSalesCycle}d</div>
            <div className="text-sm text-orange-700">Average duration</div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-purple-600" />
              <h4 className="font-medium text-purple-900">Conversion</h4>
            </div>
            <div className="text-2xl font-bold text-purple-900">{metrics.conversionRate}%</div>
            <div className="text-sm text-purple-700">Lead to close</div>
          </div>
        </div>
      )}
    </div>
  );

  const FilterBar = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search deals, accounts, contacts..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Stages</option>
            {stages.map(stage => (
              <option key={stage.id} value={stage.id}>{stage.name}</option>
            ))}
          </select>
          
          <select
            value={filterOwner}
            onChange={(e) => setFilterOwner(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Owners</option>
            {Array.from(new Set(deals.map(d => d.ownerId))).map(ownerId => {
              const owner = deals.find(d => d.ownerId === ownerId);
              return (
                <option key={ownerId} value={ownerId}>{owner?.ownerName}</option>
              );
            })}
          </select>
          
          <Button variant="outline" onClick={() => {
            setFilterText('');
            setFilterStage('');
            setFilterOwner('');
          }}>
            Clear
          </Button>
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
          <h2 className="text-2xl font-bold text-gray-900">Sales Pipeline</h2>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {deals.length} deals
          </span>
        </div>
        
        <div className="flex space-x-2">
          {!readonly && (
            <>
              <Button variant="outline" onClick={() => setShowStageEditor(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Manage Stages
              </Button>
              <Button onClick={() => onCreateDeal({})}>
                <Plus className="h-4 w-4 mr-2" />
                New Deal
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Metrics Panel */}
      <MetricsPanel />

      {/* Filter Bar */}
      <FilterBar />

      {/* Pipeline Stages */}
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          {stages
            .filter(stage => stage.isActive)
            .sort((a, b) => a.order - b.order)
            .map(stage => (
              <StageColumn key={stage.id} stage={stage} />
            ))}
        </div>
      </div>

      {/* Deal Detail Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedDeal.title}</h3>
                  <p className="text-gray-600">{selectedDeal.accountName} • {selectedDeal.contactName}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    stages.find(s => s.id === selectedDeal.stageId)?.color || 'bg-gray-500'
                  } text-white`}>
                    {stages.find(s => s.id === selectedDeal.stageId)?.name}
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedDeal.value)}
                  </span>
                  <button 
                    onClick={() => setSelectedDeal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Deal Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Value:</span>
                        <span className="font-medium">{formatCurrency(selectedDeal.value)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Probability:</span>
                        <span className="font-medium">{selectedDeal.probability}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected Close:</span>
                        <span className="font-medium">{formatDate(selectedDeal.expectedCloseDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className={`font-medium capitalize ${
                          selectedDeal.priority === 'urgent' ? 'text-red-600' :
                          selectedDeal.priority === 'high' ? 'text-orange-600' :
                          selectedDeal.priority === 'medium' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          {selectedDeal.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Owner:</span>
                        <span className="font-medium">{selectedDeal.ownerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Source:</span>
                        <span className="font-medium">{selectedDeal.source}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedDeal.nextAction && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Next Action</h4>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="font-medium text-blue-900">{selectedDeal.nextAction.type}</div>
                        <div className="text-sm text-blue-700">{selectedDeal.nextAction.description}</div>
                        <div className="text-xs text-blue-600 mt-1">
                          Due: {formatDate(selectedDeal.nextAction.dueDate)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Stage History</h4>
                    <div className="space-y-2">
                      {selectedDeal.stageHistory
                        .sort((a, b) => new Date(b.enteredAt).getTime() - new Date(a.enteredAt).getTime())
                        .slice(0, 5)
                        .map((history, index) => {
                          const stage = stages.find(s => s.id === history.stageId);
                          return (
                            <div key={index} className="flex items-center space-x-3 text-sm">
                              <div className={`w-2 h-2 rounded-full ${stage?.color || 'bg-gray-400'}`} />
                              <span className="font-medium">{stage?.name}</span>
                              <span className="text-gray-500">{formatDate(history.enteredAt)}</span>
                              {history.duration && (
                                <span className="text-gray-400">({history.duration}d)</span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  
                  {selectedDeal.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedDeal.tags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedDeal.notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {selectedDeal.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedDeal.products && selectedDeal.products.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Products/Services</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-2">Product</th>
                          <th className="text-right p-2">Quantity</th>
                          <th className="text-right p-2">Unit Price</th>
                          <th className="text-right p-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDeal.products.map(product => (
                          <tr key={product.id} className="border-t">
                            <td className="p-2 font-medium">{product.name}</td>
                            <td className="p-2 text-right">{product.quantity}</td>
                            <td className="p-2 text-right">{formatCurrency(product.unitPrice)}</td>
                            <td className="p-2 text-right font-medium">
                              {formatCurrency(product.quantity * product.unitPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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