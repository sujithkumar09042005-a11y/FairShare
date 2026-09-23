"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

export interface Slide {
  id?: string;
  image: string;
  title: string;
  description: string;
  badge: string;
  accent?: string;
}

export const defaultFairShareSlides: Slide[] = [
  {
    id: "equal",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    title: "Equal Split",
    description: "Instant bill splitting with mathematically exact zero-drift cent allocation.",
    badge: "Instant",
    accent: "from-blue-600 to-indigo-600",
  },
  {
    id: "items",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    title: "Receipt Itemized",
    description: "Assign dishes, appetizers, drinks, tax & tip to exactly who ordered them.",
    badge: "Itemized",
    accent: "from-indigo-600 to-blue-500",
  },
  {
    id: "trip",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
    title: "Trip & Travel",
    description: "Multi-currency travel manager with live exchange rates and shared stays.",
    badge: "Global",
    accent: "from-sky-500 to-blue-600",
  },
  {
    id: "settle",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    title: "Smart Debt Settle",
    description: "Greedy optimization algorithm minimizing cross-transactions in seconds.",
    badge: "Algorithm",
    accent: "from-blue-600 to-cyan-500",
  },
  {
    id: "workspace",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    title: "Crew Workspace",
    description: "Group ledger, member balances, interactive charts, and audit-ready PDF export.",
    badge: "Workspace",
    accent: "from-blue-700 to-indigo-500",
  },
];

interface CarouselConfig {
  distanceDivisor: number;
  velocityDivisor: number;
  sensitivity: number;
  xMultiplier: number;
  yMultiplier: number;
  rotationMultiplier: number;
  scaleReduction: number;
}

const getCarouselConfig = (width: number): CarouselConfig => {
  if (width < 480) {
    return {
      distanceDivisor: 80,
      velocityDivisor: 400,
      sensitivity: 120,
      xMultiplier: 65,
      yMultiplier: 12,
      rotationMultiplier: 5,
      scaleReduction: 0.06,
    };
  }
  if (width < 640) {
    return {
      distanceDivisor: 100,
      velocityDivisor: 450,
      sensitivity: 150,
      xMultiplier: 85,
      yMultiplier: 16,
      rotationMultiplier: 6,
      scaleReduction: 0.07,
    };
  }
  if (width < 1024) {
    return {
      distanceDivisor: 140,
      velocityDivisor: 550,
      sensitivity: 180,
      xMultiplier: 130,
      yMultiplier: 26,
      rotationMultiplier: 8,
      scaleReduction: 0.09,
    };
  }
  return {
    distanceDivisor: 160,
    velocityDivisor: 650,
    sensitivity: 200,
    xMultiplier: 170,
    yMultiplier: 32,
    rotationMultiplier: 10,
    scaleReduction: 0.11,
  };
};

export const defaultSplitwiseSlides = defaultFairShareSlides;

interface CarouselStackedProps {
  slides?: Slide[];
  onSelectService?: (serviceId: string) => void;
  className?: string;
}

