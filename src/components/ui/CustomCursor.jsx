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
          className={`w-2 h-2 rounded-full bg-[#0052FF] shadow-[0_0_10px_rgba(0,82,255,0.9)] transition-transform duration-150 ${
            isHovered ? 'scale-0' : 'scale-100'
          }`}
        />
      </div>

      {/* Fluid Trailing Frosted Glass Lens */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998] transition-opacity duration-300"
        style={{
          transform: `translate3d(${trailingPos.x - 20}px, ${trailingPos.y - 20}px, 0)`,
        }}
      >
        <div
          className={`w-10 h-10 rounded-full border transition-all duration-200 ease-out flex items-center justify-center ${
            isHovered
              ? 'scale-140 border-blue-500/80 bg-blue-500/15 backdrop-blur-lg shadow-[0_0_24px_rgba(0,82,255,0.28),inset_0_1px_2px_rgba(255,255,255,0.95)]'
              : 'scale-100 border-white/80 bg-white/35 backdrop-blur-md shadow-[0_8px_24px_0_rgba(0,82,255,0.14),inset_0_1px_1px_rgba(255,255,255,0.95)]'
          } ${isClicked ? 'scale-90 bg-blue-600/30' : ''}`}
        >
          {isHovered && (
            <div className="w-1.5 h-1.5 rounded-full bg-[#0052FF] animate-ping" />
          )}
        </div>
      </div>
    </>
  );
}
