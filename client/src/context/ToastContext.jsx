import React, { createContext, useState, useCallback, useContext } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'info', title, message, duration = 4000 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast = { id, type, title, message };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (message, title = 'Success') => addToast({ type: 'success', title, message }),
    error: (message, title = 'Error') => addToast({ type: 'error', title, message, duration: 6000 }),
    info: (message, title = 'Information') => addToast({ type: 'info', title, message }),
    warning: (message, title = 'Warning') => addToast({ type: 'warning', title, message }),
    dismiss: removeToast,
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50/95';
      case 'error':
        return 'border-red-200 bg-red-50/95';
      case 'warning':
        return 'border-amber-200 bg-amber-50/95';
      default:
        return 'border-blue-200 bg-blue-50/95';
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Floating Toast Portal Container */}
      <div
        aria-live="assertive"
        className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-soft-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${getBorderColor(
              item.type
            )}`}
          >
            {getIcon(item.type)}
            <div className="flex-1 min-w-0 text-left">
              {item.title && (
                <p className="text-xs font-bold text-slate-900 tracking-tight">{item.title}</p>
              )}
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed break-words">
                {item.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(item.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;

