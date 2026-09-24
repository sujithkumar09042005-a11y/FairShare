import React, { useState, useMemo } from 'react';
import ExpenseCard from './ExpenseCard.jsx';
import NeuCard from '../ui/NeuCard.jsx';
import NeuButton from '../ui/NeuButton.jsx';
import NeuIconWell from '../ui/NeuIconWell.jsx';
import { formatCurrency } from '../../utils/currency.js';
import { Search, PlusCircle, Receipt } from 'lucide-react';

export default function ExpenseList({
  expenses = [],
  members = [],
  currency = 'INR',
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [memberFilter, setMemberFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((exp) => {
        if (
          searchTerm &&
          !exp.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
        if (categoryFilter !== 'ALL' && exp.category !== categoryFilter) {
          return false;
        }
        if (memberFilter !== 'ALL') {
          const isPayer = exp.paidBy === memberFilter;
          const isInSplit = exp.splitDetails?.some(
            (s) => s.memberId === memberFilter && s.amount > 0
          );
          if (!isPayer && !isInSplit) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [expenses, searchTerm, categoryFilter, memberFilter, sortBy]);

  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [filteredExpenses]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls Bar */}
      <div className="bg-white/70 backdrop-blur-2xl p-4 rounded-2xl border border-white/80 shadow-[0_8px_32px_rgba(31,38,135,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1 bg-white/60 rounded-xl border border-white/70 px-3.5 py-2 flex items-center focus-within:border-[#0052FF]/50 focus-within:bg-white/90 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all">
            <Search className="w-4 h-4 text-gray-400 mr-2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search expenses by title..."
              className="w-full bg-transparent text-xs sm:text-sm text-black placeholder-gray-400 border-none outline-none font-medium"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Category */}
            <div className="glass-select rounded-xl px-3 py-1.5 flex items-center">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-xs font-medium text-black border-none outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-white text-black">All Categories</option>
                <option value="Food" className="bg-white text-black">Food & Dining</option>
                <option value="Stay" className="bg-white text-black">Accommodation</option>
                <option value="Travel" className="bg-white text-black">Travel & Gas</option>
                <option value="Entertainment" className="bg-white text-black">Activities</option>
                <option value="Shopping" className="bg-white text-black">Shopping</option>
                <option value="Utilities" className="bg-white text-black">Utilities</option>
                <option value="Other" className="bg-white text-black">Other</option>
              </select>
            </div>

            {/* Member Filter */}
            <div className="glass-select rounded-xl px-3 py-1.5 flex items-center">
              <select
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
                className="bg-transparent text-xs font-medium text-black border-none outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-white text-black">All Members</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id} className="bg-white text-black">
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="glass-select rounded-xl px-3 py-1.5 flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-medium text-black border-none outline-none cursor-pointer"
              >
                <option value="date-desc" className="bg-white text-black">Newest First</option>
                <option value="date-asc" className="bg-white text-black">Oldest First</option>
                <option value="amount-desc" className="bg-white text-black">Highest Amount</option>
                <option value="amount-asc" className="bg-white text-black">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status header */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/60 text-xs text-gray-500">
          <span>
            Showing <strong className="text-black">{filteredExpenses.length}</strong> of{' '}
            {expenses.length} expenses
          </span>
          <span>
            Total:{' '}
            <strong className="text-black font-semibold text-sm">
              {formatCurrency(totalFilteredAmount, currency)}
            </strong>
          </span>
        </div>
      </div>

      {/* Expense List */}
      {filteredExpenses.length === 0 ? (
        <NeuCard className="p-10 text-center space-y-3">
          <NeuIconWell icon={Receipt} size="lg" color="violet" className="mx-auto" />
          <h3 className="text-base font-semibold text-[#3D4852]">
            No expenses found
          </h3>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
            {searchTerm || categoryFilter !== 'ALL' || memberFilter !== 'ALL'
              ? 'Try adjusting your search query or filters to find what you are looking for.'
              : 'Add your first group expense to start splitting bills effortlessly.'}
          </p>
          <div className="pt-2">
            <NeuButton
              variant="primary"
              size="md"
              onClick={onAddExpense}
              icon={PlusCircle}
            >
              Add First Expense
            </NeuButton>
          </div>
        </NeuCard>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((exp) => (
            <ExpenseCard
              key={exp.id}
              expense={exp}
              members={members}
              currency={currency}
              onEdit={onEditExpense}
              onDelete={onDeleteExpense}
            />
          ))}
        </div>
      )}
    </div>
  );
}
