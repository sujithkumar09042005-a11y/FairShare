import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';

const CURRENCY_SYMBOLS = ['₹', '$', '€', '£', '¥', '₿'];

export default function InteractiveMoneyCanvas() {
  const canvasRef = useRef(null);
  const { isDark, currentTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120,
    };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onClick = (e) => {
      // Spawn burst of 12 coins at click location
      for (let i = 0; i < 12; i++) {
        spawnBurstCoin(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('click', onClick);

    // Money items
    const coins = [];
    const bills = [];
    const dustParticles = [];

    // Create persistent floating coins
    const coinCount = Math.min(24, Math.floor(width / 60));
    for (let i = 0; i < coinCount; i++) {
      coins.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 14 + Math.random() * 12,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: 0.02 + Math.random() * 0.04,
        symbol: CURRENCY_SYMBOLS[Math.floor(Math.random() * CURRENCY_SYMBOLS.length)],
        isGold: Math.random() > 0.3,
        opacity: 0.25 + Math.random() * 0.45,
      });
    }

    // Create floating banknotes
    const billCount = Math.min(12, Math.floor(width / 120));
    for (let i = 0; i < billCount; i++) {
      bills.push({
        x: Math.random() * width,
        y: Math.random() * height,
        w: 48 + Math.random() * 20,
        h: 24 + Math.random() * 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.3 + Math.random() * 0.5, // gentle downward drift
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        symbol: CURRENCY_SYMBOLS[Math.floor(Math.random() * CURRENCY_SYMBOLS.length)],
        opacity: 0.2 + Math.random() * 0.3,
      });
    }

    // Sparkle dust
    for (let i = 0; i < 40; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1 + Math.random() * 2.5,
        vy: -0.2 - Math.random() * 0.4,
        vx: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6,
      });
    }

    // Burst coins on click
    const burstCoins = [];
    function spawnBurstCoin(x, y) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 5;
      burstCoins.push({
        x,
        y,
        radius: 12 + Math.random() * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        gravity: 0.18,
        life: 1,
        symbol: CURRENCY_SYMBOLS[Math.floor(Math.random() * CURRENCY_SYMBOLS.length)],
        spin: 0,
        spinSpeed: 0.1 + Math.random() * 0.1,
      });
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Sparkle Dust
      dustParticles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = isDark
          ? `rgba(250, 204, 21, ${p.alpha * 0.6})`
          : `rgba(202, 138, 4, ${p.alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Banknotes
      bills.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.rotation += b.rotSpeed;

        if (b.y > height + 50) b.y = -50;
        if (b.x < -60) b.x = width + 60;
        if (b.x > width + 60) b.x = -60;

        // Mouse interaction
        const dx = b.x - mouse.x;
        const dy = b.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          b.x += (dx / dist) * force * 5;
          b.y += (dy / dist) * force * 5;
          b.rotation += 0.05;
        }

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rotation);

        const billBg = isDark
          ? `rgba(16, 185, 129, ${b.opacity * 0.5})`
          : `rgba(16, 185, 129, ${b.opacity * 0.35})`;
        const billBorder = isDark
          ? `rgba(52, 211, 153, ${b.opacity * 0.8})`
          : `rgba(5, 150, 105, ${b.opacity * 0.6})`;

        ctx.fillStyle = billBg;
        ctx.strokeStyle = billBorder;
        ctx.lineWidth = 1.2;

        // Draw bill rounded rectangle
        ctx.beginPath();
        ctx.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 4);
        ctx.fill();
        ctx.stroke();

        // Inner frame
        ctx.strokeStyle = billBorder;
        ctx.strokeRect(-b.w / 2 + 3, -b.h / 2 + 3, b.w - 6, b.h - 6);

        // Center currency symbol
        ctx.fillStyle = isDark ? '#ecfdf5' : '#064e3b';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.symbol, 0, 0);

        ctx.restore();
      });

      // 3. Draw Floating 3D Coins
      coins.forEach((c) => {
        c.x += c.vx;
        c.y += c.vy;
        c.angle += c.spinSpeed;

        if (c.x < -30) c.x = width + 30;
        if (c.x > width + 30) c.x = -30;
        if (c.y < -30) c.y = height + 30;
        if (c.y > height + 30) c.y = -30;

        // Mouse repulsion
        const dx = c.x - mouse.x;
        const dy = c.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          c.x += (dx / dist) * force * 6;
          c.y += (dy / dist) * force * 6;
          c.angle += 0.15;
        }

        ctx.save();
        ctx.translate(c.x, c.y);

        // 3D spinning coin scale effect
        const scaleX = Math.cos(c.angle);
        ctx.scale(scaleX, 1);

        const isGold = c.isGold;
        const mainColor = isGold
          ? isDark ? 'rgba(234, 179, 8, ' : 'rgba(202, 138, 4, '
          : isDark ? 'rgba(16, 185, 129, ' : 'rgba(5, 150, 105, ';

        // Outer coin edge
        ctx.fillStyle = `${mainColor}${c.opacity})`;
        ctx.beginPath();
        ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isGold
          ? `rgba(254, 240, 138, ${c.opacity * 0.9})`
          : `rgba(167, 243, 208, ${c.opacity * 0.9})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner rim
        ctx.beginPath();
        ctx.arc(0, 0, c.radius * 0.78, 0, Math.PI * 2);
        ctx.stroke();

        // Center engraved symbol
        if (Math.abs(scaleX) > 0.25) {
          ctx.fillStyle = isGold
            ? isDark ? '#fef08a' : '#78350f'
            : isDark ? '#ecfdf5' : '#064e3b';
          ctx.font = `bold ${Math.round(c.radius * 0.9)}px Outfit, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(c.symbol, 0, 1);
        }

        ctx.restore();
      });

      // 4. Draw Burst Coins (Click fireworks)
      for (let i = burstCoins.length - 1; i >= 0; i--) {
        const b = burstCoins[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vy += b.gravity;
        b.life -= 0.015;
        b.spin += b.spinSpeed;

        if (b.life <= 0) {
          burstCoins.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.scale(Math.cos(b.spin), 1);

        ctx.fillStyle = `rgba(250, 204, 21, ${b.life})`;
        ctx.beginPath();
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(254, 240, 138, ${b.life})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (Math.abs(Math.cos(b.spin)) > 0.3) {
          ctx.fillStyle = '#78350f';
          ctx.font = `bold ${Math.round(b.radius * 0.9)}px Outfit, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.symbol, 0, 0);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, currentTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full"
    />
  );
}
