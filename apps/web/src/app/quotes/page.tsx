'use client';

import React, { useState, useRef } from 'react';

interface QuoteItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface QuoteData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  projectTitle: string;
  projectDescription: string;
  quoteDate: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  items: QuoteItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  terms: string;
  notes: string;
}

const defaultTerms = `Terms & Conditions:
1. This quote is valid for 30 days from the date above
2. A 25% deposit is required to commence work
3. Payment terms: Net 30 days from invoice date
4. All materials are covered by manufacturer warranty
5. Labour warranty: 12 months from completion
6. Access to site must be provided during normal working hours
7. Any variations to the quoted work will be charged separately
8. Client is responsible for obtaining necessary permits/permissions`;

export default function QuoteGeneratorPage() {
  const [quote, setQuote] = useState<QuoteData>({
    id: `QUO-${Date.now()}`,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    projectTitle: '',
    projectDescription: '',
    quoteDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft',
    items: [],
    subtotal: 0,
    vatRate: 20,
    vatAmount: 0,
    total: 0,
    terms: defaultTerms,
    notes: ''
  });

  const [newItem, setNewItem] = useState<Partial<QuoteItem>>({
    category: '',
    description: '',
    quantity: 1,
    unit: 'each',
    unitPrice: 0
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const categories = [
    'Labour',
    'Materials - Sanitaryware',
    'Materials - Tiling',
    'Materials - Plumbing',
    'Materials - Electrical',
    'Materials - Fixtures',
    'Materials - Other',
    'Equipment Hire',
    'Disposal',
    'Miscellaneous'
  ];

  const units = ['each', 'sqm', 'linear m', 'hours', 'days', 'lot'];

  const calculateTotals = (items: QuoteItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const vatAmount = (subtotal * quote.vatRate) / 100;
    const total = subtotal + vatAmount;
    
    setQuote(prev => ({
      ...prev,
      subtotal,
      vatAmount,
      total
    }));
  };

  const addItem = () => {
    if (!newItem.description || !newItem.quantity || !newItem.unitPrice) return;

    const item: QuoteItem = {
      id: Date.now().toString(),
      category: newItem.category || 'Miscellaneous',
      description: newItem.description,
      quantity: newItem.quantity || 1,
      unit: newItem.unit || 'each',
      unitPrice: newItem.unitPrice || 0,
      total: (newItem.quantity || 1) * (newItem.unitPrice || 0)
    };

    const updatedItems = [...quote.items, item];
    setQuote(prev => ({ ...prev, items: updatedItems }));
    calculateTotals(updatedItems);

    setNewItem({
      category: '',
      description: '',
      quantity: 1,
      unit: 'each',
      unitPrice: 0
    });
  };

  const removeItem = (id: string) => {
    const updatedItems = quote.items.filter(item => item.id !== id);
    setQuote(prev => ({ ...prev, items: updatedItems }));
    calculateTotals(updatedItems);
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    const updatedItems = quote.items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    });
    
    setQuote(prev => ({ ...prev, items: updatedItems }));
    calculateTotals(updatedItems);
  };

  const generatePDF = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Quote ${quote.id}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .quote-header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
                .company-info { text-align: right; }
                .quote-info { margin: 20px 0; }
                .customer-info { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
                th { background: #f1f5f9; font-weight: bold; }
                .totals { margin-top: 20px; }
                .totals table { width: 50%; margin-left: auto; }
                .terms { margin-top: 30px; font-size: 12px; }
                .total-row { font-weight: bold; background: #f1f5f9; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const saveQuote = () => {
    // Here you would save to your backend
    console.log('Saving quote:', quote);
    alert('Quote saved successfully!');
  };

  const sendQuote = () => {
    // Here you would send the quote via email
    setQuote(prev => ({ ...prev, status: 'sent' }));
    alert('Quote sent to customer!');
  };

  if (isPreviewMode) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={() => setIsPreviewMode(false)}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              ← Back to Edit
            </button>
            <div className="space-x-3">
              <button
                onClick={generatePDF}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Download PDF
              </button>
              <button
                onClick={sendQuote}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Send to Customer
              </button>
            </div>
          </div>

          <div ref={printRef} className="bg-white rounded-lg shadow-sm p-8">
            {/* Quote Header */}
            <div className="quote-header">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">QUOTATION</h1>
                  <p className="text-lg text-gray-600 mt-1">#{quote.id}</p>
                </div>
                <div className="company-info text-right">
                  <div className="text-xl font-bold text-blue-600">Bowmans Kitchens & Bathrooms</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Bowman Bathrooms Ltd<br/>
                    Trading as Bowmans Kitchens & Bathrooms<br/>
                    VAT No: GB435232714<br/>
                    Company Reg: 14004226<br/>
                    Tel: 0161 123 4567<br/>
                    Email: info@bowmanskb.co.uk
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Information */}
            <div className="quote-info grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Quote Date</h3>
                <p>{new Date(quote.quoteDate).toLocaleDateString()}</p>
                
                <h3 className="font-semibold text-gray-900 mb-2 mt-4">Valid Until</h3>
                <p>{new Date(quote.validUntil).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Project</h3>
                <p className="font-medium">{quote.projectTitle}</p>
                <p className="text-gray-600 text-sm mt-1">{quote.projectDescription}</p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="customer-info">
              <h3 className="font-semibold text-gray-900 mb-3">Customer Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">{quote.customerName}</p>
                  <p className="text-sm text-gray-600">{quote.customerEmail}</p>
                  <p className="text-sm text-gray-600">{quote.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{quote.customerAddress}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item) => (
                  <tr key={item.id}>
                    <td className="text-sm text-gray-600">{item.category}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>£{item.unitPrice.toFixed(2)}</td>
                    <td>£{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="totals">
              <table>
                <tbody>
                  <tr>
                    <td>Subtotal:</td>
                    <td className="text-right">£{quote.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>VAT ({quote.vatRate}%):</td>
                    <td className="text-right">£{quote.vatAmount.toFixed(2)}</td>
                  </tr>
                  <tr className="total-row">
                    <td><strong>Total:</strong></td>
                    <td className="text-right"><strong>£{quote.total.toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Notes */}
            {quote.notes && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                <p className="text-gray-600 whitespace-pre-line">{quote.notes}</p>
              </div>
            )}

            {/* Terms */}
            <div className="terms">
              <h3 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
              <pre className="text-gray-600 whitespace-pre-wrap text-xs">{quote.terms}</pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quote Generator</h1>
              <p className="text-gray-600 mt-1">Create professional quotes for your projects</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={saveQuote}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                Save Draft
              </button>
              <button
                onClick={() => setIsPreviewMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Preview & Send
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quote Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Quote Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quote ID</label>
                    <input
                      type="text"
                      value={quote.id}
                      onChange={(e) => setQuote(prev => ({ ...prev, id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quote Date</label>
                    <input
                      type="date"
                      value={quote.quoteDate}
                      onChange={(e) => setQuote(prev => ({ ...prev, quoteDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
                  <input
                    type="date"
                    value={quote.validUntil}
                    onChange={(e) => setQuote(prev => ({ ...prev, validUntil: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                    <input
                      type="text"
                      value={quote.customerName}
                      onChange={(e) => setQuote(prev => ({ ...prev, customerName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={quote.customerEmail}
                      onChange={(e) => setQuote(prev => ({ ...prev, customerEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={quote.customerPhone}
                      onChange={(e) => setQuote(prev => ({ ...prev, customerPhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                    <input
                      type="text"
                      value={quote.projectTitle}
                      onChange={(e) => setQuote(prev => ({ ...prev, projectTitle: e.target.value }))}
                      placeholder="e.g., Master Bathroom Renovation"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Address</label>
                  <textarea
                    value={quote.customerAddress}
                    onChange={(e) => setQuote(prev => ({ ...prev, customerAddress: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                  <textarea
                    value={quote.projectDescription}
                    onChange={(e) => setQuote(prev => ({ ...prev, projectDescription: e.target.value }))}
                    rows={3}
                    placeholder="Describe the scope of work..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Quote Items */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Quote Items</h2>
              </div>
              
              {/* Add New Item */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3">
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description"
                    className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                    placeholder="Qty"
                    min="0"
                    step="0.1"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  
                  <input
                    type="number"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                    placeholder="£ Price"
                    min="0"
                    step="0.01"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <button
                  onClick={addItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Item
                </button>
              </div>

              {/* Items List */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Qty</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unit</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {quote.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="0"
                            step="0.1"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">{item.unit}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium">£{item.total.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={quote.notes}
                    onChange={(e) => setQuote(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    placeholder="Any additional notes or special conditions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                  <textarea
                    value={quote.terms}
                    onChange={(e) => setQuote(prev => ({ ...prev, terms: e.target.value }))}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quote Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Quote Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{quote.items.length}</span>
                </div>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">£{quote.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">VAT Rate:</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={quote.vatRate}
                        onChange={(e) => {
                          const rate = parseFloat(e.target.value) || 0;
                          const vatAmount = (quote.subtotal * rate) / 100;
                          setQuote(prev => ({
                            ...prev,
                            vatRate: rate,
                            vatAmount,
                            total: quote.subtotal + vatAmount
                          }));
                        }}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT Amount:</span>
                    <span className="font-medium">£{quote.vatAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-green-600">£{quote.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Status: <span className="font-medium capitalize">{quote.status}</span></div>
                    <div>Valid until: <span className="font-medium">{new Date(quote.validUntil).toLocaleDateString()}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
