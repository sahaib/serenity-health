import React, { useState, useEffect } from 'react';
import { MoodEntry as IMoodEntry } from '../utils/indexedDB';
import { useMoodEntries } from '../hooks/useMoodEntries';

interface MoodJournalProps {
  initialEntries?: IMoodEntry[];
  isDarkMode: boolean;
  onAddNote?: (timestamp: number, note: string) => void;
}

function MoodJournal({ initialEntries = [], isDarkMode, onAddNote }: MoodJournalProps) {
  const [activeNoteTimestamp, setActiveNoteTimestamp] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  
  // Use our offline-capable hook
  const { entries, loading, error, addNote } = useMoodEntries();
  
  // Combine initial entries with entries from IndexedDB if needed
  const [displayEntries, setDisplayEntries] = useState<IMoodEntry[]>(initialEntries);
  
  useEffect(() => {
    if (initialEntries.length > 0 && entries.length === 0) {
      setDisplayEntries(initialEntries);
    } else if (entries.length > 0) {
      setDisplayEntries(entries);
    }
  }, [initialEntries, entries]);
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getEmotionColor = (category: string): string => {
    switch (category) {
      case 'Joy': return '#22c55e';
      case 'Sadness': return '#64748b';
      case 'Fear': return '#eab308';
      case 'Anger': return '#ef4444';
      case 'Love': return '#ec4899';
      case 'Surprise': return '#8b5cf6';
      default: return '#6366f1';
    }
  };

  const getMoodPattern = () => {
    if (displayEntries.length < 3) return null;
    
    const recentEntries = displayEntries.slice(0, 7); // Already sorted newest first
    const categoryCounts = recentEntries.reduce((acc, { category }) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantCategory = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    return {
      category: dominantCategory,
      percentage: Math.round((categoryCounts[dominantCategory] / recentEntries.length) * 100)
    };
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const handleAddNote = async () => {
    if (activeNoteTimestamp && noteText.trim()) {
      try {
        // Use the hook's addNote function for IndexedDB support
        await addNote(activeNoteTimestamp, noteText.trim());
        
        // Also call the prop if provided (for backward compatibility)
        if (onAddNote) {
          onAddNote(activeNoteTimestamp, noteText.trim());
        }
      } catch (error) {
        console.error('Failed to add note:', error);
        // Show error to user
      } finally {
        closeNoteModal();
      }
    }
  };

  const openAddNoteModal = (timestamp: number) => {
    setActiveNoteTimestamp(timestamp);
    setNoteText('');
    setIsEditMode(false);
  };

  const openEditNoteModal = (timestamp: number, existingNote: string) => {
    setActiveNoteTimestamp(timestamp);
    setNoteText(existingNote);
    setIsEditMode(true);
  };

  const closeNoteModal = () => {
    setActiveNoteTimestamp(null);
    setNoteText('');
    setIsEditMode(false);
  };

  const pattern = getMoodPattern();

  if (loading) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: isDarkMode ? '#e5e7eb' : '#1f2937'
      }}>
        Loading your mood journal...
      </div>
    );
  }

  if (error && displayEntries.length === 0) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: isDarkMode ? '#e5e7eb' : '#1f2937'
      }}>
        <p>There was an error loading your mood journal.</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            border: 'none',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px',
      borderRadius: '24px',
      background: isDarkMode ? 'rgba(23, 25, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      boxShadow: isDarkMode 
        ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
        : '0 8px 32px rgba(99, 102, 241, 0.2)',
      border: '1px solid',
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '80vh',
      overflowY: 'auto',
      position: 'relative'
    }}>
      <h3 style={{
        margin: '0 0 20px 0',
        fontSize: '20px',
        color: isDarkMode ? '#e5e7eb' : '#1f2937',
        textAlign: 'center'
      }}>
        Your Mood Journal
        {!isOnline && (
          <span style={{
            fontSize: '12px',
            display: 'block',
            marginTop: '4px',
            color: isDarkMode ? '#9ca3af' : '#6b7280'
          }}>
            (Offline Mode)
          </span>
        )}
      </h3>

      {displayEntries.length === 0 ? (
        <div style={{
          padding: '16px',
          textAlign: 'center',
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        }}>
          No mood entries yet. Start tracking your emotions to see them here.
        </div>
      ) : (
        <>
          {pattern && (
            <div style={{
              padding: '16px',
              marginBottom: '24px',
              borderRadius: '16px',
              background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              color: isDarkMode ? '#e5e7eb' : '#1f2937'
            }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '15px' }}>
                <strong>Pattern Detected:</strong> You&apos;ve been feeling mostly {pattern.category.toLowerCase()} ({pattern.percentage}% of the time)
              </p>
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            overflowX: 'auto',
            padding: '4px'
          }}>
            {displayEntries.slice(0, 7).map((entry, index) => (
              <div
                key={entry.timestamp}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: `${getEmotionColor(entry.category)}20`,
                  border: `2px solid ${getEmotionColor(entry.category)}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative'
                }}
                title={`${entry.subEmotion} (${formatDate(entry.timestamp)})`}
              >
                {entry.category === 'Joy' ? '😊' :
                 entry.category === 'Sadness' ? '😔' :
                 entry.category === 'Fear' ? '😰' :
                 entry.category === 'Anger' ? '😠' :
                 entry.category === 'Love' ? '🥰' :
                 '😲'}
                {entry.syncStatus === 'pending' && (
                  <span style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isDarkMode ? '#f87171' : '#ef4444'
                  }} />
                )}
              </div>
            ))}
          </div>

          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '4px'
          }}>
            {displayEntries.map((entry) => (
              <div
                key={entry.timestamp}
                style={{
                  padding: '16px',
                  marginBottom: '12px',
                  borderRadius: '16px',
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  border: '1px solid',
                  borderColor: `${getEmotionColor(entry.category)}40`,
                  position: 'relative'
                }}
              >
                {entry.syncStatus === 'pending' && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontSize: '10px',
                    color: isDarkMode ? '#f87171' : '#ef4444'
                  }}>
                    Pending sync
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>
                    {entry.category === 'Joy' ? '😊' :
                     entry.category === 'Sadness' ? '😔' :
                     entry.category === 'Fear' ? '😰' :
                     entry.category === 'Anger' ? '😠' :
                     entry.category === 'Love' ? '🥰' :
                     '😲'}
                  </span>
                  <div>
                    <div style={{
                      color: isDarkMode ? '#e5e7eb' : '#1f2937',
                      fontSize: '15px',
                      fontWeight: '500'
                    }}>
                      {entry.subEmotion}
                    </div>
                    <div style={{
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      fontSize: '13px'
                    }}>
                      {formatDate(entry.timestamp)}
                    </div>
                  </div>
                </div>
                {entry.note ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <p style={{
                      margin: '0',
                      color: isDarkMode ? '#d1d5db' : '#4b5563',
                      fontSize: '14px'
                    }}>
                      {entry.note}
                    </p>
                    <button
                      onClick={() => openEditNoteModal(entry.timestamp, entry.note || '')}
                      style={{
                        alignSelf: 'flex-start',
                        background: 'none',
                        border: 'none',
                        color: isDarkMode ? '#9ca3af' : '#6b7280',
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: 0,
                        textDecoration: 'underline'
                      }}
                    >
                      Edit note
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openAddNoteModal(entry.timestamp)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      fontSize: '14px',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline'
                    }}
                  >
                    Add a note...
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {activeNoteTimestamp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            width: '90%',
            maxWidth: '450px',
            padding: '24px',
            borderRadius: '16px',
            background: isDarkMode ? 'rgba(23, 25, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
              : '0 8px 32px rgba(99, 102, 241, 0.2)',
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}>
            <h4 style={{
              margin: '0 0 16px 0',
              color: isDarkMode ? '#e5e7eb' : '#1f2937',
              fontSize: '18px',
              textAlign: 'center'
            }}>
              {isEditMode ? 'Edit your note' : 'Add a note about how you\'re feeling'}
            </h4>
            
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your thoughts here..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                marginBottom: '16px',
                borderRadius: '8px',
                background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                color: isDarkMode ? '#e5e7eb' : '#1f2937',
                fontSize: '15px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              autoFocus
            />
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={closeNoteModal}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                  color: isDarkMode ? '#e5e7eb' : '#4b5563',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              
              <button
                onClick={handleAddNote}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  border: 'none',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  opacity: noteText.trim() ? 1 : 0.7
                }}
                disabled={!noteText.trim()}
              >
                {isEditMode ? 'Update Note' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoodJournal; 