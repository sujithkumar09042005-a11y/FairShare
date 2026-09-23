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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2.5 xs:p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop with subtle blur */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Glassmorphic Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/90 shadow-[0_24px_60px_-12px_rgba(0,82,255,0.18)] p-4 xs:p-6 sm:p-8 z-10 my-3 sm:my-8 overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95`}
      >
        {/* Subtle accent top border glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0052FF] via-[#4D7CFF] to-[#0052FF]" />

        {/* Header */}
        <div className="flex items-start justify-between pb-3 sm:pb-4 gap-3 border-b border-slate-200/80">
          <div>
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold font-sans tracking-tight text-slate-900">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 xs:mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100/80 hover:bg-blue-50 text-slate-600 hover:text-[#0052FF] flex items-center justify-center transition-all cursor-pointer flex-shrink-0 border border-slate-200/60"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-3.5 xs:mt-4 max-h-[80vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
