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
    primary: 'bg-pink-950/50 text-pink-300 border-pink-500/40 shadow-[0_0_10px_rgba(255,0,127,0.2)]',
    pink: 'bg-[#FF007F]/20 text-white border-[#FF007F]/50 shadow-[0_0_12px_rgba(255,0,127,0.25)]',
    violet: 'bg-neutral-900/90 text-pink-300 border-pink-500/30',
    success: 'bg-neutral-900/90 text-pink-200 border-pink-400/40',
    warning: 'bg-neutral-900/90 text-white border-pink-500/30',
    danger: 'bg-red-950/40 text-red-300 border-red-500/40',
    neutral: 'bg-neutral-900 text-neutral-300 border-white/10',
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5 font-semibold tracking-wide',
    md: 'text-xs px-3.5 py-1 font-semibold tracking-wider font-mono',
    lg: 'text-sm px-4 py-1.5 font-semibold font-mono',
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
            dotColor || 'bg-[#FF007F]'
          )}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
