import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal.jsx';
import EqualSplit from './splits/EqualSplit.jsx';
import PercentageSplit from './splits/PercentageSplit.jsx';
import ExactSplit from './splits/ExactSplit.jsx';
import ItemizedSplit from './splits/ItemizedSplit.jsx';
import NeuButton from '../ui/NeuButton.jsx';
import { getCurrencySymbol } from '../../utils/currency.js';
import {
  calculateEqualSplit,
  calculatePercentageSplit,
  calculateExactSplit,
  calculateItemizedSplit,
} from '../../utils/splitCalculations.js';
import {
  Utensils,
  Hotel,
  Car,
  Ticket,
  ShoppingBag,
  Zap,
  HelpCircle,
  Calendar,
  UserCheck,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Food', label: 'Food & Dining', icon: Utensils },
  { id: 'Stay', label: 'Accommodation', icon: Hotel },
  { id: 'Travel', label: 'Travel & Gas', icon: Car },
  { id: 'Entertainment', label: 'Activities', icon: Ticket },
  { id: 'Shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'Utilities', label: 'Bills & Utilities', icon: Zap },
  { id: 'Other', label: 'General', icon: HelpCircle },
];

export default function ExpenseModal({
  isOpen,
  onClose,
  group,
  onSave,
  editingExpense = null,
}) {
  const currency = group?.currency || 'INR';
  const symbol = getCurrencySymbol(currency);
  const members = group?.members || [];

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [paidBy, setPaidBy] = useState('');
  const [date, setDate] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [error, setError] = useState('');

  // Split state
  const [equalSelectedIds, setEqualSelectedIds] = useState([]);
  const [percentages, setPercentages] = useState({});
  const [exactAmounts, setExactAmounts] = useState({});
  const [items, setItems] = useState([]);
  const [sharedFee, setSharedFee] = useState(0);

  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description || '');
      setAmount(editingExpense.amount?.toString() || '');
      setCategory(editingExpense.category || 'Food');
      setPaidBy(editingExpense.paidBy || members[0]?.id || '');
      setDate(
        editingExpense.date
          ? new Date(editingExpense.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setSplitType(editingExpense.splitType || 'equal');

      if (editingExpense.splitType === 'equal') {
        setEqualSelectedIds(
          editingExpense.splitDetails?.map((s) => s.memberId) || members.map((m) => m.id)
        );
      } else if (editingExpense.splitType === 'percentage') {
        const perc = {};
        editingExpense.splitDetails?.forEach((s) => {
          const p = Math.round((s.amount / editingExpense.amount) * 1000) / 10;
          perc[s.memberId] = p;
        });
        setPercentages(perc);
      } else if (editingExpense.splitType === 'exact') {
        const exact = {};
        editingExpense.splitDetails?.forEach((s) => {
          exact[s.memberId] = s.amount;
        });
        setExactAmounts(exact);
      } else if (editingExpense.splitType === 'itemized') {
        setItems(editingExpense.items || []);
        setSharedFee(editingExpense.sharedFee || 0);
      }
    } else {
      setDescription('');
      setAmount('');
      setCategory('Food');
      setPaidBy(members[0]?.id || '');
      setDate(new Date().toISOString().split('T')[0]);
      setSplitType('equal');
      setEqualSelectedIds(members.map((m) => m.id));
      setPercentages({});
      setExactAmounts({});
      setItems([]);
      setSharedFee(0);
    }
    setError('');
  }, [editingExpense, isOpen, members]);

  const handleSplitTypeChange = (newType) => {
    setSplitType(newType);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!description.trim()) {
      setError('Please provide an expense description.');
      return;
    }
    if (splitType !== 'itemized' && (!numAmount || numAmount <= 0)) {
      setError('Please enter a valid expense amount greater than zero.');
      return;
    }
    if (!paidBy) {
      setError('Please select who paid for this expense.');
      return;
    }

    let splitDetails = [];
    let finalAmount = numAmount;

    if (splitType === 'equal') {
      if (equalSelectedIds.length === 0) {
        setError('Select at least one member to split the expense with.');
        return;
      }
      splitDetails = calculateEqualSplit(numAmount, equalSelectedIds);
    } else if (splitType === 'percentage') {
      const pArray = members.map((m) => ({
        memberId: m.id,
        percentage: percentages[m.id] || 0,
      }));
      const calc = calculatePercentageSplit(numAmount, pArray);
      if (!calc.isValid) {
        setError(calc.error);
        return;
      }
      splitDetails = calc.splitDetails;
    } else if (splitType === 'exact') {
      const eArray = members.map((m) => ({
        memberId: m.id,
        amount: exactAmounts[m.id] || 0,
      }));
      const calc = calculateExactSplit(numAmount, eArray);
      if (!calc.isValid) {
        setError(calc.error);
        return;
      }
      splitDetails = calc.splitDetails;
    } else if (splitType === 'itemized') {
      if (items.length === 0) {
        setError('Please add at least one line item to the receipt.');
        return;
      }
      const calc = calculateItemizedSplit(items, sharedFee, members.map((m) => m.id));
      finalAmount = calc.totalAmount;
      splitDetails = calc.splitDetails;
    }

    onSave({
      description: description.trim(),
      amount: finalAmount,
      category,
      paidBy,
      date: new Date(date || Date.now()).toISOString(),
      splitType,
      splitDetails,
      ...(splitType === 'itemized' ? { items, sharedFee } : {}),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingExpense ? 'Edit Expense' : 'Add an Expense'}
      subtitle={`Adding to "${group?.name}"`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs font-medium rounded-xl bg-red-50 text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {/* Description & Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">
              Description *
            </label>
            <div className="bg-[#F5F5F5] rounded-xl border border-black/[0.06] px-3.5 py-2.5 flex items-center focus-within:border-black/30 focus-within:bg-white transition-all">
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Expense description (e.g. Dinner, Taxi, Groceries)"
                className="w-full bg-transparent text-sm text-black placeholder-gray-400 border-none outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">
              Total Amount *
            </label>
            <div className="bg-[#F5F5F5] rounded-xl border border-black/[0.06] px-3 py-2.5 flex items-center focus-within:border-black/30 focus-within:bg-white transition-all">
              <span className="text-sm font-semibold text-black mr-1.5 select-none">
                {symbol}
              </span>
              <input
                type="number"
                step="any"
                min="0"
                required={splitType !== 'itemized'}
                disabled={splitType === 'itemized'}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-sm font-semibold text-black border-none outline-none disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
            Category
          </label>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white font-medium shadow-sm'
                      : 'bg-black/5 text-gray-600 hover:text-black hover:bg-black/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paid By and Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-black" />
              Paid By
            </label>
            <div className="glass-select rounded-xl px-3 py-2.5 flex items-center">
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-black border-none outline-none cursor-pointer"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id} className="bg-white text-black">
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-black" />
              Date
            </label>
            <div className="bg-[#F5F5F5] rounded-xl border border-black/[0.06] px-3.5 py-2.5 flex items-center focus-within:border-black/30 focus-within:bg-white transition-all">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-sm text-black border-none outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {/* Split Type Selector Tabs */}
        <div className="pt-2 border-t border-black/5">
          <label className="block text-xs font-medium text-gray-500 mb-2 ml-1">
            Split Method
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 rounded-full bg-black/5">
            {[
              { id: 'equal', label: 'Equal' },
              { id: 'percentage', label: 'Custom %' },
              { id: 'exact', label: 'Exact Amount' },
              { id: 'itemized', label: 'Itemized' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSplitTypeChange(tab.id)}
                className={`py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  splitType === tab.id
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Split Method View */}
        <div className="pt-1">
          {splitType === 'equal' && (
            <EqualSplit
              members={members}
              amount={Number(amount) || 0}
              currency={currency}
              selectedMemberIds={equalSelectedIds}
              onChange={setEqualSelectedIds}
            />
          )}

          {splitType === 'percentage' && (
            <PercentageSplit
              members={members}
              amount={Number(amount) || 0}
              currency={currency}
              memberPercentages={percentages}
              onChange={setPercentages}
            />
          )}

          {splitType === 'exact' && (
            <ExactSplit
              members={members}
              amount={Number(amount) || 0}
              currency={currency}
              memberAmounts={exactAmounts}
              onChange={setExactAmounts}
            />
          )}

          {splitType === 'itemized' && (
            <ItemizedSplit
              members={members}
              currency={currency}
              items={items}
              sharedFee={sharedFee}
              onChangeItems={setItems}
              onChangeSharedFee={setSharedFee}
              onTotalCalculated={(calcTotal) => setAmount(calcTotal.toString())}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse xs:flex-row items-center justify-end gap-2.5 xs:gap-3 pt-4 border-t border-black/5">
          <NeuButton
            type="button"
            variant="neutral"
            size="md"
            onClick={onClose}
          >
            Cancel
          </NeuButton>
          <NeuButton
            type="submit"
            variant="primary"
            size="md"
            arrowBadge={true}
          >
            {editingExpense ? 'Update Expense' : 'Save Expense'}
          </NeuButton>
        </div>
      </form>
    </Modal>
  );
}
