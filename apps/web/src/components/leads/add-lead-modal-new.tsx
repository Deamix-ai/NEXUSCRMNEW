'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Input, Select, Textarea, Button, LoadingSpinner } from '@/components/ui';
import { accountsApi } from '@/lib/api-client';

interface Client {
  id: string;
  name: string;
  legalName?: string;
  emails: string[];
  phones: string[];
  billingAddress?: {
    postcode: string;
    city: string;
    line1: string;
    line2?: string;
  };
  contacts: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    isPrimary: boolean;
  }>;
  status: string;
}

interface LeadFormData {
  title: string;
  description: string;
  source: string;
  projectType: string;
  estimatedValue: number;
  priority: string;
  urgency: string;
  preferredContactMethod: string;
  notes: string;
  status: string;
  accountId: string;
  createdAt: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  clientAddress: string;
}

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: LeadFormData) => void;
  accountId?: string;
}

export function AddLeadModal({ isOpen, onClose, onSubmit, accountId }: AddLeadModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    source: 'Website',
    projectType: '',
    estimatedValue: '',
    priority: 'MEDIUM',
    urgency: 'Normal',
    preferredContactMethod: 'Email',
    notes: '',
    accountId: accountId || '',
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load clients when modal opens
  useEffect(() => {
    if (isOpen && !accountId) {
      loadClients();
    }
  }, [isOpen, accountId]);

  const loadClients = async () => {
    setIsLoadingClients(true);
    try {
      const response = await accountsApi.getAll({ limit: 100 });
      const data = (response as any)?.data || response;
      if (data && Array.isArray(data)) {
        setClients(data);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setIsLoadingClients(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.accountId && !accountId) {
      newErrors.accountId = 'Account selection is required';
    }

    if (!formData.projectType) {
      newErrors.projectType = 'Project type is required';
    }

    if (formData.estimatedValue && Number(formData.estimatedValue) < 0) {
      newErrors.estimatedValue = 'Estimated value must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const leadData: LeadFormData = {
        ...formData,
        estimatedValue: Number(formData.estimatedValue) || 0,
        status: 'NEW',
        createdAt: new Date().toISOString(),
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientCompany: '',
        clientAddress: '',
      };

      await onSubmit(leadData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        source: 'Website',
        projectType: '',
        estimatedValue: '',
        priority: 'MEDIUM',
        urgency: 'Normal',
        preferredContactMethod: 'Email',
        notes: '',
        accountId: accountId || '',
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Lead"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Selection - only show if not in account context */}
        {!accountId && (
          <div>
            {isLoadingClients ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-gray-600">Loading accounts...</span>
              </div>
            ) : (
              <Select
                label="Account *"
                value={formData.accountId}
                onChange={handleChange('accountId')}
                error={errors.accountId}
                placeholder="Select an account"
                required
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                    {client.legalName && ` (${client.legalName})`}
                  </option>
                ))}
              </Select>
            )}
          </div>
        )}

        {/* Lead Title */}
        <Input
          label="Lead Title *"
          value={formData.title}
          onChange={handleChange('title')}
          error={errors.title}
          placeholder="e.g., Bathroom renovation for main house"
          required
        />

        {/* Description */}
        <Textarea
          label="Description"
          value={formData.description}
          onChange={handleChange('description')}
          placeholder="Describe the project requirements..."
          rows={3}
        />

        {/* Two column layout for smaller fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source */}
          <Select
            label="Source"
            value={formData.source}
            onChange={handleChange('source')}
          >
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Google Ads">Google Ads</option>
            <option value="Social Media">Social Media</option>
            <option value="Trade Show">Trade Show</option>
            <option value="Cold Call">Cold Call</option>
            <option value="Other">Other</option>
          </Select>

          {/* Project Type */}
          <Select
            label="Project Type *"
            value={formData.projectType}
            onChange={handleChange('projectType')}
            error={errors.projectType}
            placeholder="Select project type"
            required
          >
            <option value="Bathroom">Bathroom</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Wet Room">Wet Room</option>
            <option value="Ensuite">Ensuite</option>
            <option value="Utility Room">Utility Room</option>
            <option value="Downstairs Toilet">Downstairs Toilet</option>
            <option value="Commercial">Commercial</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Other">Other</option>
          </Select>

          {/* Priority */}
          <Select
            label="Priority"
            value={formData.priority}
            onChange={handleChange('priority')}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </Select>

          {/* Urgency */}
          <Select
            label="Urgency"
            value={formData.urgency}
            onChange={handleChange('urgency')}
          >
            <option value="Normal">Normal</option>
            <option value="ASAP">ASAP</option>
            <option value="Next Week">Next Week</option>
            <option value="Next Month">Next Month</option>
            <option value="Flexible">Flexible</option>
          </Select>

          {/* Estimated Value */}
          <Input
            type="number"
            label="Estimated Value (£)"
            value={formData.estimatedValue}
            onChange={handleChange('estimatedValue')}
            error={errors.estimatedValue}
            placeholder="0"
            min="0"
            step="100"
          />

          {/* Preferred Contact Method */}
          <Select
            label="Preferred Contact"
            value={formData.preferredContactMethod}
            onChange={handleChange('preferredContactMethod')}
          >
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="SMS">SMS</option>
            <option value="WhatsApp">WhatsApp</option>
          </Select>
        </div>

        {/* Notes */}
        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={handleChange('notes')}
          placeholder="Additional notes about this lead..."
          rows={3}
        />

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Creating Lead...</span>
              </>
            ) : (
              'Create Lead'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}