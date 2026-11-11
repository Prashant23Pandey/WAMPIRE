import React from 'react';
import { cn } from '../../utils/cn.js';
import LoadingSpinner from './LoadingSpinner.jsx';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.98] tracking-wide';

  const variants = {
    primary:
      'bg-[#FF007F] hover:bg-[#FF2A85] text-white shadow-glow-pink hover:shadow-glow-pink-lg focus:ring-[#FF007F] border border-pink-300/30 font-bold',
    secondary:
      'bg-neutral-900/90 hover:bg-neutral-800/90 text-white border border-white/15 hover:border-[#FF007F]/60 backdrop-blur-md focus:ring-neutral-700',
    outline:
      'bg-transparent hover:bg-[#FF007F]/10 text-[#FF007F] hover:text-pink-300 border border-[#FF007F] focus:ring-[#FF007F]',
    ghost:
      'bg-transparent hover:bg-white/5 text-neutral-300 hover:text-white focus:ring-neutral-800',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-400 border border-transparent',
  };

  const sizes = {
    sm: 'text-xs px-4 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 font-bold',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner size="sm" className="mr-1 text-current border-t-white" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
