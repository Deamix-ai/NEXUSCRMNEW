'use client';

import React from 'react';
import { Modal } from '../ui/modal';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { LoadingSpinner } from '../ui/loading-spinner';
import { useFormValidation } from '../../hooks/use-form-validation';
import { formSchemas } from '../../lib/validation';
import { useApiError, apiRequestWithRetry } from '../../lib/api-errors';
import { ErrorBoundary } from '../error-boundary';

interface AddLeadModalValidatedProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
}

function AddLeadModalContent({ isOpen, onClose, onSuccess }: AddLeadModalValidatedProps) {
  const [clients, setClients] = React.useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = React.useState(false);
  const { handleError } = useApiError();

  const form = useFormValidation({
    schema: formSchemas.lead,
    initialValues: {
      title: '',
      description: '',
      estimatedValue: undefined,
      clientId: '',
      priority: 'MEDIUM' as const,
      expectedCloseDate: undefined,
    },
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (data) => {
      try {
        await apiRequestWithRetry('/api/leads', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        
        onSuccess?.();
        onClose();
        form.reset();
      } catch (error) {
        handleError(error);
      }
    },
  });

  // Load clients when modal opens
  React.useEffect(() => {
    if (!isOpen) return;

    const loadClients = async () => {
      setLoadingClients(true);
      try {
        const clientsData = await apiRequestWithRetry<Client[]>('/api/clients');
        setClients(clientsData);
      } catch (error) {
        handleError(error);
      } finally {
        setLoadingClients(false);
      }
    };

    loadClients();
  }, [isOpen, handleError]);

  const clientOptions = clients.map(client => ({
    value: client.id,
    label: `${client.firstName} ${client.lastName}`,
  }));

  const priorityOptions = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Lead"
      size="md"
    >
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <Input
          label="Lead Title"
          placeholder="Enter lead title..."
          required
          {...form.getFieldProps('title')}
        />

        <Textarea
          label="Description"
          placeholder="Enter lead description..."
          rows={3}
          {...form.getFieldProps('description')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Estimated Value (£)"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            {...form.getFieldProps('estimatedValue')}
          />

          <Select
            label="Priority"
            required
            {...form.getFieldProps('priority')}
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <Select
          label="Account"
          placeholder={loadingClients ? "Loading clients..." : "Select a client..."}
          required
          disabled={loadingClients}
          {...form.getFieldProps('clientId')}
        >
          {clientOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Input
          label="Expected Close Date"
          type="datetime-local"
          {...form.getFieldProps('expectedCloseDate')}
        />

        {/* Display form-level errors */}
        {form.hasErrors && Object.keys(form.errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Please fix the following errors:
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(form.errors).map(([field, message]) => (
                <li key={field}>• {message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={form.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.isSubmitting || !form.isValid}
          >
            {form.isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating Lead...
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

export function AddLeadModalValidated(props: AddLeadModalValidatedProps) {
  return (
    <ErrorBoundary
      fallback={
        <Modal
          isOpen={props.isOpen}
          onClose={props.onClose}
          title="Error"
          size="md"
        >
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Failed to load the add lead form. Please try again.
            </p>
            <Button onClick={props.onClose}>Close</Button>
          </div>
        </Modal>
      }
    >
      <AddLeadModalContent {...props} />
    </ErrorBoundary>
  );
}