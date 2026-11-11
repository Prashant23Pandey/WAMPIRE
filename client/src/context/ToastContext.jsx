import React, { createContext, useState, useCallback, useContext } from 'react';
import { Check, AlertCircle, Terminal, X } from 'lucide-react';

export const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

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
    warning: (message, title = 'Notice') => addToast({ type: 'warning', title, message }),
    dismiss: removeToast,
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check className="w-4 h-4 text-[#FF007F] flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-pink-300 flex-shrink-0" />;
      default:
        return <Terminal className="w-4 h-4 text-[#FF007F] flex-shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-[#FF007F]/50 bg-neutral-950/95 shadow-glow-pink-sm';
      case 'error':
        return 'border-red-500/50 bg-neutral-950/95';
      case 'warning':
        return 'border-pink-500/40 bg-neutral-950/95';
      default:
        return 'border-white/15 bg-neutral-950/95';
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-y-0 text-white animate-fade-in ${getBorderColor(
              item.type
            )}`}
          >
            <div className="mt-0.5">{getIcon(item.type)}</div>
            <div className="flex-1 text-xs">
              {item.title && <p className="font-mono font-bold tracking-wider uppercase mb-0.5 text-neutral-200">{item.title}</p>}
              <p className="text-neutral-300 leading-relaxed font-sans">{item.message}</p>
            </div>
            <button
              onClick={() => removeToast(item.id)}
              className="text-neutral-400 hover:text-white transition-colors p-1"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;
