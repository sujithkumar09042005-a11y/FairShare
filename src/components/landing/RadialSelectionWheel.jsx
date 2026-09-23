import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Scale,
  Receipt,
  Plane,
  HandCoins,
  FolderKanban,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';
import NeuButton from '../ui/NeuButton.jsx';

export const WHEEL_SERVICES = [
  {
    id: 'equal',
    name: 'Equal Split',
    tag: 'Quick & Fair',
    description: 'Split bills and expenses evenly among any number of people with integer-cent accuracy.',
    icon: Scale,
    accent: '#6C63FF',
  },
  {
    id: 'items',
    name: 'Items Split',
    tag: 'Receipt Breakdown',
    description: 'Assign specific line items, dishes, and drinks to individuals, plus auto-split shared tax & tip.',
    icon: Receipt,
    accent: '#38B2AC',
  },
  {
    id: 'trip',
    name: 'Trip Split',
    tag: 'Whole Vacation',
    description: 'Set a trip budget, add unlimited travelers, and run both equal and itemized splits with debt settlement.',
    icon: Plane,
    accent: '#8B84FF',
  },
  {
    id: 'settle',
    name: 'Settle Up',
    tag: 'Debt Minimizer',
    description: 'Greedy Minimum Cash Flow algorithm simplifies cross-debts into the minimal number of transactions.',
    icon: HandCoins,
    accent: '#6C63FF',
  },
  {
    id: 'workspace',
    name: 'Saved Trips',
    tag: 'Active Ledgers',
    description: 'Browse saved groups and ledgers, review detailed expense histories, and export PDF statements.',
    icon: FolderKanban,
    accent: '#38B2AC',
  },
];

