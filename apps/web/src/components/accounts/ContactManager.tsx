import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Building,
  Calendar,
  Star,
  UserCheck,
  Users
} from 'lucide-react';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  isPrimary: boolean;
  accountId: string;
  createdAt: string;
  lastContactDate?: string;
  notes?: string;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
  };
}

interface ContactManagerProps {
  accountId: string;
  contacts: Contact[];
  onAddContact: (contact: Partial<Contact>) => void;
  onUpdateContact: (id: string, contact: Partial<Contact>) => void;
  onDeleteContact: (id: string) => void;
  readonly?: boolean;
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  isPrimary: boolean;
  notes: string;
}

const DEPARTMENTS = [
  'Executive',
  'Operations',
  'Finance',
  'Marketing',
  'Sales',
  'IT',
  'HR',
  'Customer Service',
  'Procurement',
  'Facilities',
  'Other'
];

const JOB_TITLES = [
  'CEO', 'COO', 'CFO', 'CTO',
  'Director', 'Manager', 'Supervisor',
  'Coordinator', 'Specialist', 'Administrator',
  'Executive Assistant', 'Receptionist',
  'Homeowner', 'Property Manager',
  'Architect', 'Interior Designer',
  'Contractor', 'Project Manager',
  'Other'
];

export function ContactManager({ 
  accountId, 
  contacts, 
  onAddContact, 
  onUpdateContact, 
  onDeleteContact, 
  readonly = false 
}: ContactManagerProps) {
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    isPrimary: false,
    notes: ''
  });

  const primaryContact = contacts.find(c => c.isPrimary);
  const secondaryContacts = contacts.filter(c => !c.isPrimary);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      department: '',
      isPrimary: false,
      notes: ''
    });
  };

  const handleStartAdd = () => {
    resetForm();
    setFormData(prev => ({ ...prev, isPrimary: !primaryContact }));
    setIsAddingContact(true);
  };

  const handleStartEdit = (contact: Contact) => {
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email || '',
      phone: contact.phone || '',
      jobTitle: contact.jobTitle || '',
      department: contact.department || '',
      isPrimary: contact.isPrimary,
      notes: contact.notes || ''
    });
    setEditingContact(contact);
  };

  const handleCancel = () => {
    setIsAddingContact(false);
    setEditingContact(null);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert('First name and last name are required');
      return;
    }

    if (formData.isPrimary && primaryContact && (!editingContact || editingContact.id !== primaryContact.id)) {
      alert('There can only be one primary contact. Please set the current primary contact as secondary first.');
      return;
    }

    const contactData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      jobTitle: formData.jobTitle.trim() || undefined,
      department: formData.department || undefined,
      isPrimary: formData.isPrimary,
      notes: formData.notes.trim() || undefined,
      accountId
    };

    if (editingContact) {
      onUpdateContact(editingContact.id, contactData);
    } else {
      onAddContact(contactData);
    }

    handleCancel();
  };

  const handleSetPrimary = (contact: Contact) => {
    if (contact.isPrimary) return;
    
    // Set current primary to secondary
    if (primaryContact) {
      onUpdateContact(primaryContact.id, { isPrimary: false });
    }
    
    // Set selected contact as primary
    onUpdateContact(contact.id, { isPrimary: true });
  };

  const handleDelete = (contact: Contact) => {
    if (contact.isPrimary) {
      alert('Cannot delete the primary contact. Please set another contact as primary first.');
      return;
    }

    if (confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      onDeleteContact(contact.id);
    }
  };

  const formatLastContact = (date?: string) => {
    if (!date) return 'Never';
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  const ContactCard = ({ contact, isPrimary }: { contact: Contact; isPrimary?: boolean }) => (
    <div className={`bg-white rounded-lg border-2 p-4 ${isPrimary ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isPrimary ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            <User className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900">
                {contact.firstName} {contact.lastName}
              </h4>
              {isPrimary && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Star className="h-3 w-3 mr-1" />
                  Primary
                </span>
              )}
            </div>
            
            {contact.jobTitle && (
              <p className="text-sm text-gray-600 mt-1">{contact.jobTitle}</p>
            )}
            
            {contact.department && (
              <p className="text-xs text-gray-500">{contact.department}</p>
            )}

            <div className="mt-3 space-y-2">
              {contact.email && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                    {contact.email}
                  </a>
                </div>
              )}
              
              {contact.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                    {contact.phone}
                  </a>
                </div>
              )}

              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>Last contact: {formatLastContact(contact.lastContactDate)}</span>
              </div>
            </div>

            {contact.notes && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                <p className="italic">{contact.notes}</p>
              </div>
            )}
          </div>
        </div>

        {!readonly && (
          <div className="flex space-x-1">
            {!isPrimary && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSetPrimary(contact)}
                title="Set as primary contact"
              >
                <UserCheck className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleStartEdit(contact)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {!isPrimary && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(contact)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const ContactForm = () => (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
      <h4 className="font-semibold text-gray-900 mb-4">
        {editingContact ? 'Edit Contact' : 'Add New Contact'}
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <select
            value={formData.jobTitle}
            onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select job title...</option>
            {JOB_TITLES.map(title => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            value={formData.department}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select department...</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isPrimary}
            onChange={(e) => setFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            disabled={primaryContact && editingContact?.id !== primaryContact.id}
          />
          <span className="text-sm text-gray-700">Primary Contact</span>
        </label>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Additional notes about this contact..."
        />
      </div>

      <div className="mt-6 flex space-x-3">
        <Button type="submit">
          {editingContact ? 'Update Contact' : 'Add Contact'}
        </Button>
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Contacts</h3>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {contacts.length}
          </span>
        </div>
        
        {!readonly && !isAddingContact && !editingContact && (
          <Button onClick={handleStartAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        )}
      </div>

      {/* Primary Contact */}
      {primaryContact && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Primary Contact</h4>
          <ContactCard contact={primaryContact} isPrimary={true} />
        </div>
      )}

      {/* Secondary Contacts */}
      {secondaryContacts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Other Contacts ({secondaryContacts.length})
          </h4>
          <div className="space-y-3">
            {secondaryContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAddingContact || editingContact) && <ContactForm />}

      {/* Empty State */}
      {contacts.length === 0 && !isAddingContact && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add contacts to keep track of key people at this account.
          </p>
          {!readonly && (
            <div className="mt-6">
              <Button onClick={handleStartAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Contact
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}