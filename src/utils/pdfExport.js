import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './currency.js';
import { calculateNetBalances, simplifyDebts } from './settleUpAlgorithm.js';

export function exportGroupPDF(group) {
  if (!group) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const currency = group.currency || 'INR';
  const membersMap = {};
  group.members.forEach((m) => {
    membersMap[m.id] = m.name;
  });

  const totalSpend = group.expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const netBalances = calculateNetBalances(group.members, group.expenses, group.settlements || []);
  const simplifiedTransactions = simplifyDebts(netBalances);

  // Colors
  const primaryColor = [16, 185, 129]; // #10b981
  const darkColor = [15, 23, 42];      // #0f172a
  const grayColor = [100, 116, 139];   // #64748b

  // Document Title Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...darkColor);
  doc.text('SplitWise Statement', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text(group.name, 14, 28);

  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 34);

  // Group KPI Highlights Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 38, 182, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.text('TOTAL GROUP SPEND', 20, 44);
  doc.text('MEMBERS', 85, 44);
  doc.text('EXPENSES COUNT', 140, 44);

  doc.setFontSize(13);
  doc.setTextColor(...darkColor);
  doc.text(formatCurrency(totalSpend, currency), 20, 52);
  doc.text(`${group.members.length} people`, 85, 52);
  doc.text(`${group.expenses.length} records`, 140, 52);

  // Section 1: Member Balances Table
  let currentY = 64;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkColor);
  doc.text('1. Member Balances & Spending', 14, currentY);

  const memberRows = group.members.map((m) => {
    const paid = group.expenses
      .filter((e) => e.paidBy === m.id)
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

    let share = 0;
    group.expenses.forEach((e) => {
      const split = e.splitDetails?.find((s) => s.memberId === m.id);
      if (split) share += Number(split.amount) || 0;
    });

    const net = netBalances[m.id]?.amount || 0;
    let netStatus = 'Settled up';
    if (net > 0) netStatus = `Gets back ${formatCurrency(net, currency)}`;
    if (net < 0) netStatus = `Owes ${formatCurrency(Math.abs(net), currency)}`;

    return [
      m.name,
      formatCurrency(paid, currency),
      formatCurrency(share, currency),
      netStatus,
    ];
  });

  autoTable(doc, {
    startY: currentY + 4,
    head: [['Member', 'Total Paid', 'Total Share', 'Net Status']],
    body: memberRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
    },
    margin: { left: 14, right: 14 },
  });

  currentY = doc.lastAutoTable.finalY + 12;

  // Section 2: Simplified Debt Settlement Plan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkColor);
  doc.text('2. Recommended Simplified Settlements', 14, currentY);

  const settlementRows =
    simplifiedTransactions.length > 0
      ? simplifiedTransactions.map((tx) => [
          membersMap[tx.fromMemberId] || 'Unknown',
          'pays',
          membersMap[tx.toMemberId] || 'Unknown',
          formatCurrency(tx.amount, currency),
        ])
      : [['All balances are fully settled!', '-', '-', '-']];

  autoTable(doc, {
    startY: currentY + 4,
    head: [['From (Debtor)', 'Action', 'To (Creditor)', 'Amount']],
    body: settlementRows,
    theme: 'striped',
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
    },
    margin: { left: 14, right: 14 },
  });

  currentY = doc.lastAutoTable.finalY + 12;

  // Section 3: Expense Ledger
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkColor);
  doc.text('3. Detailed Expense Ledger', 14, currentY);

  const expenseRows = group.expenses.map((e) => [
    new Date(e.date).toLocaleDateString(),
    e.description,
    e.category || 'General',
    membersMap[e.paidBy] || 'Unknown',
    e.splitType ? e.splitType.toUpperCase() : 'EQUAL',
    formatCurrency(e.amount, currency),
  ]);

  autoTable(doc, {
    startY: currentY + 4,
    head: [['Date', 'Description', 'Category', 'Paid By', 'Split Type', 'Amount']],
    body: expenseRows,
    theme: 'striped',
    headStyles: {
      fillColor: [51, 65, 85],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: {
      fontSize: 8,
    },
    margin: { left: 14, right: 14 },
  });

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text(
      `Page ${i} of ${pageCount} • SplitWise Intelligent Settlement System`,
      14,
      doc.internal.pageSize.height - 8
    );
  }

  // Save the PDF
  const safeTitle = group.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${safeTitle}_Statement.pdf`);
}
