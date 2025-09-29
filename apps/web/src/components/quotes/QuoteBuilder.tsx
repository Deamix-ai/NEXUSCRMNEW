'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  X,
  Edit3,
  Calculator,
  Save,
  Send,
  Copy,
  Download,
  Eye,
  Settings,
  DollarSign,
  Percent,
  Package,
  User,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  Trash2,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

// Types for Quote Builder
interface QuoteItem {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  total: number;
  isOptional: boolean;
  notes?: string;
}

interface QuoteTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  items: QuoteItem[];
  terms: string;
  validityDays: number;
  isDefault: boolean;
}

interface Quote {
  id?: string;
  quoteNumber: string;
  title: string;
  description: string;
  accountId: string;
  contactId: string;
  ownerId: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  items: QuoteItem[];
  subtotal: number;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  taxRate: number;
  taxAmount: number;
  total: number;
  validUntil: string;
  terms: string;
  notes: string;
  templateId?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  viewedAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
}

interface Account {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  accountId: string;
}

interface QuoteBuilderProps {
  quote?: Quote;
  accounts: Account[];
  contacts: Contact[];
  templates: QuoteTemplate[];
  productCatalog: QuoteItem[];
  onSave: (quote: Quote) => void;
  onSend: (quote: Quote) => void;
  onPreview: (quote: Quote) => void;
  onDuplicate: (quote: Quote) => void;
  onDelete?: (quoteId: string) => void;
}

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({
  quote: initialQuote,
  accounts,
  contacts,
  templates,
  productCatalog,
  onSave,
  onSend,
  onPreview,
  onDuplicate,
  onDelete
}) => {
  // State management
  const [quote, setQuote] = useState<Quote>(() => {
    if (initialQuote) return initialQuote;
    
    return {
      quoteNumber: `Q-${Date.now()}`,
      title: '',
      description: '',
      accountId: '',
      contactId: '',
      ownerId: 'current-user-id',
      status: 'draft',
      items: [],
      subtotal: 0,
      discountAmount: 0,
      discountType: 'percentage',
      taxRate: 20,
      taxAmount: 0,
      total: 0,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      terms: 'Payment due within 30 days of acceptance. All work to be completed as per specifications.',
      notes: '',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showProductCatalog, setShowProductCatalog] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<QuoteItem>>({
    name: '',
    description: '',
    category: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    discountType: 'percentage',
    isOptional: false
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Calculate totals whenever items or discounts change
  useEffect(() => {
    calculateTotals();
  }, [quote.items, quote.discountAmount, quote.discountType, quote.taxRate]);

  const calculateTotals = () => {
    const subtotal = quote.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      const itemDiscount = item.discountType === 'percentage' 
        ? itemTotal * (item.discount / 100)
        : item.discount;
      return sum + (itemTotal - itemDiscount);
    }, 0);

    const globalDiscount = quote.discountType === 'percentage'
      ? subtotal * (quote.discountAmount / 100)
      : quote.discountAmount;

    const discountedSubtotal = subtotal - globalDiscount;
    const taxAmount = discountedSubtotal * (quote.taxRate / 100);
    const total = discountedSubtotal + taxAmount;

    setQuote(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }));
  };

  const handleAccountChange = (accountId: string) => {
    setQuote(prev => ({
      ...prev,
      accountId,
      contactId: '' // Reset contact when account changes
    }));
  };

  const filteredContacts = contacts.filter(contact => contact.accountId === quote.accountId);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setQuote(prev => ({
        ...prev,
        items: template.items.map(item => ({
          ...item,
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })),
        terms: template.terms,
        validUntil: new Date(Date.now() + template.validityDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        templateId
      }));
    }
    setSelectedTemplate('');
  };

  const addItemFromCatalog = (catalogItem: QuoteItem) => {
    const newQuoteItem: QuoteItem = {
      ...catalogItem,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      quantity: 1,
      total: catalogItem.unitPrice
    };

    setQuote(prev => ({
      ...prev,
      items: [...prev.items, newQuoteItem]
    }));
    setShowProductCatalog(false);
  };

  const addCustomItem = () => {
    if (!newItem.name || !newItem.unitPrice) {
      setValidationErrors({
        name: !newItem.name ? 'Item name is required' : '',
        unitPrice: !newItem.unitPrice ? 'Unit price is required' : ''
      });
      return;
    }

    const item: QuoteItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newItem.name || '',
      description: newItem.description || '',
      category: newItem.category || 'Custom',
      quantity: newItem.quantity || 1,
      unitPrice: newItem.unitPrice || 0,
      discount: newItem.discount || 0,
      discountType: newItem.discountType || 'percentage',
      total: (newItem.quantity || 1) * (newItem.unitPrice || 0),
      isOptional: newItem.isOptional || false,
      notes: newItem.notes
    };

    setQuote(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));

    setNewItem({
      name: '',
      description: '',
      category: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountType: 'percentage',
      isOptional: false
    });
    setValidationErrors({});
  };

  const updateItem = (itemId: string, updates: Partial<QuoteItem>) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updated = { ...item, ...updates };
          const itemTotal = updated.quantity * updated.unitPrice;
          const itemDiscount = updated.discountType === 'percentage' 
            ? itemTotal * (updated.discount / 100)
            : updated.discount;
          updated.total = itemTotal - itemDiscount;
          return updated;
        }
        return item;
      })
    }));
  };

  const removeItem = (itemId: string) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const duplicateItem = (itemId: string) => {
    const item = quote.items.find(i => i.id === itemId);
    if (item) {
      const duplicated: QuoteItem = {
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${item.name} (Copy)`
      };
      setQuote(prev => ({
        ...prev,
        items: [...prev.items, duplicated]
      }));
    }
  };

  const validateQuote = (): boolean => {
    const errors: Record<string, string> = {};

    if (!quote.title) errors.title = 'Quote title is required';
    if (!quote.accountId) errors.account = 'Account selection is required';
    if (!quote.contactId) errors.contact = 'Contact selection is required';
    if (quote.items.length === 0) errors.items = 'At least one item is required';
    if (!quote.validUntil) errors.validUntil = 'Valid until date is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateQuote()) return;

    const updatedQuote = {
      ...quote,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedQuote);
  };

  const handleSend = () => {
    if (!validateQuote()) return;

    const updatedQuote = {
      ...quote,
      status: 'sent' as const,
      sentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSend(updatedQuote);
  };

  const selectedAccount = accounts.find(a => a.id === quote.accountId);
  const selectedContact = contacts.find(c => c.id === quote.contactId);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {initialQuote ? 'Edit Quote' : 'Create New Quote'}
              </h2>
              <p className="text-sm text-gray-600">
                Quote #{quote.quoteNumber} • {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onPreview(quote)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>

            <button
              onClick={handleSend}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
              <span>Send Quote</span>
            </button>
          </div>
        </div>

        {/* Quote Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quote Title *
            </label>
            <input
              type="text"
              value={quote.title}
              onChange={(e) => setQuote(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter quote title..."
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a template...</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name} ({template.items.length} items)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={quote.description}
            onChange={(e) => setQuote(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of the quote..."
          />
        </div>
      </div>

      {/* Customer Information */}
      <div className="border-b border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Customer Information
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account *
            </label>
            <select
              value={quote.accountId}
              onChange={(e) => handleAccountChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.account ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select an account...</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {validationErrors.account && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.account}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact *
            </label>
            <select
              value={quote.contactId}
              onChange={(e) => setQuote(prev => ({ ...prev, contactId: e.target.value }))}
              disabled={!quote.accountId}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.contact ? 'border-red-300' : 'border-gray-300'
              } ${!quote.accountId ? 'bg-gray-100' : ''}`}
            >
              <option value="">Select a contact...</option>
              {filteredContacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName} ({contact.email})
                </option>
              ))}
            </select>
            {validationErrors.contact && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.contact}</p>
            )}
          </div>
        </div>

        {/* Selected Customer Details */}
        {selectedAccount && selectedContact && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center mb-2">
                  <Building className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium">{selectedAccount.name}</span>
                </div>
                <div className="flex items-center mb-1">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{selectedAccount.email}</span>
                </div>
                <div className="flex items-center mb-1">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{selectedAccount.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{selectedAccount.address}, {selectedAccount.city}, {selectedAccount.postcode}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium">{selectedContact.firstName} {selectedContact.lastName}</span>
                </div>
                <div className="flex items-center mb-1">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{selectedContact.email}</span>
                </div>
                <div className="flex items-center mb-1">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{selectedContact.phone}</span>
                </div>
                {selectedContact.jobTitle && (
                  <div className="text-gray-600">
                    {selectedContact.jobTitle}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quote Items */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Quote Items
          </h3>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowProductCatalog(true)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Package className="h-4 w-4" />
              <span>Add from Catalog</span>
            </button>
          </div>
        </div>

        {validationErrors.items && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {validationErrors.items}
            </p>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-4">
          {quote.items.map((item, index) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    {item.isOptional && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Optional
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    Category: {item.category}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => duplicateItem(item.id)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {editingItem === item.id ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3 border-t border-gray-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Unit Price (£)
                    </label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Discount
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) => updateItem(item.id, { discount: parseFloat(e.target.value) || 0 })}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded-l text-sm"
                        min="0"
                        step="0.01"
                      />
                      <select
                        value={item.discountType}
                        onChange={(e) => updateItem(item.id, { discountType: e.target.value as 'percentage' | 'fixed' })}
                        className="px-2 py-1 border-l-0 border border-gray-300 rounded-r text-sm"
                      >
                        <option value="percentage">%</option>
                        <option value="fixed">£</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => setEditingItem(null)}
                      className="w-full px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span>Qty: {item.quantity}</span>
                    <span>£{item.unitPrice.toFixed(2)} each</span>
                    {item.discount > 0 && (
                      <span className="text-green-600">
                        -{item.discountType === 'percentage' ? `${item.discount}%` : `£${item.discount}`}
                      </span>
                    )}
                  </div>
                  <div className="font-medium">
                    £{item.total.toFixed(2)}
                  </div>
                </div>
              )}

              {item.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-gray-400 mt-0.5" />
                    <p className="text-sm text-gray-600">{item.notes}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Custom Item */}
        <div className="mt-6 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Add Custom Item</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                value={newItem.name || ''}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter item name..."
              />
              {validationErrors.name && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newItem.category || ''}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select category...</option>
                <option value="Materials">Materials</option>
                <option value="Labour">Labour</option>
                <option value="Equipment">Equipment</option>
                <option value="Services">Services</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Price (£) *
              </label>
              <input
                type="number"
                value={newItem.unitPrice || ''}
                onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.unitPrice ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {validationErrors.unitPrice && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.unitPrice}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newItem.description || ''}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Item description..."
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newItem.isOptional || false}
                  onChange={(e) => setNewItem(prev => ({ ...prev, isOptional: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Optional item</span>
              </label>
            </div>

            <button
              onClick={addCustomItem}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quote Summary */}
      <div className="border-b border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Quote Summary
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">£{quote.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Global Discount:</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={quote.discountAmount}
                    onChange={(e) => setQuote(prev => ({ 
                      ...prev, 
                      discountAmount: parseFloat(e.target.value) || 0 
                    }))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    min="0"
                    step="0.01"
                  />
                  <select
                    value={quote.discountType}
                    onChange={(e) => setQuote(prev => ({ 
                      ...prev, 
                      discountType: e.target.value as 'percentage' | 'fixed' 
                    }))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">£</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Tax Rate:</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={quote.taxRate}
                    onChange={(e) => setQuote(prev => ({ 
                      ...prev, 
                      taxRate: parseFloat(e.target.value) || 0 
                    }))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax Amount:</span>
                <span className="font-medium">£{quote.taxAmount.toFixed(2)}</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>£{quote.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Until *
                </label>
                <input
                  type="date"
                  value={quote.validUntil}
                  onChange={(e) => setQuote(prev => ({ ...prev, validUntil: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.validUntil ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationErrors.validUntil && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.validUntil}</p>
                )}
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span>{quote.items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Optional Items:</span>
                    <span>{quote.items.filter(item => item.isOptional).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span>v{quote.version}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Notes */}
      <div className="p-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span>Advanced Options</span>
        </button>

        {showAdvanced && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms & Conditions
              </label>
              <textarea
                value={quote.terms}
                onChange={(e) => setQuote(prev => ({ ...prev, terms: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter terms and conditions..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Internal Notes
              </label>
              <textarea
                value={quote.notes}
                onChange={(e) => setQuote(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Internal notes (not visible to customer)..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Product Catalog Modal */}
      {showProductCatalog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Product Catalog</h3>
              <button
                onClick={() => setShowProductCatalog(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productCatalog.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <span className="text-lg font-semibold text-blue-600">
                        £{item.unitPrice.toFixed(2)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{item.category}</span>
                      <button
                        onClick={() => addItemFromCatalog(item)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};