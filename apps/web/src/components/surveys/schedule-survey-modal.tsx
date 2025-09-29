'use client';

import React from 'react';
import { useState } from 'react';
import { X, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';



interface ScheduleSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (surveyData: SurveyData) => Promise<void>;
  clientId: string;
  roomId?: string;
}

interface SurveyData {
  title: string;
  type: SurveyType;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  location: string;
  surveyorNotes: string;
  clientNotes: string;
  contactPersonId?: string;
  requiresAccess: boolean;
  equipmentNeeded: string[];
}

type SurveyType = 
  | 'INITIAL_SURVEY'
  | 'DESIGN_SURVEY'
  | 'TECHNICAL_SURVEY'
  | 'FINAL_INSPECTION'
  | 'REMEDIAL_SURVEY';

const SURVEY_TYPES = [
  { value: 'INITIAL_SURVEY', label: 'Initial Survey', description: 'First visit to assess requirements' },
  { value: 'DESIGN_SURVEY', label: 'Design Survey', description: 'Detailed measurements for design' },
  { value: 'TECHNICAL_SURVEY', label: 'Technical Survey', description: 'Technical assessment and feasibility' },
  { value: 'FINAL_INSPECTION', label: 'Final Inspection', description: 'Pre-completion quality check' },
  { value: 'REMEDIAL_SURVEY', label: 'Remedial Survey', description: 'Follow-up survey for issues' },
] as const;

const EQUIPMENT_OPTIONS = [
  'Measuring tape',
  'Laser measure',
  'Level',
  'Camera',
  'Moisture meter',
  'Borescope',
  'Ladder',
  'Safety equipment',
  'Notebook/tablet',
  'Floor plans',
];

export default function ScheduleSurveyModal({
  isOpen,
  onClose,
  onSubmit,
  clientId,
  roomId,
}: ScheduleSurveyModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<SurveyType>('INITIAL_SURVEY');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState(120); // minutes
  const [location, setLocation] = useState('');
  const [surveyorNotes, setSurveyorNotes] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [requiresAccess, setRequiresAccess] = useState(true);
  const [equipmentNeeded, setEquipmentNeeded] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEquipmentToggle = (equipment: string) => {
    setEquipmentNeeded(prev => 
      prev.includes(equipment)
        ? prev.filter(item => item !== equipment)
        : [...prev, equipment]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Survey title is required');
      return;
    }
    
    if (!scheduledDate || !scheduledTime) {
      setError('Date and time are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const surveyData: SurveyData = {
        title: title.trim(),
        type,
        scheduledDate,
        scheduledTime,
        duration,
        location: location.trim(),
        surveyorNotes: surveyorNotes.trim(),
        clientNotes: clientNotes.trim(),
        requiresAccess,
        equipmentNeeded,
      };

      await onSubmit(surveyData);
      
      // Reset form
      setTitle('');
      setType('INITIAL_SURVEY');
      setScheduledDate('');
      setScheduledTime('');
      setDuration(120);
      setLocation('');
      setSurveyorNotes('');
      setClientNotes('');
      setRequiresAccess(true);
      setEquipmentNeeded([]);
      
      onClose();
    } catch (error) {
      console.error('Failed to schedule survey:', error);
      setError('Failed to schedule survey. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  // Get today's date for min date input
  const today = new Date().toISOString().split('T')[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Schedule Survey</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Survey Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bathroom Survey - Initial Assessment"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Survey Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Survey Type *
            </label>
            <div className="space-y-2">
              {SURVEY_TYPES.map((surveyType) => (
                <label key={surveyType.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="surveyType"
                    value={surveyType.value}
                    checked={type === surveyType.value}
                    onChange={(e) => setType(e.target.value as SurveyType)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {surveyType.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {surveyType.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date *
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={today}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Time *
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration: {formatDuration(duration)}
            </label>
            <input
              type="range"
              min="30"
              max="480"
              step="30"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>30m</span>
              <span>8h</span>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location/Address
            </label>
            <textarea
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter the survey location address or meeting point"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>

          {/* Access Requirements */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="requiresAccess"
              checked={requiresAccess}
              onChange={(e) => setRequiresAccess(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="requiresAccess" className="ml-2 text-sm text-gray-700">
              Requires client to provide access/keys
            </label>
          </div>

          {/* Equipment Needed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipment Needed
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EQUIPMENT_OPTIONS.map((equipment) => (
                <label key={equipment} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={equipmentNeeded.includes(equipment)}
                    onChange={() => handleEquipmentToggle(equipment)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{equipment}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Internal Notes
              </label>
              <textarea
                value={surveyorNotes}
                onChange={(e) => setSurveyorNotes(e.target.value)}
                placeholder="Internal notes for the surveyor"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Notes
              </label>
              <textarea
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                placeholder="Notes for the client (will be shared)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !scheduledDate || !scheduledTime}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Scheduling...' : 'Schedule Survey'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
