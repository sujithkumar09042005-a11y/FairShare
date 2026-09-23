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
        <span className="text-xs font-medium text-gray-500">
          Custom Percentage Split
        </span>
        <button
          type="button"
          onClick={handleSplitEvenly}
          className="text-xs text-black hover:underline font-semibold transition-colors cursor-pointer"
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
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F5F5F5] border border-black/[0.06]"
            >
              <MemberChip member={m} size="sm" />

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium min-w-[70px] text-right">
                  {formatCurrency(memberAmount, currency)}
                </span>
                <div className="relative w-20 bg-white rounded-lg border border-black/[0.06] px-2.5 py-1.5 flex items-center focus-within:border-black/30">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    max="100"
                    value={currentPercent === 0 ? '' : currentPercent}
                    onChange={(e) => handlePercentageChange(m.id, e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-right text-xs text-black font-semibold border-none outline-none pr-4"
                  />
                  <span className="absolute right-2 top-1.5 text-xs text-gray-400 font-medium pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`flex items-center justify-between p-3.5 rounded-xl text-xs font-medium border transition-colors ${
          is100
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}
      >
        <span>
          {is100
            ? 'Percentages sum to 100%'
            : `Percentages sum to ${totalPercentage.toFixed(1)}% (${(
                100 - totalPercentage
              ).toFixed(1)}% remaining)`}
        </span>
        <span className="font-semibold text-sm">
          {totalPercentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
