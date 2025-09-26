'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Toast {
  id: number;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  body?: string;
  duration?: number;
}

interface ToastContextType {
  success: (options: { title: string; body?: string; duration?: number }) => void;
  warning: (options: { title: string; body?: string; duration?: number }) => void;
  error: (options: { title: string; body?: string; duration?: number }) => void;
  info: (options: { title: string; body?: string; duration?: number }) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProps {
  toast: Toast;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: {
      bg: 'bg-primary-100 dark:bg-primary-800',
      border: 'border-primary-300 dark:border-primary-600',
      text: 'text-primary-700 dark:text-primary-200',
      iconBg: 'bg-primary-500 dark:bg-primary-600',
    },
    warning: {
      bg: 'bg-yellow-100 dark:bg-yellow-800',
      border: 'border-yellow-300 dark:border-yellow-600',
      text: 'text-yellow-700 dark:text-yellow-200',
      iconBg: 'bg-yellow-500 dark:bg-yellow-600',
    },
    error: {
      bg: 'bg-red-100 dark:bg-red-800',
      border: 'border-red-300 dark:border-red-600',
      text: 'text-red-700 dark:text-red-200',
      iconBg: 'bg-red-500 dark:bg-red-600',
    },
    info: {
      bg: 'bg-blue-100 dark:bg-blue-800',
      border: 'border-blue-300 dark:border-blue-600',
      text: 'text-blue-700 dark:text-blue-200',
      iconBg: 'bg-blue-500 dark:bg-blue-600',
    },
  };

  const { bg, border, text, iconBg } = typeStyles[toast.type];

  return (
    <div
      className={`max-w-xs w-full rounded-md shadow-lg p-3 ${bg} ${border} ${text} transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`flex-shrink-0 w-5 h-5 rounded-full ${iconBg} flex items-center justify-center mr-2`}>
            <span className="text-white text-xs font-bold">
              {toast.type === 'success' ? '✓' : toast.type === 'warning' ? '!' : toast.type === 'error' ? '✗' : 'i'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-semibold">{toast.title}</h4>
            {toast.body && <p className="text-xs mt-1">{toast.body}</p>}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={`text-secondary-600 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-300 p-1`}
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (
    type: 'success' | 'warning' | 'error' | 'info',
    { title, body, duration = 3000 }: { title: string; body?: string; duration?: number }
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, body, duration }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toastContext: ToastContextType = {
    success: (options) => addToast('success', options),
    warning: (options) => addToast('warning', options),
    error: (options) => addToast('error', options),
    info: (options) => addToast('info', options),
    removeToast,
  };

  return (
    <ToastContext.Provider value={toastContext}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};