export default function RadialSelectionWheel({ onSelectService }) {
  // Continuous cumulative step counter (can grow infinitely positive or negative without rewinding)
  const [stepCount, setStepCount] = useState(0);

  const containerRef = useRef(null);
  const totalItems = WHEEL_SERVICES.length; // 5
  const angleStep = 360 / totalItems; // 72 degrees each

  // Active index derived via positive modulo
  const activeIndex = ((stepCount % totalItems) + totalItems) % totalItems;
  const activeService = WHEEL_SERVICES[activeIndex];

  const handlePrev = useCallback(() => {
    setStepCount((prev) => prev - 1);
  }, []);

  const handleNext = useCallback(() => {
    setStepCount((prev) => prev + 1);
  }, []);

  // Shortest angular navigation when clicking any node or pill
  const navigateToServiceIndex = useCallback(
    (targetIndex) => {
      setStepCount((prevStep) => {
        const currentIdx = ((prevStep % totalItems) + totalItems) % totalItems;
        let diff = (targetIndex - currentIdx) % totalItems;
        if (diff > totalItems / 2) diff -= totalItems;
        if (diff < -totalItems / 2) diff += totalItems;
        return prevStep + diff;
      });
    },
    [totalItems]
  );

  // Native non-passive wheel listener on container:
  // 1. Prevents the landing page/window from scrolling when user scrolls mouse wheel
  // 2. Rotates the wheel continuously without jitter or page jump
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let accumulatedDelta = 0;
    let lastTurnTime = 0;

    const onWheelNative = (e) => {
      // Completely prevent page/window scrolling
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      accumulatedDelta += e.deltaY;

      // Threshold and cooldown ensure 1 clean step per scroll notch/flick
      const THRESHOLD = 35;
      const COOLDOWN = 120; // ms

      if (Math.abs(accumulatedDelta) >= THRESHOLD && now - lastTurnTime > COOLDOWN) {
        if (accumulatedDelta > 0) {
          setStepCount((prev) => prev + 1);
        } else {
          setStepCount((prev) => prev - 1);
        }
        accumulatedDelta = 0;
        lastTurnTime = now;
      }
    };

    el.addEventListener('wheel', onWheelNative, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheelNative);
    };
  }, []);

  // Keyboard arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Enter') {
        onSelectService(activeService.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, activeService.id, onSelectService]);

  // Track viewport width for responsive turntable dial scaling
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive turntable sizing calculations
  const isSmallMobile = viewportWidth < 440;
  const isTabletOrSmall = viewportWidth < 640;

  // Responsive orbit radius:
  // <440px: 125px (total spread ~310px, completely fits 320px–390px screens)
  // 440px–639px: 155px (total spread ~380px)
  // >=640px: 195px (total spread ~480px)
  const orbitRadius = isSmallMobile ? 125 : isTabletOrSmall ? 155 : 195;
  const outerTrackSize = isSmallMobile ? 280 : isTabletOrSmall ? 350 : 440;
  const innerTrackSize = isSmallMobile ? 200 : isTabletOrSmall ? 260 : 330;
  const hubSize = isSmallMobile ? 175 : isTabletOrSmall ? 215 : 260;

  // Multi-directional touch swipe support (horizontal and vertical)
  const touchStartPos = useRef({ x: 0, y: 0 });
  const handleTouchStart = (e) => {
    const touch = e.touches ? e.touches[0] : e;
    if (!touch) return;
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches ? e.changedTouches[0] : e;
    if (!touch) return;
    const diffX = touch.clientX - touchStartPos.current.x;
    const diffY = touch.clientY - touchStartPos.current.y;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 25) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    } else if (Math.abs(diffY) > 25) {
      if (diffY < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const targetAngle = -30;
  // Cumulative continuous rotation: never jumps or rewinds after 5 turns
  const currentRotation = targetAngle - stepCount * angleStep;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[480px] xs:min-h-[540px] sm:min-h-[620px] select-none py-4 sm:py-6 overscroll-none overflow-hidden"
    >
      {/* Instruction Badge */}
      <div className="text-center mb-4 sm:mb-6 z-10 px-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/10 shadow-sm text-black text-xs font-medium mb-2">
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span>Interactive Service Dial</span>
        </div>
        <p className="text-xs sm:text-sm text-black/50 font-medium">
          Scroll or drag to navigate • Click or press Enter to launch
        </p>
      </div>

      {/* Big Radial Wheel Container (Adaptive dimensions) */}
      <div
        className="relative flex items-center justify-center transition-all duration-300"
        style={{
          width: `${outerTrackSize + (isSmallMobile ? 30 : 60)}px`,
          height: `${outerTrackSize + (isSmallMobile ? 30 : 60)}px`,
        }}
      >
        {/* Outer Minimalist Track Ring */}
        <div
          className="absolute rounded-full border border-black/[0.06] bg-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.02)] pointer-events-none transition-all duration-300"
          style={{ width: `${outerTrackSize}px`, height: `${outerTrackSize}px` }}
        />

        {/* Concentric Subtle Inner Ridge */}
        <div
          className="absolute rounded-full border border-black/[0.04] pointer-events-none transition-all duration-300"
          style={{ width: `${innerTrackSize}px`, height: `${innerTrackSize}px` }}
        />

        {/* Rotating Orbital Nodes Ring (Smooth continuous rotation) */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
          style={{
            transform: `rotate(${currentRotation}deg)`,
          }}
        >
          {WHEEL_SERVICES.map((service, index) => {
            const itemAngle = index * angleStep;
            const isActive = index === activeIndex;

            const rad = (itemAngle * Math.PI) / 180;
            const x = Math.cos(rad) * orbitRadius;
            const y = Math.sin(rad) * orbitRadius;

            return (
              <div
                key={service.id}
                onClick={() => {
                  if (isActive) {
                    onSelectService(service.id);
                  } else {
                    navigateToServiceIndex(index);
                  }
                }}
                className={`absolute cursor-pointer transition-all duration-300 z-10 flex items-center rounded-full ${
                  isSmallMobile ? 'gap-1.5 px-3 py-1.5' : 'gap-2.5 px-4 py-2'
                } ${
                  isActive
                    ? 'scale-105 xs:scale-110 bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] font-medium ring-2 ring-black/20'
                    : 'scale-95 bg-white text-black/70 border border-black/10 shadow-sm hover:border-black/30 hover:scale-100 hover:text-black'
                }`}
                style={{
                  transform: `translate(${x}px, ${y}px) rotate(${-currentRotation}deg)`,
                }}
              >
                <div
                  className={`${isSmallMobile ? 'w-5 h-5' : 'w-6 h-6'} rounded-full flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-white text-black'
                      : 'bg-black/[0.04] text-black/70'
                  }`}
                >
                  <service.icon className={isSmallMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
                </div>
                <span className={`${isSmallMobile ? 'text-[11px]' : 'text-xs sm:text-sm'} font-medium tracking-tight whitespace-nowrap`}>
                  {service.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Central Hub Disc (Clean Fintech Core) */}
        <div
          className="relative rounded-full z-20 flex flex-col items-center justify-center p-4 xs:p-5 sm:p-7 text-center bg-white border border-black/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.06)] transition-all duration-300"
          style={{ width: `${hubSize}px`, height: `${hubSize}px` }}
        >
          {/* Status Label */}
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-black/40 mb-1">
            Now Selecting
          </span>

          {/* Service Name */}
          <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold tracking-tight text-black leading-tight mb-1">
            {activeService.name}
          </h3>

          {/* Description snippet */}
          <p className="text-[11px] sm:text-xs text-black/60 leading-relaxed line-clamp-2 max-w-[140px] xs:max-w-[170px] sm:max-w-[200px] mb-3 sm:mb-4">
            {activeService.description}
          </p>

          {/* Dial Controls (Prev / Next Buttons) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/[0.04] border border-black/10 text-black hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer"
              title="Previous Service (←)"
              aria-label="Previous service"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              type="button"
              onClick={() => onSelectService(activeService.id)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black text-white hover:bg-gray-800 shadow-md flex items-center justify-center transition-colors cursor-pointer group"
              title={`Open ${activeService.name} (Enter)`}
              aria-label={`Open ${activeService.name}`}
            >
              <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/[0.04] border border-black/10 text-black hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer"
              title="Next Service (→)"
              aria-label="Next service"
            >
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Quick Action Link */}
          <button
            type="button"
            onClick={() => onSelectService(activeService.id)}
            className="mt-2.5 text-[10px] sm:text-xs font-semibold text-black hover:text-gray-600 transition-colors uppercase tracking-wider cursor-pointer"
          >
            Launch Service →
          </button>
        </div>
      </div>

      {/* Bottom Service Selector Quick Pills */}
      <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap max-w-lg z-10 px-2 sm:px-4">
        {WHEEL_SERVICES.map((srv, idx) => (
          <button
            key={srv.id}
            type="button"
            onClick={() => navigateToServiceIndex(idx)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              idx === activeIndex
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-black/70 border border-black/10 hover:border-black/30 hover:text-black shadow-sm'
            }`}
          >
            {srv.name}
          </button>
        ))}
      </div>
    </div>
  );
}
