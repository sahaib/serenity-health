import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { SendHorizontal } from 'lucide-react';

interface VanishInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSend: (value: string) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function VanishInput({
  onSend,
  placeholder = 'Type a message...',
  className,
  icon,
  disabled,
  ...props
}: VanishInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
      e.preventDefault();
      onSend(input.trim());
      setInput('');
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // Auto-focus on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div
      className={cn(
        'flex items-center w-full px-4 py-2 rounded-full transition-all',
        isFocused && !disabled && 'ring-2 ring-primary/20',
        disabled && 'opacity-70',
        className
      )}
    >
      {icon && <div className="flex items-center justify-center mr-2">{icon}</div>}
      
      <input
        ref={inputRef}
        type="text"
        className="vanish-input text-foreground placeholder:text-muted-foreground/70 flex-1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
      
      <button
        onClick={handleSend}
        className={cn(
          'rounded-full p-2 transition-all',
          input.trim() 
            ? 'text-primary hover:bg-primary/10 hover:scale-110' 
            : 'text-muted-foreground/40 cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-primary/30'
        )}
        disabled={!input.trim() || disabled}
        aria-label="Send message"
      >
        <SendHorizontal size={18} />
      </button>
    </div>
  );
} 