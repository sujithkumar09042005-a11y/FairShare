import React from 'react';

/**
 * NeuCard - Minimalist Modern Glassmorphic Container
 *
 * @param {('extruded'|'inset'|'flat'|'dark'|'gradient-border')} variant
 * @param {boolean} hover - whether to elevate and deepen glow on hover
 * @param {string} size - ('sm'|'md'|'lg')
 */
export default function NeuCard({
  children,
  variant = 'extruded',
  hover = false,
  size = 'lg',
  className = '',
  onClick,
  as: Component = 'div',
  ...props
}) {
  const getStyleClass = () => {
    if (variant === 'dark') {
      return 'bg-slate-900/90 text-white border border-slate-700/60 shadow-2xl backdrop-blur-2xl';
    }
    if (variant === 'inset') {
      return 'bg-slate-100/50 text-slate-900 border border-white/70 backdrop-blur-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]';
    }
    if (variant === 'flat') {
      return 'bg-white/60 text-slate-900 border border-white/75 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.02)]';
    }
    if (variant === 'gradient-border') {
      return 'bg-gradient-to-br from-[#0052FF] via-indigo-500 to-[#0052FF] p-[1.5px] rounded-2xl shadow-lg';
    }

    // Standard frosted glassmorphic card with specular rim highlight & depth
    return hover
      ? 'bg-white/70 text-slate-900 border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-[0_20px_48px_rgba(0,82,255,0.12),inset_0_1px_2px_rgba(255,255,255,1)] hover:border-blue-400/40 hover:-translate-y-1 backdrop-blur-2xl cursor-pointer'
      : 'bg-white/70 text-slate-900 border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-2xl';
  };

  const getRadiusClass = () => {
    if (size === 'sm') return 'rounded-xl p-3.5 sm:p-4';
    if (size === 'md') return 'rounded-2xl p-5 sm:p-6';
    return 'rounded-2xl sm:rounded-3xl p-6 sm:p-8';
  };

  return (
    <Component
      onClick={onClick}
      className={`
        transition-all duration-200
        ${getRadiusClass()}
        ${getStyleClass()}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
}
