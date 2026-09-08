/**
 * Integer-safe currency utility functions.
 * Storing money as integer cents/paise avoids IEEE-754 floating-point inaccuracies
 * (e.g. 0.1 + 0.2 === 0.30000000000000004).
 */

export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
];

/**
 * Converts float or string currency (e.g., 45.50) into integer cents/paise (4550).
 */
export function toIntegerCents(amount) {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return 0;
  return Math.round(Number(amount) * 100);
}

/**
 * Converts integer cents/paise back to decimal number (e.g., 4550 -> 45.5).
 */
export function fromIntegerCents(cents) {
  if (cents === undefined || cents === null || isNaN(Number(cents))) return 0;
  return Math.round(Number(cents)) / 100;
}

/**
 * Formats integer cents/paise or decimal into a formatted currency string.
 * @param {number} amount - Amount in decimal (e.g. 45.50) or cents if isCents=true
 * @param {string} currencyCode - e.g. 'INR', 'USD'
 * @param {boolean} isCents - whether the passed amount is in integer cents
 */
export function formatCurrency(amount, currencyCode = 'INR', isCents = false) {
  const decimalAmount = isCents ? fromIntegerCents(amount) : Number(amount) || 0;
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];

  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.code === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency.code === 'JPY' ? 0 : 2,
    }).format(decimalAmount);
  } catch {
    // Fallback if locale or currency throws
    return `${currency.symbol}${decimalAmount.toFixed(2)}`;
  }
}

/**
 * Returns currency symbol for a currency code.
 */
export function getCurrencySymbol(currencyCode = 'INR') {
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode);
  return currency ? currency.symbol : '₹';
}
