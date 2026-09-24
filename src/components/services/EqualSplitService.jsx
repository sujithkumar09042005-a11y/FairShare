import React, { useState } from 'react';
import NeuCard from '../ui/NeuCard.jsx';
import NeuButton from '../ui/NeuButton.jsx';
import NeuInput from '../ui/NeuInput.jsx';
import NeuIconWell from '../ui/NeuIconWell.jsx';
import { formatCurrency, getCurrencySymbol, SUPPORTED_CURRENCIES } from '../../utils/currency.js';
import { calculateEqualSplit } from '../../utils/splitCalculations.js';
import {
  Scale,
  Users,
  ArrowLeft,
  Share2,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const AVATAR_COLORS = [
  '#6C63FF', '#38B2AC', '#8B84FF', '#4FD1C5',
  '#EC4899', '#F59E0B', '#10B981', '#6366F1',
];

export default function EqualSplitService({ onBackToWheel, onSaveToGroup }) {
  const [totalAmount, setTotalAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [description, setDescription] = useState('');
  const [peopleCount, setPeopleCount] = useState(2);
  const [copied, setCopied] = useState(false);

  const [members, setMembers] = useState([
    { id: 'm1', name: 'Person 1', avatarColor: '#6C63FF' },
    { id: 'm2', name: 'Person 2', avatarColor: '#38B2AC' },
  ]);


  const symbol = getCurrencySymbol(currency);

  const handlePeopleChange = (newCount) => {
    const count = Math.max(2, Math.min(20, newCount));
    setPeopleCount(count);

    setMembers((prev) => {
      if (count > prev.length) {
        const added = [];
        for (let i = prev.length; i < count; i++) {
          added.push({
            id: `m${i + 1}`,
            name: `Person ${i + 1}`,
            avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
          });
        }
        return [...prev, ...added];
      } else {
        return prev.slice(0, count);
      }
    });
  };

  const handleMemberNameChange = (index, name) => {
    setMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], name };
      return next;
    });
  };

  const amountNum = Math.max(0, Number(totalAmount) || 0);
  const memberIds = members.map((m) => m.id);
  const splitDetails = calculateEqualSplit(amountNum, memberIds);
  const perPersonAmount = splitDetails[0]?.amount || 0;

  const handleCopySummary = () => {
    const lines = [
      `⚖️ *${description || 'Equal Bill Split'}*`,
      `Total: ${formatCurrency(amountNum, currency)} (${peopleCount} people)\n`,
      ...members.map((m) => {
        const share = splitDetails.find((s) => s.memberId === m.id)?.amount || perPersonAmount;
        return `• ${m.name}: ${formatCurrency(share, currency)}`;
      }),
      `\nSplit fairly via FairShare Soft UI`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveAndLaunch = () => {
    if (amountNum <= 0) return;
    const groupData = {
      name: description || 'Equal Split Group',
      description: `Equal split of ${formatCurrency(amountNum, currency)} among ${peopleCount} people`,
      currency,
      members,
      expenses: [
        {
          id: `exp-${Date.now()}`,
          description: description || 'Shared Bill',
          category: 'Food',
          amount: amountNum,
          paidBy: members[0].id,
          date: new Date().toISOString(),
          splitType: 'equal',
          splitDetails,
        },
      ],
      settlements: [],
    };
    onSaveToGroup(groupData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-3 xs:py-4 px-2.5 xs:px-4 sm:px-6 animate-zoom-in">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <button
          type="button"
          onClick={onBackToWheel}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/5 hover:bg-black/10 text-xs font-medium text-black transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <NeuIconWell icon={Scale} size="sm" color="default" />
          <div>
            <h2 className="text-base sm:text-lg font-medium tracking-tight text-black leading-tight">
              Equal Split Service
            </h2>
            <p className="text-[11px] text-gray-500">
              Divide total bills evenly with integer-cent accuracy
            </p>
          </div>
        </div>
      </div>

      {/* Main Equal Split Interactive Card */}
      <NeuCard className="space-y-5 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Bill Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
              Bill / Expense Description
            </label>
            <div className="bg-[#F5F5F5] rounded-xl border border-black/[0.06] px-3.5 py-2.5 flex items-center focus-within:border-black/30 focus-within:bg-white transition-all">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Dinner, Rent, Uber Ride"
                className="w-full bg-transparent text-sm font-medium text-black placeholder-gray-400 border-none outline-none"
              />
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
              Currency
            </label>
            <div className="glass-select rounded-xl px-3 py-2.5 flex items-center">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-black border-none outline-none cursor-pointer"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-white text-black">
                    {c.symbol} {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Amount & People Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-2 sm:pt-4">
          {/* Total Bill Amount */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
              Total Bill Amount *
            </label>
            <div className="bg-[#F5F5F5] rounded-xl border border-black/[0.06] px-4 py-2.5 flex items-center focus-within:border-black/30 focus-within:bg-white transition-all">
              <span className="text-xl font-medium text-black mr-2 select-none">
                {symbol}
              </span>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-2xl font-medium tracking-tight text-black border-none outline-none placeholder-gray-400"
              />
            </div>
          </div>

          {/* Number of Persons */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-black" />
                Number of People
              </span>
              <span className="font-semibold text-black">{peopleCount} persons</span>
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handlePeopleChange(peopleCount - 1)}
                className="w-11 h-11 rounded-full bg-black/5 hover:bg-black/10 text-lg font-medium text-black flex items-center justify-center transition-all cursor-pointer"
                aria-label="Decrease person count"
              >
                -
              </button>
              <div className="flex-1 text-center font-medium text-xl py-2.5 rounded-xl bg-[#F5F5F5] border border-black/[0.06] text-black">
                {peopleCount}
              </div>
              <button
                type="button"
                onClick={() => handlePeopleChange(peopleCount + 1)}
                className="w-11 h-11 rounded-full bg-black/5 hover:bg-black/10 text-lg font-medium text-black flex items-center justify-center transition-all cursor-pointer"
                aria-label="Increase person count"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Member Name Customizer */}
        <div className="pt-2 sm:pt-4">
          <label className="block text-xs font-medium text-gray-500 mb-2.5 ml-1">
            Customize People Names ({members.length})
          </label>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-h-48 overflow-y-auto pr-1">
            {members.map((m, idx) => (
              <div
                key={m.id}
                className="flex items-center gap-2 p-2 rounded-xl bg-[#F5F5F5] border border-black/[0.06]"
              >
                <div
                  className="w-7 h-7 rounded-full text-white text-xs font-semibold flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: m.avatarColor }}
                >
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <input
                  type="text"
                  value={m.name}
                  onChange={(e) => handleMemberNameChange(idx, e.target.value)}
                  placeholder={`Person ${idx + 1}`}
                  className="w-full bg-transparent text-xs font-medium text-black focus:outline-none placeholder-gray-400 border-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Live Calculation Results Box - Deep Accent Card */}
        <div className="p-5 sm:p-7 rounded-2xl bg-[#2B2644] text-white shadow-[0_8px_32px_rgba(43,38,68,0.15)] flex flex-col sm:flex-row items-center justify-between gap-5 mt-4">
          <div className="text-center sm:text-left">
            <span className="text-xs uppercase tracking-wider text-white/60 block mb-1 font-medium">
              Calculated Share Per Person
            </span>
            <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              {formatCurrency(perPersonAmount, currency)}
            </div>
            <span className="text-xs text-white/70 mt-1 block">
              Total {formatCurrency(amountNum, currency)} divided among {peopleCount} people exactly
            </span>
          </div>

          <div className="flex flex-col xs:flex-row items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopySummary}
              className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <NeuButton
              variant="secondary"
              size="md"
              onClick={handleSaveAndLaunch}
              arrowBadge={true}
              className="w-full xs:w-auto flex-1 sm:flex-initial"
            >
              <span>Settle In Workspace</span>
            </NeuButton>
          </div>
        </div>
      </NeuCard>
    </div>
  );
}
