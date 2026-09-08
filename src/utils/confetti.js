import confetti from 'canvas-confetti';

export function triggerSettlementCelebration() {
  try {
    // Blast from left
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#10b981', '#06b6d4', '#6366f1', '#ec4899', '#f59e0b'],
    });
    // Blast from right
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#10b981', '#06b6d4', '#6366f1', '#ec4899', '#f59e0b'],
    });
  } catch (err) {
    console.error('Confetti trigger failed:', err);
  }
}
