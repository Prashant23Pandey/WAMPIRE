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
        'bg-[#09090b]/85 rounded-2xl p-6 sm:p-8 border border-white/10 text-white backdrop-blur-xl relative overflow-hidden transition-all duration-300',
        hoverEffect && 'hover:-translate-y-1 hover:border-[#FF007F]/50 hover:shadow-glow-pink-sm',
        glow && 'border-[#FF007F] shadow-glow-pink',
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
  <h3 className={cn('text-xl font-bold text-white tracking-tight font-display', className)}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={cn('text-sm text-neutral-400 leading-relaxed', className)}>{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={cn('space-y-4', className)}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={cn('mt-6 pt-5 border-t border-white/10 flex items-center justify-between', className)}>
    {children}
  </div>
);

export default Card;
