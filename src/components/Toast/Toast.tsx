import React, { useEffect, useState } from 'react';
import './Toast.css';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 3000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  
  const closeToast = () => {
    setIsExiting(true);
    // Wait for the animation to complete before removing from DOM
    setTimeout(() => {
      onClose(id);
    }, 300); // Match this timing with your CSS animation duration
  };

  useEffect(() => {
    if (duration !== Infinity) {
      const timer = setTimeout(closeToast, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, closeToast]);

  return (
    <div 
      className={`toast toast-${type} ${isExiting ? 'toast-exit' : ''}`}
      role="alert"
    >
      <div className="toast-content">
        <div className="toast-icon">{getIconForType(type)}</div>
        <div className="toast-message">{message}</div>
      </div>
      <button 
        className="toast-close" 
        onClick={closeToast}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

function getIconForType(type: ToastType) {
  switch (type) {
    case 'success': return '✓';
    case 'error': return '!';
    case 'warning': return '⚠';
    case 'info': return 'i';
    default: return 'i';
  }
}

export default Toast;