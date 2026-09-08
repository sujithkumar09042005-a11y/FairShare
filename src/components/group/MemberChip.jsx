import React from 'react';
import { X } from 'lucide-react';

export default function MemberChip({
  member,
  size = 'md',
  onRemove,
  isSelected,
  onClick,
  showName = true,
  subtext,
}) {
  if (!member) return null;

  const initials = member.name
    ? member.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base font-semibold',
  };

  const bgStyle = {
    backgroundColor: member.avatarColor || '#6C63FF',
  };

  return (
    <div
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 rounded-full transition-all border-none
        ${onClick ? 'cursor-pointer' : ''}
        ${
          isSelected !== undefined
            ? isSelected
              ? 'bg-[#E0E5EC] shadow-neu-inset-sm py-1 pl-1.5 pr-3 text-[#6C63FF] font-bold'
              : 'bg-[#E0E5EC] shadow-neu-extruded-sm py-1 pl-1.5 pr-3 opacity-70 hover:opacity-100 text-[#6B7280]'
            : 'bg-[#E0E5EC] shadow-neu-extruded-sm py-1 pl-1.5 pr-3 text-[#3D4852]'
        }
      `}
    >
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-medium shadow-sm flex-shrink-0`}
        style={bgStyle}
      >
        {initials}
      </div>

      {showName && (
        <div className="flex flex-col text-left leading-tight">
          <span className="text-xs sm:text-sm font-medium">
            {member.name}
          </span>
          {subtext && (
            <span className="text-[10px] text-[#6B7280]">
              {subtext}
            </span>
          )}
        </div>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(member.id);
          }}
          className="ml-1 p-0.5 rounded-full hover:text-[#EF4444] text-[#6B7280] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
