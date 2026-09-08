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
} from 'lucide-react';

export default function GroupHeader({
  group,
  activeTab,
  onTabChange,
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#3D4852] tracking-tight">
                {group?.name}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E0E5EC] shadow-neu-inset-sm text-[#6C63FF]">
                {currency}
              </span>
            </div>

            {group?.description && (
              <p className="text-sm text-[#6B7280] mb-3 max-w-xl">
                {group.description}
              </p>
            )}

            {/* Member list chips */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs text-[#6B7280] flex items-center gap-1 mr-1">
                <Users className="w-3.5 h-3.5 text-[#6C63FF]" />
                Members:
              </span>
              {members.map((m) => (
                <MemberChip key={m.id} member={m} size="sm" />
              ))}
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-shrink-0">
            {/* Total Spent */}
            <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#6C63FF]" />
                Total Spent
              </div>
              <div className="text-base sm:text-xl font-bold font-display text-[#3D4852]">
                {formatCurrency(totalSpend, currency)}
              </div>
            </div>

            {/* Your Balance */}
            {primaryMember && (
              <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                  <Wallet className="w-3.5 h-3.5 text-[#38B2AC]" />
                  Your Net ({primaryMember.name.split(' ')[0]})
                </div>
                <div
                  className={`text-base sm:text-xl font-bold font-display ${
                    primaryNet > 0
                      ? 'text-[#10B981]'
                      : primaryNet < 0
                      ? 'text-[#EF4444]'
                      : 'text-[#6B7280]'
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
            <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1">
                <HandCoins className="w-3.5 h-3.5 text-[#F59E0B]" />
                Pending Debts
              </div>
              <div className="text-base sm:text-xl font-bold font-display text-[#3D4852]">
                {simplifiedTransactions.length}{' '}
                <span className="text-xs font-normal text-[#6B7280]">transfers</span>
              </div>
            </div>
          </div>
        </div>
      </NeuCard>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 xs:gap-2 p-1 xs:p-1.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset">
        <button
          onClick={() => onTabChange('expenses')}
          className={`flex-1 py-2 xs:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 xs:gap-2 transition-all cursor-pointer ${
            activeTab === 'expenses'
              ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-neu-extruded-sm font-bold'
              : 'text-[#6B7280] hover:text-[#3D4852]'
          }`}
        >
          <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Expenses</span>
          <span className="px-1.5 xs:px-2 py-0.5 rounded-full text-[10px] bg-[#E0E5EC] shadow-neu-inset-sm text-current">
            {expenses.length}
          </span>
        </button>

        <button
          onClick={() => onTabChange('balances')}
          className={`flex-1 py-2 xs:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 xs:gap-2 transition-all cursor-pointer ${
            activeTab === 'balances'
              ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-neu-extruded-sm font-bold'
              : 'text-[#6B7280] hover:text-[#3D4852]'
          }`}
        >
          <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Balances & Charts</span>
          <span className="sm:hidden">Balances</span>
        </button>

        <button
          onClick={() => onTabChange('settle')}
          className={`flex-1 py-2 xs:py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 xs:gap-2 transition-all cursor-pointer ${
            activeTab === 'settle'
              ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-neu-extruded-sm font-bold'
              : 'text-[#6B7280] hover:text-[#3D4852]'
          }`}
        >
          <HandCoins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Settle Up</span>
          {simplifiedTransactions.length > 0 && (
            <span className="px-1.5 xs:px-2 py-0.5 rounded-full text-[10px] bg-[#E0E5EC] shadow-neu-inset-sm text-[#F59E0B] font-bold">
              {simplifiedTransactions.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
