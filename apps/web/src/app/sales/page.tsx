'use client';

import React, { useState } from 'react';
import { SalesPipeline } from '@/components/sales/SalesPipeline';
import { DealForecasting } from '@/components/sales/DealForecasting';
import { SalesActivityDashboard } from '@/components/sales/SalesActivityDashboard';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Activity, Target } from 'lucide-react';
import {
  useCreateDeal,
  useUpdateDeal,
  useMoveDeal,
  useUpdateSalesStages,
  useUpdateForecast,
  useExportForecast,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
} from '@/hooks/api-hooks';

// Sample data for demonstration
const sampleDeals = [
  {
    id: 'deal-1',
    title: 'Luxury Kitchen Renovation',
    description: 'Complete kitchen redesign with premium fixtures',
    value: 25000,
    probability: 75,
    expectedCloseDate: '2025-10-15',
    stageId: 'negotiation',
    accountId: 'acc-1',
    accountName: 'Smith Residence',
    contactName: 'John Smith',
    contactEmail: 'john@smiths.com',
    ownerId: 'owner-1',
    ownerName: 'Sarah Wilson',
    source: 'Website',
    createdAt: '2025-09-01',
    lastActivity: '2025-09-15',
    stageHistory: [
      { stageId: 'lead', enteredAt: '2025-09-01', exitedAt: '2025-09-03', duration: 2 },
      { stageId: 'qualified', enteredAt: '2025-09-03', exitedAt: '2025-09-10', duration: 7 },
      { stageId: 'proposal', enteredAt: '2025-09-10', exitedAt: '2025-09-14', duration: 4 },
      { stageId: 'negotiation', enteredAt: '2025-09-14' }
    ],
    tags: ['kitchen', 'luxury', 'urgent'],
    priority: 'high' as const,
    products: [
      { id: 'p1', name: 'Premium Kitchen Units', quantity: 1, unitPrice: 15000 },
      { id: 'p2', name: 'Granite Worktops', quantity: 1, unitPrice: 3500 },
      { id: 'p3', name: 'Installation & Project Management', quantity: 1, unitPrice: 6500 }
    ],
    notes: 'Customer very interested, budget approved. Waiting for final decision on granite vs quartz.',
    nextAction: {
      type: 'Follow-up Call',
      description: 'Call to finalize material selection',
      dueDate: '2025-09-20',
      assignedTo: 'Sarah Wilson'
    }
  },
  {
    id: 'deal-2',
    title: 'Bathroom Modernization',
    description: 'Master bathroom renovation with walk-in shower',
    value: 12000,
    probability: 50,
    expectedCloseDate: '2025-11-01',
    stageId: 'proposal',
    accountId: 'acc-2',
    accountName: 'Johnson Family',
    contactName: 'Emma Johnson',
    contactEmail: 'emma@johnsons.co.uk',
    ownerId: 'owner-2',
    ownerName: 'Mike Thompson',
    source: 'Referral',
    createdAt: '2025-09-05',
    stageHistory: [
      { stageId: 'lead', enteredAt: '2025-09-05', exitedAt: '2025-09-08', duration: 3 },
      { stageId: 'qualified', enteredAt: '2025-09-08', exitedAt: '2025-09-12', duration: 4 },
      { stageId: 'proposal', enteredAt: '2025-09-12' }
    ],
    tags: ['bathroom', 'referral'],
    priority: 'medium' as const,
    products: [
      { id: 'p4', name: 'Bathroom Suite', quantity: 1, unitPrice: 8000 },
      { id: 'p5', name: 'Tiling & Flooring', quantity: 1, unitPrice: 2500 },
      { id: 'p6', name: 'Installation', quantity: 1, unitPrice: 1500 }
    ]
  },
  {
    id: 'deal-3',
    title: 'Small Kitchen Update',
    description: 'Budget kitchen refresh with new doors and worktops',
    value: 8500,
    probability: 25,
    expectedCloseDate: '2025-10-30',
    stageId: 'qualified',
    accountId: 'acc-3',
    accountName: 'Davis Apartment',
    contactName: 'Robert Davis',
    contactEmail: 'rob@davis.com',
    ownerId: 'owner-1',
    ownerName: 'Sarah Wilson',
    source: 'Google Ads',
    createdAt: '2025-09-10',
    stageHistory: [
      { stageId: 'lead', enteredAt: '2025-09-10', exitedAt: '2025-09-14', duration: 4 },
      { stageId: 'qualified', enteredAt: '2025-09-14' }
    ],
    tags: ['budget', 'small-project'],
    priority: 'low' as const
  },
  {
    id: 'deal-4',
    title: 'New Build Kitchen & Bathrooms',
    description: 'Complete fit-out for new construction property',
    value: 45000,
    probability: 90,
    expectedCloseDate: '2025-09-25',
    stageId: 'closed_won',
    accountId: 'acc-4',
    accountName: 'Henderson Construction',
    contactName: 'Lisa Henderson',
    contactEmail: 'lisa@henderson-const.co.uk',
    ownerId: 'owner-3',
    ownerName: 'David Clarke',
    source: 'Trade Contact',
    createdAt: '2025-08-15',
    actualCloseDate: '2025-09-18',
    stageHistory: [
      { stageId: 'lead', enteredAt: '2025-08-15', exitedAt: '2025-08-18', duration: 3 },
      { stageId: 'qualified', enteredAt: '2025-08-18', exitedAt: '2025-08-25', duration: 7 },
      { stageId: 'proposal', enteredAt: '2025-08-25', exitedAt: '2025-09-01', duration: 7 },
      { stageId: 'negotiation', enteredAt: '2025-09-01', exitedAt: '2025-09-15', duration: 14 },
      { stageId: 'closed_won', enteredAt: '2025-09-18' }
    ],
    tags: ['new-build', 'large-project', 'construction'],
    priority: 'urgent' as const
  }
];

