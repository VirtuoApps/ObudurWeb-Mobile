import { Price } from "@/types/hotel.type";

// Currency symbols mapping
export const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  TRY: "₺",
  RUB: "₽",
};

/**
 * Formats price with currency-specific formatting rules
 * @param amount - The price amount
 * @param currency - The currency code
 * @returns Formatted price string
 */
export const formatPrice = (amount: number, currency: string): string => {
  const symbol = currencySymbols[currency] || currency;

  switch (currency) {
    case "TRY":
      // Turkish formatting: Use Turkish locale for number formatting
      return `${amount.toLocaleString("tr-TR")} ${symbol}`;

    case "EUR":
      // European formatting: Amount followed by symbol with space
      return `${amount.toLocaleString("de-DE")} ${symbol}`;

    case "USD":
      // US formatting: Symbol followed by amount
      return `${symbol}${amount.toLocaleString("en-US")}`;

    case "RUB":
      // Russian formatting: Symbol followed by amount
      return `${symbol}${amount.toLocaleString("ru-RU")}`;

    default:
      // Default formatting: Amount followed by currency code/symbol
      return `${amount.toLocaleString()} ${symbol}`;
  }
};

/**
 * Gets the display price for a hotel based on selected currency with proper formatting
 * @param prices - Array of hotel prices
 * @param selectedCurrency - The preferred currency
 * @returns Formatted price string or empty string if no price available
 */
export const getDisplayPrice = (
  prices: Price[],
  selectedCurrency: string = "USD"
): string => {
  if (!prices || prices.length === 0) return "";

  // Find price in selected currency
  const selectedPrice = prices.find((p) => p.currency === selectedCurrency);

  // If selected currency is not available, use USD or the first available price
  const usdPrice = prices.find((p) => p.currency === "USD");
  const price = selectedPrice || usdPrice || prices[0];

  return formatPrice(price.amount, price.currency);
};

/**
 * Gets the numeric price value for sorting purposes
 * @param prices - Array of hotel prices
 * @param selectedCurrency - The preferred currency
 * @returns Numeric price value or 0 if no price available
 */
export const getNumericPrice = (
  prices: Price[],
  selectedCurrency: string = "USD"
): number => {
  if (!prices || prices.length === 0) return 0;

  // Find price in selected currency
  const selectedPrice = prices.find((p) => p.currency === selectedCurrency);

  // If selected currency is not available, use USD or the first available price
  const usdPrice = prices.find((p) => p.currency === "USD");
  const price = selectedPrice || usdPrice || prices[0];

  return price.amount;
};
