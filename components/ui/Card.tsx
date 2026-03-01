import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'glass', className, ...props }, ref) => {
    const variantClasses = {
      glass: 'glass',
      solid: 'bg-slate-900 border border-slate-800',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-lg p-6', variantClasses[variant], className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';