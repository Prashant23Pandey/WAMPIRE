import React from 'react';
import { cn } from '../../utils/cn.js';

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  dot = false,
  dotColor = '',
}) => {
  const variants = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200/80',
    violet: 'bg-purple-50 text-violet-700 border-violet-200/80',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
    danger: 'bg-red-50 text-red-700 border-red-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5 font-semibold tracking-wide',
    md: 'text-xs px-3 py-1 font-semibold tracking-wide',
    lg: 'text-sm px-4 py-1.5 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border uppercase tracking-wider',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full animate-pulse',
            dotColor || 'bg-current'
          )}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
