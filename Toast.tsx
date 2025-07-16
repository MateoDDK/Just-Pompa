
import React, { useEffect, useState } from 'react';
import { Toast } from '../types';
import { ICONS } from '../constants';

interface ToastProps extends Toast {
  onClose: () => void;
}

const ToastComponent: React.FC<ToastProps> = ({ message, type, icon, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      // Allow time for fade-out animation before calling onClose
      setTimeout(onClose, 300);
    }, 4700);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClasses = "flex items-center w-full max-w-xs p-4 space-x-4 text-slate-50 bg-slate-800 rounded-lg shadow-lg border-l-4 transition-all duration-300 ease-in-out";
  const typeClasses = {
    success: 'border-green-500',
    error: 'border-red-500',
    info: 'border-blue-500',
    warning: 'border-yellow-500',
  };

  const transformClass = visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0';

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${transformClass}`} role="alert">
      <div className="text-xl">{icon}</div>
      <div className="text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 p-1.5 inline-flex h-8 w-8"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        {ICONS.close}
      </button>
    </div>
  );
};

export default ToastComponent;