'use client';

import React, { useState } from 'react';
import { Check, ChevronDown, X, Download, Upload, Trash2, Edit, Mail, Archive } from 'lucide-react';

interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: (selectedIds: string[]) => void;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  variant?: 'default' | 'danger' | 'warning';
}

interface BulkOperationsProps {
  selectedIds: string[];
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  actions: BulkAction[];
  isLoading?: boolean;
}

export function BulkOperations({
  selectedIds,
  totalCount,
  onSelectAll,
  onDeselectAll,
  actions,
  isLoading = false
}: BulkOperationsProps) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null);

  const isAllSelected = selectedIds.length === totalCount && totalCount > 0;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < totalCount;

  const handleActionClick = (action: BulkAction) => {
    if (action.requiresConfirmation) {
      setConfirmAction(action);
    } else {
      action.action(selectedIds);
    }
    setIsActionsOpen(false);
  };

  const confirmActionExecution = () => {
    if (confirmAction) {
      confirmAction.action(selectedIds);
      setConfirmAction(null);
    }
  };

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Select All Checkbox */}
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isAllSelected}
                  onChange={isAllSelected ? onDeselectAll : onSelectAll}
                />
                <div
                  onClick={isAllSelected ? onDeselectAll : onSelectAll}
                  className={`w-5 h-5 border-2 rounded cursor-pointer flex items-center justify-center ${
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

            {/* Selection Info */}
            <div className="text-sm">
              <span className="font-medium text-blue-900">
                {selectedIds.length} of {totalCount} selected
              </span>
              {selectedIds.length < totalCount && (
                <button
                  onClick={onSelectAll}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Select all {totalCount}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Clear Selection */}
            <button
              onClick={onDeselectAll}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>

            {/* Bulk Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsActionsOpen(!isActionsOpen)}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Actions'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>

              {isActionsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {actions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleActionClick(action)}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-50 ${
                          action.variant === 'danger' 
                            ? 'text-red-700 hover:bg-red-50' 
                            : action.variant === 'warning'
                            ? 'text-orange-700 hover:bg-orange-50'
                            : 'text-gray-700'
                        }`}
                      >
                        {action.icon}
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Action
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {confirmAction.confirmationMessage || 
               `Are you sure you want to ${confirmAction.label.toLowerCase()} ${selectedIds.length} item(s)?`
              }
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmActionExecution}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  confirmAction.variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700'
                    : confirmAction.variant === 'warning'
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Predefined bulk actions for different entities
export const ACCOUNT_BULK_ACTIONS: BulkAction[] = [
  {
    id: 'export',
    label: 'Export Selected',
    icon: <Download className="h-4 w-4" />,
    action: (ids) => console.log('Export accounts:', ids)
  },
  {
    id: 'email',
    label: 'Send Email',
    icon: <Mail className="h-4 w-4" />,
    action: (ids) => console.log('Send email to accounts:', ids)
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: <Archive className="h-4 w-4" />,
    action: (ids) => console.log('Archive accounts:', ids),
    requiresConfirmation: true,
    confirmationMessage: 'Archived accounts will no longer appear in the main list. This action can be undone.',
    variant: 'warning'
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    action: (ids) => console.log('Delete accounts:', ids),
    requiresConfirmation: true,
    confirmationMessage: 'This action cannot be undone. All related data will be permanently deleted.',
    variant: 'danger'
  }
];

export const ENQUIRY_BULK_ACTIONS: BulkAction[] = [
  {
    id: 'export',
    label: 'Export Selected',
    icon: <Download className="h-4 w-4" />,
    action: (ids) => console.log('Export enquiries:', ids)
  },
  {
    id: 'assign',
    label: 'Assign Owner',
    icon: <Edit className="h-4 w-4" />,
    action: (ids) => console.log('Assign owner to enquiries:', ids)
  },
  {
    id: 'status',
    label: 'Update Status',
    icon: <Edit className="h-4 w-4" />,
    action: (ids) => console.log('Update status for enquiries:', ids)
  },
  {
    id: 'convert',
    label: 'Convert to Leads',
    icon: <Check className="h-4 w-4" />,
    action: (ids) => console.log('Convert enquiries to leads:', ids),
    requiresConfirmation: true,
    confirmationMessage: 'This will create new leads from the selected enquiries.'
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4" />,
    action: (ids) => console.log('Delete enquiries:', ids),
    requiresConfirmation: true,
    variant: 'danger'
  }
];

export const PROJECT_BULK_ACTIONS: BulkAction[] = [
  {
    id: 'export',
    label: 'Export Selected',
    icon: <Download className="h-4 w-4" />,
    action: (ids) => console.log('Export projects:', ids)
  },
  {
    id: 'status',
    label: 'Update Status',
    icon: <Edit className="h-4 w-4" />,
    action: (ids) => console.log('Update status for projects:', ids)
  },
  {
    id: 'archive',
    label: 'Archive',
    icon: <Archive className="h-4 w-4" />,
    action: (ids) => console.log('Archive projects:', ids),
    requiresConfirmation: true,
    variant: 'warning'
  }
];