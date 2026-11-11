import React from 'react';
import { AlertCircle, Terminal, X, Check } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const configs = {
    info: {
      border: 'border-pink-500/40 bg-pink-950/20 text-pink-100',
      icon: <Terminal className="w-5 h-5 text-[#FF007F] shrink-0" />,
    },
    success: {
      border: 'border-white/20 bg-neutral-900/90 text-white',
      icon: <Check className="w-5 h-5 text-white shrink-0" />,
    },
    warning: {
      border: 'border-pink-500/50 bg-pink-950/30 text-pink-200',
      icon: <AlertCircle className="w-5 h-5 text-[#FF007F] shrink-0" />,
    },
    error: {
      border: 'border-red-500/50 bg-red-950/30 text-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    },
  };

  const current = configs[type] || configs.info;

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-lg transition-all text-left',
        current.border,
        className
      )}
    >
      {current.icon}
      <div className="flex-1 text-sm">
        {title && <h4 className="font-bold mb-0.5 text-white tracking-wide">{title}</h4>}
        <div className="text-neutral-300 leading-relaxed text-xs sm:text-sm font-sans">{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white transition-colors p-1 cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
