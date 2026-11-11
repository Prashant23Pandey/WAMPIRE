import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
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
      border: 'border-blue-200 bg-blue-50/80 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    },
    success: {
      border: 'border-emerald-200 bg-emerald-50/80 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    },
    warning: {
      border: 'border-amber-200 bg-amber-50/80 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    },
    error: {
      border: 'border-red-200 bg-red-50/80 text-red-900',
      icon: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    },
  };

  const current = configs[type] || configs.info;

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-soft-sm transition-all text-left',
        current.border,
        className
      )}
    >
      {current.icon}
      <div className="flex-1 text-sm">
        {title && <h4 className="font-bold mb-0.5 text-slate-900">{title}</h4>}
        <div className="text-slate-700 leading-relaxed">{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 transition-colors p-1"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
