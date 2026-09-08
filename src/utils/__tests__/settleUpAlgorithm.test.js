import { describe, it, expect } from 'vitest';
import { calculateNetBalances, simplifyDebts } from '../settleUpAlgorithm';

describe('settleUpAlgorithm', () => {
  const members = [
    { id: 'alice', name: 'Alice' },
    { id: 'bob', name: 'Bob' },
    { id: 'charlie', name: 'Charlie' },
  ];

  it('correctly computes net balances with expenses', () => {
    // Alice paid 90 for dinner split equally (30 each)
    const expenses = [
      {
        id: 'e1',
        amount: 90,
        paidBy: 'alice',
        splitDetails: [
          { memberId: 'alice', amount: 30 },
          { memberId: 'bob', amount: 30 },
          { memberId: 'charlie', amount: 30 },
        ],
      },
    ];

    const balances = calculateNetBalances(members, expenses, []);
    expect(balances.alice.amount).toBe(60); // Paid 90, consumed 30 -> +60
    expect(balances.bob.amount).toBe(-30);   // Paid 0, consumed 30 -> -30
    expect(balances.charlie.amount).toBe(-30); // Paid 0, consumed 30 -> -30
  });

  it('simplifies debts to minimum number of transactions', () => {
    // Alice is owed 60, Bob owes 30, Charlie owes 30
    const netBalances = {
      alice: { cents: 6000, amount: 60 },
      bob: { cents: -3000, amount: -30 },
      charlie: { cents: -3000, amount: -30 },
    };

    const txs = simplifyDebts(netBalances);
    expect(txs).toHaveLength(2);

    const bobTx = txs.find((t) => t.fromMemberId === 'bob');
    expect(bobTx.toMemberId).toBe('alice');
    expect(bobTx.amount).toBe(30);

    const charlieTx = txs.find((t) => t.fromMemberId === 'charlie');
    expect(charlieTx.toMemberId).toBe('alice');
    expect(charlieTx.amount).toBe(30);
  });

  it('handles multi-person cyclic debts efficiently', () => {
    // Alice owes Bob 10, Bob owes Charlie 10, Charlie owes Alice 10
    // Net balances should all be 0, resulting in 0 transactions!
    const netBalances = {
      alice: { cents: 0, amount: 0 },
      bob: { cents: 0, amount: 0 },
      charlie: { cents: 0, amount: 0 },
    };
    const txs = simplifyDebts(netBalances);
    expect(txs).toHaveLength(0);
  });

  it('settlement updates net balances properly', () => {
    // Alice paid 60 for Alice and Bob (30 each)
    const expenses = [
      {
        id: 'e1',
        amount: 60,
        paidBy: 'alice',
        splitDetails: [
          { memberId: 'alice', amount: 30 },
          { memberId: 'bob', amount: 30 },
        ],
      },
    ];

    // Bob paid back Alice 30
    const settlements = [
      {
        id: 's1',
        fromMemberId: 'bob',
        toMemberId: 'alice',
        amount: 30,
      },
    ];

    const balances = calculateNetBalances(
      [{ id: 'alice' }, { id: 'bob' }],
      expenses,
      settlements
    );
    expect(balances.alice.amount).toBe(0);
    expect(balances.bob.amount).toBe(0);
  });
});
