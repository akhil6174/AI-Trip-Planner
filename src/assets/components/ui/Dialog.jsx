import React, { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

function Dialog({ onClose, message, openDialog, actions = [] }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (openDialog) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openDialog, onClose]);

  if (!openDialog) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-gray-900 p-6 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-2xl hover:text-red-400 transition"
          aria-label="Close dialog"
        >
          <IoClose />
        </button>

        <p className="text-lg text-gray-300 mb-6">{message}</p>
        {actions.length > 0 && (
          <div className="flex justify-center gap-4">
            {actions.map(({ label, onClick, className = "" }) => (
              <button
                key={label}
                onClick={onClick}
                className={`px-4 py-2 rounded-lg text-white font-medium ${className}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dialog;
