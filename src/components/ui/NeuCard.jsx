import React from 'react';

/**
 * NeuCard - Tactile Neumorphic container molded from the #E0E5EC canvas.
 * Zero hard borders; depth is sculpted entirely by dual light/dark opposing shadows.
 *
 * @param {('extruded'|'inset'|'flat')} variant
 * @param {boolean} hover - whether to elevate shadows on hover
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
  const getShadowClass = () => {
    if (variant === 'inset') {
      return size === 'sm' ? 'neu-well-sm' : 'neu-well';
    }
    if (variant === 'flat') {
      return '';
    }
    // Extruded
    if (size === 'sm') {
      return hover ? 'neu-card-sm cursor-pointer' : 'shadow-neu-extruded-sm';
    }
    return hover ? 'neu-card cursor-pointer' : 'neu-card';
  };

  const getRadiusClass = () => {
    if (size === 'sm') return 'rounded-2xl p-4';
    if (size === 'md') return 'rounded-3xl p-6';
    return 'rounded-[32px] p-6 sm:p-8';
  };

  return (
    <Component
      onClick={onClick}
      className={`
        bg-[#E0E5EC]
        text-[#3D4852]
        border-none
        transition-all duration-300
        ${getRadiusClass()}
        ${getShadowClass()}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
}
