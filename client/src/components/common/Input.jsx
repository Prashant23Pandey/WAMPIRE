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
          <label htmlFor={inputId} className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
            {label}
            {required && <span className="text-[#FF007F] ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-neutral-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            required={required}
            className={cn(
              'w-full bg-neutral-950/90 text-white placeholder-neutral-500 rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none border',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightIcon ? 'pr-10' : 'pr-3.5',
              error
                ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                : 'border-white/10 hover:border-white/20 focus:border-[#FF007F] focus:ring-2 focus:ring-[#FF007F]/25 shadow-inner'
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-neutral-400 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-neutral-400 font-mono">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
