import React from 'react';
import MemberChip from '../../group/MemberChip.jsx';
import { formatCurrency } from '../../../utils/currency.js';
import { calculateEqualSplit } from '../../../utils/splitCalculations.js';

export default function EqualSplit({
  members = [],
  amount = 0,
  currency = 'INR',
  selectedMemberIds = [],
  onChange,
}) {
  const toggleMember = (memberId) => {
    let next;
    if (selectedMemberIds.includes(memberId)) {
      if (selectedMemberIds.length === 1) return; // Must keep at least one
      next = selectedMemberIds.filter((id) => id !== memberId);
    } else {
      next = [...selectedMemberIds, memberId];
    }
    onChange(next);
  };

  const selectAll = () => {
    onChange(members.map((m) => m.id));
  };

  const splitResult = calculateEqualSplit(amount, selectedMemberIds);
  const perPersonAmount = splitResult[0]?.amount || 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">
          Split Equally Among ({selectedMemberIds.length}/{members.length})
        </span>
        <button
          type="button"
          onClick={selectAll}
          className="text-xs text-black hover:underline font-semibold transition-colors cursor-pointer"
        >
          Select All
        </button>
      </div>

      <div className="flex flex-wrap gap-2.5 p-3 rounded-xl bg-[#F5F5F5] border border-black/[0.06]">
        {members.map((m) => {
          const isSelected = selectedMemberIds.includes(m.id);
          const memberShare = splitResult.find((s) => s.memberId === m.id)?.amount;

          return (
            <MemberChip
              key={m.id}
              member={m}
              isSelected={isSelected}
              onClick={() => toggleMember(m.id)}
              subtext={isSelected ? formatCurrency(memberShare || 0, currency) : 'Excluded'}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F5F5F5] border border-black/[0.06] text-xs text-black">
        <span className="text-gray-500">Share per person:</span>
        <span className="text-sm font-semibold text-black">
          ~{formatCurrency(perPersonAmount, currency)}
        </span>
      </div>
    </div>
  );
}
