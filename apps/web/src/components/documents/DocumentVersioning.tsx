'use client';

import React, { useState } from 'react';
import {
  History,
  Download,
  Eye,
  RotateCcw,
  User,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Upload,
  GitBranch,
  Clock,
  Archive,
  Tag,
  MessageSquare,
  GitCompare,
  Lock,
  Unlock
} from 'lucide-react';

interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileName: string;
  fileSize: number;
  uploadedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  uploadedAt: string;
  changeDescription: string;
  status: 'draft' | 'published' | 'archived' | 'locked';
  tags: string[];
  downloadCount: number;
  checksum: string;
  metadata: {
    [key: string]: any;
  };
  isCurrentVersion: boolean;
  parentVersionId?: string;
  conflictsWith?: string[];
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  approvedAt?: string;
  rejectionReason?: string;
}

interface DocumentVersioningProps {
  documentId: string;
  documentName: string;
  versions: DocumentVersion[];
  currentVersionId: string;
  canEdit: boolean;
  canApprove: boolean;
  onUploadNewVersion: (file: File, changeDescription: string) => void;
  onDownloadVersion: (versionId: string) => void;
  onPreviewVersion: (versionId: string) => void;
  onRestoreVersion: (versionId: string) => void;
  onDeleteVersion: (versionId: string) => void;
  onCompareVersions: (versionId1: string, versionId2: string) => void;
  onApproveVersion: (versionId: string) => void;
  onRejectVersion: (versionId: string, reason: string) => void;
  onLockVersion: (versionId: string) => void;
  onUnlockVersion: (versionId: string) => void;
  onUpdateVersionMetadata: (versionId: string, metadata: any) => void;
}

