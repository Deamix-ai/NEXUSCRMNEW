import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText,
  Plus,
  Filter,
  Download,
  Save,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  Settings,
  Play,
  Pause,
  Clock,
  Users,
  Target,
  DollarSign,
  Activity,
  X,
  ChevronDown,
  ChevronRight,
  Search,
  SortAsc,
  SortDesc,
  MoreVertical,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ReportField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'currency';
  source: 'enquiries' | 'leads' | 'projects' | 'accounts' | 'communications' | 'users';
  category: 'dimensions' | 'measures';
  description?: string;
  format?: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

interface ReportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_null';
  value: any;
  label: string;
}

interface ReportSort {
  field: string;
  direction: 'asc' | 'desc';
  label: string;
}

interface SavedReport {
  id: string;
  name: string;
  description?: string;
  type: 'table' | 'chart' | 'dashboard';
  chartType?: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
  fields: string[];
  filters: ReportFilter[];
  sorts: ReportSort[];
  groupBy?: string[];
  dateRange?: {
    type: 'relative' | 'absolute';
    value: string;
    startDate?: string;
    endDate?: string;
  };
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    format: 'pdf' | 'excel' | 'csv';
  };
  isPublic: boolean;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
}

interface CustomReportBuilderProps {
  fields: ReportField[];
  savedReports: SavedReport[];
  onSaveReport: (report: Partial<SavedReport>) => void;
  onRunReport: (report: Partial<SavedReport>) => void;
  onDeleteReport: (reportId: string) => void;
  onDuplicateReport: (reportId: string) => void;
  readonly?: boolean;
}

const fieldSources = [
  { id: 'enquiries', label: 'Enquiries', icon: FileText },
  { id: 'leads', label: 'Leads', icon: Target },
  { id: 'projects', label: 'Projects', icon: Settings },
  { id: 'accounts', label: 'Accounts', icon: Users },
  { id: 'communications', label: 'Communications', icon: Activity },
  { id: 'users', label: 'Users', icon: Users }
];

