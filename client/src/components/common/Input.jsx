import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      id,
      type = 'text',
      required = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {label}
            {required && <span className="text-blue-600 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            required={required}
            className={cn(
              'w-full bg-white text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none border shadow-soft-sm',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightIcon ? 'pr-10' : 'pr-3.5',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50'
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-600 font-medium mt-0.5">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
