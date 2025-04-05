import React, { useState } from 'react';

interface EmotionCategory {
  name: string;
  color: string;
  emotions: {
    name: string;
    subEmotions: string[];
  }[];
}

const emotionCategories: EmotionCategory[] = [
  {
    name: 'Joy',
    color: '#22c55e',
    emotions: [
      { name: 'Peaceful', subEmotions: ['Calm', 'Content', 'Relaxed'] },
      { name: 'Powerful', subEmotions: ['Confident', 'Free', 'Energetic'] },
      { name: 'Happy', subEmotions: ['Playful', 'Excited', 'Optimistic'] }
    ]
  },
  {
    name: 'Sadness',
    color: '#64748b',
    emotions: [
      { name: 'Vulnerable', subEmotions: ['Lonely', 'Insecure', 'Fragile'] },
      { name: 'Despair', subEmotions: ['Grief', 'Helpless', 'Hopeless'] },
      { name: 'Disconnected', subEmotions: ['Bored', 'Apathetic', 'Distant'] }
    ]
  },
  {
    name: 'Fear',
    color: '#eab308',
    emotions: [
      { name: 'Scared', subEmotions: ['Helpless', 'Frightened', 'Overwhelmed'] },
      { name: 'Anxious', subEmotions: ['Worried', 'Nervous', 'Stressed'] },
      { name: 'Insecure', subEmotions: ['Inadequate', 'Inferior', 'Worthless'] }
    ]
  },
  {
    name: 'Anger',
    color: '#ef4444',
    emotions: [
      { name: 'Rage', subEmotions: ['Hateful', 'Hostile', 'Aggressive'] },
      { name: 'Frustrated', subEmotions: ['Annoyed', 'Irritated', 'Agitated'] },
      { name: 'Distant', subEmotions: ['Withdrawn', 'Critical', 'Skeptical'] }
    ]
  },
  {
    name: 'Love',
    color: '#ec4899',
    emotions: [
      { name: 'Affectionate', subEmotions: ['Caring', 'Compassionate', 'Tender'] },
      { name: 'Connected', subEmotions: ['Accepted', 'Valued', 'Trusted'] },
      { name: 'Romantic', subEmotions: ['Passionate', 'Intimate', 'Desired'] }
    ]
  },
  {
    name: 'Surprise',
    color: '#8b5cf6',
    emotions: [
      { name: 'Amazed', subEmotions: ['Astonished', 'Awe', 'Wonder'] },
      { name: 'Confused', subEmotions: ['Perplexed', 'Disillusioned', 'Stunned'] },
      { name: 'Excited', subEmotions: ['Eager', 'Energetic', 'Animated'] }
    ]
  }
];

interface EmotionWheelProps {
  isDarkMode: boolean;
  onEmotionSelect: (emotion: { category: string; emotion: string; subEmotion: string }) => void;
}

const EmotionWheel: React.FC<EmotionWheelProps> = ({ isDarkMode, onEmotionSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<EmotionCategory | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<{ name: string; subEmotions: string[] } | null>(null);

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
    }}>
      <h3 style={{
        margin: '0 0 20px 0',
        fontSize: '20px',
        color: isDarkMode ? '#e5e7eb' : '#1f2937',
        textAlign: 'center'
      }}>
        How are you feeling?
      </h3>

      {!selectedCategory ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          {emotionCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '16px',
                borderRadius: '16px',
                background: `${category.color}20`,
                border: '2px solid',
                borderColor: `${category.color}40`,
                color: isDarkMode ? '#e5e7eb' : '#1f2937',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '24px' }}>
                {category.name === 'Joy' ? '😊' :
                 category.name === 'Sadness' ? '😔' :
                 category.name === 'Fear' ? '😰' :
                 category.name === 'Anger' ? '😠' :
                 category.name === 'Love' ? '🥰' :
                 '😲'}
              </span>
              {category.name}
            </button>
          ))}
        </div>
      ) : !selectedEmotion ? (
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              cursor: 'pointer',
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
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: '8px'
          }}>
            {selectedCategory.emotions.map((emotion) => (
              <button
                key={emotion.name}
                onClick={() => setSelectedEmotion(emotion)}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  color: isDarkMode ? '#e5e7eb' : '#1f2937',
                  fontSize: '15px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {emotion.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedEmotion(null)}
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              cursor: 'pointer',
              marginBottom: '16px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            ← Back to emotions
          </button>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: '8px'
          }}>
            {selectedEmotion.subEmotions.map((subEmotion) => (
              <button
                key={subEmotion}
                onClick={() => onEmotionSelect({
                  category: selectedCategory.name,
                  emotion: selectedEmotion.name,
                  subEmotion
                })}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  color: isDarkMode ? '#e5e7eb' : '#1f2937',
                  fontSize: '15px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {subEmotion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionWheel; 