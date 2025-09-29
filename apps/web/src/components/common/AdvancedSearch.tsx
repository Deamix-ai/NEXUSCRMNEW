'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, DollarSign, Users, Tag } from 'lucide-react';

interface SearchField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'dateRange';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface SearchFilters {
  [key: string]: any;
}

interface AdvancedSearchProps {
  fields: SearchField[];
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  initialFilters?: SearchFilters;
  placeholder?: string;
}

export function AdvancedSearch({ 
  fields, 
  onSearch, 
  onClear, 
  initialFilters = {}, 
  placeholder = "Search..." 
}: AdvancedSearchProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [quickSearch, setQuickSearch] = useState('');

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    const searchFilters = { ...filters };
    if (quickSearch.trim()) {
      searchFilters._quickSearch = quickSearch.trim();
    }
    onSearch(searchFilters);
  };

  const handleClear = () => {
    setFilters({});
    setQuickSearch('');
    onClear();
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key] !== undefined && filters[key] !== '' && filters[key] !== null
  ) || quickSearch.trim() !== '';

  const renderField = (field: SearchField) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={field.placeholder || field.label}
            value={filters[field.key] || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
          />
        );

      case 'select':
        return (
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters[field.key] || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
          >
            <option value="">All {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters[field.key] || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={field.placeholder || field.label}
            value={filters[field.key] || ''}
            onChange={(e) => handleFilterChange(field.key, e.target.value)}
          />
        );

      case 'dateRange':
        return (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="From"
              value={filters[`${field.key}_from`] || ''}
              onChange={(e) => handleFilterChange(`${field.key}_from`, e.target.value)}
            />
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="To"
              value={filters[`${field.key}_to`] || ''}
              onChange={(e) => handleFilterChange(`${field.key}_to`, e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Quick Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={placeholder}
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className={`px-4 py-2 border rounded-md flex items-center gap-2 transition-colors ${
            isAdvancedOpen 
              ? 'bg-blue-50 border-blue-300 text-blue-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            {quickSearch && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{quickSearch}"
                <button
                  onClick={() => setQuickSearch('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              const field = fields.find(f => f.key === key || key.startsWith(f.key));
              if (!field) return null;
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {field.label}: {typeof value === 'string' ? value : JSON.stringify(value)}
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="ml-1 text-gray-600 hover:text-gray-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Predefined search field configurations for different entities
export const ACCOUNT_SEARCH_FIELDS: SearchField[] = [
  { key: 'name', label: 'Account Name', type: 'text', placeholder: 'Search by name...' },
  { key: 'type', label: 'Account Type', type: 'select', options: [
    { value: 'INDIVIDUAL', label: 'Individual' },
    { value: 'COMMERCIAL', label: 'Commercial' },
    { value: 'TRADE', label: 'Trade' }
  ]},
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'PROSPECT', label: 'Prospect' }
  ]},
  { key: 'owner', label: 'Account Owner', type: 'select', options: [] }, // Will be populated with users
  { key: 'createdAt', label: 'Created Date', type: 'dateRange' },
  { key: 'estimatedValue', label: 'Min Value', type: 'number', placeholder: 'Minimum value...' }
];

export const ENQUIRY_SEARCH_FIELDS: SearchField[] = [
  { key: 'title', label: 'Title', type: 'text', placeholder: 'Search enquiries...' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'NEW', label: 'New' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'QUALIFIED', label: 'Qualified' },
    { value: 'CONVERTED', label: 'Converted' },
    { value: 'REJECTED', label: 'Rejected' }
  ]},
  { key: 'priority', label: 'Priority', type: 'select', options: [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' }
  ]},
  { key: 'source', label: 'Source', type: 'select', options: [
    { value: 'Website', label: 'Website' },
    { value: 'Phone', label: 'Phone' },
    { value: 'Email', label: 'Email' },
    { value: 'Referral', label: 'Referral' },
    { value: 'Social Media', label: 'Social Media' }
  ]},
  { key: 'createdAt', label: 'Date Created', type: 'dateRange' },
  { key: 'estimatedValue', label: 'Min Value', type: 'number', placeholder: 'Minimum value...' }
];

export const PROJECT_SEARCH_FIELDS: SearchField[] = [
  { key: 'name', label: 'Project Name', type: 'text', placeholder: 'Search projects...' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'PLANNING', label: 'Planning' },
    { value: 'DESIGN', label: 'Design' },
    { value: 'SURVEY', label: 'Survey' },
    { value: 'INSTALLATION', label: 'Installation' },
    { value: 'COMPLETION', label: 'Completion' },
    { value: 'WARRANTY', label: 'Warranty' }
  ]},
  { key: 'type', label: 'Project Type', type: 'select', options: [
    { value: 'Bathroom', label: 'Bathroom' },
    { value: 'Kitchen', label: 'Kitchen' },
    { value: 'Wet Room', label: 'Wet Room' },
    { value: 'Ensuite', label: 'Ensuite' },
    { value: 'Cloakroom', label: 'Cloakroom' }
  ]},
  { key: 'startDate', label: 'Start Date', type: 'dateRange' },
  { key: 'value', label: 'Min Value', type: 'number', placeholder: 'Minimum project value...' }
];