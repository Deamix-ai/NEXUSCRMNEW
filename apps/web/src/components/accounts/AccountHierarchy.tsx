import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight,
  ChevronDown,
  Users,
  DollarSign,
  Calendar,
  Briefcase,
  ExternalLink,
  Search,
  Filter,
  Move
} from 'lucide-react';

interface Account {
  id: string;
  name: string;
  type: 'parent' | 'subsidiary' | 'division' | 'branch';
  parentId?: string;
  children?: Account[];
  metadata: {
    industry?: string;
    employees?: number;
    revenue?: number;
    website?: string;
    establishedDate?: string;
    address?: {
      street: string;
      city: string;
      postcode: string;
      country: string;
    };
  };
  stats: {
    totalProjects: number;
    activeProjects: number;
    totalRevenue: number;
    lastActivity: string;
    contactCount: number;
  };
  status: 'active' | 'inactive' | 'prospect';
}

interface AccountHierarchyProps {
  rootAccountId?: string;
  accounts: Account[];
  onAddAccount: (parentId: string, account: Partial<Account>) => void;
  onUpdateAccount: (id: string, account: Partial<Account>) => void;
  onDeleteAccount: (id: string) => void;
  onMoveAccount: (accountId: string, newParentId: string) => void;
  readonly?: boolean;
}

interface AccountFormData {
  name: string;
  type: 'parent' | 'subsidiary' | 'division' | 'branch';
  industry: string;
  employees: string;
  revenue: string;
  website: string;
  establishedDate: string;
  street: string;
  city: string;
  postcode: string;
  country: string;
}

const ACCOUNT_TYPES = [
  { value: 'parent', label: 'Parent Company', icon: Building2 },
  { value: 'subsidiary', label: 'Subsidiary', icon: Building2 },
  { value: 'division', label: 'Division', icon: Briefcase },
  { value: 'branch', label: 'Branch Office', icon: Users }
];

const INDUSTRIES = [
  'Construction & Building',
  'Architecture & Design',
  'Real Estate',
  'Property Management',
  'Hospitality',
  'Retail',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Technology',
  'Other'
];

