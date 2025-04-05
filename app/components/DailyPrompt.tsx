import React, { useState, useEffect } from 'react';

interface DailyPromptProps {
  isDarkMode: boolean;
  onPromptSelect: (prompt: string) => void;
}

type PromptCategories = {
  [key: string]: string[];
};

const prompts: PromptCategories = {
  'Self-Reflection': [
    'What made you feel most alive today?',
    'What is one thing you\'re grateful for right now?',
    'How have you grown in the past month?',
    'What is a challenge you\'re proud of overcoming?',
    'What would make today great?'
  ],
  'Emotional Awareness': [
    'How are you feeling right now, and why?',
    'What triggered strong emotions today?',
    'When did you feel most at peace today?',
    'What worried you today, and was it in your control?',
    'How did you practice self-care today?'
  ],
  'Growth & Learning': [
    'What did you learn about yourself today?',
    'What would you do differently if you could restart today?',
    'What new skill would you like to develop?',
    'What habit would you like to build or break?',
    'What is one small step you can take toward your goals?'
  ],
  'Relationships': [
    'Who made a positive impact on your day?',
    'How did you show kindness to others today?',
    'What boundaries do you need to set or maintain?',
    'Who would you like to reconnect with?',
    'How can you better support your loved ones?'
  ]
};

export default function DailyPrompt({ isDarkMode, onPromptSelect }: DailyPromptProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [lastPromptDate, setLastPromptDate] = useState<string | null>(null);

  useEffect(() => {
    const storedDate = localStorage.getItem('lastPromptDate');
    const storedPrompt = localStorage.getItem('currentPrompt');
    const today = new Date().toDateString();

    if (storedDate !== today) {
      const categories = Object.keys(prompts);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const categoryPrompts = prompts[randomCategory as keyof typeof prompts];
      const randomPrompt = categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
      
      setCurrentPrompt(randomPrompt);
      localStorage.setItem('currentPrompt', randomPrompt);
      localStorage.setItem('lastPromptDate', today);
    } else if (storedPrompt) {
      setCurrentPrompt(storedPrompt);
    }

    setLastPromptDate(storedDate || null);
  }, []);

  return (
    <div style={{
      background: isDarkMode ? '#1f2937' : '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: isDarkMode 
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' 
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      color: isDarkMode ? '#e5e7eb' : '#4b5563'
    }}>
      <h2 style={{ 
        marginTop: 0,
        marginBottom: '16px',
        fontSize: '1.5rem',
        fontWeight: 600,
        color: isDarkMode ? '#f3f4f6' : '#111827'
      }}>
        Daily Reflection
      </h2>

      {!selectedCategory ? (
        <>
          <p style={{ marginBottom: '16px' }}>
            {currentPrompt || 'Choose a category for reflection:'}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {Object.keys(prompts).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  cursor: 'pointer',
                  color: isDarkMode ? '#e5e7eb' : '#4b5563',
                  fontSize: '15px',
                  textAlign: 'left'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: isDarkMode ? '#e5e7eb' : '#4b5563',
              marginBottom: '16px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            ← Back to categories
          </button>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {prompts[selectedCategory as keyof typeof prompts].map((prompt, index) => (
              <button
                key={index}
                onClick={() => onPromptSelect(prompt)}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  cursor: 'pointer',
                  color: isDarkMode ? '#e5e7eb' : '#4b5563',
                  fontSize: '15px',
                  textAlign: 'left'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 