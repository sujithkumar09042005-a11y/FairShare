import React, { useState, useMemo } from 'react';
import MemberChip from '../group/MemberChip.jsx';
import NeuCard from '../ui/NeuCard.jsx';
import NeuButton from '../ui/NeuButton.jsx';
import NeuIconWell from '../ui/NeuIconWell.jsx';
import { formatCurrency } from '../../utils/currency.js';
import { calculateNetBalances, simplifyDebts } from '../../utils/settleUpAlgorithm.js';
import { triggerSettlementCelebration } from '../../utils/confetti.js';
import {
  ArrowRight,
  CheckCircle,
  Share2,
  Sparkles,
  History,
  Trash2,
  Check,
} from 'lucide-react';

export default function SettleUpView({
  group,
  onRecordSettlement,
  onDeleteSettlement,
}) {
  const currency = group?.currency || 'INR';
  const members = group?.members || [];
  const expenses = group?.expenses || [];
  const settlements = group?.settlements || [];

  const [copied, setCopied] = useState(false);

  const membersMap = useMemo(() => {
    const map = {};
    members.forEach((m) => {
      map[m.id] = m;
    });
    return map;
  }, [members]);

  const netBalances = useMemo(() => {
    return calculateNetBalances(members, expenses, settlements);
  }, [members, expenses, settlements]);

  const simplifiedTransactions = useMemo(() => {
    return simplifyDebts(netBalances);
  }, [netBalances]);

  const handleSettleTransaction = (tx) => {
    triggerSettlementCelebration();
    onRecordSettlement({
      fromMemberId: tx.fromMemberId,
      toMemberId: tx.toMemberId,
      amount: tx.amount,
      note: `Settlement: ${membersMap[tx.fromMemberId]?.name} to ${membersMap[tx.toMemberId]?.name}`,
    });
  };

  const handleCopyShareSummary = () => {
    if (simplifiedTransactions.length === 0) {
      navigator.clipboard.writeText(`🎉 Everyone is fully settled up in "${group?.name}"!`);
    } else {
      const lines = [
        `📊 *${group?.name} — Debt Settlement Summary*`,
        `Generated via SplitWise Soft UI\n`,
        ...simplifiedTransactions.map(
          (tx, i) =>
            `${i + 1}. *${membersMap[tx.fromMemberId]?.name}* pays *${membersMap[tx.toMemberId]?.name}*: ${formatCurrency(tx.amount, currency)}`
        ),
        `\n✨ All debts simplified to ${simplifiedTransactions.length} transaction${
          simplifiedTransactions.length > 1 ? 's' : ''
        }.`,
      ];
      navigator.clipboard.writeText(lines.join('\n'));
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Algorithm Info Banner */}
      <div className="bg-[#E0E5EC] p-5 rounded-[24px] shadow-neu-extruded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <NeuIconWell icon={Sparkles} size="md" color="violet" />
          <div>
            <h4 className="text-sm font-bold text-[#3D4852]">
              Smart Debt Simplification
            </h4>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Greedy minimum cash flow algorithm matches biggest debtors with biggest creditors,
              reducing redundant cross-payments into the fewest possible transfers.
            </p>
          </div>
        </div>

        <NeuButton
          variant="neutral"
          size="sm"
          onClick={handleCopyShareSummary}
          icon={copied ? Check : Share2}
          className="flex-shrink-0"
        >
          <span>{copied ? 'Copied!' : 'Share Summary'}</span>
        </NeuButton>
      </div>

      {/* Suggested Simplified Transactions */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-3 px-1">
          Recommended Payments ({simplifiedTransactions.length})
        </h3>

        {simplifiedTransactions.length === 0 ? (
          <NeuCard className="p-10 text-center">
            <NeuIconWell icon={CheckCircle} size="lg" color="success" className="mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#3D4852] mb-1">
              All Settled Up!
            </h3>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
              No outstanding balances in this group. Everyone is even!
            </p>
          </NeuCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {simplifiedTransactions.map((tx) => {
              const fromMember = membersMap[tx.fromMemberId];
              const toMember = membersMap[tx.toMemberId];

              return (
                <NeuCard
                  key={tx.id}
                  size="sm"
                  className="flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {/* Payer (Debtor) */}
                    <div className="flex items-center gap-2 min-w-0">
                      <MemberChip member={fromMember} size="sm" />
                    </div>

                    <div className="flex flex-col items-center flex-shrink-0 px-2">
                      <span className="text-[10px] text-[#6B7280] uppercase font-semibold">
                        pays
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#6C63FF]" />
                    </div>

                    {/* Receiver (Creditor) */}
                    <div className="flex items-center gap-2 min-w-0">
                      <MemberChip member={toMember} size="sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-black/5">
                    <div>
                      <span className="text-[10px] text-[#6B7280] uppercase font-semibold block">
                        Amount to Settle
                      </span>
                      <span className="text-lg font-bold text-[#10B981] font-display">
                        {formatCurrency(tx.amount, currency)}
                      </span>
                    </div>

                    <NeuButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleSettleTransaction(tx)}
                      icon={CheckCircle}
                    >
                      Mark as Paid
                    </NeuButton>
                  </div>
                </NeuCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Settlement History Log */}
      {settlements.length > 0 && (
        <div className="pt-4 border-t border-black/5">
          <div className="flex items-center gap-2 mb-3 px-1">
            <History className="w-4 h-4 text-[#6B7280]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Settlement Activity History ({settlements.length})
            </h3>
          </div>

          <div className="space-y-2">
            {settlements.map((set) => {
              const fromM = membersMap[set.fromMemberId];
              const toM = membersMap[set.toMemberId];
              const dateStr = new Date(set.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={set.id}
                  className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#3D4852]">
                      {fromM?.name || 'Someone'}
                    </span>
                    <span className="text-[#6B7280]">paid</span>
                    <span className="font-semibold text-[#3D4852]">
                      {toM?.name || 'Someone'}
                    </span>
                    <span className="font-bold text-[#10B981] font-display">
                      {formatCurrency(set.amount, currency)}
                    </span>
                    <span className="text-[#9CA3AF]">• {dateStr}</span>
                  </div>

                  <button
                    onClick={() => onDeleteSettlement(set.id)}
                    className="p-1 text-[#6B7280] hover:text-[#EF4444] transition-colors cursor-pointer"
                    title="Undo / Delete Settlement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
