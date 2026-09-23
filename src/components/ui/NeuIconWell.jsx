import React from 'react';

/**
 * NeuIconWell - Minimalist Modern Icon Container with Electric Blue gradient support
 */
export default function NeuIconWell({
  icon: Icon,
  variant = 'extruded',
  size = 'md',
  color = 'neutral',
  shape = 'circle',
  className = '',
  children,
}) {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-12 h-12';
      case 'md':
      default:
        return 'w-10 h-10';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      case 'md':
      default:
        return 'w-5 h-5';
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'accent':
      case 'gradient':
      case 'blue':
        return 'bg-gradient-to-br from-[#0052FF] to-[#4D7CFF] text-white border-transparent shadow-sm shadow-blue-500/25';
      case 'violet':
      case 'dark':
        return 'bg-slate-900 text-white border-slate-800';
      case 'teal':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200/60';
      case 'danger':
        return 'bg-red-50 text-red-600 border-red-200/60';
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'black':
        return 'bg-slate-900 text-white border-slate-900';
      case 'neutral':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200/80';
    }
  };

  return (
    <div
      className={`
        flex items-center justify-center shrink-0 border
        ${getSize()}
        ${shape === 'circle' ? 'rounded-full' : 'rounded-xl'}
        ${getColorClass()}
        ${className}
      `}
    >
      {Icon && <Icon className={getIconSize()} />}
      {children}
    </div>
  );
}
