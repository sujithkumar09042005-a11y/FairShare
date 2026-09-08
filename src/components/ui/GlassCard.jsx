import React from 'react';
import NeuCard from './NeuCard.jsx';

/**
 * GlassCard - Backward compatibility wrapper mapping directly to NeuCard.
 */
export default function GlassCard({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) {
  return (
    <NeuCard
      onClick={onClick}
      hover={hover}
      className={className}
      {...props}
    >
      {children}
    </NeuCard>
  );
}
