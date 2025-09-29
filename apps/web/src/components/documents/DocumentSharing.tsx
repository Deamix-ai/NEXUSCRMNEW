'use client';

import React, { useState } from 'react';
import {
  Share2,
  Users,
  Globe,
  Lock,
  Eye,
  Edit,
  Download,
  Copy,
  Mail,
  Calendar,
  Clock,
  UserCheck,
  UserX,
  Link as LinkIcon,
  Shield,
  AlertCircle,
  Check,
  X,
  Settings,
  QrCode,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface SharePermission {
  id: string;
  documentId: string;
  userId?: string;
  email?: string;
  groupId?: string;
  type: 'user' | 'email' | 'group' | 'public';
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDownload: boolean;
    canShare: boolean;
    canComment: boolean;
  };
  expiresAt?: string;
  createdAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  lastAccessedAt?: string;
  accessCount: number;
  isActive: boolean;
  notes?: string;
}

interface ShareLink {
  id: string;
  documentId: string;
  token: string;
  url: string;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDownload: boolean;
    canComment: boolean;
  };
  password?: string;
  expiresAt?: string;
  maxAccesses?: number;
  currentAccesses: number;
  isActive: boolean;
  createdAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  lastAccessedAt?: string;
  allowedDomains: string[];
  requireLogin: boolean;
  trackViews: boolean;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  department?: string;
  role?: string;
}

interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  members: User[];
}

interface DocumentSharingProps {
  documentId: string;
  documentName: string;
  currentPermissions: SharePermission[];
  shareLinks: ShareLink[];
  users: User[];
  groups: Group[];
  canManageSharing: boolean;
  onAddPermission: (permission: Partial<SharePermission>) => void;
  onUpdatePermission: (permissionId: string, updates: Partial<SharePermission>) => void;
  onRemovePermission: (permissionId: string) => void;
  onCreateShareLink: (linkData: Partial<ShareLink>) => void;
  onUpdateShareLink: (linkId: string, updates: Partial<ShareLink>) => void;
  onDeleteShareLink: (linkId: string) => void;
  onSendInvitation: (email: string, permissions: any, message?: string) => void;
  onCopyLink: (url: string) => void;
  onRevokeAccess: (permissionId: string) => void;
}

