import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="flex items-center gap-3">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            'w-5 h-5 rounded border-2 border-slate-600 bg-slate-800',
            'checked:bg-blue-600 checked:border-blue-600',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'transition-all duration-200 cursor-pointer',
            className
          )}
          {...props}
        />
        {label && (
          <label className="text-white text-sm cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';