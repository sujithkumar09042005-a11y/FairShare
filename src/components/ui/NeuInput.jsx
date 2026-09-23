import React from 'react';

/**
 * NeuInput - Minimalist Modern Glassmorphic input field
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
        <label htmlFor={id} className="text-xs font-medium text-slate-700 tracking-tight ml-0.5">
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center bg-white/80 backdrop-blur-md rounded-xl border border-slate-200/80 px-3.5 sm:px-4 py-2.5 transition-all duration-200 focus-within:border-[#0052FF] focus-within:ring-2 focus-within:ring-[#0052FF]/20 shadow-sm ${
          error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20' : ''
        } ${className}`}
      >
        {prefix && (
          <span className="text-sm font-medium text-slate-400 mr-2.5 select-none shrink-0">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm font-medium border-none outline-none focus:ring-0 p-0"
          {...props}
        />
        {suffix && (
          <span className="text-sm font-medium text-slate-400 ml-2.5 select-none shrink-0">
            {suffix}
          </span>
        )}
      </div>
      {error && <span className="text-xs text-red-600 font-medium ml-0.5">{error}</span>}
      {helper && !error && <span className="text-xs text-slate-500 ml-0.5">{helper}</span>}
    </div>
  );
}
