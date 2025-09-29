'use client';

import React from 'react';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';

// Pipeline stages from shared constants
const DEFAULT_PIPELINE_STAGES = [
  { name: 'New Lead', probability: 10, order: 1, id: 'new-lead' },
  { name: 'Qualified', probability: 25, order: 2, id: 'qualified' },
  { name: 'Survey Booked', probability: 40, order: 3, id: 'survey-booked' },
  { name: 'Quote Sent', probability: 60, order: 4, id: 'quote-sent' },
  { name: 'Negotiating', probability: 75, order: 5, id: 'negotiating' },
  { name: 'Won', probability: 100, order: 6, isClosedWon: true, id: 'won' },
  { name: 'Lost', probability: 0, order: 7, isClosedLost: true, id: 'lost' },
];



interface ConvertLeadToDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConvert: (dealData: {
    title: string;
    description?: string;
    value: number;
    probability?: number;
    expectedCloseDate?: string;
    stageId: string;
  }) => void;
  leadTitle: string;
  leadValue?: number;
}

export function ConvertLeadToDealModal({
  isOpen,
  onClose,
  onConvert,
  leadTitle,
  leadValue
}: ConvertLeadToDealModalProps) {
  const [formData, setFormData] = useState({
    title: leadTitle,
    description: '',
    value: leadValue || 0,
    probability: 75,
    expectedCloseDate: '',
    stageId: DEFAULT_PIPELINE_STAGES[0].id // Use first stage as default
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConvert(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updates: any = {
        [name]: name === 'value' || name === 'probability' ? Number(value) : value
      };
      
      // Auto-update probability when stage changes
      if (name === 'stageId') {
        const selectedStage = DEFAULT_PIPELINE_STAGES.find(stage => stage.id === value);
        if (selectedStage) {
          updates.probability = selectedStage.probability;
        }
      }
      
      return { ...prev, ...updates };
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Convert Lead to Deal
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Deal Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                  Deal Value (£) *
                </label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="probability" className="block text-sm font-medium text-gray-700">
                  Probability (%)
                </label>
                <input
                  type="number"
                  id="probability"
                  name="probability"
                  value={formData.probability}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="expectedCloseDate" className="block text-sm font-medium text-gray-700">
                Expected Close Date
              </label>
              <input
                type="date"
                id="expectedCloseDate"
                name="expectedCloseDate"
                value={formData.expectedCloseDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="stageId" className="block text-sm font-medium text-gray-700">
                Pipeline Stage *
              </label>
              <select
                id="stageId"
                name="stageId"
                value={formData.stageId}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              >
                {DEFAULT_PIPELINE_STAGES.filter(stage => !stage.isClosedWon && !stage.isClosedLost).map(stage => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name} ({stage.probability}% probability)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md border border-transparent bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Convert to Deal
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
