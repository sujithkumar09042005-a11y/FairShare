import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain flex flex-col items-center justify-center p-3 xs:p-4 sm:p-6 min-h-[100dvh]">
      {/* Light scrim backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/25 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Light Themed Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} max-h-[calc(100dvh-1.5rem)] xs:max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-black/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] p-4 xs:p-5 sm:p-7 z-10 my-auto overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95`}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 sm:pb-4 gap-3 border-b border-black/5 shrink-0">
          <div>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold font-sans tracking-tight text-slate-900">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 xs:mt-1 font-sans">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black flex items-center justify-center transition-all cursor-pointer flex-shrink-0 border border-slate-200/80"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain mt-3.5 xs:mt-4 pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
