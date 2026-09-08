import React, { useState } from 'react';
import MemberChip from '../../group/MemberChip.jsx';
import NeuButton from '../../ui/NeuButton.jsx';
import { formatCurrency, getCurrencySymbol } from '../../../utils/currency.js';
import { calculateItemizedSplit } from '../../../utils/splitCalculations.js';
import { Plus, Trash2, ReceiptText } from 'lucide-react';

export default function ItemizedSplit({
  members = [],
  currency = 'INR',
  items = [],
  sharedFee = 0,
  onChangeItems,
  onChangeSharedFee,
  onTotalCalculated,
}) {
  const symbol = getCurrencySymbol(currency);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  const handleAddItem = (e) => {
    e?.preventDefault();
    const name = newItemName.trim();
    const price = Number(newItemPrice) || 0;
    if (!name || price <= 0) return;

    const newItem = {
      id: `it-${crypto.randomUUID()}`,
      name,
      price,
      assignedTo: members.map((m) => m.id),
    };

    const nextItems = [...items, newItem];
    onChangeItems(nextItems);
    setNewItemName('');
    setNewItemPrice('');

    const res = calculateItemizedSplit(nextItems, sharedFee, members.map((m) => m.id));
    if (onTotalCalculated) onTotalCalculated(res.totalAmount);
  };

  const handleRemoveItem = (itemId) => {
    const nextItems = items.filter((it) => it.id !== itemId);
    onChangeItems(nextItems);
    const res = calculateItemizedSplit(nextItems, sharedFee, members.map((m) => m.id));
    if (onTotalCalculated) onTotalCalculated(res.totalAmount);
  };

  const handleToggleAssignee = (itemId, memberId) => {
    const nextItems = items.map((it) => {
      if (it.id !== itemId) return it;
      let nextAssignees = it.assignedTo || [];
      if (nextAssignees.includes(memberId)) {
        if (nextAssignees.length === 1) return it;
        nextAssignees = nextAssignees.filter((id) => id !== memberId);
      } else {
        nextAssignees = [...nextAssignees, memberId];
      }
      return { ...it, assignedTo: nextAssignees };
    });

    onChangeItems(nextItems);
    const res = calculateItemizedSplit(nextItems, sharedFee, members.map((m) => m.id));
    if (onTotalCalculated) onTotalCalculated(res.totalAmount);
  };

  const handleSharedFeeChange = (val) => {
    const fee = Math.max(0, Number(val) || 0);
    onChangeSharedFee(fee);
    const res = calculateItemizedSplit(items, fee, members.map((m) => m.id));
    if (onTotalCalculated) onTotalCalculated(res.totalAmount);
  };

  const memberIds = members.map((m) => m.id);
  const splitResult = calculateItemizedSplit(items, sharedFee, memberIds);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
          <ReceiptText className="w-4 h-4 text-[#6C63FF]" />
          Receipt Line Items ({items.length})
        </span>
        <span className="text-xs text-[#6B7280]">
          Items Subtotal: {formatCurrency(splitResult.itemsTotal, currency)}
        </span>
      </div>

      {/* Add New Line Item Form */}
      <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm space-y-2.5">
        <div className="flex gap-2.5">
          <div className="flex-1 neu-input px-3 py-1.5 flex items-center">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name (e.g. Margherita Pizza)"
              className="w-full bg-transparent text-xs text-[#3D4852] placeholder-[#9CA3AF] border-none outline-none"
            />
          </div>
          <div className="w-28 neu-input px-2.5 py-1.5 flex items-center">
            <span className="text-xs text-[#6C63FF] font-bold mr-1 select-none">
              {symbol}
            </span>
            <input
              type="number"
              step="any"
              min="0"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-xs text-[#3D4852] font-semibold border-none outline-none"
            />
          </div>
          <NeuButton
            type="button"
            variant="primary"
            size="sm"
            onClick={handleAddItem}
            icon={Plus}
          >
            Add
          </NeuButton>
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-extruded-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#3D4852]">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#3D4852] font-display">
                  {formatCurrency(item.price, currency)}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-[#6B7280] hover:text-[#EF4444] p-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-black/5">
              <span className="text-[10px] text-[#6B7280]">Split:</span>
              {members.map((m) => {
                const isAssigned = item.assignedTo?.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleToggleAssignee(item.id, m.id)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                      isAssigned
                        ? 'bg-[#E0E5EC] text-[#6C63FF] shadow-neu-inset-sm font-bold'
                        : 'text-[#9CA3AF] hover:text-[#3D4852]'
                    }`}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Shared Fee (Tax/Tip) Input */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm">
        <span className="text-xs font-semibold text-[#6B7280]">
          Shared Tax / Tip (Split Pro-Rata):
        </span>
        <div className="w-28 neu-input px-2.5 py-1.5 flex items-center">
          <span className="text-xs text-[#6C63FF] font-bold mr-1 select-none">
            {symbol}
          </span>
          <input
            type="number"
            step="any"
            min="0"
            value={sharedFee === 0 ? '' : sharedFee}
            onChange={(e) => handleSharedFeeChange(e.target.value)}
            placeholder="0.00"
            className="w-full bg-transparent text-xs text-[#3D4852] font-semibold border-none outline-none text-right"
          />
        </div>
      </div>
    </div>
  );
}