export function AccountHierarchy({ 
  rootAccountId,
  accounts, 
  onAddAccount, 
  onUpdateAccount, 
  onDeleteAccount,
  onMoveAccount,
  readonly = false 
}: AccountHierarchyProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isAddingChild, setIsAddingChild] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showMoveMode, setShowMoveMode] = useState(false);
  const [movingAccount, setMovingAccount] = useState<string | null>(null);

  const [formData, setFormData] = useState<AccountFormData>({
    name: '',
    type: 'subsidiary',
    industry: '',
    employees: '',
    revenue: '',
    website: '',
    establishedDate: '',
    street: '',
    city: '',
    postcode: '',
    country: 'United Kingdom'
  });

  // Build hierarchy tree
  const buildHierarchy = (accounts: Account[], parentId?: string): Account[] => {
    return accounts
      .filter(account => account.parentId === parentId)
      .map(account => ({
        ...account,
        children: buildHierarchy(accounts, account.id)
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const hierarchyTree = buildHierarchy(accounts, rootAccountId);

  // Filter accounts based on search and type
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = !searchTerm || 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.metadata.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !typeFilter || account.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const toggleExpanded = (accountId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedNodes(newExpanded);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'subsidiary',
      industry: '',
      employees: '',
      revenue: '',
      website: '',
      establishedDate: '',
      street: '',
      city: '',
      postcode: '',
      country: 'United Kingdom'
    });
  };

  const handleStartAdd = (parentId: string) => {
    resetForm();
    setIsAddingChild(parentId);
  };

  const handleStartEdit = (account: Account) => {
    setFormData({
      name: account.name,
      type: account.type,
      industry: account.metadata.industry || '',
      employees: account.metadata.employees?.toString() || '',
      revenue: account.metadata.revenue?.toString() || '',
      website: account.metadata.website || '',
      establishedDate: account.metadata.establishedDate || '',
      street: account.metadata.address?.street || '',
      city: account.metadata.address?.city || '',
      postcode: account.metadata.address?.postcode || '',
      country: account.metadata.address?.country || 'United Kingdom'
    });
    setEditingAccount(account);
  };

  const handleCancel = () => {
    setIsAddingChild(null);
    setEditingAccount(null);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Account name is required');
      return;
    }

    const accountData: Partial<Account> = {
      name: formData.name.trim(),
      type: formData.type,
      metadata: {
        industry: formData.industry || undefined,
        employees: formData.employees ? parseInt(formData.employees) : undefined,
        revenue: formData.revenue ? parseFloat(formData.revenue) : undefined,
        website: formData.website || undefined,
        establishedDate: formData.establishedDate || undefined,
        address: (formData.street || formData.city || formData.postcode) ? {
          street: formData.street,
          city: formData.city,
          postcode: formData.postcode,
          country: formData.country
        } : undefined
      },
      status: 'active'
    };

    if (editingAccount) {
      onUpdateAccount(editingAccount.id, accountData);
    } else if (isAddingChild) {
      onAddAccount(isAddingChild, accountData);
    }

    handleCancel();
  };

  const handleMove = (accountId: string, newParentId: string) => {
    onMoveAccount(accountId, newParentId);
    setMovingAccount(null);
    setShowMoveMode(false);
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      notation: 'compact'
    }).format(amount);
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = ACCOUNT_TYPES.find(t => t.value === type);
    const IconComponent = typeConfig?.icon || Building2;
    return <IconComponent className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'parent': return 'bg-blue-100 text-blue-800';
      case 'subsidiary': return 'bg-green-100 text-green-800';
      case 'division': return 'bg-purple-100 text-purple-800';
      case 'branch': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const AccountNode = ({ account, level = 0 }: { account: Account; level?: number }) => {
    const hasChildren = account.children && account.children.length > 0;
    const isExpanded = expandedNodes.has(account.id);
    const isSelected = selectedAccount === account.id;
    const isMoving = movingAccount === account.id;

    return (
      <div className="space-y-2">
        <div 
          className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
            isSelected ? 'border-blue-500 bg-blue-50' : 
            isMoving ? 'border-orange-500 bg-orange-50' :
            'border-gray-200 bg-white hover:bg-gray-50'
          }`}
          style={{ marginLeft: `${level * 20}px` }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(account.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </button>
          ) : (
            <div className="w-6 h-6" />
          )}

          {/* Account Icon */}
          <div className="text-gray-600">
            {getTypeIcon(account.type)}
          </div>

          {/* Account Info */}
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => setSelectedAccount(isSelected ? null : account.id)}
          >
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900">{account.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(account.type)}`}>
                {account.type}
              </span>
              {account.metadata.website && (
                <a
                  href={account.metadata.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{account.stats.contactCount} contacts</span>
              </span>
              <span className="flex items-center space-x-1">
                <Briefcase className="h-3 w-3" />
                <span>{account.stats.activeProjects} active projects</span>
              </span>
              <span className="flex items-center space-x-1">
                <DollarSign className="h-3 w-3" />
                <span>{formatCurrency(account.stats.totalRevenue)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(account.stats.lastActivity).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          {/* Actions */}
          {!readonly && (
            <div className="flex space-x-1">
              {showMoveMode && movingAccount !== account.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMove(movingAccount!, account.id)}
                  disabled={!movingAccount}
                >
                  Move Here
                </Button>
              )}
              
              {!showMoveMode && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStartAdd(account.id)}
                    title="Add child account"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStartEdit(account)}
                    title="Edit account"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMovingAccount(account.id);
                      setShowMoveMode(true);
                    }}
                    title="Move account"
                  >
                    <Move className="h-4 w-4" />
                  </Button>
                  {!hasChildren && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${account.name}?`)) {
                          onDeleteAccount(account.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                      title="Delete account"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Expanded Details */}
        {isSelected && (
          <div className="ml-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {account.metadata.industry && (
                <div>
                  <span className="font-medium text-gray-700">Industry:</span>
                  <span className="ml-2 text-gray-600">{account.metadata.industry}</span>
                </div>
              )}
              {account.metadata.employees && (
                <div>
                  <span className="font-medium text-gray-700">Employees:</span>
                  <span className="ml-2 text-gray-600">{account.metadata.employees.toLocaleString()}</span>
                </div>
              )}
              {account.metadata.establishedDate && (
                <div>
                  <span className="font-medium text-gray-700">Established:</span>
                  <span className="ml-2 text-gray-600">{account.metadata.establishedDate}</span>
                </div>
              )}
              {account.metadata.address && (
                <div>
                  <span className="font-medium text-gray-700">Address:</span>
                  <span className="ml-2 text-gray-600">
                    {account.metadata.address.street}, {account.metadata.address.city}, {account.metadata.address.postcode}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Children */}
        {hasChildren && isExpanded && account.children && (
          <div className="space-y-2">
            {account.children.map(child => (
              <AccountNode key={child.id} account={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const AccountForm = () => (
    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
      <h4 className="font-semibold text-gray-900 mb-4">
        {editingAccount ? 'Edit Account' : 'Add New Account'}
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ACCOUNT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select industry...</option>
              {INDUSTRIES.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employees
            </label>
            <input
              type="number"
              value={formData.employees}
              onChange={(e) => setFormData(prev => ({ ...prev, employees: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Revenue (£)
            </label>
            <input
              type="number"
              value={formData.revenue}
              onChange={(e) => setFormData(prev => ({ ...prev, revenue: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postcode
            </label>
            <input
              type="text"
              value={formData.postcode}
              onChange={(e) => setFormData(prev => ({ ...prev, postcode: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <Button type="submit">
            {editingAccount ? 'Update Account' : 'Add Account'}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Account Hierarchy</h3>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {accounts.length} accounts
          </span>
        </div>
        
        {showMoveMode && (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => {
              setShowMoveMode(false);
              setMovingAccount(null);
            }}>
              Cancel Move
            </Button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {ACCOUNT_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Hierarchy Tree */}
      <div className="space-y-2">
        {hierarchyTree.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No accounts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || typeFilter ? 'Try adjusting your search criteria.' : 'Add your first account to get started.'}
            </p>
          </div>
        ) : (
          hierarchyTree.map(account => (
            <AccountNode key={account.id} account={account} />
          ))
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAddingChild || editingAccount) && <AccountForm />}
    </div>
  );
}