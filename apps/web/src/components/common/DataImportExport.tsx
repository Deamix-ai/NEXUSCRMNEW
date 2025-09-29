'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X, Eye } from 'lucide-react';

interface ImportField {
  key: string;
  label: string;
  required: boolean;
  type: 'text' | 'email' | 'phone' | 'number' | 'date' | 'select';
  options?: string[];
  example?: string;
}

interface ImportResult {
  success: boolean;
  imported: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
  warnings: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

interface DataImportExportProps {
  entityType: string;
  importFields: ImportField[];
  onImport: (data: any[]) => Promise<ImportResult>;
  onExport: (format: 'csv' | 'excel') => Promise<void>;
  templateData?: any[];
}

export function DataImportExport({
  entityType,
  importFields,
  onImport,
  onExport,
  templateData = []
}: DataImportExportProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportResult(null);
      setShowPreview(false);
    }
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      data.push(row);
    }

    return data;
  };

  const handlePreview = async () => {
    if (!importFile) return;

    const text = await importFile.text();
    const data = parseCSV(text);
    setPreviewData(data.slice(0, 5)); // Show first 5 rows
    setShowPreview(true);
  };

  const handleImport = async () => {
    if (!importFile) return;

    setIsProcessing(true);
    try {
      const text = await importFile.text();
      const data = parseCSV(text);
      const result = await onImport(data);
      setImportResult(result);
    } catch (error) {
      setImportResult({
        success: false,
        imported: 0,
        errors: [{ row: 0, field: 'general', message: 'Failed to process file' }],
        warnings: []
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const headers = importFields.map(field => field.label);
    const sampleRow = importFields.map(field => field.example || `Sample ${field.label}`);
    
    const csvContent = [
      headers.join(','),
      sampleRow.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entityType.toLowerCase()}_import_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Data Import & Export
        </h3>
        
        {/* Tab Navigation */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'import'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Import
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'export'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Export
          </button>
        </div>
      </div>

      {/* Import Tab */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-base font-medium text-gray-900">
                    Upload a CSV file
                  </span>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".csv"
                    className="sr-only"
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  CSV files only, up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Selected File */}
          {importFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {importFile.name}
                    </p>
                    <p className="text-xs text-blue-700">
                      {(importFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePreview}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => {
                      setImportFile(null);
                      setShowPreview(false);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {showPreview && previewData.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">
                  Preview (First 5 rows)
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(previewData[0] || {}).map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((cell: any, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Import Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </button>

            <button
              onClick={handleImport}
              disabled={!importFile || isProcessing}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Import Data'}
            </button>
          </div>

          {/* Import Results */}
          {importResult && (
            <div className={`rounded-lg p-4 ${
              importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start">
                {importResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="ml-3 flex-1">
                  <h4 className={`text-sm font-medium ${
                    importResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {importResult.success ? 'Import Successful' : 'Import Failed'}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    importResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {importResult.imported} records imported successfully
                  </p>

                  {/* Errors */}
                  {importResult.errors.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-red-800">Errors:</h5>
                      <ul className="mt-1 text-sm text-red-700">
                        {importResult.errors.slice(0, 5).map((error, index) => (
                          <li key={index}>
                            Row {error.row}: {error.field} - {error.message}
                          </li>
                        ))}
                        {importResult.errors.length > 5 && (
                          <li>... and {importResult.errors.length - 5} more errors</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Warnings */}
                  {importResult.warnings.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-orange-800">Warnings:</h5>
                      <ul className="mt-1 text-sm text-orange-700">
                        {importResult.warnings.slice(0, 3).map((warning, index) => (
                          <li key={index}>
                            Row {warning.row}: {warning.field} - {warning.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className="text-center py-8">
            <Download className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Export {entityType} Data
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Download your data in CSV or Excel format
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              onClick={() => onExport('csv')}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-gray-600" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">CSV Format</div>
                  <div className="text-sm text-gray-500">
                    Compatible with Excel, Google Sheets
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => onExport('excel')}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">Excel Format</div>
                  <div className="text-sm text-gray-500">
                    Native Excel file with formatting
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Field Requirements */}
      {activeTab === 'import' && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Required Fields
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {importFields.map((field) => (
              <div
                key={field.key}
                className={`text-sm flex items-center space-x-2 ${
                  field.required ? 'text-red-700' : 'text-gray-600'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  field.required ? 'bg-red-500' : 'bg-gray-300'
                }`} />
                <span className="font-medium">{field.label}</span>
                {field.required && <span className="text-red-500">*</span>}
                {field.example && (
                  <span className="text-xs text-gray-500">
                    (e.g., {field.example})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}