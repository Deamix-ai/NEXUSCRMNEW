'use client';

import React, { memo, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { withMemo, createMemoizedListItem, useOptimizedMemo } from '@/lib/performance';

interface Lead {
  id: string;
  title: string;
  status: string;
  source?: string;
  estimatedValue?: number;
  createdAt: string;
  clientName?: string;
  priority: string;
}

interface LeadItemProps {
  item: Lead;
  index: number;
  onConvert: (lead: Lead) => void;
}

// Optimized constants
const STATUS_COLORS = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  QUALIFIED: 'bg-purple-100 text-purple-800',
  PROPOSAL: 'bg-indigo-100 text-indigo-800',
  WON: 'bg-green-100 text-green-800',
  LOST: 'bg-red-100 text-red-800',
} as const;

const SOURCE_COLORS = {
  Website: 'bg-blue-50 text-blue-700',
  Referral: 'bg-green-50 text-green-700',
  'Trade Show': 'bg-purple-50 text-purple-700',
  'Google Ads': 'bg-yellow-50 text-yellow-700',
  Social: 'bg-pink-50 text-pink-700',
} as const;

const PRIORITY_COLORS = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800',
} as const;

// Memoized utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Memoized Lead Item Component
const LeadItem = memo<LeadItemProps>(({ item: lead, index, onConvert }) => {
  const handleConvert = useCallback(() => {
    onConvert(lead);
  }, [lead, onConvert]);

  const statusColorClass = useMemo(() => 
    STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800',
    [lead.status]
  );

  const sourceColorClass = useMemo(() => 
    lead.source ? SOURCE_COLORS[lead.source as keyof typeof SOURCE_COLORS] || 'bg-gray-50 text-gray-700' : null,
    [lead.source]
  );

  const priorityColorClass = useMemo(() => 
    PRIORITY_COLORS[lead.priority as keyof typeof PRIORITY_COLORS] || 'bg-gray-100 text-gray-800',
    [lead.priority]
  );

  const formattedValue = useMemo(() => 
    lead.estimatedValue ? formatCurrency(lead.estimatedValue) : null,
    [lead.estimatedValue]
  );

  const formattedDate = useMemo(() => 
    formatDate(lead.createdAt),
    [lead.createdAt]
  );

  return (
    <tr 
      key={lead.id}
      className="hover:bg-gray-50 transition-colors duration-150"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">
              <Link 
                href={`/leads/${lead.id}`}
                className="hover:text-blue-600 transition-colors"
              >
                {lead.title}
              </Link>
            </div>
            {lead.clientName && (
              <div className="text-sm text-gray-500">{lead.clientName}</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColorClass}`}>
          {lead.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColorClass}`}>
          {lead.priority}
        </span>
      </td>
      {lead.source && (
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sourceColorClass}`}>
            {lead.source}
          </span>
        </td>
      )}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formattedValue || '—'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formattedDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <Link 
            href={`/leads/${lead.id}`}
            className="text-blue-600 hover:text-blue-900 transition-colors"
          >
            View
          </Link>
          <button
            onClick={handleConvert}
            className="text-green-600 hover:text-green-900 transition-colors"
          >
            Convert
          </button>
        </div>
      </td>
    </tr>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.index === nextProps.index &&
    prevProps.item.status === nextProps.item.status &&
    prevProps.item.estimatedValue === nextProps.item.estimatedValue &&
    prevProps.item.priority === nextProps.item.priority
  );
});

LeadItem.displayName = 'LeadItem';

interface OptimizedLeadsListProps {
  leads: Lead[];
  onConvert: (lead: Lead) => void;
  loading?: boolean;
  searchTerm?: string;
}

export const OptimizedLeadsList = memo<OptimizedLeadsListProps>(({
  leads,
  onConvert,
  loading = false,
  searchTerm = '',
}) => {
  // Optimized filtering and sorting
  const filteredAndSortedLeads = useOptimizedMemo(() => {
    if (!leads?.length) return [];

    let filtered = leads;
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = leads.filter(lead => 
        lead.title.toLowerCase().includes(lowerSearchTerm) ||
        lead.clientName?.toLowerCase().includes(lowerSearchTerm) ||
        lead.status.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Sort by priority and then by date
    return filtered.sort((a, b) => {
      const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [leads, searchTerm]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!filteredAndSortedLeads.length) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">No leads found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating a new lead.'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lead
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredAndSortedLeads.map((lead, index) => (
            <LeadItem
              key={lead.id}
              item={lead}
              index={index}
              onConvert={onConvert}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

OptimizedLeadsList.displayName = 'OptimizedLeadsList';