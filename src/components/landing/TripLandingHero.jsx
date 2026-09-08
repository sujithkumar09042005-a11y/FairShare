import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard.jsx';
import MemberChip from '../group/MemberChip.jsx';
import CircularThemeWheel from '../theme/CircularThemeWheel.jsx';
import { formatCurrency, getCurrencySymbol, SUPPORTED_CURRENCIES } from '../../utils/currency.js';
import {
  Calculator,
  Users,
  Sparkles,
  ArrowRight,
  Plane,
  Hotel,
  Utensils,
  Car,
  Ticket,
  CheckCircle,
} from 'lucide-react';

const DEFAULT_AVATAR_COLORS = [
  '#10b981', '#3b82f6', '#ec4899', '#8b5cf6',
  '#f59e0b', '#06b6d4', '#f43f5e', '#14b8a6',
];

export default function TripLandingHero({
  onLaunchTripWorkspace,
  onOpenExistingGroup,
  existingGroups = [],
}) {
  const [tripName, setTripName] = useState('Goa Beach Vacation 🌴');
  const [totalAmount, setTotalAmount] = useState('48000');
  const [currency, setCurrency] = useState('INR');
  const [peopleCount, setPeopleCount] = useState(4);
  const [tripDays, setTripDays] = useState(4);

  // Dynamic member names
  const [members, setMembers] = useState([
    { id: 'p1', name: 'Rahul Sharma', color: '#10b981' },
    { id: 'p2', name: 'Priya Nair', color: '#ec4899' },
    { id: 'p3', name: 'Amit Verma', color: '#3b82f6' },
    { id: 'p4', name: 'Sneha Rao', color: '#8b5cf6' },
  ]);

  // Budget breakdown percentages
  const [budgetBreakdown, setBudgetBreakdown] = useState({
    stay: 40,   // Stay
    food: 25,   // Food
    travel: 20, // Travel
    activities: 15, // Fun
  });

  const [calculationResult, setCalculationResult] = useState(null);

  const symbol = getCurrencySymbol(currency);

  const handlePeopleChange = (newCount) => {
    const count = Math.max(2, Math.min(16, newCount));
    setPeopleCount(count);

    // Adjust members array length
    setMembers((prev) => {
      if (count > prev.length) {
        const added = [];
        for (let i = prev.length; i < count; i++) {
          added.push({
            id: `p${i + 1}`,
            name: `Person ${i + 1}`,
            color: DEFAULT_AVATAR_COLORS[i % DEFAULT_AVATAR_COLORS.length],
          });
        }
        return [...prev, ...added];
      } else {
        return prev.slice(0, count);
      }
    });
    setCalculationResult(null);
  };

  const handleMemberNameChange = (index, name) => {
    setMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], name };
      return next;
    });
  };

  const handleCalculate = (e) => {
    e?.preventDefault();
    const amountNum = Number(totalAmount) || 0;
    if (amountNum <= 0) return;

    const perPerson = Math.round((amountNum / peopleCount) * 100) / 100;
    const perPersonPerDay = tripDays > 0 ? Math.round((perPerson / tripDays) * 100) / 100 : perPerson;

    // Compute category amounts
    const categories = [
      { name: 'Accommodation / Stay', amount: Math.round(amountNum * (budgetBreakdown.stay / 100)), icon: Hotel, color: '#3b82f6' },
      { name: 'Food & Dining', amount: Math.round(amountNum * (budgetBreakdown.food / 100)), icon: Utensils, color: '#ec4899' },
      { name: 'Travel & Gas', amount: Math.round(amountNum * (budgetBreakdown.travel / 100)), icon: Car, color: '#10b981' },
      { name: 'Activities & Events', amount: Math.round(amountNum * (budgetBreakdown.activities / 100)), icon: Ticket, color: '#8b5cf6' },
    ];

    setCalculationResult({
      totalAmount: amountNum,
      peopleCount,
      perPerson,
      perPersonPerDay,
      tripDays,
      categories,
    });
  };

  const handleCreateAndLaunchWorkspace = () => {
    const amountNum = Number(totalAmount) || 0;

    // Prepare group object for context
    const initialExpenses = calculationResult?.categories.map((cat, i) => ({
      id: `init-exp-${i}-${Date.now()}`,
      description: `${tripName} - ${cat.name}`,
      amount: cat.amount,
      category: cat.name.includes('Stay') ? 'Stay' : cat.name.includes('Food') ? 'Food' : cat.name.includes('Travel') ? 'Travel' : 'Entertainment',
      paidBy: members[i % members.length].id,
      date: new Date().toISOString(),
      splitType: 'equal',
      splitDetails: members.map((m) => ({
        memberId: m.id,
        amount: Math.round((cat.amount / members.length) * 100) / 100,
      })),
    })) || [];

    const newGroupData = {
      name: tripName.trim() || 'My Trip',
      description: `${peopleCount} people • ${tripDays} days trip calculation`,
      currency,
      members: members.map((m) => ({
        id: m.id,
        name: m.name.trim() || 'Guest',
        avatarColor: m.color,
      })),
      expenses: initialExpenses,
      settlements: [],
    };

    onLaunchTripWorkspace(newGroupData);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="text-center max-w-3xl mx-auto pt-2 pb-1">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Whole-Trip Budget Calculator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight mb-3">
          Split Bills & Settle Debts for the{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Whole Trip
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Enter your trip amount, customize your travel crew, calculate per-person shares instantly, and manage full settlement ledgers with zero math friction.
        </p>
      </div>

      {/* Main Input Form Card with 20% Glassmorphism */}
      <GlassCard className="max-w-4xl mx-auto p-6 sm:p-8 border border-white/20 dark:border-white/10 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-10 left-1/4 right-1/4 h-24 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleCalculate} className="space-y-6 relative z-10">
          {/* Row 1: Trip Name & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Trip or Group Name *
              </label>
              <div className="relative">
                <Plane className="w-4 h-4 absolute left-3.5 top-3 text-emerald-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="e.g. Manali Road Trip, Thailand Vacation, Apartment 402"
                  className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full glass-input px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Total Amount & People Counter & Days */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Amount */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Total Trip Amount / Budget *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-base font-bold text-emerald-400 pointer-events-none font-display">
                  {symbol}
                </span>
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full glass-input pl-9 pr-4 py-2.5 rounded-xl text-base font-bold text-slate-900 dark:text-slate-100 font-display"
                />
              </div>
            </div>

            {/* How Many People */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  How Many People?
                </span>
                <span className="font-bold text-emerald-400">{peopleCount}</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePeopleChange(peopleCount - 1)}
                  className="w-10 h-10 rounded-xl glass-pill hover:border-emerald-500/40 text-base font-bold flex items-center justify-center active:scale-95 text-slate-900 dark:text-white"
                >
                  -
                </button>
                <div className="flex-1 text-center font-bold font-display text-lg py-1.5 rounded-xl glass-panel">
                  {peopleCount} <span className="text-xs font-normal text-slate-400">people</span>
                </div>
                <button
                  type="button"
                  onClick={() => handlePeopleChange(peopleCount + 1)}
                  className="w-10 h-10 rounded-xl glass-pill hover:border-emerald-500/40 text-base font-bold flex items-center justify-center active:scale-95 text-slate-900 dark:text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Trip Duration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Duration (Days)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={tripDays}
                  onChange={(e) => setTripDays(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 pointer-events-none">
                  days
                </span>
              </div>
            </div>
          </div>

          {/* Row 3: Member Name Customizer */}
          <div className="pt-2 border-t border-black/5 dark:border-white/10">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Who is Going? Name Your Crew ({members.length})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {members.map((m, idx) => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-black/[0.03] dark:bg-black/20 border border-black/5 dark:border-white/10"
                >
                  <div
                    className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <input
                    type="text"
                    value={m.name}
                    onChange={(e) => handleMemberNameChange(idx, e.target.value)}
                    placeholder={`Person ${idx + 1}`}
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-black/5 dark:border-white/10">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
            >
              <Calculator className="w-4 h-4" />
              Calculate for Whole Trip
            </button>

            {existingGroups.length > 0 && (
              <button
                type="button"
                onClick={onOpenExistingGroup}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-400 transition-colors"
              >
                Or continue managing saved trips ({existingGroups.length}) →
              </button>
            )}
          </div>
        </form>

        {/* Dynamic Calculation Results Drawer */}
        {calculationResult && (
          <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/15 animate-in fade-in zoom-in-95 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Trip */}
              <div className="p-4 rounded-2xl bg-black/[0.04] dark:bg-black/30 border border-black/5 dark:border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Whole Trip Total
                </span>
                <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
                  {formatCurrency(calculationResult.totalAmount, currency)}
                </span>
              </div>

              {/* Per Person Share */}
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  Each Person Pays
                </span>
                <span className="text-2xl font-extrabold font-display text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(calculationResult.perPerson, currency)}
                </span>
              </div>

              {/* Per Person / Day */}
              <div className="p-4 rounded-2xl bg-black/[0.04] dark:bg-black/30 border border-black/5 dark:border-white/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Per Person / Day ({calculationResult.tripDays} days)
                </span>
                <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
                  {formatCurrency(calculationResult.perPersonPerDay, currency)}
                </span>
              </div>
            </div>

            {/* Estimated Budget Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Estimated Category Allocation
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {calculationResult.categories.map((cat, i) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-black/[0.03] dark:bg-black/20 border border-black/5 dark:border-white/10 flex items-center gap-3"
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: cat.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                          {cat.name}
                        </span>
                        <span className="text-sm font-bold font-display text-slate-900 dark:text-white">
                          {formatCurrency(cat.amount, currency)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Launch Workspace CTA */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Calculation Ready!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Launch the full trip workspace with your {peopleCount} members to add expenses, itemized bills, and run greedy debt settlement.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCreateAndLaunchWorkspace}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 active:scale-95 flex-shrink-0"
              >
                <span>Launch Full Trip Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </GlassCard>

      {/* 360 Degree Circular Scrolling Theme Menu Section */}
      <div className="max-w-4xl mx-auto">
        <CircularThemeWheel />
      </div>
    </div>
  );
}
