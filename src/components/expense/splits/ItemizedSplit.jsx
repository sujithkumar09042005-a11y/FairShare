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
        <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
          <ReceiptText className="w-4 h-4 text-black" />
          Receipt Line Items ({items.length})
        </span>
        <span className="text-xs text-gray-500">
          Items Subtotal: {formatCurrency(splitResult.itemsTotal, currency)}
        </span>
      </div>

      {/* Add New Line Item Form */}
      <div className="p-3.5 rounded-xl bg-[#F5F5F5] border border-black/[0.06] space-y-2.5">
        <div className="flex gap-2.5">
          <div className="flex-1 bg-white rounded-lg border border-black/[0.06] px-3 py-1.5 flex items-center focus-within:border-black/30">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name (e.g. Margherita Pizza)"
              className="w-full bg-transparent text-xs text-black placeholder-gray-400 border-none outline-none font-medium"
            />
          </div>
          <div className="w-28 bg-white rounded-lg border border-black/[0.06] px-2.5 py-1.5 flex items-center focus-within:border-black/30">
            <span className="text-xs text-black font-semibold mr-1 select-none">
              {symbol}
            </span>
            <input
              type="number"
              step="any"
              min="0"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-xs text-black font-semibold border-none outline-none"
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
            className="p-3.5 rounded-xl bg-white border border-black/[0.06] shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-black">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-black">
                  {formatCurrency(item.price, currency)}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-black/5">
              <span className="text-[10px] text-gray-500">Split:</span>
              {members.map((m) => {
                const isAssigned = item.assignedTo?.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleToggleAssignee(item.id, m.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
                      isAssigned
                        ? 'bg-black text-white'
                        : 'text-gray-400 hover:text-black'
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
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F5F5F5] border border-black/[0.06]">
        <span className="text-xs font-medium text-gray-500">
          Shared Tax / Tip (Split Pro-Rata):
        </span>
        <div className="w-28 bg-white rounded-lg border border-black/[0.06] px-2.5 py-1.5 flex items-center focus-within:border-black/30">
          <span className="text-xs text-black font-semibold mr-1 select-none">
            {symbol}
          </span>
          <input
            type="number"
            step="any"
            min="0"
            value={sharedFee === 0 ? '' : sharedFee}
            onChange={(e) => handleSharedFeeChange(e.target.value)}
            placeholder="0.00"
            className="w-full bg-transparent text-xs text-black font-semibold border-none outline-none text-right"
          />
        </div>
      </div>
    </div>
  );
}
