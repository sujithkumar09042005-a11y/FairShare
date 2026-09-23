import React, { useMemo } from 'react';
import MemberChip from './MemberChip.jsx';
import NeuCard from '../ui/NeuCard.jsx';
import { formatCurrency } from '../../utils/currency.js';
import { calculateNetBalances, simplifyDebts } from '../../utils/settleUpAlgorithm.js';
import {
  Receipt,
  Scale,
  HandCoins,
  TrendingUp,
  Wallet,
  Users,
  Edit,
  Trash2,
} from 'lucide-react';

export default function GroupHeader({
  group,
  activeTab,
  onTabChange,
  onEditGroup,
  onDeleteGroup,
}) {
  const currency = group?.currency || 'INR';
  const members = group?.members || [];
  const expenses = group?.expenses || [];
  const settlements = group?.settlements || [];

  const totalSpend = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const netBalances = useMemo(() => {
    return calculateNetBalances(members, expenses, settlements);
  }, [members, expenses, settlements]);

  const simplifiedTransactions = useMemo(() => {
    return simplifyDebts(netBalances);
  }, [netBalances]);

  // Primary user's balance (first member in group)
  const primaryMember = members[0];
  const primaryNet = primaryMember ? netBalances[primaryMember.id]?.amount || 0 : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <NeuCard className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-black">
                {group?.name}
              </h2>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-black/5 text-black">
                {currency}
              </span>

              {/* Group Action Buttons */}
              <div className="flex items-center gap-1.5 ml-1">
                {onEditGroup && (
                  <button
                    type="button"
                    onClick={() => onEditGroup(group)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200/80 bg-white/80 hover:bg-slate-50 text-slate-600 hover:text-blue-600 text-xs font-medium flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                    title="Edit group details & members"
                  >
                    <Edit className="w-3 h-3 text-slate-500" />
                    <span>Edit</span>
                  </button>
                )}
                {onDeleteGroup && (
                  <button
                    type="button"
                    onClick={() => onDeleteGroup(group)}
                    className="px-2.5 py-1 rounded-lg border border-rose-200/80 bg-rose-50/50 hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-xs font-medium flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                    title="Delete group"
                  >
                    <Trash2 className="w-3 h-3 text-rose-500" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>

            {group?.description && (
              <p className="text-sm text-gray-500 mb-3 max-w-xl">
                {group.description}
              </p>
            )}

            {/* Member list chips */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs text-gray-500 flex items-center gap-1 mr-1">
                <Users className="w-3.5 h-3.5 text-black" />
                Members:
              </span>
              {members.map((m) => (
                <MemberChip key={m.id} member={m} size="sm" />
              ))}
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 flex-shrink-0 w-full lg:w-auto">
            {/* Total Spent */}
            <div className="p-3.5 rounded-xl bg-white/70 border border-white/80 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,82,255,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)]">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#0052FF]" />
                TOTAL SPENT
              </div>
              <div className="text-base sm:text-xl font-bold font-sans text-slate-900">
                {formatCurrency(totalSpend, currency)}
              </div>
            </div>

            {/* Your Balance */}
            {primaryMember && (
              <div className="p-3.5 rounded-xl bg-white/70 border border-white/80 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,82,255,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)]">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 mb-1">
                  <Wallet className="w-3.5 h-3.5 text-[#0052FF]" />
                  YOUR NET ({primaryMember.name.split(' ')[0]})
                </div>
                <div
                  className={`text-base sm:text-xl font-bold font-sans ${
                    primaryNet > 0
                      ? 'text-emerald-600'
                      : primaryNet < 0
                      ? 'text-rose-600'
                      : 'text-slate-500'
                  }`}
                >
                  {primaryNet > 0
                    ? `+${formatCurrency(primaryNet, currency)}`
                    : primaryNet < 0
                    ? `-${formatCurrency(Math.abs(primaryNet), currency)}`
                    : 'Settled'}
                </div>
              </div>
            )}

            {/* Settle Up Action Counter */}
            <div className="p-3.5 rounded-xl bg-white/70 border border-white/80 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,82,255,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] col-span-1 xs:col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 mb-1">
                <HandCoins className="w-3.5 h-3.5 text-[#0052FF]" />
                PENDING DEBTS
              </div>
              <div className="text-base sm:text-xl font-bold font-sans text-slate-900">
                {simplifiedTransactions.length}{' '}
                <span className="text-xs font-normal text-slate-500 font-mono">txs</span>
              </div>
            </div>
          </div>
        </div>
      </NeuCard>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgba(31,38,135,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)]">
        <button
          onClick={() => onTabChange('expenses')}
          className={`flex-1 py-2 xs:py-2.5 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 xs:gap-2 transition-all cursor-pointer ${
            activeTab === 'expenses'
              ? 'bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white shadow-md font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Expenses</span>
          <span className={`px-1.5 xs:px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'expenses' ? 'bg-white/20 text-white' : 'bg-slate-300/60 text-slate-700'}`}>
            {expenses.length}
          </span>
        </button>

        <button
          onClick={() => onTabChange('balances')}
          className={`flex-1 py-2 xs:py-2.5 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 xs:gap-2 transition-all cursor-pointer ${
            activeTab === 'balances'
              ? 'bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white shadow-md font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Balances & Charts</span>
          <span className="sm:hidden">Balances</span>
        </button>

        <button
          onClick={() => onTabChange('settle')}
          className={`flex-1 py-2 xs:py-2.5 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 xs:gap-2 transition-all cursor-pointer ${
            activeTab === 'settle'
              ? 'bg-gradient-to-r from-[#0052FF] to-[#4D7CFF] text-white shadow-md font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HandCoins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Settle Up</span>
          {simplifiedTransactions.length > 0 && (
            <span className={`px-1.5 xs:px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'settle' ? 'bg-white/20 text-white' : 'bg-[#0052FF]/10 text-[#0052FF]'}`}>
              {simplifiedTransactions.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
