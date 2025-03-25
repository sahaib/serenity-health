import React from 'react';
import { cn } from '../../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  hover?: boolean;
}

export function Card({ className, hover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4 shadow-sm',
        hover && 'transition-shadow hover:shadow-md',
        className
      )}
      {...props}
    />
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    />
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn('text-sm text-foreground/70', className)}
      {...props}
    />
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div className={cn('pt-0', className)} {...props} />
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('flex items-center pt-4', className)}
      {...props}
    />
  );
} 