const sampleStages = [
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

const sampleMetrics = {
  totalValue: 90500,
  weightedValue: 52750,
  averageDealSize: 22625,
  averageSalesCycle: 45,
  conversionRate: 65,
  stageConversion: {
    'lead': { inStage: 2, converted: 8, conversionRate: 80, averageDuration: 3 },
    'qualified': { inStage: 1, converted: 7, conversionRate: 87.5, averageDuration: 6 },
    'proposal': { inStage: 1, converted: 6, conversionRate: 85.7, averageDuration: 5 },
    'negotiation': { inStage: 1, converted: 5, conversionRate: 83.3, averageDuration: 12 }
  },
  forecast: {
    thisMonth: 25000,
    nextMonth: 37000,
    thisQuarter: 85000,
    confidence: 'high' as const
  }
};

const sampleForecasts = [
  {
    period: 'October 2025',
    periodType: 'month' as const,
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    forecast: {
      bestCase: 45000,
      mostLikely: 37000,
      worstCase: 25000,
      confidence: 'high' as const,
      deals: { total: 3, closing: 2, averageValue: 18500 }
    },
    actual: 38500,
    variance: 4.1,
    accuracy: 89.2
  },
  {
    period: 'Q4 2025',
    periodType: 'quarter' as const,
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    forecast: {
      bestCase: 125000,
      mostLikely: 95000,
      worstCase: 65000,
      confidence: 'medium' as const,
      deals: { total: 8, closing: 5, averageValue: 19000 }
    }
  }
];

const sampleForecastBreakdown = {
  byStage: [
    { stageId: 'qualified', stageName: 'Qualified', dealCount: 1, totalValue: 8500, weightedValue: 2125, probability: 25, contribution: 4.0 },
    { stageId: 'proposal', stageName: 'Proposal', dealCount: 1, totalValue: 12000, weightedValue: 6000, probability: 50, contribution: 11.4 },
    { stageId: 'negotiation', stageName: 'Negotiation', dealCount: 1, totalValue: 25000, weightedValue: 18750, probability: 75, contribution: 35.5 },
    { stageId: 'closed_won', stageName: 'Closed Won', dealCount: 1, totalValue: 45000, weightedValue: 45000, probability: 100, contribution: 49.1 }
  ],
  byOwner: [
    { ownerId: 'owner-1', ownerName: 'Sarah Wilson', dealCount: 2, totalValue: 33500, weightedValue: 20875, quota: 25000, achievement: 83.5, confidence: 'high' as const },
    { ownerId: 'owner-2', ownerName: 'Mike Thompson', dealCount: 1, totalValue: 12000, weightedValue: 6000, quota: 15000, achievement: 40.0, confidence: 'medium' as const },
    { ownerId: 'owner-3', ownerName: 'David Clarke', dealCount: 1, totalValue: 45000, weightedValue: 45000, quota: 30000, achievement: 150.0, confidence: 'high' as const }
  ],
  byProduct: [
    { productId: 'kitchens', productName: 'Kitchen Solutions', dealCount: 2, totalValue: 33500, avgDealSize: 16750, growthRate: 15.2 },
    { productId: 'bathrooms', productName: 'Bathroom Solutions', dealCount: 2, totalValue: 57000, avgDealSize: 28500, growthRate: 8.7 }
  ],
  risks: [
    {
      type: 'budget' as const,
      description: 'Davis apartment deal may have budget constraints',
      impact: 'medium' as const,
      probability: 35,
      deals: ['deal-3'],
      mitigation: 'Provide alternative budget-friendly options'
    },
    {
      type: 'timing' as const,
      description: 'Johnson family may delay due to planning permission',
      impact: 'low' as const,
      probability: 20,
      deals: ['deal-2']
    }
  ]
};

const sampleActivities = [
  {
    id: 'act-1',
    type: 'call' as const,
    title: 'Discovery Call - Kitchen Requirements',
    description: 'Initial consultation about kitchen renovation needs',
    date: '2025-09-18T10:00:00Z',
    duration: 45,
    ownerId: 'owner-1',
    ownerName: 'Sarah Wilson',
    accountId: 'acc-1',
    accountName: 'Smith Residence',
    contactId: 'cont-1',
    contactName: 'John Smith',
    dealId: 'deal-1',
    dealTitle: 'Luxury Kitchen Renovation',
    outcome: 'completed' as const,
    metadata: { callConnected: true },
    tags: ['discovery', 'kitchen'],
    priority: 'high' as const,
    nextAction: {
      type: 'Site Survey',
      description: 'Schedule on-site measurement and consultation',
      dueDate: '2025-09-22'
    }
  },
  {
    id: 'act-2',
    type: 'email' as const,
    title: 'Proposal Follow-up',
    description: 'Sent detailed proposal with pricing options',
    date: '2025-09-17T14:30:00Z',
    ownerId: 'owner-2',
    ownerName: 'Mike Thompson',
    accountId: 'acc-2',
    accountName: 'Johnson Family',
    dealId: 'deal-2',
    dealTitle: 'Bathroom Modernization',
    outcome: 'completed' as const,
    metadata: { emailOpened: true, emailClicked: true },
    tags: ['proposal', 'follow-up'],
    priority: 'medium' as const
  },
  {
    id: 'act-3',
    type: 'meeting' as const,
    title: 'Showroom Visit',
    description: 'Customer visit to see bathroom displays',
    date: '2025-09-16T11:00:00Z',
    duration: 90,
    ownerId: 'owner-2',
    ownerName: 'Mike Thompson',
    accountId: 'acc-2',
    accountName: 'Johnson Family',
    contactName: 'Emma Johnson',
    outcome: 'completed' as const,
    metadata: { meetingAttendees: 2 },
    tags: ['showroom', 'demo'],
    priority: 'medium' as const
  }
];

const sampleActivityMetrics = {
  totalActivities: 24,
  activitiesByType: {
    call: 8,
    email: 6,
    meeting: 4,
    demo: 2,
    proposal: 3,
    follow_up: 1
  },
  activitiesByOutcome: {
    completed: 20,
    no_show: 2,
    reschedule: 2
  },
  averageCallDuration: 32,
  emailOpenRate: 78,
  emailClickRate: 34,
  meetingShowRate: 89,
  activitiesPerRep: [
    { ownerId: 'owner-1', ownerName: 'Sarah Wilson', total: 12, byType: { call: 4, email: 3, meeting: 2, demo: 1, proposal: 2 }, averagePerDay: 2.1, conversion: 67 },
    { ownerId: 'owner-2', ownerName: 'Mike Thompson', total: 8, byType: { call: 3, email: 2, meeting: 2, proposal: 1 }, averagePerDay: 1.8, conversion: 58 },
    { ownerId: 'owner-3', ownerName: 'David Clarke', total: 4, byType: { call: 1, email: 1, meeting: 1, demo: 1 }, averagePerDay: 1.2, conversion: 85 }
  ],
  trends: [
    { period: 'This Week', activities: 24, change: 12 },
    { period: 'Last Week', activities: 18, change: -8 }
  ]
};

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'forecasting' | 'activities'>('pipeline');

  // React Query hooks
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();
  const moveDeal = useMoveDeal();
  const updateSalesStages = useUpdateSalesStages();
  const updateForecast = useUpdateForecast();
  const exportForecast = useExportForecast();
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();

  const handleUpdateDeal = (dealId: string, updates: any) => {
    updateDeal.mutate({ id: dealId, data: updates });
  };

  const handleMoveDeal = (dealId: string, newStageId: string) => {
    moveDeal.mutate({ id: dealId, stageId: newStageId });
  };

  const handleCreateDeal = (deal: any) => {
    createDeal.mutate(deal);
  };

  const handleUpdateStages = (stages: any) => {
    updateSalesStages.mutate(stages);
  };

  const handleUpdateForecast = (period: string, updates: any) => {
    updateForecast.mutate({ period, data: updates });
  };

  const handleExportForecast = (period: string) => {
    exportForecast.mutate(period);
  };

  const handleCreateActivity = (activity: any) => {
    createActivity.mutate(activity);
  };

  const handleUpdateActivity = (activityId: string, updates: any) => {
    updateActivity.mutate({ id: activityId, data: updates });
  };

  const handleDeleteActivity = (activityId: string) => {
    deleteActivity.mutate(activityId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Management</h1>
          <p className="text-gray-600">
            Comprehensive sales pipeline, forecasting, and activity management
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pipeline')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pipeline'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Sales Pipeline</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('forecasting')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'forecasting'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Forecasting</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('activities')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activities'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Activities</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'pipeline' && (
            <SalesPipeline
              deals={sampleDeals}
              stages={sampleStages}
              metrics={sampleMetrics}
              onUpdateDeal={handleUpdateDeal}
              onMoveDeal={handleMoveDeal}
              onCreateDeal={handleCreateDeal}
              onUpdateStages={handleUpdateStages}
            />
          )}

          {activeTab === 'forecasting' && (
            <DealForecasting
              forecasts={sampleForecasts}
              breakdown={sampleForecastBreakdown}
              onUpdateForecast={handleUpdateForecast}
              onExportForecast={handleExportForecast}
            />
          )}

          {activeTab === 'activities' && (
            <SalesActivityDashboard
              activities={sampleActivities}
              metrics={sampleActivityMetrics}
              onCreateActivity={handleCreateActivity}
              onUpdateActivity={handleUpdateActivity}
              onDeleteActivity={handleDeleteActivity}
            />
          )}
        </div>
      </div>
    </div>
  );
}