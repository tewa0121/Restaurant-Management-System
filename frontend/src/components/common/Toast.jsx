import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => { onClose(); }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-orange-500 text-white',
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertTriangle size={20} />,
    warning: <AlertTriangle size={20} />,
  };

  return (
    <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl animate-slide-in ${styles[type]}`}>
      {icons[type]}
      <span className="font-semibold text-sm">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100"><X size={16} /></button>
    </div>
  );
}