import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import * as SQLite from 'expo-sqlite';

interface OfflineContextType {
  isOnline: boolean;
  syncPendingChanges: () => Promise<void>;
  addPendingChange: (change: any) => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [isOnline, setIsOnline] = useState(true);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    initializeOfflineDB();
    setupNetworkListener();
  }, []);

  const initializeOfflineDB = async (): Promise<void> => {
    try {
      const database = await SQLite.openDatabaseAsync('offline_data.db');
      
      // Create tables for offline data
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS pending_changes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          data TEXT NOT NULL,
          timestamp INTEGER NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS cached_data (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          data TEXT NOT NULL,
          last_updated INTEGER NOT NULL
        );
      `);
      
      setDb(database);
    } catch (error) {
      console.error('Failed to initialize offline database:', error);
    }
  };

  const setupNetworkListener = (): void => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOffline = !isOnline;
      setIsOnline(state.isConnected ?? false);
      
      // Auto-sync when coming back online
      if (wasOffline && state.isConnected) {
        syncPendingChanges();
      }
    });

    return unsubscribe;
  };

  const addPendingChange = async (change: any): Promise<void> => {
    if (!db) return;
    
    try {
      await db.runAsync(
        'INSERT INTO pending_changes (type, data, timestamp) VALUES (?, ?, ?)',
        [change.type, JSON.stringify(change.data), Date.now()]
      );
    } catch (error) {
      console.error('Failed to add pending change:', error);
    }
  };

  const syncPendingChanges = async (): Promise<void> => {
    if (!db || !isOnline) return;
    
    try {
      const pendingChanges = await db.getAllAsync('SELECT * FROM pending_changes ORDER BY timestamp ASC');
      
      for (const change of pendingChanges) {
        try {
          // TODO: Implement actual sync logic with API
          await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: change.data,
          });
          
          // Remove successfully synced change
          await db.runAsync('DELETE FROM pending_changes WHERE id = ?', [change.id]);
        } catch (error) {
          console.error('Failed to sync change:', error);
          // Stop syncing on first failure to maintain order
          break;
        }
      }
    } catch (error) {
      console.error('Failed to sync pending changes:', error);
    }
  };

  return (
    <OfflineContext.Provider value={{ isOnline, syncPendingChanges, addPendingChange }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline(): OfflineContextType {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
