'use client';

import React from 'react';
import { useState } from 'react';
import { X, Phone, Mail, MessageSquare, Calendar, Users, FileText, MapPin } from 'lucide-react';



interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (activityData: ActivityFormData) => void;
  clientId?: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
}

interface ActivityFormData {
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'TASK' | 'APPOINTMENT' | 'SITE_VISIT' | 'QUOTE_SENT' | 'FOLLOW_UP';
  title: string;
  description?: string;
  outcome?: string;
  clientId?: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  scheduledFor?: string;
  completedAt?: string;
  isCompleted: boolean;
}

const activityTypes = [
  { value: 'CALL', label: 'Phone Call', icon: Phone, color: 'bg-green-100 text-green-800' },
  { value: 'EMAIL', label: 'Email', icon: Mail, color: 'bg-blue-100 text-blue-800' },
  { value: 'MEETING', label: 'Meeting', icon: Users, color: 'bg-purple-100 text-purple-800' },
  { value: 'SITE_VISIT', label: 'Site Visit', icon: MapPin, color: 'bg-orange-100 text-orange-800' },
  { value: 'APPOINTMENT', label: 'Appointment', icon: Calendar, color: 'bg-indigo-100 text-indigo-800' },
  { value: 'NOTE', label: 'Note', icon: FileText, color: 'bg-gray-100 text-gray-800' },
  { value: 'TASK', label: 'Task', icon: MessageSquare, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'QUOTE_SENT', label: 'Quote Sent', icon: FileText, color: 'bg-teal-100 text-teal-800' },
  { value: 'FOLLOW_UP', label: 'Follow Up', icon: Calendar, color: 'bg-pink-100 text-pink-800' },
];

export function AddActivityModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  clientId, 
  contactId, 
  leadId, 
  dealId 
}: AddActivityModalProps) {
  const [formData, setFormData] = useState<ActivityFormData>({
    type: 'NOTE',
    title: '',
    description: '',
    outcome: '',
    clientId,
    contactId,
    leadId,
    dealId,
    scheduledFor: '',
    completedAt: '',
    isCompleted: false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        // Convert empty strings to undefined
        scheduledFor: formData.scheduledFor || undefined,
        completedAt: formData.isCompleted ? (formData.completedAt || new Date().toISOString()) : undefined,
      };
      
      await onSubmit(submitData);
      
      // Reset form
      setFormData({
        type: 'NOTE',
        title: '',
        description: '',
        outcome: '',
        clientId,
        contactId,
        leadId,
        dealId,
        scheduledFor: '',
        completedAt: '',
        isCompleted: false,
      });
      onClose();
    } catch (error) {
      console.error('Failed to create activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof ActivityFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedType = activityTypes.find(type => type.value === formData.type);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add New Activity</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Activity Type *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {activityTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateFormData('type', type.value)}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                      formData.type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the activity"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => updateFormData('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detailed description of what happened or needs to happen"
            />
          </div>

          {/* Scheduling */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scheduled For
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledFor || ''}
              onChange={(e) => updateFormData('scheduledFor', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Completion Status */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isCompleted}
                onChange={(e) => updateFormData('isCompleted', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Mark as completed</span>
            </label>
          </div>

          {/* Completion Date (if completed) */}
          {formData.isCompleted && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Completed At
              </label>
              <input
                type="datetime-local"
                value={formData.completedAt || ''}
                onChange={(e) => updateFormData('completedAt', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Leave empty for current time"
              />
            </div>
          )}

          {/* Outcome (if completed) */}
          {formData.isCompleted && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outcome
              </label>
              <textarea
                value={formData.outcome || ''}
                onChange={(e) => updateFormData('outcome', e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What was the result or outcome?"
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