const DocumentSharing: React.FC<DocumentSharingProps> = ({
  documentId,
  documentName,
  currentPermissions,
  shareLinks,
  users,
  groups,
  canManageSharing,
  onAddPermission,
  onUpdatePermission,
  onRemovePermission,
  onCreateShareLink,
  onUpdateShareLink,
  onDeleteShareLink,
  onSendInvitation,
  onCopyLink,
  onRevokeAccess
}) => {
  const [activeTab, setActiveTab] = useState<'people' | 'links' | 'settings'>('people');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showCreateLink, setShowCreateLink] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [newPermissions, setNewPermissions] = useState({
    canView: true,
    canEdit: false,
    canDownload: false,
    canShare: false,
    canComment: true
  });
  const [linkSettings, setLinkSettings] = useState({
    canView: true,
    canEdit: false,
    canDownload: false,
    canComment: false,
    password: '',
    expiresAt: '',
    maxAccesses: '',
    requireLogin: false,
    allowedDomains: [] as string[],
    trackViews: true
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !currentPermissions.some(p => p.userId === user.id)
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !currentPermissions.some(p => p.groupId === group.id)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPermissionIcon = (permission: SharePermission) => {
    if (permission.type === 'public') return Globe;
    if (permission.type === 'group') return Users;
    return UserCheck;
  };

  const getPermissionLevel = (permissions: any) => {
    if (permissions.canEdit) return 'Editor';
    if (permissions.canDownload) return 'Downloader';
    if (permissions.canComment) return 'Commenter';
    return 'Viewer';
  };

  const handleAddUser = () => {
    if (selectedUser) {
      onAddPermission({
        userId: selectedUser,
        type: 'user',
        permissions: newPermissions
      });
      setSelectedUser('');
      setShowAddUser(false);
    }
  };

  const handleAddGroup = () => {
    if (selectedGroup) {
      onAddPermission({
        groupId: selectedGroup,
        type: 'group',
        permissions: newPermissions
      });
      setSelectedGroup('');
      setShowAddUser(false);
    }
  };

  const handleInviteByEmail = () => {
    if (inviteEmail) {
      onSendInvitation(inviteEmail, newPermissions, inviteMessage);
      setInviteEmail('');
      setInviteMessage('');
      setShowAddUser(false);
    }
  };

  const handleCreateShareLink = () => {
    const linkData: Partial<ShareLink> = {
      permissions: {
        canView: linkSettings.canView,
        canEdit: linkSettings.canEdit,
        canDownload: linkSettings.canDownload,
        canComment: linkSettings.canComment
      },
      password: linkSettings.password || undefined,
      expiresAt: linkSettings.expiresAt || undefined,
      maxAccesses: linkSettings.maxAccesses ? parseInt(linkSettings.maxAccesses) : undefined,
      requireLogin: linkSettings.requireLogin,
      allowedDomains: linkSettings.allowedDomains,
      trackViews: linkSettings.trackViews
    };

    onCreateShareLink(linkData);
    setShowCreateLink(false);
    setLinkSettings({
      canView: true,
      canEdit: false,
      canDownload: false,
      canComment: false,
      password: '',
      expiresAt: '',
      maxAccesses: '',
      requireLogin: false,
      allowedDomains: [],
      trackViews: true
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Share2 className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Share Document</h2>
              <p className="text-sm text-gray-600">{documentName}</p>
            </div>
          </div>
          {canManageSharing && (
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Share</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 mt-4">
          <button
            onClick={() => setActiveTab('people')}
            className={`px-3 py-2 rounded-md text-sm transition-colors ${
              activeTab === 'people' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            People & Groups
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-3 py-2 rounded-md text-sm transition-colors ${
              activeTab === 'links' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Share Links
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-2 rounded-md text-sm transition-colors ${
              activeTab === 'settings' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Add User/Group Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw max-h-90vh overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Share Document</h3>
            
            <div className="space-y-4">
              {/* Search */}
              <div>
                <input
                  type="text"
                  placeholder="Search users or enter email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email Invitation */}
              <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2">Invite by email</h4>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                />
                <textarea
                  placeholder="Add a message (optional)"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Users */}
              {filteredUsers.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 mb-2">Users</h4>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                          selectedUser === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedUser(user.id)}
                      >
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        {selectedUser === user.id && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Groups */}
              {filteredGroups.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 mb-2">Groups</h4>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {filteredGroups.map((group) => (
                      <div
                        key={group.id}
                        className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                          selectedGroup === group.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedGroup(group.id)}
                      >
                        <Users className="h-6 w-6 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{group.name}</p>
                          <p className="text-xs text-gray-500">{group.memberCount} members</p>
                        </div>
                        {selectedGroup === group.id && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Permissions */}
              <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2">Permissions</h4>
                <div className="space-y-2">
                  {[
                    { key: 'canView', label: 'Can view', icon: Eye },
                    { key: 'canEdit', label: 'Can edit', icon: Edit },
                    { key: 'canDownload', label: 'Can download', icon: Download },
                    { key: 'canShare', label: 'Can share', icon: Share2 },
                    { key: 'canComment', label: 'Can comment', icon: MessageSquare }
                  ].map(({ key, label, icon: Icon }) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newPermissions[key as keyof typeof newPermissions]}
                        onChange={(e) => setNewPermissions(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddUser(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              {inviteEmail && (
                <button
                  onClick={handleInviteByEmail}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Send Invitation
                </button>
              )}
              {selectedUser && (
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Share with User
                </button>
              )}
              {selectedGroup && (
                <button
                  onClick={handleAddGroup}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Share with Group
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Share Link Modal */}
      {showCreateLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw max-h-90vh overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create Share Link</h3>
            
            <div className="space-y-4">
              {/* Permissions */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Permissions</h4>
                <div className="space-y-2">
                  {[
                    { key: 'canView', label: 'Can view', icon: Eye },
                    { key: 'canEdit', label: 'Can edit', icon: Edit },
                    { key: 'canDownload', label: 'Can download', icon: Download },
                    { key: 'canComment', label: 'Can comment', icon: MessageSquare }
                  ].map(({ key, label, icon: Icon }) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={linkSettings[key as keyof typeof linkSettings] as boolean}
                        onChange={(e) => setLinkSettings(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Security Options */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Security</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password (optional)
                    </label>
                    <input
                      type="password"
                      value={linkSettings.password}
                      onChange={(e) => setLinkSettings(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expires at (optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={linkSettings.expiresAt}
                      onChange={(e) => setLinkSettings(prev => ({ ...prev, expiresAt: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max accesses (optional)
                    </label>
                    <input
                      type="number"
                      value={linkSettings.maxAccesses}
                      onChange={(e) => setLinkSettings(prev => ({ ...prev, maxAccesses: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={linkSettings.requireLogin}
                      onChange={(e) => setLinkSettings(prev => ({ ...prev, requireLogin: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Require login to access</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={linkSettings.trackViews}
                      onChange={(e) => setLinkSettings(prev => ({ ...prev, trackViews: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Track views and access</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateLink(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateShareLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {activeTab === 'people' && (
          <div className="space-y-4">
            {currentPermissions.length > 0 ? (
              currentPermissions.map((permission) => {
                const PermissionIcon = getPermissionIcon(permission);
                const user = permission.userId ? users.find(u => u.id === permission.userId) : null;
                const group = permission.groupId ? groups.find(g => g.id === permission.groupId) : null;
                
                return (
                  <div key={permission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <PermissionIcon className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {permission.type === 'public' ? 'Public access' :
                           permission.type === 'email' ? permission.email :
                           user ? `${user.firstName} ${user.lastName}` :
                           group ? group.name : 'Unknown'}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{getPermissionLevel(permission.permissions)}</span>
                          {permission.expiresAt && (
                            <>
                              <span>•</span>
                              <span>Expires {formatDate(permission.expiresAt)}</span>
                            </>
                          )}
                          {permission.lastAccessedAt && (
                            <>
                              <span>•</span>
                              <span>Last accessed {formatDate(permission.lastAccessedAt)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {canManageSharing && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onRevokeAccess(permission.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No one has access</h3>
                <p className="text-gray-500 mb-4">Share this document to start collaborating</p>
                {canManageSharing && (
                  <button
                    onClick={() => setShowAddUser(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Share Document
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'links' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Share Links</h3>
              {canManageSharing && (
                <button
                  onClick={() => setShowCreateLink(true)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>Create Link</span>
                </button>
              )}
            </div>

            {shareLinks.length > 0 ? (
              shareLinks.map((link) => (
                <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <LinkIcon className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Share Link</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        link.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {link.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {canManageSharing && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onCopyLink(link.url)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteShareLink(link.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <code className="text-sm text-gray-800 break-all">{link.url}</code>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Permissions:</span> {getPermissionLevel(link.permissions)}
                    </div>
                    <div>
                      <span className="font-medium">Accesses:</span> {link.currentAccesses}
                      {link.maxAccesses && ` / ${link.maxAccesses}`}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {formatDate(link.createdAt)}
                    </div>
                    {link.expiresAt && (
                      <div>
                        <span className="font-medium">Expires:</span> {formatDate(link.expiresAt)}
                      </div>
                    )}
                    {link.password && (
                      <div className="col-span-2">
                        <span className="flex items-center space-x-1">
                          <Shield className="h-4 w-4" />
                          <span className="font-medium">Password protected</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <LinkIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No share links</h3>
                <p className="text-gray-500 mb-4">Create a link to share this document publicly</p>
                {canManageSharing && (
                  <button
                    onClick={() => setShowCreateLink(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Link
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sharing Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Public Access</h4>
                    <p className="text-sm text-gray-600">Allow anyone with the link to view this document</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-200">
                    <span className="translate-x-0 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Download Prevention</h4>
                    <p className="text-sm text-gray-600">Prevent users from downloading this document</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-200">
                    <span className="translate-x-0 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Access Notifications</h4>
                    <p className="text-sm text-gray-600">Get notified when someone accesses this document</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-blue-600">
                    <span className="translate-x-5 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Access History</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Access history and analytics are available in the premium plan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentSharing;