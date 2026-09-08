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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 xs:p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#3D4852]/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Neumorphic Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-[#E0E5EC] rounded-[24px] sm:rounded-[32px] shadow-neu-extruded-lg p-4 xs:p-6 sm:p-8 z-10 my-4 sm:my-8 overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95`}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 sm:pb-4 gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#3D4852]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5 font-sans">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E0E5EC] text-[#6B7280] hover:text-[#3D4852] shadow-neu-extruded-sm hover:shadow-neu-extruded active:shadow-neu-pressed flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-2 max-h-[78vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