const chartTypes = [
  { id: 'table', label: 'Table', icon: Table },
  { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
  { id: 'line', label: 'Line Chart', icon: LineChart },
  { id: 'pie', label: 'Pie Chart', icon: PieChart },
  { id: 'area', label: 'Area Chart', icon: Activity }
];

const operators = [
  { id: 'equals', label: 'Equals' },
  { id: 'contains', label: 'Contains' },
  { id: 'greater_than', label: 'Greater Than' },
  { id: 'less_than', label: 'Less Than' },
  { id: 'between', label: 'Between' },
  { id: 'in', label: 'In List' },
  { id: 'not_null', label: 'Not Empty' }
];

export function CustomReportBuilder({ 
  fields, 
  savedReports, 
  onSaveReport, 
  onRunReport, 
  onDeleteReport, 
  onDuplicateReport, 
  readonly = false 
}: CustomReportBuilderProps) {
  const [activeTab, setActiveTab] = useState<'builder' | 'saved'>('builder');
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [sorts, setSorts] = useState<ReportSort[]>([]);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [reportType, setReportType] = useState<'table' | 'chart'>('table');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'area' | 'scatter'>('bar');
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('');

  const filteredFields = useMemo(() => {
    let result = fields;
    
    if (selectedSource) {
      result = result.filter(field => field.source === selectedSource);
    }
    
    if (searchQuery) {
      result = result.filter(field => 
        field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return result;
  }, [fields, selectedSource, searchQuery]);

  const dimensionFields = filteredFields.filter(f => f.category === 'dimensions');
  const measureFields = filteredFields.filter(f => f.category === 'measures');

  const addField = (fieldId: string) => {
    if (!selectedFields.includes(fieldId)) {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const removeField = (fieldId: string) => {
    setSelectedFields(selectedFields.filter(id => id !== fieldId));
  };

  const addFilter = () => {
    const newFilter: ReportFilter = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: '',
      label: ''
    };
    setFilters([...filters, newFilter]);
  };

  const updateFilter = (filterId: string, updates: Partial<ReportFilter>) => {
    setFilters(filters.map(filter => 
      filter.id === filterId ? { ...filter, ...updates } : filter
    ));
  };

  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(filter => filter.id !== filterId));
  };

  const addSort = () => {
    const newSort: ReportSort = {
      field: '',
      direction: 'asc',
      label: ''
    };
    setSorts([...sorts, newSort]);
  };

  const updateSort = (index: number, updates: Partial<ReportSort>) => {
    setSorts(sorts.map((sort, i) => 
      i === index ? { ...sort, ...updates } : sort
    ));
  };

  const removeSort = (index: number) => {
    setSorts(sorts.filter((_, i) => i !== index));
  };

  const getFieldById = (fieldId: string) => {
    return fields.find(field => field.id === fieldId);
  };

  const canSaveReport = () => {
    return reportName.trim() !== '' && selectedFields.length > 0;
  };

  const handleSaveReport = () => {
    if (!canSaveReport()) return;

    const report: Partial<SavedReport> = {
      name: reportName,
      description: reportDescription,
      type: reportType === 'chart' ? 'chart' : 'table',
      chartType: reportType === 'chart' ? chartType : undefined,
      fields: selectedFields,
      filters,
      sorts,
      groupBy,
      isPublic: false,
      tags: []
    };

    onSaveReport(report);
    
    // Reset form
    setReportName('');
    setReportDescription('');
    setSelectedFields([]);
    setFilters([]);
    setSorts([]);
    setGroupBy([]);
  };

  const handleRunReport = () => {
    const report: Partial<SavedReport> = {
      name: reportName || 'Untitled Report',
      type: reportType === 'chart' ? 'chart' : 'table',
      chartType: reportType === 'chart' ? chartType : undefined,
      fields: selectedFields,
      filters,
      sorts,
      groupBy
    };

    onRunReport(report);
    setShowPreview(true);
  };

  const ReportBuilder = () => (
    <div className="space-y-6">
      {/* Report Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Report Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Enter report name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="table">Table</option>
              <option value="chart">Chart</option>
            </select>
          </div>
          
          {reportType === 'chart' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'pie' | 'area' | 'scatter')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {chartTypes.slice(1).map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Optional description"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Field Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Available Fields</h3>
          
          {/* Field Filters */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sources</option>
              {fieldSources.map(source => (
                <option key={source.id} value={source.id}>{source.label}</option>
              ))}
            </select>
          </div>

          {/* Dimensions */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Dimensions</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {dimensionFields.map(field => (
                  <div
                    key={field.id}
                    onClick={() => addField(field.id)}
                    className={`p-2 rounded border cursor-pointer hover:border-blue-300 ${
                      selectedFields.includes(field.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">{field.name}</div>
                    {field.description && (
                      <div className="text-xs text-gray-600">{field.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Measures</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {measureFields.map(field => (
                  <div
                    key={field.id}
                    onClick={() => addField(field.id)}
                    className={`p-2 rounded border cursor-pointer hover:border-blue-300 ${
                      selectedFields.includes(field.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">{field.name}</div>
                    {field.description && (
                      <div className="text-xs text-gray-600">{field.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Fields */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Selected Fields</h3>
          
          {selectedFields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Table className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>No fields selected. Click on fields from the left to add them.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedFields.map(fieldId => {
                const field = getFieldById(fieldId);
                if (!field) return null;
                
                return (
                  <div key={fieldId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{field.name}</div>
                      <div className="text-xs text-gray-600 capitalize">
                        {field.source} • {field.type}
                      </div>
                    </div>
                    <button
                      onClick={() => removeField(fieldId)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          <Button variant="outline" size="sm" onClick={addFilter}>
            <Plus className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
        </div>
        
        {filters.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Filter className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p>No filters applied. Add filters to refine your report data.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filters.map(filter => (
              <div key={filter.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <select
                  value={filter.field}
                  onChange={(e) => updateFilter(filter.id, { field: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select field</option>
                  {fields.map(field => (
                    <option key={field.id} value={field.id}>{field.name}</option>
                  ))}
                </select>
                
                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(filter.id, { operator: e.target.value as any })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {operators.map(op => (
                    <option key={op.id} value={op.id}>{op.label}</option>
                  ))}
                </select>
                
                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                  placeholder="Filter value"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {selectedFields.length} fields selected, {filters.length} filters applied
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRunReport} disabled={selectedFields.length === 0}>
            <Play className="h-4 w-4 mr-2" />
            Run Report
          </Button>
          
          {!readonly && (
            <Button onClick={handleSaveReport} disabled={!canSaveReport()}>
              <Save className="h-4 w-4 mr-2" />
              Save Report
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const SavedReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Saved Reports ({savedReports.length})</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search reports..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedReports.map(report => (
          <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {report.type === 'chart' ? (
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Table className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <p className="text-sm text-gray-600">
                    {report.type === 'chart' ? `${report.chartType} chart` : 'Table report'}
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {report.description && (
              <p className="text-sm text-gray-600 mb-3">{report.description}</p>
            )}

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center justify-between">
                <span>Fields:</span>
                <span>{report.fields.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Filters:</span>
                <span>{report.filters.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Created:</span>
                <span>{new Date(report.createdAt).toLocaleDateString('en-GB')}</span>
              </div>
              {report.lastRun && (
                <div className="flex items-center justify-between">
                  <span>Last run:</span>
                  <span>{new Date(report.lastRun).toLocaleDateString('en-GB')}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={() => onRunReport(report)}>
                <Play className="h-3 w-3 mr-1" />
                Run
              </Button>
              
              {!readonly && (
                <>
                  <Button variant="outline" size="sm" onClick={() => onDuplicateReport(report.id)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDeleteReport(report.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>

            {report.schedule?.enabled && (
              <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                <div className="flex items-center space-x-1 text-sm text-green-700">
                  <Clock className="h-3 w-3" />
                  <span>Scheduled {report.schedule.frequency}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {savedReports.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">No saved reports</h3>
          <p className="text-gray-600">Create your first report using the report builder.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Custom Report Builder</h2>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          {!readonly && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'builder', label: 'Report Builder', icon: Settings },
            { id: 'saved', label: 'Saved Reports', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'builder' && <ReportBuilder />}
      {activeTab === 'saved' && <SavedReports />}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Report Preview</h3>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">Report Preview</h4>
                <p className="text-gray-600">
                  Report would be generated here with {selectedFields.length} fields and {filters.length} filters applied.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}