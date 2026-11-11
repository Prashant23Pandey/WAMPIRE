import React from 'react';
import { cn } from '../../utils/cn.js';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div
      className={cn(
        'rounded-full animate-spin border-cyan-500/20 border-t-cyan-400',
        sizes[size] || sizes.md,
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

export default LoadingSpinner;

