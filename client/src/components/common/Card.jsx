import React from 'react';
import { cn } from '../../utils/cn.js';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm relative overflow-hidden transition-all duration-300',
        hoverEffect && 'hover:-translate-y-1 hover:border-blue-300/80 hover:shadow-soft-xl',
        glow && 'border-blue-400 shadow-electric',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={cn('mb-4 flex flex-col gap-1', className)}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={cn('text-xl font-bold text-slate-900 tracking-tight', className)}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={cn('text-sm text-slate-600 leading-relaxed', className)}>{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={cn('space-y-4', className)}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={cn('mt-6 pt-5 border-t border-slate-100 flex items-center justify-between', className)}>
    {children}
  </div>
);

export default Card;
