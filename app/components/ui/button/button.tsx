import React from 'react';
import { cn } from '../../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className = '', 
      variant = 'default', 
      size = 'md', 
      icon, 
      iconPosition = 'left', 
      loading = false, 
      disabled,
      children, 
      ...props 
    }, 
    ref
  ) => {
    const variantStyles = {
      default: 'bg-primary text-primary-foreground hover:opacity-90',
      outline: 'border border-border bg-transparent hover:bg-secondary',
      ghost: 'bg-transparent hover:bg-secondary',
      link: 'bg-transparent underline underline-offset-4 hover:opacity-80'
    };

    const sizeStyles = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
        ) : iconPosition === 'left' && icon ? (
          <span className="mr-2">{icon}</span>
        ) : null}
        
        {children}
        
        {!loading && iconPosition === 'right' && icon ? (
          <span className="ml-2">{icon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, type ButtonProps }; 