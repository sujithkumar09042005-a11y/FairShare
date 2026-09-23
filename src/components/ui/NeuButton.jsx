import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * NeuButton - Minimalist Modern Button with Electric Blue gradient primary option
 *
 * @param {('neutral'|'primary'|'secondary'|'danger'|'ghost')} variant
 * @param {('sm'|'md'|'lg')} size
 * @param {boolean} active - whether the button is held in an active state
 * @param {boolean} arrowBadge - whether to render a trailing circular arrow badge
 */
export default function NeuButton({
  children,
  variant = 'neutral',
  size = 'md',
  active = false,
  fullWidth = false,
  icon: Icon,
  arrowBadge = false,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white hover:brightness-105 shadow-[0_4px_14px_rgba(0,82,255,0.25)] hover:shadow-[0_8px_24px_rgba(0,82,255,0.35)] border border-white/20';
      case 'secondary':
        return 'bg-slate-900 text-white hover:bg-slate-800 shadow-md border border-slate-800';
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-rose-500 text-white hover:brightness-105 shadow-[0_4px_14px_rgba(239,68,68,0.25)] border border-red-400/20';
      case 'ghost':
        return 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60';
      case 'neutral':
      default:
        return active
          ? 'bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white font-medium shadow-[0_4px_14px_rgba(0,82,255,0.25)] border border-white/20'
          : 'bg-white/90 text-slate-800 border border-slate-200/80 hover:border-blue-500/30 hover:bg-white shadow-sm backdrop-blur-md';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return arrowBadge
          ? 'pl-3.5 pr-1.5 py-1.5 text-xs rounded-full gap-2'
          : 'px-3.5 py-1.5 text-xs rounded-full gap-1.5';
      case 'lg':
        return arrowBadge
          ? 'pl-7 pr-2.5 py-3 text-base md:text-lg rounded-full gap-3.5'
          : 'px-7 py-3 text-base md:text-lg rounded-full gap-3';
      case 'md':
      default:
        return arrowBadge
          ? 'pl-5 pr-2 py-2 text-sm md:text-base rounded-full gap-2.5'
          : 'px-5 py-2.5 text-sm md:text-base rounded-full gap-2';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        font-medium tracking-tight
        transition-all duration-200
        outline-none select-none
        ${getVariantClass()}
        ${getSizeClass()}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer active:scale-[0.98] hover:-translate-y-0.5'}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children && <span>{children}</span>}
      {arrowBadge && (
        <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
        </span>
      )}
    </button>
  );
}
