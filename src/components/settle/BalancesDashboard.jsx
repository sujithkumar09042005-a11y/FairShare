import React, { useMemo } from 'react';
import MemberChip from '../group/MemberChip.jsx';
import NeuCard from '../ui/NeuCard.jsx';
import { formatCurrency } from '../../utils/currency.js';
import { calculateNetBalances } from '../../utils/settleUpAlgorithm.js';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { ArrowUpRight, ArrowDownLeft, CheckCircle2, PieChart as PieIcon, BarChart3 } from 'lucide-react';

const PIE_COLORS = [
  '#000000', '#2B2644', '#4B5563', '#6B7280',
  '#9CA3AF', '#D1D5DB', '#10B981', '#3B82F6',
];

export default function BalancesDashboard({
  group,
  onNavigateToSettle,
}) {
  const currency = group?.currency || 'INR';
  const members = group?.members || [];
  const expenses = group?.expenses || [];
  const settlements = group?.settlements || [];

  const netBalances = useMemo(() => {
    return calculateNetBalances(members, expenses, settlements);
  }, [members, expenses, settlements]);

  // Compute total paid and total share per member
  const memberStats = useMemo(() => {
    return members.map((m) => {
      const totalPaid = expenses
        .filter((e) => e.paidBy === m.id)
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      let totalShare = 0;
      expenses.forEach((e) => {
        const s = e.splitDetails?.find((d) => d.memberId === m.id);
        if (s) totalShare += Number(s.amount) || 0;
      });

      const net = netBalances[m.id]?.amount || 0;

      return {
        member: m,
        totalPaid,
        totalShare,
        net,
        status: netBalances[m.id]?.status || 'settled',
      };
    });
  }, [members, expenses, netBalances]);

  // Spending by category data for Pie chart
  const categoryData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const cat = e.category || 'General';
      map[cat] = (map[cat] || 0) + (Number(e.amount) || 0);
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [expenses]);

  // Paid vs Share comparison data for Bar chart
  const comparisonData = useMemo(() => {
    return memberStats.map((stat) => ({
      name: stat.member.name.split(' ')[0],
      Paid: stat.totalPaid,
      Share: stat.totalShare,
    }));
  }, [memberStats]);

  return (
    <div className="space-y-6">
      {/* Individual Member Balances Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-medium text-gray-500">
            Member Net Balances
          </h3>
          <button
            onClick={onNavigateToSettle}
            className="text-xs font-semibold text-black hover:underline transition-colors flex items-center gap-1 cursor-pointer"
          >
            Settle Up Debts →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {memberStats.map(({ member, totalPaid, totalShare, net }) => {
            const isCreditor = net > 0;
            const isDebtor = net < 0;
            const isSettled = net === 0;

            return (
              <NeuCard
                key={member.id}
                size="sm"
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <MemberChip member={member} size="sm" />
                    {isCreditor && (
                      <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {isDebtor && (
                      <span className="w-6 h-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {isSettled && (
                      <span className="w-6 h-6 rounded-full bg-black/5 text-gray-500 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Total Paid:</span>
                      <span className="text-black font-medium">
                        {formatCurrency(totalPaid, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Total Consumed:</span>
                      <span className="text-black font-medium">
                        {formatCurrency(totalShare, currency)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F5F5F5] border border-black/[0.06] text-center">
                  <span className="block text-[10px] font-medium tracking-wider text-gray-500">
                    {isCreditor ? 'Gets Back' : isDebtor ? 'Owes' : 'Status'}
                  </span>
                  <span
                    className={`text-base font-semibold ${
                      isCreditor ? 'text-emerald-600' : isDebtor ? 'text-red-600' : 'text-gray-500'
                    }`}
                  >
                    {isSettled
                      ? 'Settled Up'
                      : formatCurrency(Math.abs(net), currency)}
                  </span>
                </div>
              </NeuCard>
            );
          })}
        </div>
      </div>

      {/* Visual Analytics Section */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Category Breakdown Pie Chart */}
          <NeuCard size="md">
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="w-4 h-4 text-black" />
              <h4 className="text-sm font-medium text-black">
                Spending by Category
              </h4>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => formatCurrency(val, currency)}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      color: '#000000',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs text-gray-700">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </NeuCard>

          {/* Paid vs Consumed Comparison Bar Chart */}
          <NeuCard size="md">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-[#2B2644]" />
              <h4 className="text-sm font-medium text-black">
                Paid vs. Consumed per Member
              </h4>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `${val}`}
                  />
                  <Tooltip
                    formatter={(val) => formatCurrency(val, currency)}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      color: '#000000',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    formatter={(value) => (
                      <span className="text-xs text-gray-700">
                        {value}
                      </span>
                    )}
                  />
                  <Bar dataKey="Paid" fill="#000000" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Share" fill="#2B2644" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </NeuCard>
        </div>
      )}
    </div>
  );
}
