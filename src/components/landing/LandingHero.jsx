import React from 'react';
import CarouselStacked, { defaultFairShareSlides } from '../ui/carousel-07.tsx';
import NeuButton from '../ui/NeuButton.jsx';
import NeuCard from '../ui/NeuCard.jsx';
import {
  Users,
  Receipt,
  Plane,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Layers,
  Zap,
} from 'lucide-react';

export default function LandingHero({ onSelectService }) {
  return (
    <div className="w-full flex flex-col items-center pt-2 sm:pt-6 pb-16 overflow-hidden">
      {/* Ambient Radial Glow Top - Clamped to 90vw */}
      <div
        className="absolute top-16 left-1/2 -translate-x-1/2 w-[min(600px,90vw)] h-[350px] bg-gradient-to-b from-[#0052FF]/10 via-[#4D7CFF]/5 to-transparent blur-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* 1. SECTION BADGE */}
      <div className="inline-flex items-center gap-2.5 rounded-full border border-[#0052FF]/25 bg-[#0052FF]/6 px-4 py-1.5 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-ping" />
        <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#0052FF] font-semibold">
          NEXT-GEN EXPENSE ENGINE
        </span>
      </div>

      {/* 2. DUAL-FONT HERO HEADLINE */}
      <div className="text-center mt-5 mb-3 max-w-4xl px-3 sm:px-4">
        <h1 className="font-display text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-normal text-slate-900 tracking-tight leading-[1.1]">
          Split expenses without friction, settled in{' '}
          <span className="gradient-text relative inline-block font-display">
            seconds
            <span className="gradient-underline" />
          </span>
        </h1>
        <p className="mt-3 sm:mt-4 text-sm xs:text-base sm:text-lg lg:text-xl text-slate-600 font-sans max-w-2xl mx-auto leading-relaxed">
          Mathematical zero-drift rounding, instant receipt allocation, and greedy graph debt settlement. Designed with clarity and character.
        </p>
      </div>

      {/* 3. HERO QUICK ACTION BUTTONS */}
      <div className="flex flex-wrap items-center justify-center gap-2 xs:gap-3 mt-4 mb-2 z-20 px-2">
        <NeuButton
          variant="primary"
          size="md"
          arrowBadge
          onClick={() => onSelectService('equal')}
        >
          Quick Equal Split
        </NeuButton>
        <NeuButton
          variant="neutral"
          size="md"
          icon={Receipt}
          onClick={() => onSelectService('items')}
        >
          Itemized Receipt
        </NeuButton>
        <NeuButton
          variant="neutral"
          size="md"
          icon={Users}
          onClick={() => onSelectService('workspace')}
        >
          Crew Workspace
        </NeuButton>
      </div>

      {/* 4. STACKED GLASSMORPHIC CAROUSEL (carousel-07) */}
      <div className="w-full my-4 relative z-10 overflow-hidden">
        <div className="text-center mb-2">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
            USE ARROWS, DRAG OR CLICK CARDS TO EXPLORE SERVICES
          </p>
        </div>
        <CarouselStacked
          slides={defaultFairShareSlides}
          onSelectService={onSelectService}
        />
      </div>

      {/* 5. INVERTED CONTRAST SECTION (Design System DNA) */}
      <section className="w-full max-w-6xl my-10 rounded-3xl bg-slate-900 text-white p-5 xs:p-7 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl border border-slate-800 mx-auto">
        {/* Dot pattern background texture */}
        <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" />

        {/* Ambient radial glow inside inverted section */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 bg-[#0052FF]/20 rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-mono text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              GREEDY ALGORITHM CORE
            </div>

            <h2 className="font-display text-3xl sm:text-4xl text-white font-normal leading-tight">
              Turn chaotic IOUs into the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
                minimum possible transfers
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              Traditional expense sharing leaves friends trapped in circular debt cycles where everyone owes everyone.
              FairShare runs a greedy net-balance reduction algorithm that collapses multi-party debt into simple, direct payoffs.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-2xl font-mono font-bold text-blue-400">0¢</span>
                <p className="text-xs text-slate-400 mt-0.5">Zero-drift cent rounding</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-2xl font-mono font-bold text-sky-400">-75%</span>
                <p className="text-xs text-slate-400 mt-0.5">Fewer cross payments</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md col-span-2 sm:col-span-1">
                <span className="text-2xl font-mono font-bold text-emerald-400">100%</span>
                <p className="text-xs text-slate-400 mt-0.5">Local & privacy-first</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSelectService('settle')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white font-medium text-sm hover:brightness-110 transition-all shadow-lg shadow-blue-600/30"
              >
                <span>Launch Debt Simplification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            {/* Visual simulation card */}
            <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-5 backdrop-blur-xl shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  OPTIMIZATION PREVIEW
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  OPTIMAL
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                      A
                    </div>
                    <span className="text-slate-200">Alex</span>
                  </div>
                  <span className="text-slate-400">pays $42.50 to</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200">Sam</span>
                    <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                      S
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-400 flex items-center justify-center font-bold text-[10px]">
                      M
                    </div>
                    <span className="text-slate-200">Maya</span>
                  </div>
                  <span className="text-slate-400">pays $18.25 to</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200">Sam</span>
                    <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                      S
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Original IOUs: 6 txs</span>
                <span className="text-emerald-400 font-semibold">Reduced to 2 txs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BENTO GRID OF GLASSMORPHIC SERVICES */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
        {/* Bento 1: Equal Split */}
        <NeuCard
          hover
          onClick={() => onSelectService('equal')}
          className="flex flex-col justify-between group"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] text-white flex items-center justify-center shadow-md shadow-blue-500/20 mb-4 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-sans text-slate-900 tracking-tight">
              Equal Split
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Dinner, groceries, drinks or taxis. Enter total bill, add participants, and get mathematically exact allocations.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/60 flex items-center justify-between text-xs font-mono font-semibold text-[#0052FF]">
            <span>INSTANT SPLIT</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </NeuCard>

        {/* Bento 2: Items Split */}
        <NeuCard
          hover
          onClick={() => onSelectService('items')}
          className="flex flex-col justify-between group"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mb-4 group-hover:scale-105 transition-transform">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-sans text-slate-900 tracking-tight">
              Receipt Items Split
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Line-item breakdown. Assign specific entrees, drinks, and share appetizers. Tax & tip auto-scale proportionally.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/60 flex items-center justify-between text-xs font-mono font-semibold text-[#0052FF]">
            <span>ITEMIZED BILL</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </NeuCard>

        {/* Bento 3: Trip & Workspace */}
        <NeuCard
          hover
          onClick={() => onSelectService('trip')}
          className="flex flex-col justify-between group"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 mb-4 group-hover:scale-105 transition-transform">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-sans text-slate-900 tracking-tight">
              Trip & Multi-Currency
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Traveling abroad? Manage flights, Airbnb, excursions in USD, EUR, INR, GBP, JPY with live currency conversion rates.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/60 flex items-center justify-between text-xs font-mono font-semibold text-[#0052FF]">
            <span>MULTI-CURRENCY</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </NeuCard>
      </div>
    </div>
  );
}
