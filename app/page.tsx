'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Brain, MessageCircle, Loader, Heart, HelpCircle, Moon, Sun, HeartHandshake, X, Upload, Download, Coffee } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface SideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  isDarkMode: boolean;
}

const SideSheet: React.FC<SideSheetProps> = ({ isOpen, onClose, title, content, isDarkMode }) => {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          bottom: '20px',
          width: '100%',
          maxWidth: '500px',
          background: isDarkMode 
            ? 'rgba(23, 25, 35, 0.4)' 
            : 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderLeft: '1px solid',
          borderColor: isDarkMode 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.3)',
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1)' 
            : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
          transform: isOpen ? 'translateX(0)' : 'translateX(120%)',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          overflow: 'hidden'
        }}
      >
        <div style={{
          padding: '20px',
          borderBottom: '1px solid',
          borderColor: isDarkMode 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: isDarkMode 
            ? 'rgba(23, 25, 35, 0.6)' 
            : 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            color: isDarkMode ? '#e5e7eb' : '#1f2937',
            fontWeight: '600'
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: isDarkMode 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.3)',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode 
                ? 'rgba(255, 255, 255, 0.15)' 
                : 'rgba(255, 255, 255, 0.4)';
              e.currentTarget.style.color = isDarkMode ? '#e5e7eb' : '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDarkMode 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#6b7280';
            }}
          >
            <X size={24} />
          </button>
        </div>
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1,
          color: isDarkMode ? '#e5e7eb' : '#1f2937',
          fontSize: '16px',
          lineHeight: '1.8'
        }}>
          {content}
        </div>
      </div>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDarkMode 
              ? 'rgba(0, 0, 0, 0.3)' 
              : 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 999,
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      )}
    </>
  );
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showExportTooltip, setShowExportTooltip] = useState(false);
  const [showKofiModal, setShowKofiModal] = useState(false);
  const [sideSheet, setSideSheet] = useState<{ isOpen: boolean; title: string; content: React.ReactNode }>({
    isOpen: false,
    title: '',
    content: null
  });
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const scrollContainer = messagesContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  };

  useEffect(() => {
    // Add a small delay to ensure all content has rendered
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  // Handle dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = { role: 'user', content: inputValue };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let assistantMessage = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = new TextDecoder().decode(value);
        assistantMessage += text;
        
        setMessages([
          ...updatedMessages,
          { role: 'assistant', content: assistantMessage }
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const exportChat = () => {
    // Only proceed if there are messages to export
    if (messages.length === 0) return;
    
    // Create a formatted text version of the chat
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `serenity-chat-${timestamp}.txt`;
    
    // Format the conversation with timestamps and clear role indicators
    let chatContent = "Serenity Health AI - Chat Export\n";
    chatContent += "Generated on: " + new Date().toLocaleString() + "\n\n";
    
    messages.forEach((message, i) => {
      const roleLabel = message.role === 'user' ? 'You' : 'Serenity AI';
      chatContent += `${roleLabel}:\n${message.content}\n\n`;
    });
    
    // Create a downloadable blob and trigger download
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 50%, #ede9fe 100%)',
      }}>
        <header style={{
          width: '100%',
          maxWidth: '800px',
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              letterSpacing: '-0.02em'
            }}>
              <HeartHandshake 
                size={36} 
                style={{ 
                  color: '#6366f1',
                  flexShrink: 0,
                  strokeWidth: 1.5
                }} 
              />
              <span style={{
                fontSize: '36px',
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingBottom: '4px'
              }}>
                <span style={{ 
                  fontFamily: "'Telma', serif",
                  display: 'inline-block'
                }}>Serenity</span>
                <span>Health AI</span>
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {messages.length > 0 && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={exportChat}
                  title="Export conversation"
                  onMouseEnter={() => setShowExportTooltip(true)}
                  onMouseLeave={() => setShowExportTooltip(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDarkMode ? '#e5e7eb' : '#1f2937',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Upload size={22} />
                </button>
                {showExportTooltip && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                    color: isDarkMode ? '#e5e7eb' : '#1f2937',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    boxShadow: isDarkMode 
                      ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' 
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    opacity: 1,
                    transition: 'opacity 0.2s ease',
                    pointerEvents: 'none'
                  }}>
                    Export chat (no data saved online)
                  </div>
                )}
              </div>
            )}
            <a
              onClick={(e) => {
                e.preventDefault();
                setShowKofiModal(true);
              }}
              href="#"
              className="kofi-button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)',
                boxShadow: isDarkMode 
                  ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                  : '0 4px 12px rgba(99, 102, 241, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? '0 6px 16px rgba(0, 0, 0, 0.4)' 
                  : '0 6px 16px rgba(99, 102, 241, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                  : '0 4px 12px rgba(99, 102, 241, 0.2)';
              }}
            >
              <Coffee size={18} />
              <span>Buy me a coffee</span>
            </a>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDarkMode ? '#e5e7eb' : '#1f2937',
                transition: 'all 0.2s ease'
              }}
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </header>

        <div style={{
          width: '100%',
          maxWidth: '800px',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '500',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            letterSpacing: '0.01em'
          }}>
            <span style={{ fontSize: '20px' }}>💭</span>
            Your supportive AI companion for mental wellbeing
          </div>

          <div className="feature-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {[
              { icon: '🤝', title: 'Supportive Chat', description: 'Have a conversation in a safe, judgment-free space' },
              { icon: '🎯', title: 'Focused Guidance', description: 'Get help with specific mental health concerns' },
              { icon: '🌱', title: 'Personal Growth', description: 'Develop coping strategies and emotional resilience' }
            ].map((feature, index) => (
              <div key={index} className="feature-card" style={{
                padding: '24px',
                borderRadius: '16px',
                background: isDarkMode ? 'rgba(23, 25, 35, 0.6)' : 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '32px' }}>{feature.icon}</span>
                <h3 className="feature-title" style={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: '600',
                  color: isDarkMode ? '#e5e7eb' : '#1f2937',
                  letterSpacing: '0.01em'
                }}>{feature.title}</h3>
                <p className="feature-desc" style={{
                  margin: 0,
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: isDarkMode ? '#9ca3af' : '#6b7280'
                }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <main style={{
          width: '100%',
          maxWidth: '800px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '60vh',
          minHeight: '400px'
        }}>
          <div style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.7)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            background: isDarkMode ? 'rgba(23, 25, 35, 0.6)' : 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 2px 15px rgba(255, 255, 255, 0.07)'
              : '0 8px 32px rgba(99, 102, 241, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)'
          }}>
            {messages.length === 0 ? (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                color: isDarkMode ? '#9ca3af' : '#6b7280',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px'
                }}>
                  💭
                </div>
                <div>
                  <h2 className="welcome-title" style={{
                    margin: '0 0 8px 0',
                    fontSize: '24px',
                    fontWeight: '600',
                    color: isDarkMode ? '#e5e7eb' : '#1f2937',
                    letterSpacing: '0.01em'
                  }}>Welcome to Health AI</h2>
                  <p className="welcome-text" style={{ 
                    margin: 0, 
                    fontSize: '17px',
                    lineHeight: '1.6' 
                  }}>
                    Feel free to share your thoughts or concerns. I'm here to listen and support you.
                  </p>
                </div>
              </div>
            ) : (
              <div 
                id="messagesContainer"
                style={{ 
                  flex: 1,
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '16px',
                  overflow: 'auto',
                  maxHeight: 'calc(60vh - 120px)'
                }}
                ref={messagesContainerRef}
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className="chat-message"
                    style={{
                      alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      padding: '14px 16px',
                      borderRadius: '18px',
                      background: message.role === 'user' 
                        ? isDarkMode ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.12)'
                        : isDarkMode ? 'rgba(23, 25, 35, 0.75)' : 'rgba(255, 255, 255, 0.7)',
                      border: message.role === 'user'
                        ? '1px solid rgba(99, 102, 241, 0.3)'
                        : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#eaeaea'}`,
                      boxShadow: isDarkMode
                        ? '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 2px 15px rgba(255, 255, 255, 0.07)'
                        : '0 2px 6px rgba(0,0,0,0.06)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      fontSize: '15px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      color: isDarkMode ? '#e5e7eb' : 'inherit',
                      animation: index === messages.length - 1 && message.role === 'assistant' 
                        ? 'fadeIn 0.3s ease-out' 
                        : 'none'
                    }}
                  >
                    {message.content}
                  </div>
                ))}
                {isLoading && (
                  <div style={{
                    alignSelf: 'flex-start',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    background: isDarkMode ? 'rgba(23, 25, 35, 0.75)' : 'rgba(255, 255, 255, 0.7)',
                    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#eaeaea'}`,
                    color: isDarkMode ? '#e5e7eb' : 'inherit',
                    fontSize: '15px',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}>
                    Thinking...
                  </div>
                )}
                <div ref={messagesEndRef} style={{ height: '1px', width: '100%' }} />
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} style={{ 
            display: 'flex',
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.7)',
            borderRadius: '9999px',
            overflow: 'hidden',
            background: isDarkMode ? 'rgba(23, 25, 35, 0.6)' : 'rgba(255, 255, 255, 0.25)',
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 2px 15px rgba(255, 255, 255, 0.07)'
              : '0 8px 32px rgba(99, 102, 241, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '16px 24px',
                border: 'none',
                background: 'transparent',
                color: isDarkMode ? '#e5e7eb' : 'inherit',
                fontSize: '15px',
                outline: 'none'
              }}
              className="chat-input"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                fontSize: '15px',
                cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                opacity: inputValue.trim() && !isLoading ? 1 : 0.7,
                transition: 'opacity 0.2s ease'
              }}
              className="send-button"
            >
              Send
            </button>
          </form>
      </main>

        <footer style={{
          width: '100%',
          maxWidth: '800px',
          marginTop: '20px',
          padding: '16px 20px',
          borderRadius: '12px',
          background: isDarkMode ? 'rgba(23, 25, 35, 0.6)' : 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.7)',
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 2px 15px rgba(255, 255, 255, 0.07)'
            : '0 8px 32px rgba(99, 102, 241, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <p className="disclaimer-text" style={{
            fontSize: '15px',
            lineHeight: '1.6',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            textAlign: 'center',
            margin: 0
          }}>
            <strong style={{ color: isDarkMode ? '#e5e7eb' : '#4b5563' }}>Disclaimer:</strong> Serenity Health AI is not a substitute for professional mental health care. If you're experiencing a crisis or need immediate assistance, please contact emergency services or a mental health professional. Our AI provides general support and guidance only.
          </p>
          
          <div className="footer-content" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            position: 'relative',
            flexWrap: 'wrap'
          }}>
            <a
              href="https://x.com/imsahaib"
          target="_blank"
          rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: isDarkMode ? '#e5e7eb' : '#4b5563',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                const popover = e.currentTarget.nextElementSibling as HTMLElement;
                if (popover) popover.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                const popover = e.currentTarget.nextElementSibling as HTMLElement;
                if (popover) popover.style.opacity = '0';
              }}
            >
              Created by
              <span style={{
                fontWeight: '600',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                𝕏 @imsahaib
              </span>
            </a>
            <div style={{
              position: 'absolute',
              bottom: 'calc(100% + 12px)',
              background: isDarkMode ? 'rgba(23, 25, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              padding: '12px 16px',
              borderRadius: '8px',
              boxShadow: isDarkMode 
                ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
                : '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.7)',
              maxWidth: '280px',
              fontSize: '14px',
              lineHeight: '1.6',
              color: isDarkMode ? '#e5e7eb' : '#4b5563',
              opacity: 0,
              transition: 'opacity 0.2s ease',
              zIndex: 10
            }}>
              Chaos-Taming Solver passionate about creating elegant, user-centric applications. Specializing in AI-powered solutions that make a difference.
            </div>
            <div className="divider" style={{
              width: '1px',
              height: '20px',
              background: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
              margin: '0 4px'
            }} />
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSideSheet({
                    isOpen: true,
                    title: 'Terms of Use',
                    content: (
                      <div>
                        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>1. Acceptance of Terms</h3>
                        <p style={{ marginBottom: '16px' }}>By accessing and using Serenity Health AI, you agree to be bound by these Terms of Use and all applicable laws and regulations.</p>
                        
                        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>2. Service Description</h3>
                        <p style={{ marginBottom: '16px' }}>Serenity Health AI is an AI-powered mental wellbeing companion that provides supportive conversation and guidance. It is not a substitute for professional mental health care.</p>
                        
                        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>3. User Responsibilities</h3>
                        <p style={{ marginBottom: '16px' }}>Users must be 18 years or older to use this service. Do not use this service for emergency situations or crisis care.</p>
                        
                        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>4. Limitations of Service</h3>
                        <p style={{ marginBottom: '16px' }}>Serenity Health AI is not a medical service and should not be used as a replacement for professional medical advice, diagnosis, or treatment.</p>
                        
                        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>5. Privacy</h3>
                        <p style={{ marginBottom: '16px' }}>Your use of Serenity Health AI is also governed by our Privacy Policy. Please review it to understand how we collect and use your information.</p>
                        
                        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>6. Changes to Terms</h3>
                        <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.</p>
                      </div>
                    )
                  });
                }}
                style={{
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isDarkMode ? '#e5e7eb' : '#4b5563';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#6b7280';
                }}
              >
                Terms of Use
              </a>
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'
              }} />
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSideSheet({
                    isOpen: true,
                    title: 'Privacy Policy',
                    content: (
                      <div>
                        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>1. Information We Collect</h3>
                        <p style={{ marginBottom: '16px' }}>We collect conversation data and user interactions to improve our service and provide better support. No personally identifiable information is required to use Serenity Health AI.</p>
                        
                        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>2. How We Use Your Information</h3>
                        <p style={{ marginBottom: '16px' }}>Your conversation data is used to provide real-time AI responses and improve our service. We do not share your data with third parties.</p>
                        
                        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>3. Data Security</h3>
                        <p style={{ marginBottom: '16px' }}>We implement appropriate security measures to protect your information. However, no internet transmission is completely secure.</p>
                        
                        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>4. Cookies and Tracking</h3>
                        <p style={{ marginBottom: '16px' }}>We use essential cookies to maintain your session and preferences. No third-party tracking cookies are used.</p>
                        
                        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>5. Your Rights</h3>
                        <p style={{ marginBottom: '16px' }}>You have the right to access, correct, or delete your conversation history. Contact us to exercise these rights.</p>
                        
                        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>6. Changes to Privacy Policy</h3>
                        <p>We may update this policy periodically. Continue using our service to accept any changes.</p>
                      </div>
                    )
                  });
                }}
                style={{
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isDarkMode ? '#e5e7eb' : '#4b5563';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#6b7280';
                }}
              >
                Privacy Policy
              </a>
            </div>
          </div>
      </footer>
    </div>

      <SideSheet
        isOpen={sideSheet.isOpen}
        onClose={() => setSideSheet(prev => ({ ...prev, isOpen: false }))}
        title={sideSheet.title}
        content={sideSheet.content}
        isDarkMode={isDarkMode}
      />

      {showKofiModal && (
        <>
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '480px',
              background: isDarkMode ? 'rgba(23, 25, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '20px',
              zIndex: 1001,
              boxShadow: isDarkMode 
                ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
                : '0 8px 32px rgba(99, 102, 241, 0.2)',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 1
            }}>
              <button
                onClick={() => setShowKofiModal(false)}
                style={{
                  background: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'rgba(255, 255, 255, 0.4)';
                  e.currentTarget.style.color = isDarkMode ? '#e5e7eb' : '#4b5563';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#6b7280';
                }}
              >
                <X size={24} />
              </button>
            </div>
            <iframe
              id='kofiframe'
              src='https://ko-fi.com/sahaib/?hidefeed=true&widget=true&embed=true&preview=true'
              style={{
                border: 'none',
                width: '100%',
                height: '712px',
                background: isDarkMode ? '#1a1a1a' : '#f9f9f9',
                borderRadius: '16px'
              }}
              title='sahaib'
            />
          </div>
          <div
            onClick={() => setShowKofiModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isDarkMode 
                ? 'rgba(0, 0, 0, 0.5)' 
                : 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 1000
            }}
          />
        </>
      )}

      <style jsx global>{`
        @import url('https://api.fontshare.com/v2/css?f[]=telma@400,700,500&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        html {
          height: -webkit-fill-available;
        }

        body {
          margin: 0;
          padding: 0;
          min-height: 100vh;
          min-height: -webkit-fill-available;
          font-family: 'EB Garamond', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, serif;
          background: ${isDarkMode 
            ? 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 50%, #ede9fe 100%)'};
          color: ${isDarkMode ? '#e5e7eb' : '#1a1a1a'};
          transition: background 0.3s ease, color 0.3s ease;
          font-feature-settings: "liga" 1, "kern" 1;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overscroll-behavior-y: contain;
        }

        /* Improve scrolling performance */
        #messagesContainer {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          overscroll-behavior: contain;
          will-change: transform;
        }

        /* Optimize touch targets */
        button, a {
          touch-action: manipulation;
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
        }

        /* Prevent text selection on interactive elements */
        .chat-message, .feature-card, .kofi-button {
          user-select: none;
          -webkit-user-select: none;
        }

        /* Optimize mobile form elements */
        input, button {
          appearance: none;
          -webkit-appearance: none;
          border-radius: 0;
        }

        /* PWA full-screen optimization */
        @media all and (display-mode: standalone) {
          body {
            padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
          }
          
          header {
            padding-top: max(20px, env(safe-area-inset-top));
          }
          
          footer {
            padding-bottom: max(20px, env(safe-area-inset-bottom));
          }

          /* Ensure icons maintain size in PWA mode */
          button svg, a svg {
            min-width: 24px !important;
            min-height: 24px !important;
          }

          .kofi-button {
            min-width: 40px !important;
            min-height: 40px !important;
            padding: 8px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .kofi-button svg {
            min-width: 20px !important;
            min-height: 20px !important;
          }
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'EB Garamond', serif;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        p {
          font-family: 'EB Garamond', serif;
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        input {
          font-family: 'EB Garamond', serif;
          font-size: 16px;
          letter-spacing: 0.01em;
        }

        button {
          font-family: 'EB Garamond', serif;
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        input::placeholder {
          color: ${isDarkMode ? '#6b7280' : '#9ca3af'};
          font-family: 'EB Garamond', serif;
          font-style: italic;
        }

        body.dark {
          color-scheme: dark;
        }
        
        /* Responsive Styles */
        @media (max-width: 768px) {
          header span {
            font-size: 28px !important;
          }
          
          header svg {
            min-width: 30px !important;
            min-height: 30px !important;
          }
          
          .feature-grid {
            grid-template-columns: 1fr !important;
          }
          
          .chat-message {
            max-width: 90% !important;
          }
          
          .footer-content {
            flex-direction: column !important;
            gap: 16px !important;
          }
          
          .divider {
            display: none !important;
          }
          
          main {
            height: 55vh !important;
          }
          
          #messagesContainer {
            max-height: calc(55vh - 120px) !important;
          }
          
          .kofi-button span {
            display: none !important;
          }
          
          .kofi-button {
            min-width: 40px !important;
            min-height: 40px !important;
            padding: 8px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .kofi-button svg {
            min-width: 20px !important;
            min-height: 20px !important;
          }
        }
        
        @media (max-width: 480px) {
          body {
            padding: 10px !important;
          }
          
          header span {
            font-size: 22px !important;
          }
          
          header svg {
            min-width: 24px !important;
            min-height: 24px !important;
          }
          
          header {
            margin-bottom: 20px !important;
          }
          
          .welcome-title {
            font-size: 20px !important;
          }
          
          .welcome-text {
            font-size: 15px !important;
          }
          
          .feature-card {
            padding: 16px !important;
          }
          
          .feature-title {
            font-size: 18px !important;
          }
          
          .feature-desc {
            font-size: 14px !important;
          }
          
          .disclaimer-text {
            font-size: 13px !important;
          }
          
          main {
            height: 50vh !important;
            min-height: 350px !important;
          }
          
          #messagesContainer {
            max-height: calc(50vh - 110px) !important;
          }
          
          .chat-message {
            font-size: 14px !important;
            padding: 12px 14px !important;
          }
          
          .chat-input {
            padding: 14px 16px !important;
            font-size: 14px !important;
          }
          
          .send-button {
            padding: 10px 18px !important;
            font-size: 14px !important;
          }
          
          .kofi-button {
            min-width: 36px !important;
            min-height: 36px !important;
            padding: 8px !important;
          }
          
          .kofi-button svg {
            min-width: 18px !important;
            min-height: 18px !important;
          }

          /* Ensure touch targets are at least 44x44px for iOS */
          button, a {
            min-width: 44px !important;
            min-height: 44px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </>
  );
}