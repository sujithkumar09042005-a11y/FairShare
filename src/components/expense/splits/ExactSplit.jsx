import React from 'react';
import MemberChip from '../../group/MemberChip.jsx';
import { formatCurrency, getCurrencySymbol } from '../../../utils/currency.js';
import { calculateExactSplit } from '../../../utils/splitCalculations.js';

export default function ExactSplit({
  members = [],
  amount = 0,
  currency = 'INR',
  memberAmounts = {},
  onChange,
}) {
  const symbol = getCurrencySymbol(currency);

  const handleAmountChange = (memberId, value) => {
    const num = Math.max(0, Number(value) || 0);
    onChange({
      ...memberAmounts,
      [memberId]: num,
    });
  };

  const splitArray = members.map((m) => ({
    memberId: m.id,
    amount: memberAmounts[m.id] ?? 0,
  }));

  const calcResult = calculateExactSplit(amount, splitArray);
  const isValid = calcResult.isValid;
  const difference = calcResult.difference;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
          Exact Amount per Member
        </span>
        <span className="text-xs text-[#6B7280]">
          Total: {formatCurrency(amount, currency)}
        </span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {members.map((m) => {
          const currentVal = memberAmounts[m.id] ?? 0;

          return (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm"
            >
              <MemberChip member={m} size="sm" />

              <div className="relative w-28 neu-input px-2.5 py-1.5 flex items-center">
                <span className="text-xs text-[#6C63FF] font-bold mr-1 select-none">
                  {symbol}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={currentVal === 0 ? '' : currentVal}
                  onChange={(e) => handleAmountChange(m.id, e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-right text-xs text-[#3D4852] font-semibold border-none outline-none"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`flex items-center justify-between p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm text-xs font-semibold transition-colors ${
          isValid ? 'text-[#10B981]' : 'text-[#EF4444]'
        }`}
      >
        <span>
          {isValid
            ? 'Exact amounts match total bill!'
            : difference > 0
            ? `${formatCurrency(difference, currency)} remaining to assign`
            : `${formatCurrency(Math.abs(difference), currency)} over total amount`}
        </span>
        <span className="font-bold text-sm font-display">
          {formatCurrency(calcResult.sumAmount, currency)} / {formatCurrency(amount, currency)}
        </span>
      </div>
    </div>
  );
}
