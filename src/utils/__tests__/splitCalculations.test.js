import { describe, it, expect } from 'vitest';
import {
  calculateEqualSplit,
  calculatePercentageSplit,
  calculateExactSplit,
  calculateItemizedSplit,
} from '../splitCalculations';

describe('splitCalculations', () => {
  describe('calculateEqualSplit', () => {
    it('splits 100 evenly among 3 members without penny loss', () => {
      const result = calculateEqualSplit(100, ['m1', 'm2', 'm3']);
      expect(result).toHaveLength(3);
      // Total must equal 100.00 exactly
      const sum = result.reduce((acc, r) => acc + r.amount, 0);
      expect(Math.round(sum * 100) / 100).toBe(100);
      // Remainder penny distributed to first member
      expect(result[0].amount).toBe(33.34);
      expect(result[1].amount).toBe(33.33);
      expect(result[2].amount).toBe(33.33);
    });

    it('splits 50 evenly among 2 members', () => {
      const result = calculateEqualSplit(50, ['m1', 'm2']);
      expect(result[0].amount).toBe(25);
      expect(result[1].amount).toBe(25);
    });
  });

  describe('calculatePercentageSplit', () => {
    it('validates percentage sum is 100%', () => {
      const invalid = calculatePercentageSplit(100, [
        { memberId: 'm1', percentage: 40 },
        { memberId: 'm2', percentage: 50 },
      ]);
      expect(invalid.isValid).toBe(false);

      const valid = calculatePercentageSplit(100, [
        { memberId: 'm1', percentage: 40 },
        { memberId: 'm2', percentage: 60 },
      ]);
      expect(valid.isValid).toBe(true);
      expect(valid.splitDetails[0].amount).toBe(40);
      expect(valid.splitDetails[1].amount).toBe(60);
    });

    it('handles floating percentages cleanly', () => {
      const result = calculatePercentageSplit(100, [
        { memberId: 'm1', percentage: 33.33 },
        { memberId: 'm2', percentage: 33.33 },
        { memberId: 'm3', percentage: 33.34 },
      ]);
      expect(result.isValid).toBe(true);
      const sum = result.splitDetails.reduce((acc, r) => acc + r.amount, 0);
      expect(Math.round(sum * 100) / 100).toBe(100);
    });
  });

  describe('calculateExactSplit', () => {
    it('detects when exact amounts do not match total', () => {
      const result = calculateExactSplit(100, [
        { memberId: 'm1', amount: 50 },
        { memberId: 'm2', amount: 40 },
      ]);
      expect(result.isValid).toBe(false);
      expect(result.difference).toBe(10);
    });

    it('accepts exact matches', () => {
      const result = calculateExactSplit(100, [
        { memberId: 'm1', amount: 65.5 },
        { memberId: 'm2', amount: 34.5 },
      ]);
      expect(result.isValid).toBe(true);
      expect(result.difference).toBe(0);
    });
  });

  describe('calculateItemizedSplit', () => {
    it('splits items according to assignees and distributes shared fee proportionally', () => {
      const items = [
        { id: '1', name: 'Pizza', price: 60, assignedTo: ['m1', 'm2'] }, // 30 each
        { id: '2', name: 'Salad', price: 20, assignedTo: ['m2'] },        // 20 to m2
      ];
      // Subtotals: m1: 30, m2: 50. Total items: 80
      // Shared tax/tip: 16 (20% of 80)
      // m1 share of tip: 30/80 * 16 = 6 -> total 36
      // m2 share of tip: 50/80 * 16 = 10 -> total 60
      const result = calculateItemizedSplit(items, 16, ['m1', 'm2']);
      expect(result.totalAmount).toBe(96);

      const m1 = result.splitDetails.find((s) => s.memberId === 'm1');
      const m2 = result.splitDetails.find((s) => s.memberId === 'm2');
      expect(m1.amount).toBe(36);
      expect(m2.amount).toBe(60);
    });
  });
});
