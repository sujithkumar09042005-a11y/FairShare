import React from 'react';

/**
 * AmbientBackground - Minimalist Modern canvas (#FAFAFA) with subtle ambient Electric Blue glows and rotating subtle ring
 */
export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20 bg-[#F8FAFC]">
      {/* Subtle Dot Grid Pattern */}
      <div className="absolute inset-0 bg-dot-pattern-light opacity-50" />

      {/* Top Center Electric Blue Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full bg-gradient-to-b from-[#0052FF]/14 via-[#4D7CFF]/8 to-transparent blur-[140px] pointer-events-none" />

      {/* Top Right Cyan Iridescent Orb */}
      <div className="absolute top-20 right-[5%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-cyan-400/12 to-blue-500/10 blur-[130px] pointer-events-none" />

      {/* Center Left Indigo Accent */}
      <div className="absolute top-1/3 left-[-5%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-indigo-500/10 to-blue-600/8 blur-[150px] pointer-events-none" />

      {/* Bottom Right Electric Sky Glow */}
      <div className="absolute -bottom-40 right-[-10%] w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-[#0052FF]/10 via-[#4D7CFF]/8 to-transparent blur-[160px] pointer-events-none" />

      {/* Bottom Left Subtle Teal Glow */}
      <div className="absolute -bottom-30 left-[-5%] w-[500px] h-[500px] rounded-full bg-teal-400/8 blur-[150px] pointer-events-none" />

      {/* Slow rotating subtle dashed rings (Design System DNA) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-[850px] h-[850px] rounded-full border border-dashed border-[#0052FF]/20 animate-spin-slow" />
        <div className="absolute w-[600px] h-[600px] rounded-full border border-slate-300/50" />
      </div>
    </div>
  );
}
