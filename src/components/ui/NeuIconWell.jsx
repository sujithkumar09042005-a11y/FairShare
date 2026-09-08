import React from 'react';

/**
 * NeuIconWell - Tactile circular or squircle container for icons.
 * Can be recessed (inset well) or elevated (extruded).
 */
export default function NeuIconWell({
  icon: Icon,
  variant = 'extruded',
  size = 'md',
  color = 'violet',
  shape = 'circle',
  className = '',
  children,
}) {
  const getShadow = () => {
    if (variant === 'inset') {
      return size === 'sm' ? 'neu-well-sm' : 'neu-well';
    }
    return size === 'sm' ? 'shadow-neu-extruded-sm' : 'neu-card-sm';
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-14 h-14';
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
        return 'w-7 h-7';
      case 'md':
      default:
        return 'w-5 h-5';
    }
  };

  const getColor = () => {
    switch (color) {
      case 'violet':
        return 'text-[#6C63FF]';
      case 'teal':
        return 'text-[#38B2AC]';
      case 'danger':
        return 'text-[#EF4444]';
      case 'success':
        return 'text-[#10B981]';
      case 'neutral':
      default:
        return 'text-[#3D4852]';
    }
  };

  return (
    <div
      className={`
        bg-[#E0E5EC]
        flex items-center justify-center flex-shrink-0
        ${shape === 'circle' ? 'rounded-full' : 'rounded-2xl'}
        ${getSize()}
        ${getShadow()}
        ${getColor()}
        ${className}
      `}
    >
      {Icon && <Icon className={getIconSize()} />}
      {children}
    </div>
  );
}
