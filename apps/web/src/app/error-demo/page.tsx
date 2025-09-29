'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ErrorBoundary } from '@/components/error-boundary';
import { useToast } from '@/components/ui/Toast';
import { useFormValidation } from '@/hooks/use-form-validation';
import { formSchemas } from '@/lib/validation';
import { useApiError, ApiError, apiRequestWithRetry } from '@/lib/api-errors';

// Component that intentionally throws an error
function ErrorComponent() {
  const [shouldError, setShouldError] = React.useState(false);

  if (shouldError) {
    throw new Error('This is a test error from ErrorComponent');
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-2">Error Boundary Test</h3>
      <p className="text-sm text-gray-600 mb-4">
        This component will throw an error when you click the button.
      </p>
      <Button 
        onClick={() => setShouldError(true)}
        variant="destructive"
      >
        Trigger Error
      </Button>
    </div>
  );
}

// Form validation demo
function ValidationDemo() {
  const form = useFormValidation({
    schema: formSchemas.contact,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  });

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Form Validation Demo</h3>
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <Input
          label="First Name"
          placeholder="Enter your first name"
          required
          {...form.getFieldProps('firstName')}
        />
        
        <Input
          label="Last Name"
          placeholder="Enter your last name"
          required
          {...form.getFieldProps('lastName')}
        />
        
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
          {...form.getFieldProps('email')}
        />
        
        <Input
          label="Phone (UK)"
          placeholder="+44 7123 456789"
          {...form.getFieldProps('phone')}
        />

        {form.hasErrors && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Validation Errors:
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(form.errors).map(([field, message]) => (
                <li key={field}>• {field}: {message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={form.isSubmitting || !form.isValid}
          >
            {form.isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={form.reset}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}

// API error demo
function ApiErrorDemo() {
  const { addToast } = useToast();
  const { handleError } = useApiError();
  const [isLoading, setIsLoading] = React.useState(false);

  const simulateApiError = async (errorType: string) => {
    setIsLoading(true);
    try {
      switch (errorType) {
        case 'network':
          // Simulate network error
          throw new Error('Failed to fetch');
        case '401':
          throw new ApiError('Unauthorized access', 401, 'UNAUTHORIZED');
        case '403':
          throw new ApiError('Access forbidden', 403, 'FORBIDDEN');
        case '404':
          throw new ApiError('Resource not found', 404, 'NOT_FOUND');
        case '422':
          throw new ApiError('Validation failed', 422, 'VALIDATION_ERROR', {
            fields: { email: 'Invalid email format' }
          });
        case '500':
          throw new ApiError('Internal server error', 500, 'INTERNAL_ERROR');
        case 'success':
          addToast({
            type: 'success',
            title: 'Success!',
            message: 'Operation completed successfully.',
          });
          return;
        default:
          await apiRequestWithRetry('/api/nonexistent-endpoint');
      }
    } catch (error) {
      const apiError = handleError(error);
      
      // Show toast for the error
      addToast({
        type: 'error',
        title: `Error ${apiError.status || 'Unknown'}`,
        message: apiError.message,
        action: apiError.status >= 500 ? {
          label: 'Retry',
          onClick: () => simulateApiError(errorType),
        } : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">API Error Handling Demo</h3>
      <p className="text-sm text-gray-600 mb-4">
        Click these buttons to see different types of API errors and how they're handled.
      </p>
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => simulateApiError('success')}
          disabled={isLoading}
          variant="outline"
        >
          Success
        </Button>
        <Button
          onClick={() => simulateApiError('network')}
          disabled={isLoading}
          variant="destructive"
        >
          Network Error
        </Button>
        <Button
          onClick={() => simulateApiError('401')}
          disabled={isLoading}
          variant="destructive"
        >
          401 Unauthorized
        </Button>
        <Button
          onClick={() => simulateApiError('403')}
          disabled={isLoading}
          variant="destructive"
        >
          403 Forbidden
        </Button>
        <Button
          onClick={() => simulateApiError('404')}
          disabled={isLoading}
          variant="destructive"
        >
          404 Not Found
        </Button>
        <Button
          onClick={() => simulateApiError('422')}
          disabled={isLoading}
          variant="destructive"
        >
          422 Validation
        </Button>
        <Button
          onClick={() => simulateApiError('500')}
          disabled={isLoading}
          variant="destructive"
        >
          500 Server Error
        </Button>
        <Button
          onClick={() => simulateApiError('real')}
          disabled={isLoading}
          variant="destructive"
        >
          Real API Call
        </Button>
      </div>
    </Card>
  );
}

// Toast demo
function ToastDemo() {
  const { addToast } = useToast();

  const showToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: { title: 'Success!', message: 'Your action was completed successfully.' },
      error: { title: 'Error!', message: 'Something went wrong. Please try again.' },
      warning: { title: 'Warning!', message: 'Please check your input before proceeding.' },
      info: { title: 'Info', message: 'Here is some useful information for you.' },
    };

    addToast({
      type,
      ...messages[type],
      action: type === 'error' ? {
        label: 'Retry',
        onClick: () => console.log('Retry clicked'),
      } : undefined,
    });
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Toast Notifications Demo</h3>
      <p className="text-sm text-gray-600 mb-4">
        Click these buttons to see different types of toast notifications.
      </p>
      
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => showToast('success')} variant="outline">
          Success Toast
        </Button>
        <Button onClick={() => showToast('error')} variant="destructive">
          Error Toast
        </Button>
        <Button onClick={() => showToast('warning')} variant="outline">
          Warning Toast
        </Button>
        <Button onClick={() => showToast('info')} variant="outline">
          Info Toast
        </Button>
      </div>
    </Card>
  );
}

export default function ErrorHandlingDemo() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Error Handling & Validation Demo</h1>
        <p className="text-gray-600">
          This page demonstrates comprehensive error handling, form validation, and user notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Boundary Demo */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Error Boundary Demo</h3>
          <ErrorBoundary>
            <ErrorComponent />
          </ErrorBoundary>
        </Card>

        {/* Toast Demo */}
        <ToastDemo />

        {/* API Error Demo */}
        <ApiErrorDemo />

        {/* Form Validation Demo */}
        <ValidationDemo />
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Error Handling Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Error Boundaries</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Catch React component errors</li>
              <li>• Display fallback UI</li>
              <li>• Development error details</li>
              <li>• Retry functionality</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Form Validation</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Zod schema validation</li>
              <li>• Real-time field validation</li>
              <li>• Custom validation rules</li>
              <li>• Error message display</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">API Error Handling</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Standardized error format</li>
              <li>• Automatic retry logic</li>
              <li>• User-friendly messages</li>
              <li>• Network error detection</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}