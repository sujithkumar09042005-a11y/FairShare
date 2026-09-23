import React, { useState } from 'react';
import MemberChip from '../group/MemberChip.jsx';
import NeuIconWell from '../ui/NeuIconWell.jsx';
import { formatCurrency } from '../../utils/currency.js';
import {
  Utensils,
  Hotel,
  Car,
  Ticket,
  ShoppingBag,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
} from 'lucide-react';

const CATEGORY_ICONS = {
  Food: Utensils,
  Stay: Hotel,
  Travel: Car,
  Entertainment: Ticket,
  Shopping: ShoppingBag,
  Utilities: Zap,
  Other: HelpCircle,
};

export default function ExpenseCard({
  expense,
  members = [],
  currency = 'INR',
  onEdit,
  onDelete,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const payer = members.find((m) => m.id === expense.paidBy);
  const Icon = CATEGORY_ICONS[expense.category] || HelpCircle;

  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white/75 backdrop-blur-2xl rounded-2xl p-4 border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-[0_12px_32px_rgba(0,82,255,0.08),inset_0_1px_1px_rgba(255,255,255,1)] hover:border-blue-500/25 transition-all duration-200">
      <div className="flex items-start justify-between gap-2.5 sm:gap-3">
        {/* Left: Icon & Description */}
        <div className="flex items-start gap-2.5 sm:gap-3.5 flex-1 min-w-0">
          <NeuIconWell icon={Icon} size="md" color="default" shape="squircle" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap xs:flex-nowrap">
              <h3 className="text-sm sm:text-base font-semibold text-black truncate">
                {expense.description}
              </h3>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/5 text-black flex-shrink-0">
                {expense.splitType || 'Equal'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 text-xs text-gray-500">
              <span>{formattedDate}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span>Paid by</span>
                <span className="font-semibold text-black">
                  {payer?.name || 'Someone'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Total Amount & Actions */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="text-base sm:text-lg font-semibold tracking-tight text-black">
            {formatCurrency(expense.amount, currency)}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(expense)}
              className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 text-gray-500 hover:text-black flex items-center justify-center transition-all cursor-pointer"
              title="Edit Expense"
              aria-label="Edit Expense"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(expense.id)}
              className="w-7 h-7 rounded-full bg-black/5 hover:bg-red-50 text-gray-500 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer"
              title="Delete Expense"
              aria-label="Delete Expense"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 text-gray-500 hover:text-black flex items-center justify-center transition-all cursor-pointer"
              title="View Split Details"
              aria-label="View Split Details"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Split Breakdown Drawer */}
      {isExpanded && (
        <div className="mt-3.5 pt-3 border-t border-black/5 animate-in fade-in duration-200 space-y-2">
          <span className="text-[11px] font-medium text-gray-500">
            Split Breakdown
          </span>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2">
            {expense.splitDetails?.map((split) => {
              const member = members.find((m) => m.id === split.memberId);
              const isPayer = split.memberId === expense.paidBy;

              return (
                <div
                  key={split.memberId}
                  className="p-2.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <MemberChip member={member} size="sm" showName={false} />
                    <span className="text-xs text-black font-medium truncate">
                      {member?.name || 'Member'}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isPayer ? 'text-emerald-600' : 'text-black'
                    }`}
                  >
                    {formatCurrency(split.amount, currency)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* If itemized, show items list */}
          {expense.splitType === 'itemized' && expense.items?.length > 0 && (
            <div className="mt-2 pt-2 border-t border-black/5 text-xs text-[#6B7280] space-y-1">
              <span className="font-semibold block text-[11px] text-[#3D4852]">
                Itemized Dishes / Bills:
              </span>
              {expense.items.map((it) => (
                <div key={it.id} className="flex justify-between pl-1">
                  <span>{it.name}</span>
                  <span className="font-medium text-[#3D4852]">
                    {formatCurrency(it.price, currency)}
                  </span>
                </div>
              ))}
              {expense.sharedFee > 0 && (
                <div className="flex justify-between pl-1 text-[#6C63FF]">
                  <span>Shared Tax / Tip</span>
                  <span>+{formatCurrency(expense.sharedFee, currency)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
