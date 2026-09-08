import React from 'react';

/**
 * NeuButton - Tactile Soft UI interactive button.
 * Depresses smoothly with inset shadows and subtle transform when pressed.
 *
 * @param {('neutral'|'primary'|'secondary'|'danger')} variant
 * @param {('sm'|'md'|'lg')} size
 * @param {boolean} active - whether the button is held in an active/pressed state
 */
export default function NeuButton({
  children,
  variant = 'neutral',
  size = 'md',
  active = false,
  fullWidth = false,
  icon: Icon,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'neu-btn-primary';
      case 'secondary':
        return 'neu-btn-secondary';
      case 'danger':
        return 'bg-[#EF4444] text-white shadow-[6px_6px_14px_rgba(239,68,68,0.35),-6px_-6px_14px_rgba(255,255,255,0.7)] hover:bg-[#DC2626] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.25)]';
      case 'neutral':
      default:
        return active
          ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-neu-pressed font-semibold'
          : 'neu-btn font-medium';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs rounded-xl gap-1.5';
      case 'lg':
        return 'px-6 py-3.5 text-base rounded-2xl gap-2.5';
      case 'md':
      default:
        return 'px-4 py-2.5 text-sm rounded-2xl gap-2';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        transition-all duration-200
        border-none outline-none select-none
        ${fullWidth ? 'w-full' : ''}
        ${getSizeClass()}
        ${getVariantClass()}
        ${disabled ? 'opacity-50 cursor-not-allowed filter grayscale' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      {children}
    </button>
  );
}
