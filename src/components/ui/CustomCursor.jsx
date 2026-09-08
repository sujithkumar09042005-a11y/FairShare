import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const requestRef = useRef(null);

  useEffect(() => {
    // Check touch device
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if target is interactive
      const target = e.target;
      const isInteractive =
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.closest('[role="button"]') ||
        target.closest('.interactive') ||
        target.closest('.glass-card');

      setIsHovered(!!isInteractive);
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseenter', onMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  // Smooth lerp for trailing ring
  useEffect(() => {
    if (isTouchDevice) return;

    const follow = () => {
      setTrailingPos((prev) => {
        const dx = pos.x - prev.x;
        const dy = pos.y - prev.y;
        return {
          x: prev.x + dx * 0.22,
          y: prev.y + dy * 0.22,
        };
      });
      requestRef.current = requestAnimationFrame(follow);
    };

    requestRef.current = requestAnimationFrame(follow);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [pos, isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Precision Center Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300"
        style={{
          transform: `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0)`,
        }}
      >
        <div
          className={`w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 shadow-[0_0_8px_rgba(5,150,105,0.7)] dark:shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-transform duration-150 ${
            isHovered ? 'scale-0' : 'scale-100'
          }`}
        />
      </div>

      {/* Fluid Trailing Glass Ring */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998] transition-opacity duration-300"
        style={{
          transform: `translate3d(${trailingPos.x - 18}px, ${trailingPos.y - 18}px, 0)`,
        }}
      >
        <div
          className={`w-9 h-9 rounded-full border transition-all duration-200 ease-out flex items-center justify-center ${
            isHovered
              ? 'scale-150 border-emerald-600 dark:border-emerald-400 bg-emerald-500/20 dark:bg-emerald-400/20 backdrop-blur-[2px] shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'scale-100 border-emerald-600/70 dark:border-emerald-400/60 bg-emerald-500/15 dark:bg-emerald-500/10'
          } ${isClicked ? 'scale-90 bg-emerald-500/30' : ''}`}
        >
          {isHovered && (
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-300 animate-ping" />
          )}
        </div>
      </div>
    </>
  );
}
