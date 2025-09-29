import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as SQLite from 'expo-sqlite';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
export interface OfflineAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: string;
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SyncStatus {
  isOnline: boolean;
  lastSyncTime: number | null;
  syncInProgress: boolean;
  pendingActions: number;
  failedActions: number;
  syncErrors: string[];
}

export interface OfflineData {
  enquiries: any[];
  leads: any[];
  projects: any[];
  accounts: any[];
  communications: any[];
  quotes: any[];
  documents: any[];
  tasks: any[];
  lastUpdated: { [key: string]: number };
}

// Database Schema
const DATABASE_NAME = 'CrmNexusOffline.db';
const DATABASE_VERSION = 1;

// Store Interface
interface OfflineStoreState {
  syncStatus: SyncStatus;
  offlineData: OfflineData;
  pendingActions: OfflineAction[];
  
  // Actions
  addPendingAction: (action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>) => void;
  removePendingAction: (actionId: string) => void;
  updateSyncStatus: (status: Partial<SyncStatus>) => void;
  updateOfflineData: (entity: string, data: any[]) => void;
  getOfflineData: (entity: string) => any[];
  clearAllData: () => void;
  incrementRetryCount: (actionId: string) => void;
}

// Zustand Store with Persistence
export const useOfflineStore = create<OfflineStoreState>()(
  persist(
    (set, get) => ({
      syncStatus: {
        isOnline: false,
        lastSyncTime: null,
        syncInProgress: false,
        pendingActions: 0,
        failedActions: 0,
        syncErrors: []
      },
      offlineData: {
        enquiries: [],
        leads: [],
        projects: [],
        accounts: [],
        communications: [],
        quotes: [],
        documents: [],
        tasks: [],
        lastUpdated: {}
      },
      pendingActions: [],

      addPendingAction: (action) => {
        const newAction: OfflineAction = {
          ...action,
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          retryCount: 0
        };

        set((state) => ({
          pendingActions: [...state.pendingActions, newAction],
          syncStatus: {
            ...state.syncStatus,
            pendingActions: state.syncStatus.pendingActions + 1
          }
        }));
      },

      removePendingAction: (actionId) => {
        set((state) => ({
          pendingActions: state.pendingActions.filter(a => a.id !== actionId),
          syncStatus: {
            ...state.syncStatus,
            pendingActions: Math.max(0, state.syncStatus.pendingActions - 1)
          }
        }));
      },

      updateSyncStatus: (status) => {
        set((state) => ({
          syncStatus: { ...state.syncStatus, ...status }
        }));
      },

      updateOfflineData: (entity, data) => {
        set((state) => ({
          offlineData: {
            ...state.offlineData,
            [entity]: data,
            lastUpdated: {
              ...state.offlineData.lastUpdated,
              [entity]: Date.now()
            }
          }
        }));
      },

      getOfflineData: (entity) => {
        const state = get();
        return state.offlineData[entity as keyof OfflineData] as any[] || [];
      },

      incrementRetryCount: (actionId) => {
        set((state) => ({
          pendingActions: state.pendingActions.map(action =>
            action.id === actionId
              ? { ...action, retryCount: action.retryCount + 1 }
              : action
          )
        }));
      },

      clearAllData: () => {
        set({
          offlineData: {
            enquiries: [],
            leads: [],
            projects: [],
            accounts: [],
            communications: [],
            quotes: [],
            documents: [],
            tasks: [],
            lastUpdated: {}
          },
          pendingActions: [],
          syncStatus: {
            isOnline: false,
            lastSyncTime: null,
            syncInProgress: false,
            pendingActions: 0,
            failedActions: 0,
            syncErrors: []
          }
        });
      }
    }),
    {
      name: 'crm-nexus-offline-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        offlineData: state.offlineData,
        pendingActions: state.pendingActions,
        syncStatus: {
          ...state.syncStatus,
          syncInProgress: false // Reset sync in progress on app restart
        }
      })
    }
  )
);

