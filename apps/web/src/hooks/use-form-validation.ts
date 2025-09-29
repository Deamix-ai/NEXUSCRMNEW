'use client';

import { useState, useCallback } from 'react';
import { z, ZodSchema } from 'zod';
import { validateSchema, ValidationResult } from '../lib/validation';

export interface UseFormValidationOptions<T> {
  schema: ZodSchema<T>;
  initialValues?: Partial<T>;
  onSubmit?: (data: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface FormState<T> {
  values: Partial<T>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  hasErrors: boolean;
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  initialValues = {},
  onSubmit,
  validateOnChange = false,
  validateOnBlur = true,
}: UseFormValidationOptions<T>) {
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: false,
    hasErrors: false,
  });

  // Set a field value
  const setValue = useCallback((field: keyof T, value: any) => {
    setFormState(prev => {
      const newValues = { ...prev.values, [field]: value };
      const newState = { ...prev, values: newValues };

      if (validateOnChange && prev.touched[field as string]) {
        const result = validateSchema(schema, newValues);
        newState.errors = result.errors;
        newState.isValid = result.success;
        newState.hasErrors = Object.keys(result.errors).length > 0;
      }

      return newState;
    });
  }, [schema, validateOnChange]);

  // Set multiple values at once
  const setValues = useCallback((values: Partial<T>) => {
    setFormState(prev => ({
      ...prev,
      values: { ...prev.values, ...values },
    }));
  }, []);

  // Mark a field as touched and optionally validate
  const setFieldTouched = useCallback((field: keyof T, touched = true) => {
    setFormState(prev => {
      const newTouched = { ...prev.touched, [field as string]: touched };
      const newState = { ...prev, touched: newTouched };

      if (validateOnBlur && touched) {
        const result = validateSchema(schema, prev.values);
        newState.errors = result.errors;
        newState.isValid = result.success;
        newState.hasErrors = Object.keys(result.errors).length > 0;
      }

      return newState;
    });
  }, [schema, validateOnBlur]);

  // Validate the entire form
  const validate = useCallback((): ValidationResult => {
    const result = validateSchema(schema, formState.values);
    
    setFormState(prev => ({
      ...prev,
      errors: result.errors,
      isValid: result.success,
      hasErrors: Object.keys(result.errors).length > 0,
    }));

    return result;
  }, [schema, formState.values]);

  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Mark all fields as touched
    const allFieldsTouched = Object.keys(formState.values).reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      {}
    );

    setFormState(prev => ({
      ...prev,
      touched: { ...prev.touched, ...allFieldsTouched },
      isSubmitting: true,
    }));

    try {
      const result = validate();

      if (result.success && onSubmit) {
        await onSubmit(result.data);
      }

      return result;
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  }, [validate, onSubmit, schema]);

  // Reset form to initial state
  const reset = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: false,
      hasErrors: false,
    });
  }, [initialValues]);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      errors: {},
      hasErrors: false,
      isValid: true,
    }));
  }, []);

  // Get field props for input components
  const getFieldProps = useCallback((field: keyof T) => {
    return {
      value: formState.values[field] ?? '',
      error: formState.touched[field as string] ? formState.errors[field as string] : undefined,
      onChange: (value: any) => setValue(field, value),
      onBlur: () => setFieldTouched(field, true),
    };
  }, [formState, setValue, setFieldTouched]);

  // Check if a specific field has an error
  const hasFieldError = useCallback((field: keyof T): boolean => {
    return Boolean(
      formState.touched[field as string] && formState.errors[field as string]
    );
  }, [formState]);

  // Get error message for a specific field
  const getFieldError = useCallback((field: keyof T): string | undefined => {
    return formState.touched[field as string] 
      ? formState.errors[field as string] 
      : undefined;
  }, [formState]);

  return {
    // Form state
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isSubmitting: formState.isSubmitting,
    isValid: formState.isValid,
    hasErrors: formState.hasErrors,

    // Actions
    setValue,
    setValues,
    setFieldTouched,
    validate,
    handleSubmit,
    reset,
    clearErrors,

    // Helpers
    getFieldProps,
    hasFieldError,
    getFieldError,
  };
}