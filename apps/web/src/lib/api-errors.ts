// API Error handling utilities

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: Record<string, any>;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class ApiErrorHandler {
  // Convert fetch response errors to standardized format
  static async fromResponse(response: Response): Promise<ApiError> {
    let errorData: any;
    
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText || 'Unknown error' };
    }

    return new ApiError(
      errorData.message || this.getDefaultMessage(response.status),
      response.status,
      errorData.code || errorData.error,
      errorData.details || errorData
    );
  }

  // Convert generic errors to standardized format
  static fromError(error: unknown): ApiError {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new ApiError(
        'Network error. Please check your connection and try again.',
        0,
        'NETWORK_ERROR'
      );
    }

    if (error instanceof Error) {
      return new ApiError(
        error.message,
        500,
        'UNKNOWN_ERROR'
      );
    }

    return new ApiError(
      'An unexpected error occurred',
      500,
      'UNKNOWN_ERROR'
    );
  }

  // Get user-friendly messages for HTTP status codes
  static getDefaultMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication required. Please log in and try again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This action conflicts with existing data. Please refresh and try again.';
      case 422:
        return 'Invalid data provided. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // Get user-friendly message with optional technical details
  static getUserMessage(error: ApiError, showTechnical = false): string {
    let message = error.message;

    if (showTechnical && error.code) {
      message += ` (${error.code})`;
    }

    return message;
  }

  // Check if error should trigger logout
  static shouldLogout(error: ApiError): boolean {
    return error.status === 401 || error.code === 'TOKEN_EXPIRED';
  }

  // Check if error is retryable
  static isRetryable(error: ApiError): boolean {
    return [408, 429, 500, 502, 503, 504].includes(error.status) ||
           error.code === 'NETWORK_ERROR';
  }

  // Get retry delay in milliseconds
  static getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
    return Math.min(1000 * Math.pow(2, attempt - 1), 30000);
  }
}

// Toast notification types for errors
export interface ErrorToast {
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export class ErrorNotificationService {
  static createErrorToast(error: ApiError): ErrorToast {
    const isServerError = error.status >= 500;
    const isClientError = error.status >= 400 && error.status < 500;

    return {
      type: isServerError ? 'error' : 'warning',
      title: this.getErrorTitle(error),
      message: ApiErrorHandler.getUserMessage(error),
      duration: isServerError ? 0 : 5000, // Server errors stay until dismissed
      action: ApiErrorHandler.isRetryable(error) ? {
        label: 'Retry',
        onClick: () => window.location.reload(),
      } : undefined,
    };
  }

  private static getErrorTitle(error: ApiError): string {
    if (error.status === 0) return 'Connection Error';
    if (error.status === 401) return 'Authentication Required';
    if (error.status === 403) return 'Access Denied';
    if (error.status === 404) return 'Not Found';
    if (error.status === 422) return 'Validation Error';
    if (error.status >= 500) return 'Server Error';
    return 'Error';
  }
}

// Enhanced fetch wrapper with error handling
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw await ApiErrorHandler.fromResponse(response);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiErrorHandler.fromError(error);
  }
}

// Retry wrapper for API requests
export async function apiRequestWithRetry<T = any>(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<T> {
  let lastError: ApiError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiRequest<T>(url, options);
    } catch (error) {
      lastError = error instanceof ApiError ? error : ApiErrorHandler.fromError(error);

      // Don't retry client errors (4xx) except 408 and 429
      if (!ApiErrorHandler.isRetryable(lastError)) {
        throw lastError;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Wait before retrying
      await new Promise(resolve => 
        setTimeout(resolve, ApiErrorHandler.getRetryDelay(attempt))
      );
    }
  }

  throw lastError!;
}

// React hook for handling API errors
export function useApiError() {
  const handleError = (error: unknown): ApiError => {
    const apiError = error instanceof ApiError ? error : ApiErrorHandler.fromError(error);
    
    // Log error for debugging
    console.error('API Error:', apiError);

    return apiError;
  };

  return { handleError };
}