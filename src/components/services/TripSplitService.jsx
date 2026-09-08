import React, { useState, useMemo } from 'react';
import NeuCard from '../ui/NeuCard.jsx';
import NeuButton from '../ui/NeuButton.jsx';
import NeuIconWell from '../ui/NeuIconWell.jsx';
import { formatCurrency, getCurrencySymbol, SUPPORTED_CURRENCIES } from '../../utils/currency.js';
import { simplifyDebts } from '../../utils/settleUpAlgorithm.js';
import {
  Plane,
  Users,
  ArrowLeft,
  Share2,
  Check,
  Plus,
  Trash2,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const AVATAR_COLORS = [
  '#6C63FF', '#38B2AC', '#8B84FF', '#4FD1C5',
  '#EC4899', '#F59E0B', '#10B981', '#6366F1',
];

const TRIP_CATEGORIES = [
  'Stay / Hotel',
  'Flights & Travel',
  'Food & Dining',
  'Activities & Fun',
  'Fuel / Taxi',
  'General',
];

export default function TripSplitService({ onBackToWheel, onSaveToGroup }) {
  const [tripName, setTripName] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [tripBudget, setTripBudget] = useState('');
  const [splitMode, setSplitMode] = useState('equal'); // 'equal' | 'items'
  const [copied, setCopied] = useState(false);

  // Unlimited Trip Persons
  const [members, setMembers] = useState([
    { id: 't1', name: 'Person 1', avatarColor: '#6C63FF' },
    { id: 't2', name: 'Person 2', avatarColor: '#38B2AC' },
  ]);
  const [newMemberName, setNewMemberName] = useState('');

  // Equal Mode State
  const [equalSpentTotal, setEqualSpentTotal] = useState('');
  const [equalPayerId, setEqualPayerId] = useState('t1');

  // Items/Expenses Mode State
  const [tripExpenses, setTripExpenses] = useState([]);

  // New Expense Inputs for Items Mode
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpCategory, setNewExpCategory] = useState(TRIP_CATEGORIES[0]);
  const [newExpPayer, setNewExpPayer] = useState('t1');
  const [newExpSplit, setNewExpSplit] = useState(['t1', 't2']);

  const symbol = getCurrencySymbol(currency);
  const budgetNum = Math.max(0, parseFloat(tripBudget) || 0);

  // Add Member
  const handleAddMember = (e) => {
    e?.preventDefault();
    const name = newMemberName.trim();
    if (!name) return;
    const newId = `t${Date.now()}`;
    const nextColor = AVATAR_COLORS[members.length % AVATAR_COLORS.length];
    const newMem = { id: newId, name, avatarColor: nextColor };
    setMembers((prev) => [...prev, newMem]);
    setNewExpSplit((prev) => [...prev, newId]);
    setNewMemberName('');
  };

  // Remove Member
  const handleRemoveMember = (id) => {
    if (members.length <= 2) {
      alert('Keep at least 2 members for the trip split.');
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (equalPayerId === id) {
      const remaining = members.filter((m) => m.id !== id);
      setEqualPayerId(remaining[0]?.id || '');
    }
    setTripExpenses((prev) =>
      prev.map((exp) => ({
        ...exp,
        paidBy: exp.paidBy === id ? members.find((m) => m.id !== id)?.id || '' : exp.paidBy,
        splitBetween: exp.splitBetween.filter((mId) => mId !== id),
      }))
    );
  };

  // Add Trip Expense (Items Mode)
  const handleAddTripExpense = (e) => {
    e?.preventDefault();
    const title = newExpTitle.trim() || `Expense ${tripExpenses.length + 1}`;
    const amountNum = parseFloat(newExpAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const split = newExpSplit.length > 0 ? newExpSplit : members.map((m) => m.id);

    setTripExpenses((prev) => [
      ...prev,
      {
        id: `te${Date.now()}`,
        title,
        amount: String(amountNum),
        category: newExpCategory,
        paidBy: newExpPayer || members[0].id,
        splitBetween: split,
      },
    ]);

    setNewExpTitle('');
    setNewExpAmount('');
  };

  const handleRemoveTripExpense = (id) => {
    setTripExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  // Financial calculations
  const { totalSpent, perPersonShare, simplifiedTransactions } = useMemo(() => {
    const balances = {};
    members.forEach((m) => {
      balances[m.id] = 0;
    });

    let spent = 0;

    if (splitMode === 'equal') {
      spent = Math.max(0, parseFloat(equalSpentTotal) || 0);
      const share = members.length > 0 ? spent / members.length : 0;

      if (balances[equalPayerId] !== undefined) {
        balances[equalPayerId] += spent;
      }
      members.forEach((m) => {
        balances[m.id] -= share;
      });

      const balancesInCents = {};
      Object.entries(balances).forEach(([k, v]) => {
        balancesInCents[k] = Math.round(v * 100);
      });
      const simplified = simplifyDebts(balancesInCents);
      return {
        totalSpent: spent,
        perPersonShare: share,
        simplifiedTransactions: simplified,
      };
    } else {
      // Items Split Mode
      tripExpenses.forEach((exp) => {
        const amt = parseFloat(exp.amount) || 0;
        spent += amt;

        if (balances[exp.paidBy] !== undefined) {
          balances[exp.paidBy] += amt;
        }

        const validSplit = exp.splitBetween.filter((id) => members.some((m) => m.id === id));
        const participants = validSplit.length > 0 ? validSplit : members.map((m) => m.id);
        const splitCost = amt / participants.length;

        participants.forEach((pid) => {
          if (balances[pid] !== undefined) {
            balances[pid] -= splitCost;
          }
        });
      });

      const avgShare = members.length > 0 ? spent / members.length : 0;
      const balancesInCents = {};
      Object.entries(balances).forEach(([k, v]) => {
        balancesInCents[k] = Math.round(v * 100);
      });
      const simplified = simplifyDebts(balancesInCents);
      return {
        totalSpent: spent,
        perPersonShare: avgShare,
        simplifiedTransactions: simplified,
      };
    }
  }, [splitMode, equalSpentTotal, equalPayerId, tripExpenses, members]);

  const percentOfBudget = budgetNum > 0 ? Math.min(100, Math.round((totalSpent / budgetNum) * 100)) : 0;
  const isOverBudget = budgetNum > 0 && totalSpent > budgetNum;

  // Copy Summary
  const handleCopySummary = () => {
    const lines = [
      `✈️ *Trip Split: ${tripName || 'Vacation'}*`,
      budgetNum > 0 ? `Budget: ${formatCurrency(budgetNum, currency)}` : null,
      `Total Spent: ${formatCurrency(totalSpent, currency)} (${splitMode.toUpperCase()} SPLIT)`,
      `Trip Crew: ${members.map((m) => m.name).join(', ')}\n`,
      '🤝 *Simplified Settlements (Who Pays Whom):*',
      simplifiedTransactions.length > 0
        ? simplifiedTransactions
            .map((s) => {
              const fromName = members.find((m) => m.id === s.fromMemberId)?.name || s.fromMemberId;
              const toName = members.find((m) => m.id === s.toMemberId)?.name || s.toMemberId;
              return `• ${fromName} pays ${toName}: ${formatCurrency(s.amount, currency)}`;
            })
            .join('\n')
        : '• All settled up! No debts pending.',
      `\nSplit effortlessly via SplitWise Soft UI`,
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Launch into Full Workspace
  const handleLaunchTripWorkspace = () => {
    let expensesList = [];

    if (splitMode === 'equal') {
      const splitDetails = members.map((m) => ({
        memberId: m.id,
        amount: Math.round((totalSpent / members.length) * 100) / 100,
      }));

      expensesList = [
        {
          id: `exp-${Date.now()}`,
          description: `${tripName} (Equal Trip Total)`,
          category: 'General',
          amount: totalSpent,
          paidBy: equalPayerId,
          date: new Date().toISOString(),
          splitType: 'equal',
          splitDetails,
        },
      ];
    } else {
      expensesList = tripExpenses.map((exp, idx) => {
        const amt = parseFloat(exp.amount) || 0;
        const validSplit = exp.splitBetween.filter((id) => members.some((m) => m.id === id));
        const participants = validSplit.length > 0 ? validSplit : members.map((m) => m.id);
        const splitCost = amt / participants.length;

        const splitDetails = participants.map((pid) => ({
          memberId: pid,
          amount: Math.round(splitCost * 100) / 100,
        }));

        return {
          id: `exp-${Date.now()}-${idx}`,
          description: exp.title,
          category: exp.category,
          amount: amt,
          paidBy: exp.paidBy,
          date: new Date().toISOString(),
          splitType: 'exact',
          splitDetails,
        };
      });
    }

    const groupData = {
      name: tripName || 'Trip Split Group',
      description: `Trip split with ${members.length} members. Budget: ${formatCurrency(budgetNum, currency)}`,
      currency,
      members,
      expenses: expensesList,
      settlements: [],
    };

    onSaveToGroup(groupData);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-3 xs:py-4 px-2.5 xs:px-4 sm:px-6 animate-zoom-in space-y-4 sm:space-y-6">
      {/* Header & Back to Wheel */}
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onBackToWheel}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#E0E5EC] shadow-neu-extruded-sm hover:shadow-neu-extruded active:shadow-neu-pressed text-xs font-semibold text-[#3D4852] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6C63FF]" />
          <span>Back to Wheel</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <NeuIconWell icon={Plane} size="sm" color="violet" />
          <div>
            <h2 className="text-sm sm:text-base font-bold font-display text-[#3D4852] leading-tight">
              Trip Split Service
            </h2>
            <p className="text-[10px] sm:text-[11px] text-[#6B7280]">
              Whole-trip budget, unlimited friends, and simplified settlements
            </p>
          </div>
        </div>
      </div>

      {/* Trip Meta & Budget Meter Card */}
      <NeuCard className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1.5 ml-1">
              Trip / Vacation Name
            </label>
            <div className="neu-input px-3.5 py-2 flex items-center">
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Trip name (e.g. Vacation, Road Trip)"
                className="w-full bg-transparent text-sm font-semibold text-[#3D4852] placeholder-[#9CA3AF] border-none outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1.5 ml-1">
              Trip Budget ({symbol})
            </label>
            <div className="neu-input px-3.5 py-2 flex items-center">
              <input
                type="number"
                step="any"
                min="0"
                value={tripBudget}
                onChange={(e) => setTripBudget(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full bg-transparent text-sm font-bold font-display text-[#3D4852] border-none outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1.5 ml-1">
              Currency
            </label>
            <div className="neu-input px-3 py-2 flex items-center">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-[#3D4852] border-none outline-none cursor-pointer"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#E0E5EC] text-[#3D4852]">
                    {c.symbol} {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Budget Progress Meter (Recessed Inset Well) */}
        <div className="p-4 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#3D4852] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#6C63FF]" />
              Budget Tracking: {formatCurrency(totalSpent, currency)} spent of {formatCurrency(budgetNum, currency)}
            </span>
            <span
              className={`font-bold ${
                isOverBudget ? 'text-[#EF4444]' : 'text-[#6C63FF]'
              }`}
            >
              {isOverBudget
                ? `Exceeded by ${formatCurrency(totalSpent - budgetNum, currency)}!`
                : `${budgetNum > 0 ? Math.round(((budgetNum - totalSpent) / budgetNum) * 100) : 0}% remaining`}
            </span>
          </div>

          {/* Meter Bar */}
          <div className="w-full h-3 rounded-full bg-[#E0E5EC] shadow-neu-inset-sm p-0.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isOverBudget
                  ? 'bg-[#EF4444]'
                  : 'bg-gradient-to-r from-[#6C63FF] to-[#38B2AC]'
              }`}
              style={{ width: `${Math.min(100, percentOfBudget)}%` }}
            />
          </div>
        </div>

        {/* Trip Participants (Unlimited Members) */}
        <div className="pt-3 border-t border-black/5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5 ml-1">
              <Users className="w-3.5 h-3.5 text-[#6C63FF]" />
              Trip Crew ({members.length} people)
            </span>

            {/* Quick Add Member */}
            <form onSubmit={handleAddMember} className="flex items-center gap-2 w-full xs:w-auto">
              <div className="neu-input px-3 py-1 flex items-center flex-1 xs:flex-initial w-full xs:w-36 sm:w-44">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="+ Add trip friend"
                  className="w-full bg-transparent text-xs font-semibold text-[#3D4852] placeholder-[#9CA3AF] border-none outline-none"
                />
              </div>
              <NeuButton type="submit" variant="primary" size="sm">
                Add
              </NeuButton>
            </form>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {members.map((m) => (
              <div
                key={m.id}
                className="inline-flex items-center gap-2 pl-2 pr-3 py-1 rounded-2xl bg-[#E0E5EC] shadow-neu-extruded-sm text-xs font-semibold"
              >
                <div
                  className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                  style={{ backgroundColor: m.avatarColor }}
                >
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[#3D4852]">{m.name}</span>
                {members.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(m.id)}
                    className="text-[#6B7280] hover:text-[#EF4444] transition-colors ml-1 cursor-pointer"
                    title={`Remove ${m.name}`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </NeuCard>

      {/* Split Mode Selector Toggle */}
      <div className="flex items-center justify-center w-full">
        <div className="p-1.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset flex flex-col xs:flex-row items-center gap-1.5 xs:gap-2 w-full max-w-md">
          <button
            type="button"
            onClick={() => setSplitMode('equal')}
            className={`flex-1 w-full xs:w-auto px-3 xs:px-4 py-2 xs:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
              splitMode === 'equal'
                ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-neu-extruded-sm font-extrabold'
                : 'text-[#6B7280] hover:text-[#3D4852]'
            }`}
          >
            <span className="xs:hidden">Equal Trip Split</span>
            <span className="hidden xs:inline">Option A: Equal Trip Split</span>
          </button>
          <button
            type="button"
            onClick={() => setSplitMode('items')}
            className={`flex-1 w-full xs:w-auto px-3 xs:px-4 py-2 xs:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
              splitMode === 'items'
                ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-neu-extruded-sm font-extrabold'
                : 'text-[#6B7280] hover:text-[#3D4852]'
            }`}
          >
            <span className="xs:hidden">Items / Categorized</span>
            <span className="hidden xs:inline">Option B: Items / Categorized</span>
          </button>
        </div>
      </div>

      {/* Split View Content */}
      {splitMode === 'equal' ? (
        /* EQUAL SPLIT MODE */
        <NeuCard className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1.5 ml-1">
                Total Money Spent in Trip *
              </label>
              <div className="neu-input px-4 py-2 flex items-center">
                <span className="text-xl font-bold text-[#6C63FF] mr-2 select-none font-display">
                  {symbol}
                </span>
                <input
                  type="number"
                  step="any"
                  min="1"
                  value={equalSpentTotal}
                  onChange={(e) => setEqualSpentTotal(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-2xl font-bold font-display text-[#3D4852] border-none outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1.5 ml-1">
                Who Paid for the Trip Upfront?
              </label>
              <div className="neu-input px-3 py-2 flex items-center">
                <select
                  value={equalPayerId}
                  onChange={(e) => setEqualPayerId(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-[#3D4852] border-none outline-none cursor-pointer"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#E0E5EC] text-[#3D4852]">
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[28px] bg-[#E0E5EC] shadow-neu-inset flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6C63FF] block mb-1 font-sans">
                Equal Share Per Person
              </span>
              <div className="text-3xl font-extrabold font-display text-[#3D4852]">
                {formatCurrency(perPersonShare, currency)}
              </div>
              <span className="text-[11px] text-[#6B7280]">
                Split equally among {members.length} trip friends
              </span>
            </div>

            <div className="text-right text-xs font-semibold text-[#6B7280]">
              Primary Payer:{' '}
              <span className="font-bold text-[#6C63FF]">
                {members.find((m) => m.id === equalPayerId)?.name}
              </span>
            </div>
          </div>
        </NeuCard>
      ) : (
        /* ITEMS SPLIT MODE */
        <div className="space-y-4">
          <NeuCard size="md" className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5 ml-1">
              <Plus className="w-3.5 h-3.5 text-[#6C63FF]" />
              Add Trip Expense Item
            </h3>

            <form onSubmit={handleAddTripExpense} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div className="sm:col-span-2 neu-input px-3.5 py-2 flex items-center">
                  <input
                    type="text"
                    value={newExpTitle}
                    onChange={(e) => setNewExpTitle(e.target.value)}
                    placeholder="Expense (e.g. Villa Booking)"
                    className="w-full bg-transparent text-xs font-semibold text-[#3D4852] placeholder-[#9CA3AF] border-none outline-none"
                  />
                </div>

                <div className="neu-input px-3 py-2 flex items-center">
                  <span className="text-xs font-bold text-[#6C63FF] mr-1.5 select-none">
                    {symbol}
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full bg-transparent text-xs font-bold text-[#3D4852] border-none outline-none"
                  />
                </div>

                <div className="neu-input px-3 py-2 flex items-center">
                  <select
                    value={newExpCategory}
                    onChange={(e) => setNewExpCategory(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#3D4852] border-none outline-none cursor-pointer"
                  >
                    {TRIP_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#E0E5EC] text-[#3D4852]">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Paid By & Split With */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-[11px] font-semibold text-[#6B7280] block mb-1.5 ml-1">
                    Who paid for this?
                  </span>
                  <div className="neu-input px-3 py-1.5 flex items-center">
                    <select
                      value={newExpPayer}
                      onChange={(e) => setNewExpPayer(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-[#3D4852] border-none outline-none cursor-pointer"
                    >
                      {members.map((m) => (
                        <option key={m.id} value={m.id} className="bg-[#E0E5EC] text-[#3D4852]">
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#6B7280] block mb-1.5 ml-1">
                    Split among who?
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {members.map((m) => {
                      const isSelected = newExpSplit.includes(m.id);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              if (newExpSplit.length > 1) {
                                setNewExpSplit((prev) => prev.filter((id) => id !== m.id));
                              }
                            } else {
                              setNewExpSplit((prev) => [...prev, m.id]);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-neu-inset-sm font-bold'
                              : 'bg-[#E0E5EC] text-[#6B7280] shadow-neu-extruded-sm hover:shadow-neu-extruded'
                          }`}
                        >
                          {m.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <NeuButton
                  type="submit"
                  variant="primary"
                  size="sm"
                >
                  Add Trip Expense
                </NeuButton>
              </div>
            </form>
          </NeuCard>

          {/* List of Trip Expenses */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] block px-1">
              Logged Trip Expenses ({tripExpenses.length})
            </span>
            {tripExpenses.length === 0 ? (
              <div className="p-8 text-center bg-[#E0E5EC] rounded-[24px] shadow-neu-inset-sm">
                <Plane className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2 opacity-70" />
                <p className="text-xs font-medium text-[#6B7280]">
                  No trip expenses logged yet. Add your first expense above!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {tripExpenses.map((exp) => {
                const payerName = members.find((m) => m.id === exp.paidBy)?.name || 'Someone';
                return (
                  <div
                    key={exp.id}
                    className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-extruded-sm hover:shadow-neu-extruded transition-all flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#3D4852]">
                          {exp.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E0E5EC] shadow-neu-inset-sm text-[#6C63FF] font-semibold">
                          {exp.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">
                        Paid by <strong className="text-[#3D4852]">{payerName}</strong> • Split with {exp.splitBetween.length} people
                      </p>
                    </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold font-display text-[#3D4852]">
                          {formatCurrency(parseFloat(exp.amount) || 0, currency)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTripExpense(exp.id)}
                          className="text-[#6B7280] hover:text-[#EF4444] p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Simplified Debt Settlements Card */}
      <NeuCard className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold font-display text-[#3D4852] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6C63FF]" />
              Simplified Settlement Plan
            </h3>
            <p className="text-[11px] text-[#6B7280]">
              Minimizes transactions so everyone settles in the fewest payments possible
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E0E5EC] shadow-neu-inset-sm text-[#6C63FF]">
            {simplifiedTransactions.length} payment{simplifiedTransactions.length === 1 ? '' : 's'} needed
          </span>
        </div>

        {simplifiedTransactions.length === 0 ? (
          <div className="p-6 text-center rounded-[24px] bg-[#E0E5EC] shadow-neu-inset-sm">
            <Check className="w-6 h-6 text-[#10B981] mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-[#3D4852]">
              All balances are zero! Nobody owes anything.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {simplifiedTransactions.map((s, idx) => {
              const fromMember = members.find((m) => m.id === s.fromMemberId);
              const toMember = members.find((m) => m.id === s.toMemberId);
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: fromMember?.avatarColor || '#6C63FF' }}
                    >
                      {fromMember?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-[#3D4852]">
                      {fromMember?.name}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6B7280]" />
                    <div
                      className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: toMember?.avatarColor || '#38B2AC' }}
                    >
                      {toMember?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-[#3D4852]">
                      {toMember?.name}
                    </span>
                  </div>

                  <span className="text-xs font-extrabold font-display text-[#10B981]">
                    {formatCurrency(s.amount, currency)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
          <NeuButton
            variant="neutral"
            size="md"
            onClick={handleCopySummary}
            icon={copied ? Check : Share2}
            className="w-full sm:w-auto text-center"
          >
            <span>{copied ? 'Copied Settlement Plan!' : 'Share WhatsApp Summary'}</span>
          </NeuButton>

          <NeuButton
            variant="primary"
            size="md"
            onClick={handleLaunchTripWorkspace}
            className="w-full sm:w-auto text-center"
          >
            <span>Launch Full Trip Workspace →</span>
          </NeuButton>
        </div>
      </NeuCard>
    </div>
  );
}
