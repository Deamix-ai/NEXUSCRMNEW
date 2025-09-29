'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import DocumentLibrary from '@/components/documents/DocumentLibrary';
import DocumentVersioning from '@/components/documents/DocumentVersioning';
import DocumentSharing from '@/components/documents/DocumentSharing';
import DocumentTemplates from '@/components/documents/DocumentTemplates';
import {
  useDocuments,
  useUploadDocument,
  useUpdateDocument,
  useDeleteDocument,
} from '@/hooks/api-hooks';
import {
  FileText,
  FolderOpen,
  History,
  Share2,
  Layout,
  BarChart3,
  Grid,
  List,
  Upload,
  Download,
  Star,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';

// Sample data for the document management system
const sampleFolders = [
  {
    id: 'folder-1',
    name: 'Project Documents',
    parentId: null,
    description: 'Documents related to active projects',
    documentCount: 25,
    subfolderCount: 3,
    createdAt: '2024-08-01T10:00:00Z',
    updatedAt: '2024-09-15T14:30:00Z',
    permissions: {
      canRead: true,
      canWrite: true,
      canDelete: true,
      canShare: true
    },
    tags: ['projects', 'work'],
    color: '#3B82F6'
  },
  {
    id: 'folder-2',
    name: 'Quotes & Proposals',
    parentId: null,
    description: 'Customer quotes and business proposals',
    documentCount: 18,
    subfolderCount: 2,
    createdAt: '2024-08-05T09:00:00Z',
    updatedAt: '2024-09-18T11:15:00Z',
    permissions: {
      canRead: true,
      canWrite: true,
      canDelete: false,
      canShare: true
    },
    tags: ['quotes', 'proposals', 'sales'],
    color: '#10B981'
  },
  {
    id: 'folder-3',
    name: 'Contracts',
    parentId: null,
    description: 'Legal contracts and agreements',
    documentCount: 12,
    subfolderCount: 1,
    createdAt: '2024-08-10T16:00:00Z',
    updatedAt: '2024-09-16T13:45:00Z',
    permissions: {
      canRead: true,
      canWrite: false,
      canDelete: false,
      canShare: false
    },
    tags: ['contracts', 'legal'],
    color: '#EF4444'
  }
];

const sampleDocuments = [
  {
    id: 'doc-1',
    name: 'Modern Bathroom Project Plan.pdf',
    description: 'Detailed project plan for the Johnson bathroom renovation',
    fileName: 'modern-bathroom-project-plan.pdf',
    fileSize: 2548736,
    fileType: 'pdf',
    mimeType: 'application/pdf',
    folderId: 'folder-1',
    uploadedBy: {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com'
    },
    uploadedAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-09-15T14:30:00Z',
    version: 3,
    isStarred: true,
    isPublic: false,
    downloadCount: 12,
    tags: ['project-plan', 'bathroom', 'renovation'],
    metadata: {
      projectId: 'proj-1',
      accountId: 'acc-1'
    },
    permissions: {
      canRead: true,
      canWrite: true,
      canDelete: true,
      canShare: true
    },
    projectId: 'proj-1',
    accountId: 'acc-1',
    checksum: 'a1b2c3d4e5f6'
  },
  {
    id: 'doc-2',
    name: 'Kitchen Renovation Quote.docx',
    description: 'Comprehensive quote for kitchen renovation project',
    fileName: 'kitchen-renovation-quote.docx',
    fileSize: 1024000,
    fileType: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    folderId: 'folder-2',
    uploadedBy: {
      id: 'user-2',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@company.com'
    },
    uploadedAt: '2024-09-10T09:30:00Z',
    updatedAt: '2024-09-18T11:15:00Z',
    version: 2,
    isStarred: false,
    isPublic: true,
    downloadCount: 8,
    tags: ['quote', 'kitchen', 'renovation'],
    metadata: {
      quoteId: 'quote-2',
      accountId: 'acc-2'
    },
    permissions: {
      canRead: true,
      canWrite: true,
      canDelete: true,
      canShare: true
    },
    accountId: 'acc-2',
    checksum: 'f6e5d4c3b2a1'
  }
];

const sampleVersions = [
  {
    id: 'version-1',
    documentId: 'doc-1',
    version: 3,
    fileName: 'modern-bathroom-project-plan-v3.pdf',
    fileSize: 2548736,
    uploadedBy: {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com'
    },
    uploadedAt: '2024-09-15T14:30:00Z',
    changeDescription: 'Updated timeline and added material specifications',
    status: 'published' as const,
    tags: ['current'],
    downloadCount: 12,
    checksum: 'a1b2c3d4e5f6',
    metadata: {},
    isCurrentVersion: true
  },
  {
    id: 'version-2',
    documentId: 'doc-1',
    version: 2,
    fileName: 'modern-bathroom-project-plan-v2.pdf',
    fileSize: 2446831,
    uploadedBy: {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com'
    },
    uploadedAt: '2024-09-10T11:00:00Z',
    changeDescription: 'Added cost breakdown and supplier information',
    status: 'archived' as const,
    tags: [],
    downloadCount: 8,
    checksum: 'b2c3d4e5f6a1',
    metadata: {},
    isCurrentVersion: false
  }
];

const sampleUsers = [
  {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    avatar: undefined,
    department: 'Project Management',
    role: 'Project Manager'
  },
  {
    id: 'user-2',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@company.com',
    avatar: undefined,
    department: 'Sales',
    role: 'Sales Manager'
  },
  {
    id: 'user-3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@company.com',
    avatar: undefined,
    department: 'Installation',
    role: 'Senior Installer'
  }
];

const sampleTemplates = [
  {
    id: 'template-1',
    name: 'Project Proposal Template',
    description: 'Standard template for creating project proposals',
    category: 'proposals',
    tags: ['proposal', 'project', 'standard'],
    content: 'Template content here...',
    variables: [
      {
        id: 'var-1',
        name: 'client_name',
        label: 'Client Name',
        type: 'text' as const,
        required: true,
        description: 'Name of the client'
      },
      {
        id: 'var-2',
        name: 'project_value',
        label: 'Project Value',
        type: 'number' as const,
        required: true,
        description: 'Total project value in GBP'
      }
    ],
    isPublic: true,
    isStarred: true,
    usageCount: 24,
    createdBy: {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com'
    },
    createdAt: '2024-08-01T10:00:00Z',
    updatedAt: '2024-09-10T14:30:00Z',
    version: 2,
    status: 'published' as const,
    fileType: 'document' as const,
    metadata: {},
    permissions: {
      canEdit: true,
      canDelete: true,
      canShare: true
    }
  },
  {
    id: 'template-2',
    name: 'Quote Template - Bathroom',
    description: 'Specialized template for bathroom renovation quotes',
    category: 'quotes',
    tags: ['quote', 'bathroom', 'renovation'],
    content: 'Bathroom quote template content...',
    variables: [
      {
        id: 'var-3',
        name: 'room_size',
        label: 'Room Size (sqm)',
        type: 'number' as const,
        required: true,
        description: 'Bathroom size in square meters'
      }
    ],
    isPublic: true,
    isStarred: false,
    usageCount: 18,
    createdBy: {
      id: 'user-2',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@company.com'
    },
    createdAt: '2024-08-15T09:00:00Z',
    updatedAt: '2024-09-05T16:20:00Z',
    version: 1,
    status: 'published' as const,
    fileType: 'document' as const,
    metadata: {},
    permissions: {
      canEdit: true,
      canDelete: true,
      canShare: true
    }
  }
];

const sampleCategories = [
  {
    id: 'proposals',
    name: 'Proposals',
    description: 'Business proposals and project bids',
    color: '#3B82F6',
    templateCount: 5
  },
  {
    id: 'quotes',
    name: 'Quotes',
    description: 'Customer quotations and estimates',
    color: '#10B981',
    templateCount: 8
  },
  {
    id: 'contracts',
    name: 'Contracts',
    description: 'Legal contracts and agreements',
    color: '#EF4444',
    templateCount: 3
  }
];

export default function DocumentsPage() {
  const [activeView, setActiveView] = useState<'library' | 'versions' | 'sharing' | 'templates'>('library');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  // React Query hooks
  const { data: documentsData = [], isLoading } = useDocuments({
    accountId: currentFolderId || undefined,
  });
  const uploadDocument = useUploadDocument();
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();

  // Type-safe documents array
  const documents = (documentsData as any[]) || [];
  const selectedDocument = selectedDocumentId ? documents.find((d: any) => d.id === selectedDocumentId) : null;

  // Sample handlers
  const handleFolderSelect = (folderId: string | null) => {
    setCurrentFolderId(folderId);
  };

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setActiveView('versions');
  };

  const handleCreateFolder = (folderData: any) => {
    // For now, we'll treat folders as a special type of document
    // In a real implementation, you might have a separate folder API
    const formData = new FormData();
    formData.append('name', folderData.name);
    formData.append('type', 'folder');
    formData.append('description', folderData.description || '');
    if (currentFolderId) {
      formData.append('parentId', currentFolderId);
    }
    uploadDocument.mutate(formData);
  };

  const handleUploadDocument = (files: FileList, folderId: string | null) => {
    if (files.length > 0) {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      if (folderId) {
        formData.append('folderId', folderId);
      }
      uploadDocument.mutate(formData);
    }
  };

  // Document operations
  const handleDeleteDocument = (documentId: string) => {
    deleteDocument.mutate(documentId);
  };

  const handleRenameDocument = (documentId: string, newName: string) => {
    updateDocument.mutate({
      id: documentId,
      data: { name: newName }
    });
  };

  const handleMoveDocument = (documentId: string, targetFolderId: string | null) => {
    updateDocument.mutate({
      id: documentId,
      data: { folderId: targetFolderId }
    });
  };

  const handleToggleStarred = (documentId: string) => {
    const document = documents.find((d: any) => d.id === documentId);
    updateDocument.mutate({
      id: documentId,
      data: { starred: !document?.starred }
    });
  };

  const handleDownloadDocument = (documentId: string) => {
    // This would typically trigger a download from a blob URL
    const document = documents.find((d: any) => d.id === documentId);
    if (document?.url) {
      window.open(document.url, '_blank');
    }
  };

  const handlePreviewDocument = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setActiveView('versions');
  };

  // Version operations
  const handleUploadNewVersion = (file: File, changeDescription: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('changeDescription', changeDescription);
    formData.append('isNewVersion', 'true');
    if (selectedDocumentId) {
      formData.append('documentId', selectedDocumentId);
    }
    uploadDocument.mutate(formData);
  };

  const handleDownloadVersion = (versionId: string) => {
    // In a real implementation, this would download a specific version
    const document = documents.find((d: any) => d.versions?.some((v: any) => v.id === versionId));
    if (document?.url) {
      window.open(document.url, '_blank');
    }
  };

  const handleRestoreVersion = (versionId: string) => {
    // In a real implementation, this would restore a document to a specific version
    if (selectedDocumentId) {
      updateDocument.mutate({
        id: selectedDocumentId,
        data: { activeVersionId: versionId }
      });
    }
  };

  // Template operations
  const handleCreateTemplate = (templateData: any) => {
    const formData = new FormData();
    formData.append('name', templateData.name);
    formData.append('type', 'template');
    formData.append('templateData', JSON.stringify(templateData));
    uploadDocument.mutate(formData);
  };

  const handleUseTemplate = (templateId: string, variables: Record<string, any>) => {
    const formData = new FormData();
    formData.append('templateId', templateId);
    formData.append('variables', JSON.stringify(variables));
    formData.append('action', 'createFromTemplate');
    uploadDocument.mutate(formData);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Document Management
                </h1>
                <p className="text-gray-600">
                  Comprehensive document storage, versioning, and collaboration
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Documents</p>
                    <p className="text-2xl font-bold">{sampleDocuments.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">15 added this month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Storage Used</p>
                    <p className="text-2xl font-bold">24.5 GB</p>
                  </div>
                  <FolderOpen className="h-8 w-8 text-green-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  <span className="text-sm">68% of total capacity</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Shared Documents</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <Share2 className="h-8 w-8 text-purple-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">45 active collaborators</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Templates</p>
                    <p className="text-2xl font-bold">{sampleTemplates.length}</p>
                  </div>
                  <Layout className="h-8 w-8 text-orange-200" />
                </div>
                <div className="mt-4 flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  <span className="text-sm">42 uses this month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex items-center justify-between">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'library', label: 'Document Library', icon: FolderOpen },
                  { id: 'versions', label: 'Version History', icon: History },
                  { id: 'sharing', label: 'Sharing & Permissions', icon: Share2 },
                  { id: 'templates', label: 'Templates', icon: Layout }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeView === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* View Mode Toggle */}
              {(activeView === 'library' || activeView === 'templates') && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          {activeView === 'library' && (
            <DocumentLibrary
              folders={sampleFolders}
              documents={sampleDocuments}
              currentFolderId={currentFolderId}
              viewMode={viewMode}
              onFolderSelect={handleFolderSelect}
              onDocumentSelect={handleDocumentSelect}
              onCreateFolder={handleCreateFolder}
              onUploadDocument={handleUploadDocument}
              onDeleteDocument={handleDeleteDocument}
              onDeleteFolder={(folderId) => console.log('Delete folder:', folderId)}
              onRenameDocument={handleRenameDocument}
              onRenameFolder={(folderId, newName) => console.log('Rename folder:', { folderId, newName })}
              onMoveDocument={handleMoveDocument}
              onToggleStarred={handleToggleStarred}
              onShareDocument={(docId, settings) => console.log('Share document:', { docId, settings })}
              onDownloadDocument={handleDownloadDocument}
              onPreviewDocument={handlePreviewDocument}
              onUpdateTags={(docId, tags) => console.log('Update tags:', { docId, tags })}
            />
          )}

          {activeView === 'versions' && selectedDocument && (
            <div className="space-y-6">
              {/* Document Context */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedDocument.name}</h3>
                    <p className="text-gray-600">{selectedDocument.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Current Version</div>
                    <div className="text-2xl font-bold text-blue-600">v{selectedDocument.version}</div>
                  </div>
                </div>
              </div>

              <DocumentVersioning
                documentId={selectedDocument.id}
                documentName={selectedDocument.name}
                versions={sampleVersions.filter(v => v.documentId === selectedDocument.id)}
                currentVersionId={sampleVersions.find(v => v.documentId === selectedDocument.id && v.isCurrentVersion)?.id || ''}
                canEdit={selectedDocument.permissions.canWrite}
                canApprove={true}
                onUploadNewVersion={handleUploadNewVersion}
                onDownloadVersion={handleDownloadVersion}
                onPreviewVersion={(versionId) => console.log('Preview version:', versionId)}
                onRestoreVersion={handleRestoreVersion}
                onDeleteVersion={(versionId) => console.log('Delete version:', versionId)}
                onCompareVersions={(v1, v2) => console.log('Compare versions:', { v1, v2 })}
                onApproveVersion={(versionId) => console.log('Approve version:', versionId)}
                onRejectVersion={(versionId, reason) => console.log('Reject version:', { versionId, reason })}
                onLockVersion={(versionId) => console.log('Lock version:', versionId)}
                onUnlockVersion={(versionId) => console.log('Unlock version:', versionId)}
                onUpdateVersionMetadata={(versionId, metadata) => console.log('Update metadata:', { versionId, metadata })}
              />
            </div>
          )}

          {activeView === 'sharing' && selectedDocument && (
            <div className="space-y-6">
              {/* Document Context */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedDocument.name}</h3>
                    <p className="text-gray-600">Manage sharing and permissions</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Visibility</div>
                    <div className="text-lg font-bold text-blue-600">
                      {selectedDocument.isPublic ? 'Public' : 'Private'}
                    </div>
                  </div>
                </div>
              </div>

              <DocumentSharing
                documentId={selectedDocument.id}
                documentName={selectedDocument.name}
                currentPermissions={[]}
                shareLinks={[]}
                users={sampleUsers}
                groups={[]}
                canManageSharing={selectedDocument.permissions.canShare}
                onAddPermission={(permission) => console.log('Add permission:', permission)}
                onUpdatePermission={(permissionId, updates) => console.log('Update permission:', { permissionId, updates })}
                onRemovePermission={(permissionId) => console.log('Remove permission:', permissionId)}
                onCreateShareLink={(linkData) => console.log('Create share link:', linkData)}
                onUpdateShareLink={(linkId, updates) => console.log('Update share link:', { linkId, updates })}
                onDeleteShareLink={(linkId) => console.log('Delete share link:', linkId)}
                onSendInvitation={(email, permissions, message) => console.log('Send invitation:', { email, permissions, message })}
                onCopyLink={(url) => console.log('Copy link:', url)}
                onRevokeAccess={(permissionId) => console.log('Revoke access:', permissionId)}
              />
            </div>
          )}

          {activeView === 'templates' && (
            <DocumentTemplates
              templates={sampleTemplates}
              categories={sampleCategories}
              viewMode={viewMode}
              onCreateTemplate={handleCreateTemplate}
              onEditTemplate={(templateId) => console.log('Edit template:', templateId)}
              onDeleteTemplate={(templateId) => console.log('Delete template:', templateId)}
              onDuplicateTemplate={(templateId) => console.log('Duplicate template:', templateId)}
              onUseTemplate={handleUseTemplate}
              onToggleStarred={(templateId) => console.log('Toggle starred template:', templateId)}
              onPreviewTemplate={(templateId) => console.log('Preview template:', templateId)}
              onExportTemplate={(templateId) => console.log('Export template:', templateId)}
              onImportTemplate={(file) => console.log('Import template:', file.name)}
              onUpdateTemplate={(templateId, updates) => console.log('Update template:', { templateId, updates })}
              onCreateCategory={(categoryData) => console.log('Create category:', categoryData)}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}