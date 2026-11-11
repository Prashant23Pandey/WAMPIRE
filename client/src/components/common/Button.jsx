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
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-electric hover:shadow-lg focus:ring-blue-500 border border-transparent',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 shadow-soft-sm focus:ring-slate-300',
    outline:
      'bg-transparent hover:bg-blue-50 text-blue-600 hover:text-blue-700 border-2 border-blue-600/80 hover:border-blue-600 focus:ring-blue-400',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-200',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-400 border border-transparent',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-bold',
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
