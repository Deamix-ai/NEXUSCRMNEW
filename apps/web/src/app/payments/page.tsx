'use client';

import React, { useState, useEffect } from 'react';

interface Payment {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer' | 'cash' | 'cheque';
  createdAt: string;
  paidAt?: string;
  description: string;
}

interface PaymentLink {
  id: string;
  invoiceId: string;
  amount: number;
  description: string;
  url: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'used';
  createdAt: string;
}

const PaymentsPage = () => {
  const [activeTab, setActiveTab] = useState<'payments' | 'invoices' | 'links' | 'settings'>('payments');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [showCreateLink, setShowCreateLink] = useState(false);

  useEffect(() => {
    // Mock data
    setPayments([
      {
        id: '1',
        invoiceNumber: 'INV-2025-001',
        customerName: 'John Smith',
        amount: 2500.00,
        status: 'completed',
        paymentMethod: 'card',
        createdAt: '2025-01-09T10:00:00Z',
        paidAt: '2025-01-09T10:05:23Z',
        description: 'Bathroom renovation deposit',
      },
      {
        id: '2',
        invoiceNumber: 'INV-2025-002',
        customerName: 'Emma Davis',
        amount: 5200.00,
        status: 'pending',
        paymentMethod: 'card',
        createdAt: '2025-01-09T14:30:00Z',
        description: 'Kitchen installation final payment',
      },
      {
        id: '3',
        invoiceNumber: 'INV-2025-003',
        customerName: 'Michael Brown',
        amount: 850.00,
        status: 'processing',
        paymentMethod: 'bank_transfer',
        createdAt: '2025-01-09T16:15:00Z',
        description: 'Consultation and design fee',
      },
      {
        id: '4',
        invoiceNumber: 'INV-2025-004',
        customerName: 'Sarah Wilson',
        amount: 1200.00,
        status: 'failed',
        paymentMethod: 'card',
        createdAt: '2025-01-09T09:20:00Z',
        description: 'Additional fittings payment',
      },
    ]);

    setPaymentLinks([
      {
        id: '1',
        invoiceId: 'INV-2025-005',
        amount: 3200.00,
        description: 'Bathroom suite installation',
        url: 'https://pay.bowmanskb.co.uk/link/3f2a8b9c',
        expiresAt: '2025-01-16T23:59:59Z',
        status: 'active',
        createdAt: '2025-01-09T12:00:00Z',
      },
      {
        id: '2',
        invoiceId: 'INV-2025-006',
        amount: 750.00,
        description: 'Design consultation fee',
        url: 'https://pay.bowmanskb.co.uk/link/9e4c1d7f',
        expiresAt: '2025-01-12T23:59:59Z',
        status: 'expired',
        createdAt: '2025-01-05T15:30:00Z',
      },
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'used': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalReceived = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments
    .filter(p => p.status === 'pending' || p.status === 'processing')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateLink(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Payment Link
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">£{totalReceived.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Received</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">£{pendingPayments.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{payments.length}</div>
                <div className="text-sm text-gray-600">Total Transactions</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">98.5%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'payments', label: 'Payments', count: payments.length },
              { id: 'invoices', label: 'Invoices', count: 12 },
              { id: 'links', label: 'Payment Links', count: paymentLinks.length },
              { id: 'settings', label: 'Settings', count: null }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Recent Payments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Invoice</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Method</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{payment.invoiceNumber}</div>
                          <div className="text-sm text-gray-600">{payment.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{payment.customerName}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        £{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{payment.paymentMethod.replace('_', ' ')}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleDateString()}
                        {payment.paidAt && (
                          <div className="text-xs text-green-600">
                            Paid: {new Date(payment.paidAt).toLocaleTimeString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                          {payment.status === 'completed' && (
                            <button className="text-gray-600 hover:text-gray-800 text-sm">Refund</button>
                          )}
                          {payment.status === 'failed' && (
                            <button className="text-blue-600 hover:text-blue-800 text-sm">Retry</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Links Tab */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Payment Links</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {paymentLinks.map((link) => (
                    <div key={link.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium text-gray-900">{link.invoiceId}</h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(link.status)}`}>
                              {link.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>£{link.amount.toLocaleString()}</span>
                            <span>•</span>
                            <span>Expires: {new Date(link.expiresAt).toLocaleDateString()}</span>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={link.url}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                              />
                              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                                Copy
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Providers</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">S</div>
                        <div>
                          <div className="font-medium">Stripe</div>
                          <div className="text-sm text-gray-600">Credit cards, Apple Pay, Google Pay</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-green-600">Connected</span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Configure</button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-800 rounded flex items-center justify-center text-white font-bold">P</div>
                        <div>
                          <div className="font-medium">PayPal</div>
                          <div className="text-sm text-gray-600">PayPal payments and Pay Later</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">Not connected</span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Connect</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Automatic payment reminders</div>
                        <div className="text-sm text-gray-600">Send automated reminders for overdue payments</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Payment confirmations</div>
                        <div className="text-sm text-gray-600">Send confirmation emails when payments are received</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Payment Link Modal */}
      {showCreateLink && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Payment Link</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="INV-2025-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Payment description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expires In
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateLink(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Create Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
