'use client';

import React, { useState } from 'react';
import {
  FileText,
  FolderOpen,
  Upload,
  Download,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Eye,
  Edit,
  Share2,
  Trash2,
  Star,
  StarOff,
  Calendar,
  User,
  FileImage,
  FileVideo,
  Archive,
  Clock,
  Tag,
  Plus,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface DocumentFolder {
  id: string;
  name: string;
  parentId: string | null;
  description?: string;
  documentCount: number;
  subfolderCount: number;
  createdAt: string;
  updatedAt: string;
  permissions: {
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    canShare: boolean;
  };
  tags: string[];
  color?: string;
}

interface Document {
  id: string;
  name: string;
  description?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
  folderId: string | null;
  uploadedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  uploadedAt: string;
  updatedAt: string;
  version: number;
  isStarred: boolean;
  isPublic: boolean;
  downloadCount: number;
  tags: string[];
  metadata: {
    [key: string]: any;
  };
  permissions: {
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    canShare: boolean;
  };
  projectId?: string;
  accountId?: string;
  thumbnail?: string;
  checksum: string;
}

interface DocumentLibraryProps {
  folders: DocumentFolder[];
  documents: Document[];
  currentFolderId: string | null;
  viewMode: 'grid' | 'list';
  onFolderSelect: (folderId: string | null) => void;
  onDocumentSelect: (documentId: string) => void;
  onCreateFolder: (folderData: Partial<DocumentFolder>) => void;
  onUploadDocument: (files: FileList, folderId: string | null) => void;
  onDeleteDocument: (documentId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onRenameDocument: (documentId: string, newName: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  onMoveDocument: (documentId: string, targetFolderId: string | null) => void;
  onToggleStarred: (documentId: string) => void;
  onShareDocument: (documentId: string, settings: any) => void;
  onDownloadDocument: (documentId: string) => void;
  onPreviewDocument: (documentId: string) => void;
  onUpdateTags: (documentId: string, tags: string[]) => void;
}

const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  folders,
  documents,
  currentFolderId,
  viewMode,
  onFolderSelect,
  onDocumentSelect,
  onCreateFolder,
  onUploadDocument,
  onDeleteDocument,
  onDeleteFolder,
  onRenameDocument,
  onRenameFolder,
  onMoveDocument,
  onToggleStarred,
  onShareDocument,
  onDownloadDocument,
  onPreviewDocument,
  onUpdateTags
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [filterBy, setFilterBy] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter current folder items
  const currentFolders = folders.filter(folder => folder.parentId === currentFolderId);
  const currentDocuments = documents.filter(doc => doc.folderId === currentFolderId);

  // Search and filter logic
  const filteredFolders = currentFolders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDocuments = currentDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'starred') return matchesSearch && doc.isStarred;
    if (filterBy === 'recent') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return matchesSearch && new Date(doc.updatedAt) > weekAgo;
    }
    if (filterBy === 'shared') return matchesSearch && doc.isPublic;
    return matchesSearch && doc.fileType === filterBy;
  });

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'size':
        comparison = a.fileSize - b.fileSize;
        break;
      case 'type':
        comparison = a.fileType.localeCompare(b.fileType);
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

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
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileType: string, mimeType: string) => {
    if (mimeType.startsWith('image/')) return FileImage;
    if (mimeType.startsWith('video/')) return FileVideo;
    if (fileType === 'pdf') return FileText;
    if (fileType === 'zip' || fileType === 'rar') return Archive;
    return FileText;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onUploadDocument(files, currentFolderId);
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder({
        name: newFolderName.trim(),
        parentId: currentFolderId,
        description: '',
        tags: []
      });
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const breadcrumbs = [];
  let currentFolder = folders.find(f => f.id === currentFolderId);
  while (currentFolder) {
    breadcrumbs.unshift(currentFolder);
    currentFolder = folders.find(f => f.id === currentFolder?.parentId);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FolderOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Document Library</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCreateFolder(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Folder</span>
            </button>
            <label className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <button
            onClick={() => onFolderSelect(null)}
            className="hover:text-blue-600 transition-colors"
          >
            Documents
          </button>
          {breadcrumbs.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <span>/</span>
              <button
                onClick={() => onFolderSelect(folder.id)}
                className="hover:text-blue-600 transition-colors"
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Files</option>
                <option value="starred">Starred</option>
                <option value="recent">Recent</option>
                <option value="shared">Shared</option>
                <option value="pdf">PDF</option>
                <option value="doc">Documents</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleSort('name')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>Name</span>
              {sortBy === 'name' && (
                sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => toggleSort('date')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                sortBy === 'date' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>Date</span>
              {sortBy === 'date' && (
                sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => toggleSort('size')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                sortBy === 'size' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>Size</span>
              {sortBy === 'size' && (
                sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateFolder(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="p-6">
        {/* Folders */}
        {filteredFolders.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Folders</h3>
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' : 'grid-cols-1'}`}>
              {filteredFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="group relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => onFolderSelect(folder.id)}
                >
                  <div className="flex items-center space-x-3">
                    <FolderOpen className="h-8 w-8 text-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{folder.name}</p>
                      <p className="text-xs text-gray-500">
                        {folder.documentCount} files, {folder.subfolderCount} folders
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        {sortedDocuments.length > 0 ? (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Documents</h3>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {sortedDocuments.map((document) => {
                  const FileIcon = getFileIcon(document.fileType, document.mimeType);
                  return (
                    <div
                      key={document.id}
                      className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onDocumentSelect(document.id)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-3">
                          {document.thumbnail ? (
                            <img
                              src={document.thumbnail}
                              alt={document.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <FileIcon className="h-16 w-16 text-gray-400" />
                          )}
                          {document.isStarred && (
                            <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate w-full" title={document.name}>
                          {document.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(document.fileSize)}
                        </p>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleStarred(document.id);
                            }}
                            className="p-1 text-gray-400 hover:text-yellow-500"
                          >
                            {document.isStarred ? (
                              <Star className="h-4 w-4 fill-current" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {sortedDocuments.map((document) => {
                  const FileIcon = getFileIcon(document.fileType, document.mimeType);
                  return (
                    <div
                      key={document.id}
                      className="group flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onDocumentSelect(document.id)}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <FileIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 truncate">{document.name}</p>
                            {document.isStarred && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>{formatFileSize(document.fileSize)}</span>
                            <span>Modified {formatDate(document.updatedAt)}</span>
                            <span>by {document.uploadedBy.firstName} {document.uploadedBy.lastName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreviewDocument(document.id);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownloadDocument(document.id);
                          }}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShareDocument(document.id, {});
                          }}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterBy !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Upload your first document to get started'
              }
            </p>
            {!searchTerm && filterBy === 'all' && (
              <label className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>Upload Document</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentLibrary;