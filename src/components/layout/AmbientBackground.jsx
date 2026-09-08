import React from 'react';

/**
 * AmbientBackground - Tactile, matte cool-grey (#E0E5EC) canvas
 * sculpted with concentric extruded and inset decorative architectural rings.
 */
export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20 bg-[var(--neu-base)] transition-colors duration-300">
      {/* Concentric Neumorphic Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outermost Inset Groove Ring */}
        <div className="w-[920px] h-[920px] rounded-full shadow-[inset_8px_8px_16px_rgba(163,177,198,0.35),inset_-8px_-8px_16px_rgba(255,255,255,0.4)] dark:shadow-[inset_8px_8px_20px_rgba(0,0,0,0.65),inset_-8px_-8px_20px_rgba(255,255,255,0.035)] opacity-70 transition-shadow duration-300" />

        {/* Middle Extruded Ring */}
        <div className="absolute w-[680px] h-[680px] rounded-full shadow-[10px_10px_22px_rgba(163,177,198,0.4),-10px_-10px_22px_rgba(255,255,255,0.5)] dark:shadow-[10px_10px_24px_rgba(0,0,0,0.7),-10px_-10px_24px_rgba(255,255,255,0.04)] opacity-60 transition-shadow duration-300" />

        {/* Inner Inset Ring */}
        <div className="absolute w-[440px] h-[440px] rounded-full shadow-[inset_6px_6px_12px_rgba(163,177,198,0.4),inset_-6px_-6px_12px_rgba(255,255,255,0.45)] dark:shadow-[inset_6px_6px_14px_rgba(0,0,0,0.65),inset_-6px_-6px_14px_rgba(255,255,255,0.035)] opacity-80 transition-shadow duration-300" />

        {/* Subtle Decorative Center Emboss Node */}
        <div className="absolute w-[180px] h-[180px] rounded-full shadow-[6px_6px_14px_rgba(163,177,198,0.35),-6px_-6px_14px_rgba(255,255,255,0.45)] dark:shadow-[6px_6px_16px_rgba(0,0,0,0.65),-6px_-6px_16px_rgba(255,255,255,0.04)] opacity-40 animate-pulse-slow transition-shadow duration-300" />
      </div>

      {/* Subtle Corner Shadow Gradient for organic depth */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl bg-white/20 dark:bg-[#6C63FF]/5 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl bg-[#A3B1C6]/20 dark:bg-black/30 translate-x-1/2 translate-y-1/2" />
    </div>
  );
}