const DocumentVersioning: React.FC<DocumentVersioningProps> = ({
  documentId,
  documentName,
  versions,
  currentVersionId,
  canEdit,
  canApprove,
  onUploadNewVersion,
  onDownloadVersion,
  onPreviewVersion,
  onRestoreVersion,
  onDeleteVersion,
  onCompareVersions,
  onApproveVersion,
  onRejectVersion,
  onLockVersion,
  onUnlockVersion,
  onUpdateVersionMetadata
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [changeDescription, setChangeDescription] = useState('');
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingVersionId, setRejectingVersionId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');

  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);
  const currentVersion = versions.find(v => v.id === currentVersionId);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: DocumentVersion['status']) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'archived':
        return <Archive className="h-4 w-4 text-gray-500" />;
      case 'locked':
        return <Lock className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: DocumentVersion['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'locked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUploadNewVersion = () => {
    if (uploadFile && changeDescription.trim()) {
      onUploadNewVersion(uploadFile, changeDescription.trim());
      setUploadFile(null);
      setChangeDescription('');
      setShowUploadModal(false);
    }
  };

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      } else if (prev.length < 2) {
        return [...prev, versionId];
      } else {
        return [prev[1], versionId];
      }
    });
  };

  const handleRejectVersion = () => {
    if (rejectingVersionId && rejectionReason.trim()) {
      onRejectVersion(rejectingVersionId, rejectionReason.trim());
      setRejectingVersionId(null);
      setRejectionReason('');
      setShowRejectModal(false);
    }
  };

  const canCompareVersions = selectedVersions.length === 2;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <History className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Version History</h2>
              <p className="text-sm text-gray-600">{documentName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {canCompareVersions && (
              <button
                onClick={() => onCompareVersions(selectedVersions[0], selectedVersions[1])}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <GitCompare className="h-4 w-4" />
                <span>Compare</span>
              </button>
            )}
            {canEdit && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Upload New Version</span>
              </button>
            )}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              viewMode === 'timeline' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              viewMode === 'table' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Table
          </button>
        </div>

        {/* Current Version Info */}
        {currentVersion && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-900">Current Version</span>
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    v{currentVersion.version}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(currentVersion.status)}`}>
                    {currentVersion.status}
                  </span>
                </div>
                <p className="text-sm text-blue-700 mt-1">{currentVersion.changeDescription}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Updated {formatDate(currentVersion.uploadedAt)} by {currentVersion.uploadedBy.firstName} {currentVersion.uploadedBy.lastName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-900">{formatFileSize(currentVersion.fileSize)}</p>
                <p className="text-xs text-blue-600">{currentVersion.downloadCount} downloads</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload New Version Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <h3 className="text-lg font-semibold mb-4">Upload New Version</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Change Description *
                </label>
                <textarea
                  value={changeDescription}
                  onChange={(e) => setChangeDescription(e.target.value)}
                  placeholder="Describe what changed in this version..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadNewVersion}
                disabled={!uploadFile || !changeDescription.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Version Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <h3 className="text-lg font-semibold mb-4">Reject Version</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectVersion}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {viewMode === 'timeline' ? (
          <div className="space-y-6">
            {sortedVersions.map((version, index) => (
              <div key={version.id} className="relative">
                {/* Timeline line */}
                {index < sortedVersions.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
                )}
                
                <div className="flex space-x-4">
                  {/* Timeline dot */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    version.isCurrentVersion ? 'bg-blue-600' : 'bg-gray-200'
                  }`}>
                    {version.isCurrentVersion ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">v{version.version}</span>
                    )}
                  </div>

                  {/* Version card */}
                  <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Version {version.version}
                          </h3>
                          {version.isCurrentVersion && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Current
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(version.status)}`}>
                            {getStatusIcon(version.status)}
                            <span className="ml-1">{version.status}</span>
                          </span>
                          {canCompareVersions && (
                            <input
                              type="checkbox"
                              checked={selectedVersions.includes(version.id)}
                              onChange={() => handleVersionSelect(version.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-3">{version.changeDescription}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{version.uploadedBy.firstName} {version.uploadedBy.lastName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(version.uploadedAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="h-4 w-4" />
                            <span>{formatFileSize(version.fileSize)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="h-4 w-4" />
                            <span>{version.downloadCount} downloads</span>
                          </div>
                        </div>

                        {/* Approval status */}
                        {version.approvalStatus && (
                          <div className="mt-3">
                            {version.approvalStatus === 'pending' && (
                              <div className="flex items-center space-x-2 text-yellow-600">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">Pending approval</span>
                              </div>
                            )}
                            {version.approvalStatus === 'approved' && version.approvedBy && (
                              <div className="flex items-center space-x-2 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm">
                                  Approved by {version.approvedBy.firstName} {version.approvedBy.lastName}
                                  {version.approvedAt && ` on ${formatDate(version.approvedAt)}`}
                                </span>
                              </div>
                            )}
                            {version.approvalStatus === 'rejected' && (
                              <div className="text-red-600">
                                <div className="flex items-center space-x-2">
                                  <XCircle className="h-4 w-4" />
                                  <span className="text-sm">Rejected</span>
                                </div>
                                {version.rejectionReason && (
                                  <p className="text-sm mt-1 pl-6">{version.rejectionReason}</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tags */}
                        {version.tags.length > 0 && (
                          <div className="flex items-center space-x-2 mt-3">
                            <Tag className="h-4 w-4 text-gray-400" />
                            <div className="flex flex-wrap gap-1">
                              {version.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => onPreviewVersion(version.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDownloadVersion(version.id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        {!version.isCurrentVersion && canEdit && (
                          <button
                            onClick={() => onRestoreVersion(version.id)}
                            className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                            title="Restore this version"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                        {canApprove && version.approvalStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => onApproveVersion(version.id)}
                              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setRejectingVersionId(version.id);
                                setShowRejectModal(true);
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {version.status === 'locked' ? (
                          <button
                            onClick={() => onUnlockVersion(version.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Unlock"
                          >
                            <Unlock className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onLockVersion(version.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Lock"
                          >
                            <Lock className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedVersions.map((version) => (
                  <tr key={version.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">v{version.version}</span>
                        {version.isCurrentVersion && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Current
                          </span>
                        )}
                        {canCompareVersions && (
                          <input
                            type="checkbox"
                            checked={selectedVersions.includes(version.id)}
                            onChange={() => handleVersionSelect(version.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={version.changeDescription}>
                        {version.changeDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {version.uploadedBy.firstName} {version.uploadedBy.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(version.uploadedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(version.fileSize)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getStatusColor(version.status)}`}>
                        {getStatusIcon(version.status)}
                        <span className="ml-1">{version.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onPreviewVersion(version.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDownloadVersion(version.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        {!version.isCurrentVersion && canEdit && (
                          <button
                            onClick={() => onRestoreVersion(version.id)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {versions.length === 0 && (
          <div className="text-center py-12">
            <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No version history</h3>
            <p className="text-gray-500">This document has no previous versions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentVersioning;