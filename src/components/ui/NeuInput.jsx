import React from 'react';

/**
 * NeuInput - Recessed tactile input field with inset dual shadows.
 * Zero borders; seamless focus state.
 */
export default function NeuInput({
  label,
  prefix,
  suffix,
  error,
  helper,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-[#6B7280] tracking-wide ml-1">
          {label}
        </label>
      )}
      <div className={`relative flex items-center neu-input px-3.5 py-2.5 ${className}`}>
        {prefix && (
          <span className="text-sm font-semibold text-[#6B7280] mr-2 select-none flex-shrink-0">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          className="w-full bg-transparent text-[#3D4852] placeholder-[#9CA3AF] text-sm font-medium border-none outline-none focus:ring-0 p-0"
          {...props}
        />
        {suffix && (
          <span className="text-sm font-medium text-[#6B7280] ml-2 select-none flex-shrink-0">
            {suffix}
          </span>
        )}
      </div>
      {error && <span className="text-xs text-[#EF4444] font-medium ml-1">{error}</span>}
      {helper && !error && <span className="text-xs text-[#6B7280] ml-1">{helper}</span>}
    </div>
  );
}
