import { toIntegerCents, fromIntegerCents } from './currency.js';

/**
 * Computes net balances in integer cents for all members given expenses and settlements.
 *
 * Net Balance = Total Paid - Total Owed
 * Positive: Member is owed money (creditor)
 * Negative: Member owes money (debtor)
 * Zero: All settled
 */
export function calculateNetBalances(members = [], expenses = [], settlements = []) {
  const balancesInCents = {};

  // Initialize 0 balance for every member
  members.forEach((m) => {
    balancesInCents[m.id] = 0;
  });

  // 1. Process Expenses
  expenses.forEach((expense) => {
    const paidBy = expense.paidBy;
    const totalCents = toIntegerCents(expense.amount);

    // Payer's balance increases by total amount paid
    if (balancesInCents[paidBy] !== undefined) {
      balancesInCents[paidBy] += totalCents;
    }

    // Each participant's balance decreases by their share
    if (Array.isArray(expense.splitDetails)) {
      expense.splitDetails.forEach((split) => {
        const shareCents = toIntegerCents(split.amount);
        if (balancesInCents[split.memberId] !== undefined) {
          balancesInCents[split.memberId] -= shareCents;
        }
      });
    }
  });

  // 2. Process Settlements (Alice paid Bob)
  settlements.forEach((settlement) => {
    const amountCents = toIntegerCents(settlement.amount);
    // Payer reduced their debt (+ balance)
    if (balancesInCents[settlement.fromMemberId] !== undefined) {
      balancesInCents[settlement.fromMemberId] += amountCents;
    }
    // Receiver received their owed money (- balance)
    if (balancesInCents[settlement.toMemberId] !== undefined) {
      balancesInCents[settlement.toMemberId] -= amountCents;
    }
  });

  // Convert to structured result with both cents and decimals
  const result = {};
  Object.keys(balancesInCents).forEach((id) => {
    const cents = balancesInCents[id];
    result[id] = {
      cents,
      amount: fromIntegerCents(cents),
      status: cents > 0 ? 'owes_me' : cents < 0 ? 'i_owe' : 'settled',
    };
  });

  return result;
}

/**
 * Greedy Minimum Cash Flow Algorithm for Debt Simplification.
 * Minimizes total number of transactions required to settle all debts in a group.
 * Complexity: O(N log N)
 *
 * @param {Object} netBalances - Output of calculateNetBalances
 * @returns {Array} List of simplified transactions: [{ fromMemberId, toMemberId, amount }]
 */
export function simplifyDebts(netBalances = {}) {
  // Extract creditors (positive) and debtors (negative)
  const creditors = []; // { memberId, cents }
  const debtors = [];   // { memberId, cents } (stored as positive cents owed)

  Object.entries(netBalances).forEach(([memberId, data]) => {
    const cents = typeof data === 'number' ? data : data.cents;
    if (cents > 0) {
      creditors.push({ memberId, cents });
    } else if (cents < 0) {
      debtors.push({ memberId, cents: -cents });
    }
  });

  const transactions = [];

  // Greedy match: settle largest debtor with largest creditor
  while (creditors.length > 0 && debtors.length > 0) {
    // Sort descending by cents
    creditors.sort((a, b) => b.cents - a.cents);
    debtors.sort((a, b) => b.cents - a.cents);

    const creditor = creditors[0];
    const debtor = debtors[0];

    const settledCents = Math.min(creditor.cents, debtor.cents);

    if (settledCents > 0) {
      transactions.push({
        id: `tx-${debtor.memberId}-${creditor.memberId}-${settledCents}`,
        fromMemberId: debtor.memberId,
        toMemberId: creditor.memberId,
        amount: fromIntegerCents(settledCents),
        amountCents: settledCents,
      });
    }

    creditor.cents -= settledCents;
    debtor.cents -= settledCents;

    if (creditor.cents <= 0) creditors.shift();
    if (debtor.cents <= 0) debtors.shift();
  }

  return transactions;
}
