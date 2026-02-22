import React from 'react';
import { cn } from '@/lib/utils';

interface HefzButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'highlight' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const HefzButton: React.FC<HefzButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-accent text-accent-foreground hover:opacity-90 focus:ring-accent",
    accent: "bg-accent text-accent-foreground hover:opacity-90 focus:ring-accent",
    highlight: "bg-highlight text-highlight-foreground hover:opacity-95 focus:ring-highlight",
    ghost: "bg-transparent text-primary border border-primary hover:bg-primary hover:text-primary-foreground focus:ring-primary"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
