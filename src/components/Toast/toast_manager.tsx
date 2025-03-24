import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import { createRoot } from 'react-dom/client';
import './Toast.css';

let toastRoot: any = null;

export interface ToastOptions {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

// ToastManager component to manage multiple toasts
const ToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = (id: string) => {
    // The actual removal will happen in the Toast component after animation
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Global event listener for adding toasts
  useEffect(() => {
    const handleAddToast = (event: CustomEvent<ToastOptions>) => {
      const newToast: ToastItem = {
        ...event.detail,
        id: Date.now().toString(),
      };
      setToasts((prevToasts) => [...prevToasts, newToast]);
    };

    window.addEventListener('add-toast' as any, handleAddToast as EventListener);
    return () => {
      window.removeEventListener('add-toast' as any, handleAddToast as EventListener);
    };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

// Initialize the toast container and manager
export const initToasts = () => {
  if (!toastRoot) {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-root-container';
    document.body.appendChild(toastContainer);
    toastRoot = createRoot(toastContainer);
    toastRoot.render(<ToastManager />);
  }
};

// Show a toast notification
export const showToast = (options: ToastOptions) => {
  // Initialize if not already done
  if (!toastRoot) {
    initToasts();
  }
  
  // Dispatch event to add toast
  const event = new CustomEvent('add-toast', { detail: options });
  window.dispatchEvent(event);
};

// Convenience methods
export const toast = {
  success: (message: string, duration?: number) => 
    showToast({ message, type: 'success', duration }),
  error: (message: string, duration?: number) => 
    showToast({ message, type: 'error', duration }),
  warning: (message: string, duration?: number) => 
    showToast({ message, type: 'warning', duration }),
  info: (message: string, duration?: number) => 
    showToast({ message, type: 'info', duration })
};