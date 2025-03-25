'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Brain, MessageCircle, Loader, Heart, HelpCircle, Moon, Sun, HeartHandshake, X } from 'lucide-react';

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
  const [sideSheet, setSideSheet] = useState<{ isOpen: boolean; title: string; content: React.ReactNode }>({
    isOpen: false,
    title: '',
    content: null
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                Serenity Health AI
              </span>
            </div>
          </div>
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

          <div style={{
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
              <div key={index} style={{
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
                <h3 style={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: '600',
                  color: isDarkMode ? '#e5e7eb' : '#1f2937',
                  letterSpacing: '0.01em'
                }}>{feature.title}</h3>
                <p style={{
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
          flexDirection: 'column'
        }}>
          <div style={{ 
            flex: 1,
            overflowY: 'auto',
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
                  <h2 style={{
                    margin: '0 0 8px 0',
                    fontSize: '24px',
                    fontWeight: '600',
                    color: isDarkMode ? '#e5e7eb' : '#1f2937',
                    letterSpacing: '0.01em'
                  }}>Welcome to  Health AI</h2>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '17px',
                    lineHeight: '1.6' 
                  }}>
                    Feel free to share your thoughts or concerns. I'm here to listen and support you.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map((message, index) => (
                  <div
                    key={index}
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
          <p style={{
            fontSize: '15px',
            lineHeight: '1.6',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            textAlign: 'center',
            margin: 0
          }}>
            <strong style={{ color: isDarkMode ? '#e5e7eb' : '#4b5563' }}>Disclaimer:</strong> Serenity Health AI is not a substitute for professional mental health care. If you're experiencing a crisis or need immediate assistance, please contact emergency services or a mental health professional. Our AI provides general support and guidance only.
          </p>
          
          <div style={{
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
            <div style={{
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

      <style jsx global>{`
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
        }

        body {
          margin: 0;
          padding: 0;
          font-family: 'EB Garamond', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, serif;
          background: ${isDarkMode 
            ? 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 50%, #ede9fe 100%)'};
          min-height: 100vh;
          color: ${isDarkMode ? '#e5e7eb' : '#1a1a1a'};
          transition: background 0.3s ease, color 0.3s ease;
          font-feature-settings: "liga" 1, "kern" 1;
          text-rendering: optimizeLegibility;
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
      `}</style>
    </>
  );
}