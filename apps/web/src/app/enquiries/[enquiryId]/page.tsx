'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { enquiriesApi } from '@/lib/api-client';
import { ArrowLeft, Phone, Mail, Building2, Calendar, DollarSign, Tag, User } from 'lucide-react';
import Link from 'next/link';



interface Enquiry {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  estimatedValue?: number;
  source?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  account?: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  QUALIFIED: 'bg-purple-100 text-purple-800',
  CONVERTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  NURTURING: 'bg-gray-100 text-gray-800',
};

const priorityColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800',
};

export default function EnquiryDetailPage() {
  const params = useParams();
  const enquiryId = params.enquiryId as string;
  
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiry();
  }, [enquiryId]);

  const fetchEnquiry = async () => {
    try {
      const response = await enquiriesApi.getById(enquiryId) as Enquiry;
      setEnquiry(response);
    } catch (error) {
      console.error('Failed to fetch enquiry:', error);
      notFound();
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToLead = async () => {
    if (!enquiry) return;
    
    try {
      await enquiriesApi.convertToLead(enquiry.id);
      alert('Enquiry successfully converted to lead!');
      // Refresh the enquiry data
      await fetchEnquiry();
    } catch (error) {
      console.error('Failed to convert enquiry:', error);
      alert('Failed to convert enquiry. Please try again.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!enquiry) {
    return notFound();
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/enquiries"
              className="flex items-center text-gray-500 hover:text-gray-700 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Enquiries
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{enquiry.title}</h1>
              <p className="text-gray-600">
                {enquiry.firstName} {enquiry.lastName}
                {enquiry.company && ` - ${enquiry.company}`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                statusColors[enquiry.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
              }`}>
                {enquiry.status.replace('_', ' ')}
              </span>
              <span className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                priorityColors[enquiry.priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800'
              }`}>
                {enquiry.priority} Priority
              </span>
              {enquiry.status !== 'CONVERTED' && (
                <button
                  onClick={handleConvertToLead}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Convert to Lead
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {enquiry.description && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700">{enquiry.description}</p>
              </div>
            )}

            {/* Customer Message */}
            {enquiry.message && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Message</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 italic">"{enquiry.message}"</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {enquiry.firstName} {enquiry.lastName}
                    </p>
                  </div>
                </div>
                
                {enquiry.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <a
                      href={`mailto:${enquiry.email}`}
                      className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      {enquiry.email}
                    </a>
                  </div>
                )}

                {enquiry.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <a
                      href={`tel:${enquiry.phone}`}
                      className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      {enquiry.phone}
                    </a>
                  </div>
                )}

                {enquiry.company && (
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                    <p className="text-sm text-gray-900">{enquiry.company}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Enquiry Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Enquiry Details</h3>
              <div className="space-y-4">
                {enquiry.estimatedValue && (
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Estimated Value</p>
                      <p className="text-sm text-gray-600">
                        £{enquiry.estimatedValue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {enquiry.source && (
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Source</p>
                      <p className="text-sm text-gray-600">{enquiry.source}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">
                      {new Date(enquiry.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {enquiry.account && (
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Account</p>
                      <Link
                        href={`/accounts/${enquiry.account.id}`}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        {enquiry.account.name}
                      </Link>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Owner</p>
                    <p className="text-sm text-gray-600">
                      {enquiry.owner.firstName} {enquiry.owner.lastName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}