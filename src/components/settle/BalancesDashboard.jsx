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
  '#6C63FF', '#38B2AC', '#8B84FF', '#4FD1C5',
  '#EC4899', '#F59E0B', '#10B981', '#6366F1',
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            Member Net Balances
          </h3>
          <button
            onClick={onNavigateToSettle}
            className="text-xs font-semibold text-[#6C63FF] hover:underline transition-colors flex items-center gap-1 cursor-pointer"
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
                      <span className="w-6 h-6 rounded-full bg-[#E0E5EC] shadow-neu-inset-sm text-[#10B981] flex items-center justify-center">
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {isDebtor && (
                      <span className="w-6 h-6 rounded-full bg-[#E0E5EC] shadow-neu-inset-sm text-[#EF4444] flex items-center justify-center">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {isSettled && (
                      <span className="w-6 h-6 rounded-full bg-[#E0E5EC] shadow-neu-inset-sm text-[#6B7280] flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-xs text-[#6B7280]">
                      <span>Total Paid:</span>
                      <span className="text-[#3D4852] font-medium">
                        {formatCurrency(totalPaid, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-[#6B7280]">
                      <span>Total Consumed:</span>
                      <span className="text-[#3D4852] font-medium">
                        {formatCurrency(totalShare, currency)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#E0E5EC] shadow-neu-inset-sm text-center">
                  <span className="block text-[10px] uppercase font-semibold tracking-wider text-[#6B7280]">
                    {isCreditor ? 'Gets Back' : isDebtor ? 'Owes' : 'Status'}
                  </span>
                  <span
                    className={`text-base font-bold font-display ${
                      isCreditor ? 'text-[#10B981]' : isDebtor ? 'text-[#EF4444]' : 'text-[#6B7280]'
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
              <PieIcon className="w-4 h-4 text-[#6C63FF]" />
              <h4 className="text-sm font-bold text-[#3D4852]">
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
                      backgroundColor: '#E0E5EC',
                      borderRadius: '16px',
                      border: 'none',
                      boxShadow: '6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.6)',
                      color: '#3D4852',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs text-[#3D4852]">
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
              <BarChart3 className="w-4 h-4 text-[#38B2AC]" />
              <h4 className="text-sm font-bold text-[#3D4852]">
                Paid vs. Consumed per Member
              </h4>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    stroke="#6B7280"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `${val}`}
                  />
                  <Tooltip
                    formatter={(val) => formatCurrency(val, currency)}
                    contentStyle={{
                      backgroundColor: '#E0E5EC',
                      borderRadius: '16px',
                      border: 'none',
                      boxShadow: '6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.6)',
                      color: '#3D4852',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    formatter={(value) => (
                      <span className="text-xs text-[#3D4852]">
                        {value}
                      </span>
                    )}
                  />
                  <Bar dataKey="Paid" fill="#6C63FF" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Share" fill="#38B2AC" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </NeuCard>
        </div>
      )}
    </div>
  );
}
