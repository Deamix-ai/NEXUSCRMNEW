// Shared utility functions
import { nanoid } from 'nanoid';

// ID generation
export const generateId = (): string => nanoid();
export const generatePortalKey = (): string => `portal-${nanoid(20)}`;
export const generateJobNumber = (year?: number): string => {
  const currentYear = year || new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BWM-${currentYear}-${sequence}`;
};

// String utilities
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const titleCase = (text: string): string => {
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
};

// Date utilities
export const formatDate = (date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string => {
  const d = new Date(date);
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-GB');
    case 'long':
      return d.toLocaleDateString('en-GB', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'time':
      return d.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    default:
      return d.toLocaleDateString('en-GB');
  }
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return `${formatDate(d)} ${formatDate(d, 'time')}`;
};

export const isBusinessHours = (date: Date = new Date()): boolean => {
  const hour = date.getHours();
  const day = date.getDay();
  return day >= 1 && day <= 5 && hour >= 8 && hour < 20; // Mon-Fri 8am-8pm
};

export const addBusinessDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    // Skip weekends
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      addedDays++;
    }
  }
  
  return result;
};

// Number utilities
export const formatCurrency = (amount: number, currency: string = 'GBP'): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const roundToDecimal = (number: number, decimals: number = 2): number => {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// Phone number utilities
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // UK mobile format
  if (cleaned.match(/^07\d{9}$/)) {
    return cleaned.replace(/(\d{5})(\d{6})/, '$1 $2');
  }
  
  // UK landline format
  if (cleaned.match(/^0\d{10}$/)) {
    return cleaned.replace(/(\d{5})(\d{6})/, '$1 $2');
  }
  
  // International format
  if (cleaned.match(/^\d{10,15}$/)) {
    return `+${cleaned}`;
  }
  
  return phone; // Return original if no pattern matches
};

export const isValidUKPostcode = (postcode: string): boolean => {
  const ukPostcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;
  return ukPostcodeRegex.test(postcode.replace(/\s/g, ''));
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Array utilities
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Object utilities
export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result: any = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
};

export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// URL utilities
export const buildUrl = (base: string, params: Record<string, any>): string => {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};

export const getQueryParams = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

// File utilities
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return imageExtensions.includes(getFileExtension(filename));
};

export const isPdfFile = (filename: string): boolean => {
  return getFileExtension(filename) === 'pdf';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Color utilities
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Lead statuses
    NEW: 'blue',
    CONTACTED: 'yellow',
    QUALIFIED: 'green',
    PROPOSAL_SENT: 'orange',
    WON: 'emerald',
    LOST: 'red',
    
    // Job statuses
    SCHEDULED: 'blue',
    IN_PROGRESS: 'yellow',
    SNAGGING: 'orange',
    COMPLETED: 'green',
    CANCELLED: 'red',
    
    // Task statuses
    PENDING: 'slate',
    // IN_PROGRESS: 'yellow', // Already defined above
    // COMPLETED: 'green',    // Already defined above
    // CANCELLED: 'red',      // Already defined above
    
    // Priority levels
    LOW: 'gray',
    MEDIUM: 'blue',
    HIGH: 'orange',
    URGENT: 'red',
  };
  
  return statusColors[status] || 'gray';
};

// Search utilities
export const fuzzySearch = (query: string, text: string): boolean => {
  const cleanQuery = query.toLowerCase().replace(/\s+/g, '');
  const cleanText = text.toLowerCase().replace(/\s+/g, '');
  
  let queryIndex = 0;
  for (let i = 0; i < cleanText.length && queryIndex < cleanQuery.length; i++) {
    if (cleanText[i] === cleanQuery[queryIndex]) {
      queryIndex++;
    }
  }
  
  return queryIndex === cleanQuery.length;
};

export const highlightMatch = (text: string, query: string): string => {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// Permissions utilities
export const hasPermission = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    ADMIN: 100,
    MANAGER: 80,
    SALES: 60,
    DESIGNER: 50,
    FIELD: 40,
    INSTALLER_COMPANY_OWNER: 30,
    READ_ONLY: 10,
  };
  
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  
  return userLevel >= requiredLevel;
};

export const canAccessField = (userRole: string, field: string, context: Record<string, any> = {}): boolean => {
  // Field-level permissions logic
  const fieldPermissions: Record<string, Record<string, string[]>> = {
    financial: {
      read: ['ADMIN', 'MANAGER'],
      write: ['ADMIN', 'MANAGER'],
    },
    client_contact: {
      read: ['ADMIN', 'MANAGER', 'SALES', 'DESIGNER'],
      write: ['ADMIN', 'MANAGER', 'SALES'],
    },
    compliance: {
      read: ['ADMIN', 'MANAGER', 'FIELD'],
      write: ['ADMIN', 'MANAGER'],
    },
  };
  
  const permission = fieldPermissions[field];
  if (!permission) return true; // No restrictions
  
  return permission.read?.includes(userRole) || false;
};

// Time zone utilities
export const convertToUTC = (date: Date, timezone: string = 'Europe/London'): Date => {
  return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
};

export const convertFromUTC = (date: Date, timezone: string = 'Europe/London'): Date => {
  return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
};

// Retry utilities
export const retry = async <T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, attempts - 1, delay * 2);
  }
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
