// IndexedDB utility for offline storage
const DB_NAME = 'serenity-health-ai-db';
const DB_VERSION = 1;
const MOOD_STORE = 'mood-entries';

// Define extended interface for ServiceWorkerRegistration with sync
declare global {
  interface ServiceWorkerRegistration {
    sync: {
      register(tag: string): Promise<void>;
    }
  }
  
  interface Window {
    SyncManager: any;
  }
}

// Open the database
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported in this browser'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject(new Error('Error opening database'));
    };

    request.onsuccess = (event) => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create the mood entries store with timestamp as key
      if (!db.objectStoreNames.contains(MOOD_STORE)) {
        const store = db.createObjectStore(MOOD_STORE, { keyPath: 'timestamp' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('syncStatus', 'syncStatus', { unique: false });
      }
    };
  });
};

// Type for mood entries
export interface MoodEntry {
  timestamp: number;
  category: string;
  emotion: string;
  subEmotion: string;
  note?: string;
  syncStatus?: 'pending' | 'synced';
}

// Save a mood entry to IndexedDB
export const saveMoodEntry = async (entry: MoodEntry): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(MOOD_STORE, 'readwrite');
    const store = transaction.objectStore(MOOD_STORE);
    
    // Mark as pending sync by default
    const entryWithSync = { ...entry, syncStatus: 'pending' };
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put(entryWithSync);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Error saving entry'));
    });
    
    // Request background sync if available
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-mood-entries');
    }
  } catch (error) {
    console.error('Error saving mood entry:', error);
    throw error;
  }
};

// Get all mood entries from IndexedDB
export const getAllMoodEntries = async (): Promise<MoodEntry[]> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(MOOD_STORE, 'readonly');
    const store = transaction.objectStore(MOOD_STORE);
    
    return new Promise<MoodEntry[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Error getting entries'));
    });
  } catch (error) {
    console.error('Error getting mood entries:', error);
    return [];
  }
};

// Update a mood entry in IndexedDB
export const updateMoodEntry = async (entry: MoodEntry): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(MOOD_STORE, 'readwrite');
    const store = transaction.objectStore(MOOD_STORE);
    
    // Ensure it's marked for syncing
    const entryWithSync = { ...entry, syncStatus: 'pending' };
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put(entryWithSync);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Error updating entry'));
    });
    
    // Request background sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-mood-entries');
    }
  } catch (error) {
    console.error('Error updating mood entry:', error);
    throw error;
  }
};

// Mark entries as synced
export const markEntriesAsSynced = async (timestamps: number[]): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(MOOD_STORE, 'readwrite');
    const store = transaction.objectStore(MOOD_STORE);
    
    for (const timestamp of timestamps) {
      const request = store.get(timestamp);
      request.onsuccess = () => {
        const entry = request.result;
        if (entry) {
          entry.syncStatus = 'synced';
          store.put(entry);
        }
      };
    }
  } catch (error) {
    console.error('Error marking entries as synced:', error);
  }
};

// Get pending entries that need to be synced
export const getPendingEntries = async (): Promise<MoodEntry[]> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(MOOD_STORE, 'readonly');
    const store = transaction.objectStore(MOOD_STORE);
    const index = store.index('syncStatus');
    
    return new Promise<MoodEntry[]>((resolve, reject) => {
      const request = index.getAll('pending');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Error getting pending entries'));
    });
  } catch (error) {
    console.error('Error getting pending entries:', error);
    return [];
  }
}; 