// SQLite Database Manager
export class OfflineDatabase {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await this.createTables();
    } catch (error) {
      console.error('Failed to initialize offline database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const queries = [
      // Enquiries
      `CREATE TABLE IF NOT EXISTS enquiries (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        firstName TEXT,
        lastName TEXT,
        email TEXT,
        phone TEXT,
        accountId TEXT,
        ownerId TEXT,
        status TEXT,
        priority TEXT,
        estimatedValue REAL,
        source TEXT,
        createdAt INTEGER,
        updatedAt INTEGER,
        syncStatus TEXT DEFAULT 'pending'
      )`,

      // Leads
      `CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        firstName TEXT,
        lastName TEXT,
        email TEXT,
        phone TEXT,
        company TEXT,
        source TEXT,
        status TEXT,
        score INTEGER,
        ownerId TEXT,
        accountId TEXT,
        estimatedValue REAL,
        expectedCloseDate INTEGER,
        notes TEXT,
        createdAt INTEGER,
        updatedAt INTEGER,
        syncStatus TEXT DEFAULT 'pending'
      )`,

      // Projects
      `CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        accountId TEXT,
        managerId TEXT,
        status TEXT,
        priority TEXT,
        startDate INTEGER,
        endDate INTEGER,
        estimatedBudget REAL,
        actualBudget REAL,
        progress REAL,
        phase TEXT,
        location TEXT,
        requirements TEXT,
        createdAt INTEGER,
        updatedAt INTEGER,
        syncStatus TEXT DEFAULT 'pending'
      )`,

      // Communications
      `CREATE TABLE IF NOT EXISTS communications (
        id TEXT PRIMARY KEY,
        type TEXT,
        direction TEXT,
        subject TEXT,
        content TEXT,
        fromId TEXT,
        toId TEXT,
        accountId TEXT,
        leadId TEXT,
        projectId TEXT,
        status TEXT,
        scheduledAt INTEGER,
        sentAt INTEGER,
        readAt INTEGER,
        attachments TEXT,
        createdAt INTEGER,
        updatedAt INTEGER,
        syncStatus TEXT DEFAULT 'pending'
      )`,

      // Sync Actions
      `CREATE TABLE IF NOT EXISTS sync_actions (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        entity TEXT NOT NULL,
        entityId TEXT,
        data TEXT,
        priority TEXT,
        retryCount INTEGER DEFAULT 0,
        maxRetries INTEGER DEFAULT 3,
        createdAt INTEGER,
        syncStatus TEXT DEFAULT 'pending'
      )`
    ];

    for (const query of queries) {
      await this.db.execAsync(query);
    }
  }

  async insertOrUpdate(table: string, data: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const updateClause = keys.map(key => `${key} = ?`).join(', ');

    const query = `
      INSERT OR REPLACE INTO ${table} (${keys.join(', ')})
      VALUES (${placeholders})
    `;

    await this.db.runAsync(query, values);
  }

  async query(table: string, where?: string, params?: any[]): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = `SELECT * FROM ${table}`;
    if (where) {
      query += ` WHERE ${where}`;
    }

    const result = await this.db.getAllAsync(query, params);
    return result;
  }

  async delete(table: string, where: string, params: any[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `DELETE FROM ${table} WHERE ${where}`;
    await this.db.runAsync(query, params);
  }

  async clearTable(table: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync(`DELETE FROM ${table}`);
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

// Offline Sync Manager
export class OfflineSyncManager {
  private database: OfflineDatabase;
  private baseURL: string;
  private authToken: string | null = null;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor(baseURL: string) {
    this.database = new OfflineDatabase();
    this.baseURL = baseURL;
  }

  async initialize(authToken?: string): Promise<void> {
    await this.database.initialize();
    if (authToken) {
      this.authToken = authToken;
    }
    
    // Listen to network changes
    NetInfo.addEventListener(state => {
      useOfflineStore.getState().updateSyncStatus({
        isOnline: state.isConnected ?? false
      });

      if (state.isConnected) {
        this.startAutoSync();
      } else {
        this.stopAutoSync();
      }
    });

    // Initial network check
    const networkState = await NetInfo.fetch();
    useOfflineStore.getState().updateSyncStatus({
      isOnline: networkState.isConnected ?? false
    });

    if (networkState.isConnected) {
      this.startAutoSync();
    }
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  private startAutoSync(): void {
    if (this.syncInterval) return;

    this.syncInterval = setInterval(() => {
      this.syncPendingActions();
    }, 30000); // Sync every 30 seconds

    // Immediate sync
    this.syncPendingActions();
  }

  private stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async createOfflineAction(
    type: OfflineAction['type'],
    entity: string,
    data: any,
    priority: OfflineAction['priority'] = 'MEDIUM'
  ): Promise<void> {
    // Store in Zustand store
    useOfflineStore.getState().addPendingAction({
      type,
      entity,
      data,
      priority,
      maxRetries: 3
    });

    // Store in SQLite for persistence
    await this.database.insertOrUpdate('sync_actions', {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      entity,
      entityId: data.id || null,
      data: JSON.stringify(data),
      priority,
      createdAt: Date.now()
    });
  }

  async syncPendingActions(): Promise<void> {
    const store = useOfflineStore.getState();
    
    if (store.syncStatus.syncInProgress || !store.syncStatus.isOnline) {
      return;
    }

    store.updateSyncStatus({ syncInProgress: true, syncErrors: [] });

    const pendingActions = store.pendingActions
      .filter(action => action.retryCount < action.maxRetries)
      .sort((a, b) => {
        // Sort by priority then by timestamp
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return a.timestamp - b.timestamp;
      });

    const errors: string[] = [];
    let successCount = 0;

    for (const action of pendingActions) {
      try {
        await this.executeAction(action);
        store.removePendingAction(action.id);
        await this.database.delete('sync_actions', 'id = ?', [action.id]);
        successCount++;
      } catch (error) {
        console.error(`Failed to sync action ${action.id}:`, error);
        errors.push(`${action.entity} ${action.type}: ${error.message}`);
        
        store.incrementRetryCount(action.id);
        
        // Remove action if max retries exceeded
        if (action.retryCount + 1 >= action.maxRetries) {
          store.removePendingAction(action.id);
          await this.database.delete('sync_actions', 'id = ?', [action.id]);
        }
      }
    }

    store.updateSyncStatus({
      syncInProgress: false,
      lastSyncTime: Date.now(),
      syncErrors: errors,
      failedActions: errors.length
    });
  }

  private async executeAction(action: OfflineAction): Promise<void> {
    if (!this.authToken) {
      throw new Error('No authentication token available');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authToken}`
    };

    let url = `${this.baseURL}/api/${action.entity}`;
    let method = 'POST';

    switch (action.type) {
      case 'CREATE':
        method = 'POST';
        break;
      case 'UPDATE':
        method = 'PUT';
        url += `/${action.data.id}`;
        break;
      case 'DELETE':
        method = 'DELETE';
        url += `/${action.data.id}`;
        break;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: action.type !== 'DELETE' ? JSON.stringify(action.data) : undefined
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  async downloadData(entity: string, lastUpdated?: number): Promise<any[]> {
    if (!this.authToken) {
      throw new Error('No authentication token available');
    }

    let url = `${this.baseURL}/api/${entity}`;
    if (lastUpdated) {
      url += `?since=${lastUpdated}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download ${entity}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Store in offline storage
    useOfflineStore.getState().updateOfflineData(entity, data);
    
    // Store in SQLite
    for (const item of data) {
      await this.database.insertOrUpdate(entity, {
        ...item,
        createdAt: new Date(item.createdAt).getTime(),
        updatedAt: new Date(item.updatedAt).getTime(),
        syncStatus: 'synced'
      });
    }

    return data;
  }

  async fullSync(): Promise<void> {
    const store = useOfflineStore.getState();
    
    if (!store.syncStatus.isOnline) {
      throw new Error('Cannot perform full sync while offline');
    }

    store.updateSyncStatus({ syncInProgress: true });

    try {
      const entities = ['enquiries', 'leads', 'projects', 'accounts', 'communications', 'quotes'];
      
      for (const entity of entities) {
        const lastUpdated = store.offlineData.lastUpdated[entity];
        await this.downloadData(entity, lastUpdated);
      }

      // Sync pending actions
      await this.syncPendingActions();

      store.updateSyncStatus({
        syncInProgress: false,
        lastSyncTime: Date.now(),
        syncErrors: []
      });
    } catch (error) {
      store.updateSyncStatus({
        syncInProgress: false,
        syncErrors: [error.message]
      });
      throw error;
    }
  }

  async clearOfflineData(): Promise<void> {
    // Clear Zustand store
    useOfflineStore.getState().clearAllData();
    
    // Clear SQLite tables
    const tables = ['enquiries', 'leads', 'projects', 'communications', 'sync_actions'];
    for (const table of tables) {
      await this.database.clearTable(table);
    }
  }

  async getOfflineEntityCount(entity: string): Promise<number> {
    const data = await this.database.query(entity);
    return data.length;
  }

  async getLastSyncTime(entity: string): Promise<number | null> {
    const store = useOfflineStore.getState();
    return store.offlineData.lastUpdated[entity] || null;
  }

  async destroy(): Promise<void> {
    this.stopAutoSync();
    await this.database.close();
  }
}

// Singleton instance
let syncManagerInstance: OfflineSyncManager | null = null;

export const getSyncManager = (baseURL?: string): OfflineSyncManager => {
  if (!syncManagerInstance && baseURL) {
    syncManagerInstance = new OfflineSyncManager(baseURL);
  }
  
  if (!syncManagerInstance) {
    throw new Error('Sync manager not initialized. Provide baseURL on first call.');
  }
  
  return syncManagerInstance;
};

// React Hook for using sync manager
export const useSyncManager = () => {
  const syncStatus = useOfflineStore(state => state.syncStatus);
  const offlineData = useOfflineStore(state => state.offlineData);
  const pendingActions = useOfflineStore(state => state.pendingActions);
  
  const syncManager = getSyncManager();
  
  return {
    syncStatus,
    offlineData,
    pendingActions,
    syncManager,
    createOfflineAction: syncManager.createOfflineAction.bind(syncManager),
    syncNow: syncManager.syncPendingActions.bind(syncManager),
    fullSync: syncManager.fullSync.bind(syncManager),
    clearData: syncManager.clearOfflineData.bind(syncManager)
  };
};