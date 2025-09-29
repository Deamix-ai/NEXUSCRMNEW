'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Star,
  StarOff,
  Copy,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Tag,
  Calendar,
  User,
  FolderOpen,
  Settings,
  Bookmark,
  Archive,
  RefreshCw,
  MoreVertical,
  Check,
  X,
  AlertCircle,
  Clock
} from 'lucide-react';

interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  content: string;
  variables: TemplateVariable[];
  isPublic: boolean;
  isStarred: boolean;
  usageCount: number;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
  thumbnail?: string;
  fileType: 'document' | 'spreadsheet' | 'presentation' | 'email' | 'contract';
  size?: number;
  metadata: {
    [key: string]: any;
  };
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
  };
}

interface TemplateVariable {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'phone' | 'select' | 'boolean';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    message?: string;
  };
  description?: string;
}

interface TemplateCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  templateCount: number;
  icon?: string;
}

interface DocumentTemplatesProps {
  templates: DocumentTemplate[];
  categories: TemplateCategory[];
  viewMode: 'grid' | 'list';
  onCreateTemplate: (templateData: Partial<DocumentTemplate>) => void;
  onEditTemplate: (templateId: string) => void;
  onDeleteTemplate: (templateId: string) => void;
  onDuplicateTemplate: (templateId: string) => void;
  onUseTemplate: (templateId: string, variables: Record<string, any>) => void;
  onToggleStarred: (templateId: string) => void;
  onPreviewTemplate: (templateId: string) => void;
  onExportTemplate: (templateId: string) => void;
  onImportTemplate: (file: File) => void;
  onUpdateTemplate: (templateId: string, updates: Partial<DocumentTemplate>) => void;
  onCreateCategory: (categoryData: Partial<TemplateCategory>) => void;
}

const DocumentTemplates: React.FC<DocumentTemplatesProps> = ({
  templates,
  categories,
  viewMode,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onUseTemplate,
  onToggleStarred,
  onPreviewTemplate,
  onExportTemplate,
  onImportTemplate,
  onUpdateTemplate,
  onCreateCategory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'usage' | 'rating'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUseTemplate, setShowUseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);

  // Get all unique tags
  const allTags = Array.from(new Set(templates.flatMap(t => t.tags))).sort();

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => template.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesTags;
  });

  // Sort templates
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'usage':
        comparison = a.usageCount - b.usageCount;
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getFileTypeIcon = (fileType: DocumentTemplate['fileType']) => {
    switch (fileType) {
      case 'document':
        return FileText;
      case 'spreadsheet':
        return Grid;
      case 'presentation':
        return Eye;
      case 'email':
        return Tag;
      case 'contract':
        return Bookmark;
      default:
        return FileText;
    }
  };

  const getFileTypeColor = (fileType: DocumentTemplate['fileType']) => {
    switch (fileType) {
      case 'document':
        return 'text-blue-600';
      case 'spreadsheet':
        return 'text-green-600';
      case 'presentation':
        return 'text-orange-600';
      case 'email':
        return 'text-purple-600';
      case 'contract':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusColor = (status: DocumentTemplate['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUseTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    const initialVariables: Record<string, any> = {};
    template.variables.forEach(variable => {
      initialVariables[variable.name] = variable.defaultValue || '';
    });
    setTemplateVariables(initialVariables);
    setShowUseTemplate(true);
  };

  const handleSubmitTemplate = () => {
    if (selectedTemplate) {
      onUseTemplate(selectedTemplate.id, templateVariables);
      setShowUseTemplate(false);
      setSelectedTemplate(null);
      setTemplateVariables({});
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportTemplate(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Document Templates</h2>
          </div>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Import</span>
              <input
                type="file"
                accept=".json,.docx,.xlsx,.pptx"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Template</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.templateCount})
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as any);
                setSortOrder(order as any);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="usage-desc">Most Used</option>
              <option value="usage-asc">Least Used</option>
            </select>
          </div>
        </div>

        {/* Tag Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Filter by Tags</h4>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <h3 className="text-lg font-semibold mb-4">Create New Template</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="document">Document</option>
                  <option value="spreadsheet">Spreadsheet</option>
                  <option value="presentation">Presentation</option>
                  <option value="email">Email</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe this template"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle template creation
                  setShowCreateModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Use Template Modal */}
      {showUseTemplate && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw max-h-90vh overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Use Template: {selectedTemplate.name}</h3>
            
            {selectedTemplate.variables.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Fill in the variables below to customize your document:
                </p>
                {selectedTemplate.variables.map((variable) => (
                  <div key={variable.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {variable.label}
                      {variable.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {variable.type === 'select' ? (
                      <select
                        value={templateVariables[variable.name] || ''}
                        onChange={(e) => setTemplateVariables(prev => ({
                          ...prev,
                          [variable.name]: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select an option</option>
                        {variable.options?.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : variable.type === 'boolean' ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={templateVariables[variable.name] || false}
                          onChange={(e) => setTemplateVariables(prev => ({
                            ...prev,
                            [variable.name]: e.target.checked
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">{variable.description}</span>
                      </div>
                    ) : (
                      <input
                        type={variable.type}
                        value={templateVariables[variable.name] || ''}
                        onChange={(e) => setTemplateVariables(prev => ({
                          ...prev,
                          [variable.name]: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={variable.description}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-4">
                This template has no customizable variables. Click "Create Document" to use it as-is.
              </p>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUseTemplate(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid/List */}
      <div className="p-6">
        {sortedTemplates.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedTemplates.map((template) => {
                const FileIcon = getFileTypeIcon(template.fileType);
                return (
                  <div
                    key={template.id}
                    className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <FileIcon className={`h-8 w-8 ${getFileTypeColor(template.fileType)}`} />
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(template.status)}`}>
                          {template.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onToggleStarred(template.id)}
                          className="p-1 text-gray-400 hover:text-yellow-500"
                        >
                          {template.isStarred ? (
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 truncate" title={template.name}>
                      {template.name}
                    </h3>
                    
                    {template.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {template.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{template.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>Used {template.usageCount} times</span>
                      <span>{formatDate(template.updatedAt)}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Use Template
                      </button>
                      <button
                        onClick={() => onPreviewTemplate(template.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDuplicateTemplate(template.id)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedTemplates.map((template) => {
                const FileIcon = getFileTypeIcon(template.fileType);
                return (
                  <div
                    key={template.id}
                    className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <FileIcon className={`h-8 w-8 flex-shrink-0 ${getFileTypeColor(template.fileType)}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">{template.name}</h3>
                          {template.isStarred && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${getStatusColor(template.status)}`}>
                            {template.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{template.category}</span>
                          <span>Used {template.usageCount} times</span>
                          <span>Updated {formatDate(template.updatedAt)}</span>
                          <span>by {template.createdBy.firstName} {template.createdBy.lastName}</span>
                        </div>
                        {template.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {template.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Use
                      </button>
                      <button
                        onClick={() => onPreviewTemplate(template.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDuplicateTemplate(template.id)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditTemplate(template.id)}
                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onExportTemplate(template.id)}
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory !== 'all' || selectedTags.length > 0
                ? 'Try adjusting your search or filters'
                : 'Create your first template to get started'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && selectedTags.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Template
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentTemplates;