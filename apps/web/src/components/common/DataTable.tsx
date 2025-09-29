'use client';

import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Check, Eye, Edit, Trash2 } from 'lucide-react';

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
  className?: string;
}

interface TableAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: (row: any) => void;
  variant?: 'default' | 'danger' | 'warning';
  show?: (row: any) => boolean;
}

interface DataTableProps {
  data: any[];
  columns: TableColumn[];
  keyField?: string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  actions?: TableAction[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  sortable?: boolean;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable({
  data,
  columns,
  keyField = 'id',
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  actions = [],
  pagination,
  sortable = true,
  onSort,
  loading = false,
  emptyMessage = 'No data available',
  className = ''
}: DataTableProps) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Internal sorting if no external sort handler provided
  const sortedData = useMemo(() => {
    if (!sortable || onSort || !sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortField, sortDirection, sortable, onSort]);

  const handleSort = (field: string) => {
    if (!sortable) return;

    let newDirection: 'asc' | 'desc' = 'asc';
    
    if (sortField === field) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    setSortField(field);
    setSortDirection(newDirection);

    if (onSort) {
      onSort(field, newDirection);
    }
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    const allIds = sortedData.map(row => row[keyField]);
    const isAllSelected = allIds.every(id => selectedIds.includes(id));

    if (isAllSelected) {
      onSelectionChange(selectedIds.filter(id => !allIds.includes(id)));
    } else {
      const uniqueIds = Array.from(new Set([...selectedIds, ...allIds]));
      onSelectionChange(uniqueIds);
    }
  };

  const handleSelectRow = (id: string) => {
    if (!onSelectionChange) return;

    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const isAllSelected = sortedData.length > 0 && 
    sortedData.every(row => selectedIds.includes(row[keyField]));
  const isSomeSelected = sortedData.some(row => selectedIds.includes(row[keyField])) && !isAllSelected;

  const renderSortIcon = (column: TableColumn) => {
    if (!sortable || !column.sortable) return null;

    if (sortField !== column.key) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }

    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-gray-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-gray-600" />
    );
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (sortedData.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Selection Column */}
              {selectable && (
                <th className="w-12 px-6 py-3">
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                      <div
                        onClick={handleSelectAll}
                        className={`w-4 h-4 border-2 rounded cursor-pointer flex items-center justify-center ${
                          isAllSelected
                            ? 'bg-blue-600 border-blue-600'
                            : isSomeSelected
                            ? 'bg-blue-100 border-blue-400'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {isAllSelected && <Check className="h-3 w-3 text-white" />}
                        {isSomeSelected && <div className="w-2 h-2 bg-blue-600 rounded-sm" />}
                      </div>
                    </div>
                  </div>
                </th>
              )}

              {/* Data Columns */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.width || ''
                  } ${column.className || ''}`}
                >
                  {column.sortable && sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="group inline-flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>{column.label}</span>
                      {renderSortIcon(column)}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}

              {/* Actions Column */}
              {actions.length > 0 && (
                <th className="w-24 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((row, index) => (
              <tr
                key={row[keyField] || index}
                className={`hover:bg-gray-50 ${
                  selectedIds.includes(row[keyField]) ? 'bg-blue-50' : ''
                }`}
              >
                {/* Selection Column */}
                {selectable && (
                  <td className="w-12 px-6 py-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedIds.includes(row[keyField])}
                        onChange={() => handleSelectRow(row[keyField])}
                      />
                    </div>
                  </td>
                )}

                {/* Data Columns */}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                      column.className || ''
                    }`}
                  >
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}

                {/* Actions Column */}
                {actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {actions
                        .filter(action => !action.show || action.show(row))
                        .map((action) => (
                          <button
                            key={action.id}
                            onClick={() => action.onClick(row)}
                            className={`p-1 rounded hover:bg-gray-100 ${
                              action.variant === 'danger'
                                ? 'text-red-600 hover:bg-red-50'
                                : action.variant === 'warning'
                                ? 'text-orange-600 hover:bg-orange-50'
                                : 'text-gray-600'
                            }`}
                            title={action.label}
                          >
                            {action.icon}
                          </button>
                        ))
                      }
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <span>Showing</span>
              <select
                value={pagination.pageSize}
                onChange={(e) => pagination.onPageSizeChange(Number(e.target.value))}
                className="mx-2 border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>
                of {pagination.total} results
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) })
                  .slice(
                    Math.max(0, pagination.page - 3),
                    Math.min(Math.ceil(pagination.total / pagination.pageSize), pagination.page + 2)
                  )
                  .map((_, i) => {
                    const pageNum = Math.max(0, pagination.page - 3) + i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => pagination.onPageChange(pageNum)}
                        className={`px-3 py-1 border rounded text-sm ${
                          pageNum === pagination.page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })
                }
              </div>

              <button
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Common table actions
export const DEFAULT_TABLE_ACTIONS: TableAction[] = [
  {
    id: 'view',
    label: 'View',
    icon: <Eye className="h-4 w-4" />,
    onClick: (row) => console.log('View:', row)
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: <Edit className="h-4 w-4" />,
    onClick: (row) => console.log('Edit:', row)
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    onClick: (row) => console.log('Delete:', row),
    variant: 'danger'
  }
];