export const CarouselStacked = ({
  slides = defaultFairShareSlides,
  onSelectService,
  className,
}: CarouselStackedProps) => {
  const scrollProgress = useMotionValue(0);
  const startProgress = React.useRef(0);
  const [windowWidth, setWindowWidth] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const dragStartTime = React.useRef(0);

  const total = slides.length;

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    return scrollProgress.on("change", (v) => {
      const normalized = Math.round(v);
      const mod = ((normalized % total) + total) % total;
      setActiveIndex(mod);
    });
  }, [scrollProgress, total]);

  const config = React.useMemo(
    () => getCarouselConfig(windowWidth),
    [windowWidth],
  );

  const prev = React.useCallback(() => {
    const currentProg = scrollProgress.get();
    const normalized = Math.round(currentProg);
    animate(scrollProgress, normalized - 1, {
      type: "spring",
      stiffness: 260,
      damping: 26,
    });
  }, [scrollProgress]);

  const next = React.useCallback(() => {
    const currentProg = scrollProgress.get();
    const normalized = Math.round(currentProg);
    animate(scrollProgress, normalized + 1, {
      type: "spring",
      stiffness: 260,
      damping: 26,
    });
  }, [scrollProgress]);

  const goTo = React.useCallback((index: number) => {
    const currentProg = scrollProgress.get();
    const normalized = Math.round(currentProg);
    const modCurrent = ((normalized % total) + total) % total;
    animate(scrollProgress, normalized + (index - modCurrent), {
      type: "spring",
      stiffness: 260,
      damping: 26,
    });
  }, [scrollProgress, total]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key === "ArrowRight") {
        next();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next]);

  const handlePanStart = () => {
    setIsDragging(true);
    dragStartTime.current = Date.now();
    startProgress.current = scrollProgress.get();
  };

  const handlePan = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const delta = -info.delta.x / config.sensitivity;
    scrollProgress.set(scrollProgress.get() + delta);
  };

  const handlePanEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setTimeout(() => setIsDragging(false), 120);
    const dragDistance = info.offset.x;
    const velocity = info.velocity.x;

    const distanceShift = -dragDistance / config.distanceDivisor;
    const velocityShift = -velocity / config.velocityDivisor;

    let totalShift = Math.round(distanceShift + velocityShift);
    totalShift = Math.max(-2, Math.min(2, totalShift));

    const target = Math.round(startProgress.current) + totalShift;

    animate(scrollProgress, target, {
      type: "spring",
      stiffness: 240,
      damping: 26,
      mass: 0.9,
    });
  };

  const handleCardClick = (slide: Slide, index: number) => {
    if (isDragging) return;
    const currentProg = scrollProgress.get();
    const normalized = Math.round(currentProg);
    const modCurrent = ((normalized % total) + total) % total;
    if (modCurrent === index) {
      if (slide.id && onSelectService) {
        onSelectService(slide.id);
      }
    } else {
      animate(scrollProgress, normalized + (index - modCurrent), {
        type: "spring",
        stiffness: 260,
        damping: 26,
      });
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full py-4 select-none relative",
        className,
      )}
    >
      <motion.div
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        className="relative w-full max-w-6xl h-80 sm:h-[26rem] lg:h-[30rem] flex items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing"
      >
        {/* Left / Prev Arrow Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-1 xs:left-2 sm:left-4 lg:left-8 z-45 w-9 h-9 xs:w-11 xs:h-11 sm:w-13 sm:h-13 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-xl border border-slate-200/90 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md group"
          aria-label="Previous card"
          title="Previous (Left arrow key)"
        >
          <ChevronLeft className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
        </button>

        {/* Right / Next Arrow Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-1 xs:right-2 sm:right-4 lg:right-8 z-45 w-9 h-9 xs:w-11 xs:h-11 sm:w-13 sm:h-13 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-xl border border-slate-200/90 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md group"
          aria-label="Next card"
          title="Next (Right arrow key)"
        >
          <ChevronRight className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
        </button>

        {/* Stacked Cards */}
        {slides.map((slide, i) => (
          <Card
            key={slide.id || i}
            slide={slide}
            index={i}
            total={total}
            progress={scrollProgress}
            config={config}
            onSelect={() => handleCardClick(slide, i)}
          />
        ))}
      </motion.div>

      {/* Control navigation pills with active state indicator */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 xs:gap-2 mt-4 relative z-30 px-2">
        {slides.map((slide, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={slide.id || idx}
              type="button"
              onClick={() => goTo(idx)}
              className={cn(
                "group px-2.5 py-1 xs:px-3.5 xs:py-1.5 rounded-full border transition-all flex items-center gap-1.5 text-[10px] xs:text-xs font-mono uppercase tracking-wider cursor-pointer shadow-sm",
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-md font-semibold scale-105"
                  : "border-slate-200/80 bg-white/80 backdrop-blur-md text-slate-700 hover:text-blue-600 hover:border-blue-400"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-transform",
                  isActive ? "bg-white scale-125" : "bg-blue-600 group-hover:scale-125"
                )}
              />
              <span className="hidden sm:inline">{slide.title}</span>
              <span className="sm:hidden">{slide.badge}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface CardProps {
  slide: Slide;
  index: number;
  total: number;
  progress: MotionValue<number>;
  config: CarouselConfig;
  onSelect: () => void;
}

const Card = ({
  slide,
  index,
  total,
  progress,
  config,
  onSelect,
}: CardProps) => {
  const offset = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });

  const x = useTransform(offset, (o) => o * config.xMultiplier);
  const rotate = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return o * config.rotationMultiplier;
  });
  const y = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return absO * config.yMultiplier;
  });
  const scale = useTransform(
    offset,
    (o) => 1 - Math.abs(o) * config.scaleReduction,
  );
  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2],
    [0, 1, 1, 1, 0],
  );
  const zIndex = useTransform(offset, (o) =>
    Math.round(35 - Math.abs(o) * 4),
  );

  return (
    <motion.div
      style={{
        x,
        rotate,
        y,
        scale,
        opacity,
        zIndex,
      }}
      onClick={onSelect}
      className={cn(
        "absolute rounded-2xl overflow-hidden group select-none pointer-events-auto cursor-pointer",
        "w-48 h-68 xs:w-54 xs:h-72 sm:w-64 sm:h-[22rem] lg:w-72 lg:h-[25rem]",
        "border border-white/60 bg-white/40 backdrop-blur-xl shadow-xl transition-shadow duration-300",
        "hover:shadow-[0_16px_36px_rgba(0,82,255,0.22)]",
      )}
    >
      {/* Background Image with smooth zoom */}
      <img
        src={slide.image}
        alt={slide.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-105"
      />

      {/* Dimmer layered on depth */}
      <motion.div
        style={{
          opacity: useTransform(
            offset,
            [-2, -0.5, 0, 0.5, 2],
            [0.55, 0.22, 0.1, 0.22, 0.55],
          ),
        }}
        className="absolute inset-0 bg-slate-950 pointer-events-none"
      />

      {/* Glassmorphic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/35 to-white/10 pointer-events-none" />

      {/* Subtle hairline border reflection */}
      <div className="absolute inset-0 rounded-2xl border border-white/30 pointer-events-none" />

      {/* Glassmorphic Badge */}
      <Badge className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 sm:px-3 py-1 rounded-full bg-white/85 backdrop-blur-md text-[10px] sm:text-xs font-bold font-mono uppercase tracking-wider text-slate-900 shadow-md border border-white/70">
        <Sparkles className="w-3 h-3 text-blue-600 mr-1 inline" />
        {slide.badge}
      </Badge>

      {/* Glassmorphic Content Card at Bottom */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3.5 sm:p-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/35 text-white shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <motion.h3
            style={{
              opacity: useTransform(offset, [-0.5, 0, 0.5], [0.5, 1, 0.5]),
            }}
            className="text-base sm:text-lg font-bold font-sans tracking-tight text-white drop-shadow-sm flex items-center gap-1.5"
          >
            {slide.title}
          </motion.h3>
          <div className="w-6 h-6 rounded-full bg-blue-600/90 text-white flex items-center justify-center shrink-0 group-hover:translate-x-1 group-hover:bg-blue-500 transition-all shadow-sm">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <motion.p
          style={{
            opacity: useTransform(offset, [-0.5, 0, 0.5], [0.2, 1, 0.2]),
          }}
          className="text-xs text-slate-100/90 line-clamp-2 mt-1 leading-snug drop-shadow-sm"
        >
          {slide.description}
        </motion.p>

        <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between text-[11px] font-mono text-blue-200">
          <span>Click to launch</span>
          <span className="font-bold text-white uppercase tracking-wider">OPEN →</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CarouselStacked;
