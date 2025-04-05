import { useState, useEffect, useCallback } from 'react';
import {
  MoodEntry,
  getAllMoodEntries,
  saveMoodEntry,
  updateMoodEntry
} from '../utils/indexedDB';

export function useMoodEntries() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load entries from IndexedDB
  useEffect(() => {
    const loadEntries = async () => {
      try {
        setLoading(true);
        const loadedEntries = await getAllMoodEntries();
        // Sort by timestamp descending (newest first)
        setEntries(loadedEntries.sort((a, b) => b.timestamp - a.timestamp));
        setError(null);
      } catch (err) {
        console.error('Failed to load mood entries:', err);
        setError('Failed to load mood entries');
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, []);

  // Add a new mood entry
  const addEntry = useCallback(async (entry: Omit<MoodEntry, 'timestamp'>) => {
    try {
      const newEntry: MoodEntry = {
        ...entry,
        timestamp: Date.now()
      };
      
      await saveMoodEntry(newEntry);
      
      // Update local state
      setEntries(prevEntries => [newEntry, ...prevEntries]);
      return newEntry;
    } catch (err) {
      console.error('Failed to add mood entry:', err);
      setError('Failed to add mood entry');
      throw err;
    }
  }, []);

  // Update an existing entry
  const updateEntry = useCallback(async (timestamp: number, updates: Partial<Omit<MoodEntry, 'timestamp'>>) => {
    try {
      const entryIndex = entries.findIndex(e => e.timestamp === timestamp);
      if (entryIndex === -1) {
        throw new Error('Entry not found');
      }
      
      const updatedEntry: MoodEntry = {
        ...entries[entryIndex],
        ...updates
      };
      
      await updateMoodEntry(updatedEntry);
      
      // Update local state
      setEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.timestamp === timestamp ? updatedEntry : entry
        )
      );
      
      return updatedEntry;
    } catch (err) {
      console.error('Failed to update mood entry:', err);
      setError('Failed to update mood entry');
      throw err;
    }
  }, [entries]);

  // Add a note to an entry
  const addNote = useCallback(async (timestamp: number, note: string) => {
    return updateEntry(timestamp, { note });
  }, [updateEntry]);

  return {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    addNote
  };
} 