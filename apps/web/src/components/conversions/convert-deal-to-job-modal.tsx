'use client';

import React from 'react';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';

// Room types from shared constants
const ROOM_TYPES = {
  BATHROOM: 'Bathroom',
  EN_SUITE: 'En-Suite',
  WC: 'WC/Cloakroom',
  WETROOM: 'Wet Room',
  SHOWER_ROOM: 'Shower Room',
  UTILITY: 'Utility Room',
};



interface ConvertDealToJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConvert: (jobData: {
    title: string;
    description?: string;
    roomId: string;
    quotedValue?: number;
    surveyDate?: string;
    startDate?: string;
    expectedEndDate?: string;
  }) => void;
  dealTitle: string;
  dealValue?: number;
}

export function ConvertDealToJobModal({
  isOpen,
  onClose,
  onConvert,
  dealTitle,
  dealValue
}: ConvertDealToJobModalProps) {
  const [formData, setFormData] = useState({
    title: dealTitle,
    description: '',
    roomId: 'BATHROOM', // Default to bathroom - first room type
    quotedValue: dealValue || 0,
    surveyDate: '',
    startDate: '',
    expectedEndDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConvert(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quotedValue' ? Number(value) : value
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Convert Deal to Job
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Job Title *
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

            <div>
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
                Room Type *
              </label>
              <select
                id="roomId"
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              >
                {Object.entries(ROOM_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="quotedValue" className="block text-sm font-medium text-gray-700">
                Quoted Value (£)
              </label>
              <input
                type="number"
                id="quotedValue"
                name="quotedValue"
                value={formData.quotedValue}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="surveyDate" className="block text-sm font-medium text-gray-700">
                  Survey Date
                </label>
                <input
                  type="date"
                  id="surveyDate"
                  name="surveyDate"
                  value={formData.surveyDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="expectedEndDate" className="block text-sm font-medium text-gray-700">
                  Expected End
                </label>
                <input
                  type="date"
                  id="expectedEndDate"
                  name="expectedEndDate"
                  value={formData.expectedEndDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>
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
                Convert to Job
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
