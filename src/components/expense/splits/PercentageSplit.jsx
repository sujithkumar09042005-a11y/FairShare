import React from 'react';
import MemberChip from '../../group/MemberChip.jsx';
import { formatCurrency } from '../../../utils/currency.js';
import { calculatePercentageSplit } from '../../../utils/splitCalculations.js';

export default function PercentageSplit({
  members = [],
  amount = 0,
  currency = 'INR',
  memberPercentages = {},
  onChange,
}) {
  const handlePercentageChange = (memberId, value) => {
    const num = Math.max(0, Math.min(100, Number(value) || 0));
    onChange({
      ...memberPercentages,
      [memberId]: num,
    });
  };

  const splitArray = members.map((m) => ({
    memberId: m.id,
    percentage: memberPercentages[m.id] ?? 0,
  }));

  const calcResult = calculatePercentageSplit(amount, splitArray);
  const totalPercentage = calcResult.sumPercentage;
  const is100 = calcResult.isValid;

  const handleSplitEvenly = () => {
    const n = members.length;
    if (n === 0) return;
    const base = Math.floor((100 / n) * 10) / 10;
    const next = {};
    let sum = 0;
    members.forEach((m, idx) => {
      if (idx === n - 1) {
        next[m.id] = Math.round((100 - sum) * 10) / 10;
      } else {
        next[m.id] = base;
        sum += base;
      }
    });
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
          Custom Percentage Split
        </span>
        <button
          type="button"
          onClick={handleSplitEvenly}
          className="text-xs text-[#6C63FF] hover:underline font-semibold transition-colors cursor-pointer"
        >
          Distribute Evenly
        </button>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {members.map((m) => {
          const currentPercent = memberPercentages[m.id] ?? 0;
          const memberAmount =
            calcResult.splitDetails?.find((s) => s.memberId === m.id)?.amount ??
            (amount * currentPercent) / 100;

          return (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm"
            >
              <MemberChip member={m} size="sm" />

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6B7280] font-medium min-w-[70px] text-right">
                  {formatCurrency(memberAmount, currency)}
                </span>
                <div className="relative w-20 neu-input px-2.5 py-1.5 flex items-center">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    max="100"
                    value={currentPercent === 0 ? '' : currentPercent}
                    onChange={(e) => handlePercentageChange(m.id, e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-right text-xs text-[#3D4852] font-semibold border-none outline-none pr-4"
                  />
                  <span className="absolute right-2 top-2 text-xs text-[#6B7280] font-medium pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`flex items-center justify-between p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm text-xs font-semibold transition-colors ${
          is100 ? 'text-[#10B981]' : 'text-[#EF4444]'
        }`}
      >
        <span>
          {is100
            ? 'Percentages sum to 100%'
            : `Percentages sum to ${totalPercentage.toFixed(1)}% (${(
                100 - totalPercentage
              ).toFixed(1)}% remaining)`}
        </span>
        <span className="font-bold text-sm font-display">
          {totalPercentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
