"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Toast, ToastType } from "@/types";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, action?: Toast["action"]) => void;
  removeToast: (id: string) => void;
  success: (message: string, action?: Toast["action"]) => void;
  error: (message: string, action?: Toast["action"]) => void;
  info: (message: string, action?: Toast["action"]) => void;
  warning: (message: string, action?: Toast["action"]) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_DURATION = 4000;

const toastStyles: Record<ToastType, { bg: string; icon: ReactNode; border: string }> = {
  success: {
    bg: "bg-emerald-50",
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    border: "border-emerald-200",
  },
  error: {
    bg: "bg-red-50",
    icon: <AlertCircle className="w-5 h-5 text-red-600" />,
    border: "border-red-200",
  },
  info: {
    bg: "bg-blue-50",
    icon: <Info className="w-5 h-5 text-blue-600" />,
    border: "border-blue-200",
  },
  warning: {
    bg: "bg-amber-50",
    icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    border: "border-amber-200",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, action?: Toast["action"]) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: Toast = { id, type, message, action };

      setToasts((prev) => [...prev, newToast]);

      // Auto-remove after duration
      setTimeout(() => {
        removeToast(id);
      }, TOAST_DURATION);
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, action?: Toast["action"]) => addToast("success", message, action),
    [addToast]
  );

  const error = useCallback(
    (message: string, action?: Toast["action"]) => addToast("error", message, action),
    [addToast]
  );

  const info = useCallback(
    (message: string, action?: Toast["action"]) => addToast("info", message, action),
    [addToast]
  );

  const warning = useCallback(
    (message: string, action?: Toast["action"]) => addToast("warning", message, action),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}
      
      {/* Toast Container */}
      <div className="toast-container flex flex-col gap-2">
        {toasts.map((toast) => {
          const style = toastStyles[toast.type];
          return (
            <div
              key={toast.id}
              className={`
                ${style.bg} ${style.border}
                border rounded-xl p-4 pr-10 shadow-lg
                animate-slide-in-right
                relative min-w-[280px] max-w-[400px]
              `}
              role="alert"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{toast.message}</p>
                  {toast.action && (
                    <button
                      onClick={toast.action.onClick}
                      className="mt-2 text-sm font-semibold text-[var(--color-primary)] hover:underline"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="absolute top-3 right-3 p-1 rounded-lg hover:bg-black/5 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
