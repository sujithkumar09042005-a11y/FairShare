import React from 'react';
import { Scale, Receipt, Plane, ShieldCheck } from 'lucide-react';

export default function Footer({ onSelectService, currentView }) {
  return (
    <footer className={`w-full ${currentView === 'wheel' ? 'mt-4 sm:mt-6' : 'mt-10 sm:mt-16'} bg-[#E0E5EC] shadow-neu-extruded rounded-t-[24px] sm:rounded-t-[32px] relative z-10 border-none transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          {/* Brand & Soft UI indicator */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-center md:text-left">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#E0E5EC] shadow-neu-extruded-sm flex items-center justify-center p-1 font-bold flex-shrink-0 overflow-hidden">
              <img
                src="/app-icon.png"
                alt="SplitWise Logo"
                className="w-full h-full object-contain rounded-full select-none"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 justify-center md:justify-start">
                <span className="text-sm font-extrabold font-display text-[#3D4852]">
                  SplitWise
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E0E5EC] text-[#6C63FF] shadow-neu-inset-sm uppercase font-sans">
                  Neumorphism Soft UI
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#6B7280]">
                Tactile group expense calculation & debt settlement
              </p>
            </div>
          </div>

          {/* Quick service navigation pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => onSelectService('equal')}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === 'equal'
                  ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-neu-inset-sm font-bold'
                  : 'bg-[#E0E5EC] text-[#3D4852] shadow-neu-extruded-sm hover:shadow-neu-extruded'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-[#6C63FF]" />
              <span>Equal Split</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectService('items')}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === 'items'
                  ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-neu-inset-sm font-bold'
                  : 'bg-[#E0E5EC] text-[#3D4852] shadow-neu-extruded-sm hover:shadow-neu-extruded'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-[#38B2AC]" />
              <span>Items Split</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectService('trip')}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === 'trip'
                  ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-neu-inset-sm font-bold'
                  : 'bg-[#E0E5EC] text-[#3D4852] shadow-neu-extruded-sm hover:shadow-neu-extruded'
              }`}
            >
              <Plane className="w-3.5 h-3.5 text-[#8B84FF]" />
              <span>Trip Split</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectService('workspace')}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'workspace'
                  ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-neu-inset-sm font-bold'
                  : 'bg-[#E0E5EC] text-[#3D4852] shadow-neu-extruded-sm hover:shadow-neu-extruded'
              }`}
            >
              <span>Full Workspace</span>
            </button>
          </div>

          {/* Copyright & Security */}
          <div className="text-[11px] text-[#6B7280] text-center md:text-right flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Local Storage • 100% Client-Side Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
