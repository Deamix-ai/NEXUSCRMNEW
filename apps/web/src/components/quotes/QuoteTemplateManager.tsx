'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Layout,
  Settings,
  Copy,
  Trash2,
  Edit,
  Plus,
  Eye,
  Save,
  X,
  Move,
  Type,
  Image,
  Table,
  BarChart,
  Palette,
  Grid,
  AlignLeft,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Download,
  Upload,
  Layers,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle,
  Star
} from 'lucide-react';

// Types for Template Manager
interface TemplateVariable {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'boolean' | 'select';
  defaultValue?: string;
  options?: string[];
  isRequired: boolean;
  description?: string;
}

interface TemplateSection {
  id: string;
  type: 'header' | 'text' | 'table' | 'chart' | 'quote' | 'image' | 'footer' | 'signature';
  title: string;
  content: any;
  order: number;
  isVisible: boolean;
  isEditable: boolean;
  styles: {
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    backgroundColor?: string;
    padding?: number;
    margin?: number;
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted';
  };
  conditions?: {
    showIf?: string;
    hideIf?: string;
  };
}

interface QuoteTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  sections: TemplateSection[];
  variables: TemplateVariable[];
  settings: {
    paperSize: 'A4' | 'Letter' | 'Legal';
    orientation: 'portrait' | 'landscape';
    margins: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    branding: {
      logo?: string;
      logoPosition: 'left' | 'center' | 'right';
      logoSize: 'small' | 'medium' | 'large';
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
      showWatermark: boolean;
      watermarkText?: string;
    };
    header: {
      showPageNumbers: boolean;
      showDate: boolean;
      showCompanyInfo: boolean;
      height: number;
    };
    footer: {
      showTerms: boolean;
      showSignature: boolean;
      showContact: boolean;
      height: number;
    };
  };
  isDefault: boolean;
  isActive: boolean;
  usageCount: number;
  averageValue: number;
  conversionRate: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateManagerProps {
  templates: QuoteTemplate[];
  categories: string[];
  industries: string[];
  onCreateTemplate: (template: Omit<QuoteTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTemplate: (templateId: string, updates: Partial<QuoteTemplate>) => void;
  onDeleteTemplate: (templateId: string) => void;
  onDuplicateTemplate: (templateId: string) => void;
  onPreviewTemplate: (template: QuoteTemplate) => void;
  onExportTemplate: (templateId: string) => void;
  onImportTemplate: (templateData: any) => void;
}

export const QuoteTemplateManager: React.FC<TemplateManagerProps> = ({
  templates,
  categories,
  industries,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onPreviewTemplate,
  onExportTemplate,
  onImportTemplate
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<QuoteTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<QuoteTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'design' | 'variables' | 'settings' | 'preview'>('design');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [newSection, setNewSection] = useState<Partial<TemplateSection>>({
    type: 'text',
    title: '',
    content: '',
    isVisible: true,
    isEditable: true,
    styles: {
      fontSize: 14,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#000000',
      backgroundColor: '#ffffff',
      padding: 12,
      margin: 8,
      borderWidth: 0,
      borderColor: '#cccccc',
      borderStyle: 'solid'
    }
  });
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    const matchesIndustry = filterIndustry === 'all' || template.industry === filterIndustry;
    const matchesSearch = searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesIndustry && matchesSearch;
  });

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'header': return <Layers className="h-4 w-4" />;
      case 'text': return <Type className="h-4 w-4" />;
      case 'table': return <Table className="h-4 w-4" />;
      case 'chart': return <BarChart className="h-4 w-4" />;
      case 'quote': return <Quote className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'footer': return <Layout className="h-4 w-4" />;
      case 'signature': return <Edit className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const addSection = () => {
    if (!editingTemplate || !newSection.type || !newSection.title) return;

    const section: TemplateSection = {
      id: `section-${Date.now()}`,
      type: newSection.type as any,
      title: newSection.title,
      content: newSection.content || '',
      order: editingTemplate.sections.length,
      isVisible: true,
      isEditable: true,
      styles: newSection.styles || {
        fontSize: 14,
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'left',
        color: '#000000',
        backgroundColor: '#ffffff',
        padding: 12,
        margin: 8,
        borderWidth: 0,
        borderColor: '#cccccc',
        borderStyle: 'solid'
      }
    };

    const updatedTemplate = {
      ...editingTemplate,
      sections: [...editingTemplate.sections, section]
    };

    setEditingTemplate(updatedTemplate);
    setNewSection({
      type: 'text',
      title: '',
      content: '',
      isVisible: true,
      isEditable: true,
      styles: {
        fontSize: 14,
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'left',
        color: '#000000',
        backgroundColor: '#ffffff',
        padding: 12,
        margin: 8,
        borderWidth: 0,
        borderColor: '#cccccc',
        borderStyle: 'solid'
      }
    });
  };

  const updateSection = (sectionId: string, updates: Partial<TemplateSection>) => {
    if (!editingTemplate) return;

    const updatedTemplate = {
      ...editingTemplate,
      sections: editingTemplate.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    };

    setEditingTemplate(updatedTemplate);
  };

  const removeSection = (sectionId: string) => {
    if (!editingTemplate) return;

    const updatedTemplate = {
      ...editingTemplate,
      sections: editingTemplate.sections.filter(section => section.id !== sectionId)
    };

    setEditingTemplate(updatedTemplate);
    setSelectedSection(null);
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!editingTemplate) return;

    const sections = [...editingTemplate.sections];
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= sections.length) return;

    // Swap sections
    [sections[currentIndex], sections[newIndex]] = [sections[newIndex], sections[currentIndex]];
    
    // Update order values
    sections.forEach((section, index) => {
      section.order = index;
    });

    const updatedTemplate = {
      ...editingTemplate,
      sections
    };

    setEditingTemplate(updatedTemplate);
  };

  const saveTemplate = () => {
    if (!editingTemplate) return;

    onUpdateTemplate(editingTemplate.id, editingTemplate);
    setEditingTemplate(null);
    setSelectedSection(null);
  };

  const cancelEditing = () => {
    setEditingTemplate(null);
    setSelectedSection(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Layout className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Quote Template Manager</h2>
              <p className="text-sm text-gray-600">
                Create and manage professional quote templates
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => document.getElementById('import-template')?.click()}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Upload className="h-4 w-4" />
              <span>Import</span>
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <Plus className="h-4 w-4" />
              <span>New Template</span>
            </button>

            <input
              id="import-template"
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const templateData = JSON.parse(event.target?.result as string);
                      onImportTemplate(templateData);
                    } catch (error) {
                      alert('Invalid template file');
                    }
                  };
                  reader.readAsText(file);
                }
              }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex">
        {/* Template List */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Templates ({filteredTemplates.length})</h3>
          </div>

          <div className="overflow-y-auto max-h-96">
            {filteredTemplates.length === 0 ? (
              <div className="p-6 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-600">Create your first template to get started.</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 ${
                      selectedTemplate?.id === template.id ? 'border-orange-300 bg-orange-50' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {template.isDefault && (
                          <Star className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Category:</span> {template.category}
                      </div>
                      <div>
                        <span className="font-medium">Industry:</span> {template.industry}
                      </div>
                      <div>
                        <span className="font-medium">Sections:</span> {template.sections.length}
                      </div>
                      <div>
                        <span className="font-medium">Used:</span> {template.usageCount} times
                      </div>
                    </div>

                    {template.conversionRate > 0 && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium text-green-600">
                          {template.conversionRate.toFixed(1)}% conversion rate
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTemplate(template);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateTemplate(template.id);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onExportTemplate(template.id);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewTemplate(template);
                        }}
                        className="flex items-center space-x-1 px-2 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Template Editor/Viewer */}
        <div className="flex-1">
          {editingTemplate ? (
            <div className="h-full">
              {/* Editor Header */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Editing: {editingTemplate.name}
                  </h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveTemplate}
                      className="flex items-center space-x-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>

                {/* Editor Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    {[
                      { id: 'design', label: 'Design' },
                      { id: 'variables', label: 'Variables' },
                      { id: 'settings', label: 'Settings' },
                      { id: 'preview', label: 'Preview' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-orange-500 text-orange-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Editor Content */}
              <div className="p-6 overflow-y-auto max-h-96">
                {activeTab === 'design' && (
                  <div className="space-y-6">
                    {/* Add Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Add New Section</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                          value={newSection.type}
                          onChange={(e) => setNewSection(prev => ({ ...prev, type: e.target.value as any }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="text">Text</option>
                          <option value="header">Header</option>
                          <option value="table">Table</option>
                          <option value="chart">Chart</option>
                          <option value="quote">Quote</option>
                          <option value="image">Image</option>
                          <option value="footer">Footer</option>
                          <option value="signature">Signature</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Section title..."
                          value={newSection.title}
                          onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <button
                          onClick={addSection}
                          className="flex items-center justify-center space-x-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                    {/* Sections List */}
                    <div className="space-y-4">
                      {editingTemplate.sections.map((section) => (
                        <div
                          key={section.id}
                          className={`border rounded-lg p-4 ${
                            selectedSection === section.id ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              {getSectionIcon(section.type)}
                              <div>
                                <h5 className="font-medium text-gray-900">{section.title}</h5>
                                <p className="text-sm text-gray-500 capitalize">{section.type}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => moveSection(section.id, 'up')}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => moveSection(section.id, 'down')}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setSelectedSection(
                                  selectedSection === section.id ? null : section.id
                                )}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => removeSection(section.id)}
                                className="p-1 text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {selectedSection === section.id && (
                            <div className="border-t border-gray-200 pt-4 space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={section.title}
                                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Content
                                </label>
                                <textarea
                                  value={section.content}
                                  onChange={(e) => updateSection(section.id, { content: e.target.value })}
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                  placeholder="Enter section content..."
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={section.isVisible}
                                    onChange={(e) => updateSection(section.id, { isVisible: e.target.checked })}
                                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">Visible</span>
                                </label>

                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={section.isEditable}
                                    onChange={(e) => updateSection(section.id, { isEditable: e.target.checked })}
                                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">Editable</span>
                                </label>
                              </div>

                              {/* Style Controls */}
                              <div className="border-t border-gray-200 pt-4">
                                <h6 className="text-sm font-medium text-gray-900 mb-3">Styling</h6>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Font Size
                                    </label>
                                    <input
                                      type="number"
                                      value={section.styles.fontSize || 14}
                                      onChange={(e) => updateSection(section.id, {
                                        styles: { ...section.styles, fontSize: parseInt(e.target.value) }
                                      })}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                      min="8"
                                      max="72"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Color
                                    </label>
                                    <input
                                      type="color"
                                      value={section.styles.color || '#000000'}
                                      onChange={(e) => updateSection(section.id, {
                                        styles: { ...section.styles, color: e.target.value }
                                      })}
                                      className="w-full h-8 border border-gray-300 rounded"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Background
                                    </label>
                                    <input
                                      type="color"
                                      value={section.styles.backgroundColor || '#ffffff'}
                                      onChange={(e) => updateSection(section.id, {
                                        styles: { ...section.styles, backgroundColor: e.target.value }
                                      })}
                                      className="w-full h-8 border border-gray-300 rounded"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Align
                                    </label>
                                    <select
                                      value={section.styles.textAlign || 'left'}
                                      onChange={(e) => updateSection(section.id, {
                                        styles: { ...section.styles, textAlign: e.target.value as any }
                                      })}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                    >
                                      <option value="left">Left</option>
                                      <option value="center">Center</option>
                                      <option value="right">Right</option>
                                      <option value="justify">Justify</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'variables' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Template Variables</h4>
                      <button className="flex items-center space-x-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                        <Plus className="h-4 w-4" />
                        <span>Add Variable</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {editingTemplate.variables.map((variable) => (
                        <div key={variable.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                              </label>
                              <input
                                type="text"
                                value={variable.name}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Label
                              </label>
                              <input
                                type="text"
                                value={variable.label}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                              </label>
                              <select
                                value={variable.type}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                disabled
                              >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="currency">Currency</option>
                                <option value="boolean">Boolean</option>
                                <option value="select">Select</option>
                              </select>
                            </div>
                          </div>
                          {variable.description && (
                            <p className="mt-2 text-sm text-gray-600">{variable.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Template Settings</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Paper Size
                          </label>
                          <select
                            value={editingTemplate.settings.paperSize}
                            onChange={(e) => setEditingTemplate(prev => prev ? {
                              ...prev,
                              settings: { ...prev.settings, paperSize: e.target.value as any }
                            } : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option value="A4">A4</option>
                            <option value="Letter">Letter</option>
                            <option value="Legal">Legal</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Orientation
                          </label>
                          <select
                            value={editingTemplate.settings.orientation}
                            onChange={(e) => setEditingTemplate(prev => prev ? {
                              ...prev,
                              settings: { ...prev.settings, orientation: e.target.value as any }
                            } : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Branding</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Primary Color
                          </label>
                          <input
                            type="color"
                            value={editingTemplate.settings.branding.primaryColor}
                            onChange={(e) => setEditingTemplate(prev => prev ? {
                              ...prev,
                              settings: {
                                ...prev.settings,
                                branding: { ...prev.settings.branding, primaryColor: e.target.value }
                              }
                            } : null)}
                            className="w-full h-10 border border-gray-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Secondary Color
                          </label>
                          <input
                            type="color"
                            value={editingTemplate.settings.branding.secondaryColor}
                            onChange={(e) => setEditingTemplate(prev => prev ? {
                              ...prev,
                              settings: {
                                ...prev.settings,
                                branding: { ...prev.settings.branding, secondaryColor: e.target.value }
                              }
                            } : null)}
                            className="w-full h-10 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preview' && (
                  <div className="border border-gray-200 rounded-lg p-6 bg-white">
                    <div className="text-center mb-6">
                      <h4 className="text-lg font-medium text-gray-900">Template Preview</h4>
                      <p className="text-sm text-gray-600">
                        This is how your template will appear in generated quotes
                      </p>
                    </div>

                    <div className="space-y-6 max-w-2xl mx-auto">
                      {editingTemplate.sections
                        .filter(section => section.isVisible)
                        .sort((a, b) => a.order - b.order)
                        .map((section) => (
                          <div
                            key={section.id}
                            className="border-l-4 border-orange-300 pl-4"
                            style={{
                              fontSize: section.styles.fontSize,
                              color: section.styles.color,
                              backgroundColor: section.styles.backgroundColor,
                              textAlign: section.styles.textAlign,
                              fontWeight: section.styles.fontWeight,
                              fontStyle: section.styles.fontStyle
                            }}
                          >
                            <h5 className="font-medium text-gray-900 mb-2">{section.title}</h5>
                            <div className="text-gray-700">
                              {section.content || `[${section.type.toUpperCase()} CONTENT]`}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : selectedTemplate ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">{selectedTemplate.name}</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setEditingTemplate(selectedTemplate)}
                    className="flex items-center space-x-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Template Information</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Category:</dt>
                        <dd className="font-medium">{selectedTemplate.category}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Industry:</dt>
                        <dd className="font-medium">{selectedTemplate.industry}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Sections:</dt>
                        <dd className="font-medium">{selectedTemplate.sections.length}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Variables:</dt>
                        <dd className="font-medium">{selectedTemplate.variables.length}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Usage:</dt>
                        <dd className="font-medium">{selectedTemplate.usageCount} times</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Performance</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Conversion Rate:</dt>
                        <dd className="font-medium text-green-600">{selectedTemplate.conversionRate.toFixed(1)}%</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Average Value:</dt>
                        <dd className="font-medium">£{selectedTemplate.averageValue.toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Status:</dt>
                        <dd className={`font-medium ${selectedTemplate.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                          {selectedTemplate.isActive ? 'Active' : 'Inactive'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Created:</dt>
                        <dd className="font-medium">{new Date(selectedTemplate.createdAt).toLocaleDateString()}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Sections</h4>
                  <div className="space-y-2">
                    {selectedTemplate.sections.map((section) => (
                      <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getSectionIcon(section.type)}
                          <div>
                            <h5 className="font-medium text-gray-900">{section.title}</h5>
                            <p className="text-sm text-gray-500 capitalize">{section.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {section.isVisible ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-600">
                            {section.isVisible ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Layout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Template</h3>
                <p className="text-gray-600">Choose a template from the list to view or edit it.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Create New Template</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter template name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Describe the template..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                      <option value="">Select category...</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                      <option value="">Select industry...</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};