import React from 'react';
import { ShieldCheck } from 'lucide-react';
import LogoIcon from '../ui/LogoIcon.jsx';

export default function Footer({ onSelectService, currentView }) {
  return (
    <footer className="w-full mt-16 border-t border-white/80 bg-white/60 backdrop-blur-2xl py-10 shadow-[0_-8px_32px_0_rgba(31,38,135,0.03)] transition-colors duration-200">
      <div className="max-w-[88rem] mx-auto px-4 xs:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Minimalist Modern indicator */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md p-1.5">
              <LogoIcon className="w-6 h-3.5 text-white shrink-0" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-base font-bold tracking-tight text-slate-900 font-sans">
                  FairShare
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#0052FF] border border-blue-200/60 uppercase">
                  MINIMALIST MODERN
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Intelligent group expense calculations & greedy debt settlement
              </p>
            </div>
          </div>

          {/* Privacy & Guarantee note */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Client-Side Privacy</span>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono gap-2 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} FairShare. Minimalist Modern &bull; Calistoga &amp; Inter.</span>
          <span>Zero-Drift Integer Math &bull; Greedy Debt Minimization</span>
        </div>
      </div>
    </footer>
  );
}
