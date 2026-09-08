import React, { useState, useMemo } from 'react';
import NeuCard from '../ui/NeuCard.jsx';
import NeuButton from '../ui/NeuButton.jsx';
import NeuIconWell from '../ui/NeuIconWell.jsx';
import { formatCurrency, getCurrencySymbol, SUPPORTED_CURRENCIES } from '../../utils/currency.js';
import {
  Receipt,
  Users,
  ArrowLeft,
  Share2,
  Check,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';

const AVATAR_COLORS = [
  '#6C63FF', '#38B2AC', '#8B84FF', '#4FD1C5',
  '#EC4899', '#F59E0B', '#10B981', '#6366F1',
];

export default function ItemsSplitService({ onBackToWheel, onSaveToGroup }) {
  const [currency, setCurrency] = useState('INR');
  const [billTitle, setBillTitle] = useState('');
  const [copied, setCopied] = useState(false);

  // People List
  const [people, setPeople] = useState([
    { id: 'p1', name: 'Person 1', avatarColor: '#6C63FF' },
    { id: 'p2', name: 'Person 2', avatarColor: '#38B2AC' },
  ]);
  const [newPersonName, setNewPersonName] = useState('');

  // Tax & Tip percentages
  const [taxPercent, setTaxPercent] = useState('');
  const [tipPercent, setTipPercent] = useState('');

  // Items List
  const [items, setItems] = useState([]);

  // New Item inputs
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemAssigned, setNewItemAssigned] = useState(['p1', 'p2']);


  const symbol = getCurrencySymbol(currency);

  // Add a new person
  const handleAddPerson = (e) => {
    e?.preventDefault();
    const name = newPersonName.trim();
    if (!name) return;
    const newId = `p${Date.now()}`;
    const nextColor = AVATAR_COLORS[people.length % AVATAR_COLORS.length];
    setPeople((prev) => [...prev, { id: newId, name, avatarColor: nextColor }]);
    setNewPersonName('');
  };

  // Remove person
  const handleRemovePerson = (id) => {
    if (people.length <= 2) {
      alert('Keep at least 2 people to split items.');
      return;
    }
    setPeople((prev) => prev.filter((p) => p.id !== id));
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        assignedTo: item.assignedTo.filter((mId) => mId !== id),
      }))
    );
  };

  // Add new item
  const handleAddItem = (e) => {
    e?.preventDefault();
    const name = newItemName.trim() || `Item ${items.length + 1}`;
    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) return;

    const assigned = newItemAssigned.length > 0 ? newItemAssigned : people.map((p) => p.id);

    setItems((prev) => [
      ...prev,
      {
        id: `it${Date.now()}`,
        name,
        price: String(priceNum),
        assignedTo: assigned,
      },
    ]);

    setNewItemName('');
    setNewItemPrice('');
  };

  // Remove an item
  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Toggle person assignment for an item
  const handleToggleAssign = (itemId, personId) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        const exists = it.assignedTo.includes(personId);
        let nextAssigned;
        if (exists) {
          nextAssigned = it.assignedTo.filter((id) => id !== personId);
          if (nextAssigned.length === 0) {
            nextAssigned = [personId];
          }
        } else {
          nextAssigned = [...it.assignedTo, personId];
        }
        return { ...it, assignedTo: nextAssigned };
      })
    );
  };


  // Financial calculations
  const { subtotal, taxAmount, tipAmount, grandTotal, personBreakdowns } = useMemo(() => {
    let sub = 0;
    const personRaw = {};
    people.forEach((p) => {
      personRaw[p.id] = { itemsSubtotal: 0, itemsList: [] };
    });

    items.forEach((item) => {
      const price = parseFloat(item.price) || 0;
      sub += price;
      const assigned = item.assignedTo.filter((id) => people.some((p) => p.id === id));
      const shareCount = assigned.length > 0 ? assigned.length : people.length;
      const perPerson = price / shareCount;

      const targetList = assigned.length > 0 ? assigned : people.map((p) => p.id);
      targetList.forEach((pid) => {
        if (personRaw[pid]) {
          personRaw[pid].itemsSubtotal += perPerson;
          personRaw[pid].itemsList.push({
            name: item.name,
            itemShare: perPerson,
            totalPrice: price,
            sharedWithCount: shareCount,
          });
        }
      });
    });

    const taxRate = (parseFloat(taxPercent) || 0) / 100;
    const tipRate = (parseFloat(tipPercent) || 0) / 100;

    const calculatedTax = sub * taxRate;
    const calculatedTip = sub * tipRate;
    const total = sub + calculatedTax + calculatedTip;

    const breakdowns = people.map((p) => {
      const raw = personRaw[p.id] || { itemsSubtotal: 0, itemsList: [] };
      const proportion = sub > 0 ? raw.itemsSubtotal / sub : 1 / people.length;
      const pTax = calculatedTax * proportion;
      const pTip = calculatedTip * proportion;
      const pTotal = raw.itemsSubtotal + pTax + pTip;

      return {
        id: p.id,
        name: p.name,
        avatarColor: p.avatarColor,
        subtotal: raw.itemsSubtotal,
        tax: pTax,
        tip: pTip,
        total: pTotal,
        items: raw.itemsList,
      };
    });

    return {
      subtotal: sub,
      taxAmount: calculatedTax,
      tipAmount: calculatedTip,
      grandTotal: total,
      personBreakdowns: breakdowns,
    };
  }, [people, items, taxPercent, tipPercent]);

  // Copy breakdown to clipboard
  const handleCopySummary = () => {
    const lines = [
      `🧾 *Itemized Bill: ${billTitle || 'Receipt Split'}*`,
      `Subtotal: ${formatCurrency(subtotal, currency)}`,
      taxAmount > 0 ? `Tax (${taxPercent}%): ${formatCurrency(taxAmount, currency)}` : null,
      tipAmount > 0 ? `Tip (${tipPercent}%): ${formatCurrency(tipAmount, currency)}` : null,
      `*Grand Total: ${formatCurrency(grandTotal, currency)}*\n`,
      '📋 *Individual Breakdown:*',
      ...personBreakdowns.map((p) => {
        const itemLines = p.items
          .map((it) => `   - ${it.name} (${formatCurrency(it.itemShare, currency)})`)
          .join('\n');
        return `• *${p.name}*: ${formatCurrency(p.total, currency)}\n${itemLines}`;
      }),
      `\nSplit accurately via SplitWise Soft UI`,
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Save to Workspace
  const handleSaveToWorkspace = () => {
    if (grandTotal <= 0) return;
    const groupMembers = people.map((p) => ({
      id: p.id,
      name: p.name,
      avatarColor: p.avatarColor,
    }));

    const splitDetails = personBreakdowns.map((p) => ({
      memberId: p.id,
      amount: Math.round(p.total * 100) / 100,
    }));

    const groupData = {
      name: billTitle || 'Items Split Bill',
      description: `Itemized breakdown of ${items.length} dishes totaling ${formatCurrency(grandTotal, currency)}`,
      currency,
      members: groupMembers,
      expenses: [
        {
          id: `exp-${Date.now()}`,
          description: billTitle || 'Itemized Receipt',
          category: 'Food',
          amount: Math.round(grandTotal * 100) / 100,
          paidBy: people[0].id,
          date: new Date().toISOString(),
          splitType: 'exact',
          splitDetails,
        },
      ],
      settlements: [],
    };
    onSaveToGroup(groupData);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-3 xs:py-4 px-2.5 xs:px-4 sm:px-6 animate-zoom-in space-y-4 sm:space-y-6">
      {/* Top Header & Navigation */}
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
          <NeuIconWell icon={Receipt} size="sm" color="teal" />
          <div>
            <h2 className="text-sm sm:text-base font-bold font-display text-[#3D4852] leading-tight">
              Items Split Service
            </h2>
            <p className="text-[10px] sm:text-[11px] text-[#6B7280]">
              Assign individual receipt items, split dishes & proportional tax/tip
            </p>
          </div>
        </div>
      </div>

      {/* Bill Meta Card: Title, Currency, Tax & Tip */}
      <NeuCard className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-1.5 ml-1">
              Receipt / Event Title
            </label>
            <div className="neu-input px-3.5 py-2 flex items-center">
              <input
                type="text"
                value={billTitle}
                onChange={(e) => setBillTitle(e.target.value)}
                placeholder="e.g. Italian Bistro Dinner"
                className="w-full bg-transparent text-sm font-semibold text-[#3D4852] placeholder-[#9CA3AF] border-none outline-none"
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
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5 ml-1">
                Tax %
              </label>
              <div className="neu-input px-2.5 py-2 flex items-center">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                  placeholder="5"
                  className="w-full bg-transparent text-sm font-semibold text-[#3D4852] text-center border-none outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5 ml-1">
                Tip %
              </label>
              <div className="neu-input px-2.5 py-2 flex items-center">
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={tipPercent}
                  onChange={(e) => setTipPercent(e.target.value)}
                  placeholder="10"
                  className="w-full bg-transparent text-sm font-semibold text-[#3D4852] text-center border-none outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Members Management Bar */}
        <div className="pt-3 border-t border-black/5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5 ml-1">
              <Users className="w-3.5 h-3.5 text-[#6C63FF]" />
              Split Participants ({people.length})
            </span>

            {/* Quick Add Person Form */}
            <form onSubmit={handleAddPerson} className="flex items-center gap-2 w-full xs:w-auto">
              <div className="neu-input px-3 py-1 flex items-center flex-1 xs:flex-initial w-full xs:w-36 sm:w-44">
                <input
                  type="text"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  placeholder="+ New member"
                  className="w-full bg-transparent text-xs font-semibold text-[#3D4852] placeholder-[#9CA3AF] border-none outline-none"
                />
              </div>
              <NeuButton type="submit" variant="primary" size="sm">
                Add
              </NeuButton>
            </form>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {people.map((p) => (
              <div
                key={p.id}
                className="inline-flex items-center gap-2 pl-2 pr-3 py-1 rounded-2xl bg-[#E0E5EC] shadow-neu-extruded-sm text-xs font-semibold"
              >
                <div
                  className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                  style={{ backgroundColor: p.avatarColor }}
                >
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[#3D4852]">{p.name}</span>
                {people.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePerson(p.id)}
                    className="text-[#6B7280] hover:text-[#EF4444] transition-colors ml-1 cursor-pointer"
                    title={`Remove ${p.name}`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </NeuCard>

      {/* Item Addition & Item List Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Items Entry & Item List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Add Item Card */}
          <NeuCard size="md" className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5 ml-1">
              <Plus className="w-3.5 h-3.5 text-[#6C63FF]" />
              Add Receipt Item
            </h3>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2.5">
                <div className="xs:col-span-2 neu-input px-3.5 py-2 flex items-center">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Item name (e.g. Pizza)"
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
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="Price"
                    className="w-full bg-transparent text-xs font-bold text-[#3D4852] border-none outline-none"
                  />
                </div>
              </div>

              {/* Assign To Selection Chips */}
              <div>
                <span className="text-[11px] font-semibold text-[#6B7280] block mb-1.5 ml-1">
                  Who ordered or shared this?
                </span>
                <div className="flex flex-wrap gap-2">
                  {people.map((p) => {
                    const isSelected = newItemAssigned.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            if (newItemAssigned.length > 1) {
                              setNewItemAssigned((prev) => prev.filter((id) => id !== p.id));
                            }
                          } else {
                            setNewItemAssigned((prev) => [...prev, p.id]);
                          }
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-neu-inset-sm font-bold'
                            : 'bg-[#E0E5EC] text-[#6B7280] shadow-neu-extruded-sm hover:shadow-neu-extruded hover:text-[#3D4852]'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: p.avatarColor }}
                        />
                        <span>{p.name}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setNewItemAssigned(people.map((p) => p.id))}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#6C63FF] hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <NeuButton
                  type="submit"
                  variant="primary"
                  size="sm"
                >
                  Add Item
                </NeuButton>
              </div>
            </form>
          </NeuCard>

          {/* Current Items List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Receipt Items ({items.length})
              </span>
              <span className="text-xs font-bold text-[#6C63FF]">
                Subtotal: {formatCurrency(subtotal, currency)}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="p-8 text-center bg-[#E0E5EC] rounded-[24px] shadow-neu-inset-sm">
                <Receipt className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2 opacity-70" />
                <p className="text-xs font-medium text-[#6B7280]">
                  No items added yet. Add receipt dishes above!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-extruded-sm hover:shadow-neu-extruded transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#3D4852]">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold font-display text-[#3D4852]">
                          {formatCurrency(parseFloat(item.price) || 0, currency)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-[#6B7280] hover:text-[#EF4444] p-1 rounded-lg transition-colors cursor-pointer"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* People Assignment Pill Toggles */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-black/5">
                      <span className="text-[10px] text-[#6B7280]">Assigned:</span>
                      {people.map((p) => {
                        const isAssigned = item.assignedTo.includes(p.id);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleToggleAssign(item.id, p.id)}
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                              isAssigned
                                ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-neu-inset-sm font-bold'
                                : 'text-[#9CA3AF] hover:text-[#3D4852]'
                            }`}
                          >
                            {p.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Per-Person Breakdown & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <NeuCard size="md" className="space-y-4">
            {/* Header Totals */}
            <div className="pb-3 border-b border-black/5 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                Total Bill Calculation
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold font-display text-[#3D4852]">
                  {formatCurrency(grandTotal, currency)}
                </span>
                <span className="text-xs text-[#6B7280]">
                  {people.length} people
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280] flex items-center justify-between">
                <span>Subtotal: {formatCurrency(subtotal, currency)}</span>
                <span>Tax: {formatCurrency(taxAmount, currency)} • Tip: {formatCurrency(tipAmount, currency)}</span>
              </div>
            </div>

            {/* Individual Shares List */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {personBreakdowns.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: p.avatarColor }}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-[#3D4852]">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-sm font-extrabold font-display text-[#6C63FF]">
                      {formatCurrency(p.total, currency)}
                    </span>
                  </div>

                  <div className="text-[10px] text-[#6B7280] flex justify-between">
                    <span>Items: {formatCurrency(p.subtotal, currency)}</span>
                    <span>Tax & Tip: {formatCurrency(p.tax + p.tip, currency)}</span>
                  </div>

                  {p.items.length > 0 && (
                    <div className="text-[10px] text-[#9CA3AF] line-clamp-1">
                      {p.items.map((it) => it.name).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions: Copy & Save */}
            <div className="pt-2 space-y-2">
              <NeuButton
                variant="neutral"
                size="md"
                fullWidth
                onClick={handleCopySummary}
                icon={copied ? Check : Share2}
              >
                <span>{copied ? 'Copied Breakdown!' : 'Copy Summary'}</span>
              </NeuButton>

              <NeuButton
                variant="primary"
                size="md"
                fullWidth
                onClick={handleSaveToWorkspace}
              >
                <span>Save to Trip Workspace →</span>
              </NeuButton>
            </div>
          </NeuCard>
        </div>
      </div>
    </div>
  );
}
