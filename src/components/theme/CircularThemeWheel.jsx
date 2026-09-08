import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { ChevronLeft, ChevronRight, RotateCw, Check, Sparkles } from 'lucide-react';

export default function CircularThemeWheel() {
  const { currentTheme, setTheme, themeList } = useTheme();

  // Rotation angle in degrees (0 to 360)
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const containerRef = useRef(null);
  const numItems = themeList.length;
  const angleStep = 360 / numItems; // 60 degrees each

  // Keep rotation in sync with selected theme on initial load
  useEffect(() => {
    const activeIndex = themeList.findIndex((t) => t.id === currentTheme);
    if (activeIndex !== -1) {
      setRotation(-activeIndex * angleStep);
    }
  }, []);

  // Mouse drag to rotate
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    setRotation((prev) => prev + deltaX * 0.4);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
  };

  // Mouse wheel scroll to rotate
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -15 : 15;
    setRotation((prev) => prev + delta);
  };

  const rotatePrev = () => {
    setRotation((prev) => prev + angleStep);
  };

  const rotateNext = () => {
    setRotation((prev) => prev - angleStep);
  };

  const handleSelectTheme = (index, themeId) => {
    setTheme(themeId);
    // Smoothly rotate the wheel to bring clicked theme to the center (0 deg)
    setRotation(-index * angleStep);
  };

  // Normalized rotation in 0-360 range
  const normalizedDeg = (((Math.round(rotation) % 360) + 360) % 360);

  return (
    <div className="w-full my-6 select-none">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            360° Circular Scrolling Palette
          </span>
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
            Choose Your Theme Experience
          </h3>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-black/10 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold border border-black/5 dark:border-white/10 flex items-center gap-1">
            <RotateCw className="w-3 h-3 text-emerald-400 animate-spin-slow" />
            {normalizedDeg}° / 360°
          </span>

          <button
            type="button"
            onClick={rotatePrev}
            className="p-1.5 rounded-xl glass-pill hover:border-emerald-500/40 text-slate-700 dark:text-slate-200 transition-transform active:scale-90"
            title="Rotate Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={rotateNext}
            className="p-1.5 rounded-xl glass-pill hover:border-emerald-500/40 text-slate-700 dark:text-slate-200 transition-transform active:scale-90"
            title="Rotate Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 360 Degree 3D Rotating Carousel Cylinder */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="relative w-full h-[230px] sm:h-[260px] perspective-1200 flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 bg-black/[0.03] dark:bg-black/20"
      >
        {/* Ambient orbital rings */}
        <div className="absolute w-[440px] h-[440px] rounded-full border border-dashed border-emerald-500/20 pointer-events-none -bottom-52" />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-emerald-500/10 pointer-events-none -bottom-36" />

        {/* 3D Rotating Stage */}
        <div
          className="relative w-[180px] sm:w-[220px] h-[160px] sm:h-[180px] preserve-3d transition-transform duration-300 ease-out"
          style={{
            transform: `rotateY(${rotation}deg)`,
          }}
        >
          {themeList.map((theme, index) => {
            const itemAngle = index * angleStep;
            // Radius of cylinder
            const radius = 220;
            const isSelected = currentTheme === theme.id;

            return (
              <div
                key={theme.id}
                onClick={() => handleSelectTheme(index, theme.id)}
                className={`absolute inset-0 rounded-2xl p-3.5 glass-card border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-400 dark:border-emerald-400 ring-2 ring-emerald-400/40 shadow-xl'
                    : 'border-black/10 dark:border-white/10 opacity-75 hover:opacity-100 hover:border-emerald-400/50'
                }`}
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                      {theme.type}
                    </span>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-emerald-500 text-slate-950 shadow-sm">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white leading-tight mb-1">
                    {theme.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {theme.description}
                  </p>
                </div>

                {/* Color Swatches */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-black/5 dark:border-white/10">
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 dark:border-white/20 shadow-sm flex-shrink-0"
                    style={{ backgroundColor: theme.accentColor }}
                    title={`Accent: ${theme.accentColor}`}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 dark:border-white/20 shadow-sm flex-shrink-0"
                    style={{ backgroundColor: theme.secondaryColor }}
                    title={`Secondary: ${theme.secondaryColor}`}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 dark:border-white/20 shadow-sm flex-shrink-0"
                    style={{ backgroundColor: theme.bgPreview }}
                    title={`Background: ${theme.bgPreview}`}
                  />
                  <span className="text-[10px] text-slate-400 font-medium ml-auto">
                    {itemAngle}°
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Drag Hint Overlay */}
        <div className="absolute bottom-2 text-[10px] text-slate-400 pointer-events-none flex items-center gap-1">
          <span>⇄ Drag or scroll wheel to rotate 360°</span>
        </div>
      </div>
    </div>
  );
}
