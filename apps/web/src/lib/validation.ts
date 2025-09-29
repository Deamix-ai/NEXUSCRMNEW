import { z, ZodError, ZodSchema } from 'zod';

// Types for validation results
export interface ValidationResult {
  success: boolean;
  errors: Record<string, string>;
  data?: any;
}

export interface FieldError {
  field: string;
  message: string;
}

// Utility function to validate data against a Zod schema
export function validateSchema<T>(
  schema: ZodSchema<T>,
  data: unknown
): ValidationResult {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      errors: {},
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {};
      
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: { general: 'Validation failed' },
    };
  }
}

// Utility to format error messages for display
export function formatValidationErrors(errors: Record<string, string>): string[] {
  return Object.entries(errors).map(([field, message]) => {
    // Convert camelCase field names to readable format
    const readableField = field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
    
    return `${readableField}: ${message}`;
  });
}

// Custom validation schemas for common patterns
export const commonValidations = {
  // UK postcode validation
  ukPostcode: z
    .string()
    .regex(
      /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i,
      'Please enter a valid UK postcode'
    ),

  // UK phone number validation
  ukPhone: z
    .string()
    .regex(
      /^(\+44\s?|0)(7\d{9}|[1-9]\d{8,9})$/,
      'Please enter a valid UK phone number'
    ),

  // Professional email validation
  professionalEmail: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(254, 'Email must be less than 254 characters'),

  // Strong password validation
  strongPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, lowercase letter, number, and special character'
    ),

  // Currency validation (GBP)
  currency: z
    .number()
    .min(0, 'Amount must be positive')
    .max(999999.99, 'Amount is too large'),

  // Required string that's not just whitespace
  requiredString: z
    .string()
    .min(1, 'This field is required')
    .trim()
    .refine((val) => val.length > 0, 'This field cannot be empty'),

  // Optional string that's trimmed
  optionalString: z.string().trim().optional(),

  // File validation
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type),
      'File must be JPEG, PNG, WebP, or PDF'
    ),
};

// Higher-order function to create form validation hooks
export function createFormValidator<T>(schema: ZodSchema<T>) {
  return function useFormValidation(initialData?: Partial<T>) {
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [isValid, setIsValid] = React.useState(false);

    const validate = (data: unknown): ValidationResult => {
      const result = validateSchema(schema, data);
      setErrors(result.errors);
      setIsValid(result.success);
      return result;
    };

    const validateField = (fieldName: string, value: unknown) => {
      try {
        // For individual field validation, we'll validate the entire object
        // with the current field updated, then extract field-specific errors
        const testData = { ...initialData, [fieldName]: value };
        const result = validateSchema(schema, testData);
        
        if (result.success) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
          });
        } else if (result.errors[fieldName]) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: result.errors[fieldName],
          }));
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: 'Invalid value',
        }));
      }
    };

    const clearErrors = () => {
      setErrors({});
      setIsValid(false);
    };

    const getFieldError = (fieldName: string): string | undefined => {
      return errors[fieldName];
    };

    const hasFieldError = (fieldName: string): boolean => {
      return Boolean(errors[fieldName]);
    };

    return {
      validate,
      validateField,
      clearErrors,
      getFieldError,
      hasFieldError,
      errors,
      isValid,
      hasErrors: Object.keys(errors).length > 0,
    };
  };
}

// Common form schemas for the CRM
export const formSchemas = {
  // Simple contact form
  contact: z.object({
    firstName: commonValidations.requiredString,
    lastName: commonValidations.requiredString,
    email: commonValidations.professionalEmail,
    phone: commonValidations.ukPhone.optional(),
    message: commonValidations.optionalString,
  }),

  // Lead creation form
  lead: z.object({
    title: commonValidations.requiredString,
    description: commonValidations.optionalString,
    estimatedValue: commonValidations.currency.optional(),
    clientId: z.string().min(1, 'Please select a client'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    expectedCloseDate: z.string().datetime().optional(),
  }),

  // Client creation form
  client: z.object({
    firstName: commonValidations.requiredString,
    lastName: commonValidations.requiredString,
    email: commonValidations.professionalEmail.optional(),
    phone: commonValidations.ukPhone.optional(),
    mobile: commonValidations.ukPhone.optional(),
    companyName: commonValidations.optionalString,
    addressLine1: commonValidations.optionalString,
    addressLine2: commonValidations.optionalString,
    city: commonValidations.optionalString,
    postcode: commonValidations.ukPostcode.optional(),
    clientType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'TRADE']).default('RESIDENTIAL'),
  }),
};

// React import (this should be at the top in a real file)
import React from 'react';