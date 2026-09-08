import { toIntegerCents, fromIntegerCents } from './currency.js';

/**
 * Calculates equal split among participating members with integer-cent remainder distribution.
 * Guarantees sum of splits === totalAmount exactly.
 *
 * Example: 100.00 split 3 ways -> [33.34, 33.33, 33.33]
 */
export function calculateEqualSplit(totalAmount, memberIds) {
  if (!memberIds || memberIds.length === 0) return [];
  const totalCents = toIntegerCents(totalAmount);
  const n = memberIds.length;
  const baseCents = Math.floor(totalCents / n);
  const remainderCents = totalCents % n;

  return memberIds.map((memberId, index) => {
    // Distribute 1 extra cent to the first 'remainderCents' members
    const cents = baseCents + (index < remainderCents ? 1 : 0);
    return {
      memberId,
      amount: fromIntegerCents(cents),
    };
  });
}

/**
 * Calculates percentage split based on custom percentages per member.
 * Validates sum is 100% and adjusts minor penny rounding differences.
 */
export function calculatePercentageSplit(totalAmount, memberPercentages) {
  // memberPercentages: [{ memberId: string, percentage: number }]
  const totalCents = toIntegerCents(totalAmount);
  const sumPercentage = memberPercentages.reduce(
    (acc, m) => acc + (Number(m.percentage) || 0),
    0
  );

  const isExact100 = Math.abs(sumPercentage - 100) < 0.01;

  if (!isExact100) {
    return {
      isValid: false,
      error: `Percentages must add up to 100%. Currently: ${sumPercentage.toFixed(1)}%`,
      sumPercentage,
      splitDetails: [],
    };
  }

  // Calculate cents per member
  let allocatedCents = 0;
  const splitsWithCents = memberPercentages.map((m) => {
    const p = Number(m.percentage) || 0;
    const cents = Math.round((p / 100) * totalCents);
    allocatedCents += cents;
    return { memberId: m.memberId, cents, percentage: p };
  });

  // Adjust difference (usually +/- 1-2 cents due to rounding)
  let diff = totalCents - allocatedCents;
  if (diff !== 0 && splitsWithCents.length > 0) {
    // Adjust highest percentage members first
    const sortedIndices = [...splitsWithCents.keys()].sort(
      (a, b) => splitsWithCents[b].cents - splitsWithCents[a].cents
    );
    let i = 0;
    while (diff !== 0 && i < sortedIndices.length) {
      const idx = sortedIndices[i];
      if (diff > 0) {
        splitsWithCents[idx].cents += 1;
        diff -= 1;
      } else {
        if (splitsWithCents[idx].cents > 0) {
          splitsWithCents[idx].cents -= 1;
          diff += 1;
        }
      }
      i = (i + 1) % sortedIndices.length;
    }
  }

  const splitDetails = splitsWithCents.map((s) => ({
    memberId: s.memberId,
    amount: fromIntegerCents(s.cents),
  }));

  return {
    isValid: true,
    error: null,
    sumPercentage,
    splitDetails,
  };
}

/**
 * Calculates and validates exact amount split.
 */
export function calculateExactSplit(totalAmount, memberAmounts) {
  // memberAmounts: [{ memberId: string, amount: number }]
  const totalCents = toIntegerCents(totalAmount);
  let sumCents = 0;

  const splitDetails = memberAmounts.map((m) => {
    const cents = toIntegerCents(m.amount || 0);
    sumCents += cents;
    return {
      memberId: m.memberId,
      amount: fromIntegerCents(cents),
    };
  });

  const diffCents = totalCents - sumCents;
  const isValid = diffCents === 0;

  return {
    isValid,
    difference: fromIntegerCents(diffCents),
    sumAmount: fromIntegerCents(sumCents),
    splitDetails,
    error: isValid
      ? null
      : diffCents > 0
      ? `${fromIntegerCents(diffCents)} remaining to allocate`
      : `${fromIntegerCents(-diffCents)} over total expense amount`,
  };
}

/**
 * Calculates itemized split where individual items are assigned to one or more members,
 * plus optional shared tax, tip, or fee distributed proportionally to their subtotal.
 */
export function calculateItemizedSplit(items = [], sharedFee = 0, memberIds = []) {
  // items: [{ id, name, price, assignedTo: [memberId] }]
  const memberSubtotalsCents = {};
  memberIds.forEach((id) => {
    memberSubtotalsCents[id] = 0;
  });

  let itemsTotalCents = 0;

  items.forEach((item) => {
    const itemCents = toIntegerCents(item.price || 0);
    itemsTotalCents += itemCents;
    const assignees = item.assignedTo && item.assignedTo.length > 0 ? item.assignedTo : memberIds;
    const perPersonBase = Math.floor(itemCents / assignees.length);
    const remainder = itemCents % assignees.length;

    assignees.forEach((memberId, idx) => {
      const share = perPersonBase + (idx < remainder ? 1 : 0);
      memberSubtotalsCents[memberId] = (memberSubtotalsCents[memberId] || 0) + share;
    });
  });

  const sharedFeeCents = toIntegerCents(sharedFee || 0);
  const totalExpenseCents = itemsTotalCents + sharedFeeCents;

  // Distribute shared fee proportionally (or equally if itemsTotal is 0)
  const memberTotalCents = { ...memberSubtotalsCents };
  if (sharedFeeCents > 0) {
    let allocatedFeeCents = 0;
    const activeMemberIds = Object.keys(memberSubtotalsCents).filter(
      (id) => memberSubtotalsCents[id] > 0
    );
    const targetMembers = activeMemberIds.length > 0 ? activeMemberIds : memberIds;

    targetMembers.forEach((id) => {
      let feeShare = 0;
      if (itemsTotalCents > 0) {
        feeShare = Math.round((memberSubtotalsCents[id] / itemsTotalCents) * sharedFeeCents);
      } else {
        feeShare = Math.floor(sharedFeeCents / targetMembers.length);
      }
      memberTotalCents[id] += feeShare;
      allocatedFeeCents += feeShare;
    });

    // Fix remainder penny
    let diff = sharedFeeCents - allocatedFeeCents;
    if (diff !== 0 && targetMembers.length > 0) {
      memberTotalCents[targetMembers[0]] += diff;
    }
  }

  const splitDetails = memberIds.map((id) => ({
    memberId: id,
    amount: fromIntegerCents(memberTotalCents[id] || 0),
  }));

  return {
    itemsTotal: fromIntegerCents(itemsTotalCents),
    sharedFee: fromIntegerCents(sharedFeeCents),
    totalAmount: fromIntegerCents(totalExpenseCents),
    splitDetails,
  };
}
