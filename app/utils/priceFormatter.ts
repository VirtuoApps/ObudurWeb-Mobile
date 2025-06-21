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
export const formatPrice = (
  amount: number,
  currency: string,
  isMarker: boolean = false
): string => {
  const symbol = currencySymbols[currency] || currency;

  switch (currency) {
    case "TRY":
      if (isMarker) {
        if (amount < 1000) {
          // Yüzler ve altı: "999 ₺"
          return `${amount} ${symbol}`;
        } else if (amount < 10000) {
          // Binler: "9.500 ₺"
          return `${amount.toLocaleString("tr-TR")} ${symbol}`;
        } else if (amount < 100000) {
          // On Binler: "99 Bin ₺"
          const thousands = Math.floor(amount / 1000);
          const remainder = amount % 1000;
          if (remainder === 0) {
            return `${thousands} Bin ${symbol}`;
          } else {
            // If there's a remainder, show decimal: "99,5 Bin ₺"
            const decimal = (amount / 1000).toFixed(1).replace(".", ",");
            return `${decimal} Bin ${symbol}`;
          }
        } else if (amount < 1000000) {
          // Yüz Binler: "999 Bin ₺"
          const thousands = Math.floor(amount / 1000);
          const remainder = amount % 1000;
          if (remainder === 0) {
            return `${thousands} Bin ${symbol}`;
          } else {
            // If there's a remainder, show decimal: "999,5 Bin ₺"
            const decimal = (amount / 1000).toFixed(1).replace(".", ",");
            return `${decimal} Bin ${symbol}`;
          }
        } else if (amount < 100000000) {
          // Milyon: "9,5 M ₺"
          const millions = (amount / 1000000).toFixed(1).replace(".", ",");
          return `${millions} M ${symbol}`;
        } else if (amount < 1000000000) {
          // Yüz Milyonlar: "999,5 M ₺"
          const millions = (amount / 1000000).toFixed(1).replace(".", ",");
          return `${millions} M ${symbol}`;
        } else {
          // Milyar: "1,5 Milyar ₺"
          const billions = (amount / 1000000000).toFixed(1).replace(".", ",");
          return `${billions} Milyar ${symbol}`;
        }
      } else {
        return `${amount.toLocaleString("tr-TR")} ${symbol}`;
      }

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
 * Formats number for input field with currency-specific formatting (without symbol)
 * @param amount - The price amount
 * @param currency - The currency code
 * @returns Formatted number string without currency symbol
 */
export const formatInputPrice = (amount: number, currency: string): string => {
  if (!amount || amount === 0) return "";

  switch (currency) {
    case "TRY":
      // Turkish formatting: Use Turkish locale (1.234.567,89)
      return amount.toLocaleString("tr-TR");

    case "USD":
      // US formatting: Use US locale (1,234,567.89)
      return amount.toLocaleString("en-US");

    case "EUR":
      // European formatting: Use German locale (1.234.567,89)
      return amount.toLocaleString("de-DE");

    case "RUB":
      // Russian formatting: Use Russian locale
      return amount.toLocaleString("ru-RU");

    default:
      // Default formatting
      return amount.toLocaleString("en-US");
  }
};

/**
 * Parses formatted input string back to number
 * @param formattedValue - The formatted string from input
 * @param currency - The currency code
 * @returns Parsed number value
 */
export const parseInputPrice = (
  formattedValue: string,
  currency: string
): number => {
  if (!formattedValue || formattedValue.trim() === "") return 0;

  // Remove all non-numeric characters except decimal separators
  let cleanValue = formattedValue;

  switch (currency) {
    case "TRY":
    case "EUR":
      // Turkish/European format: 1.234.567,89
      // Remove thousands separators (dots) but keep decimal comma
      cleanValue = cleanValue.replace(/\./g, "").replace(",", ".");
      break;

    case "USD":
    case "RUB":
      // US/Russian format: 1,234,567.89
      // Remove thousands separators (commas) but keep decimal dot
      cleanValue = cleanValue.replace(/,/g, "");
      break;

    default:
      // Default: assume US format
      cleanValue = cleanValue.replace(/,/g, "");
      break;
  }

  // Parse the cleaned value
  const parsedValue = parseFloat(cleanValue);
  return isNaN(parsedValue) ? 0 : parsedValue;
};

/**
 * Handles real-time input formatting as user types
 * @param inputValue - Current input value
 * @param currency - The currency code
 * @returns Object with formatted display value and numeric value
 */
export const handlePriceInput = (
  inputValue: string,
  currency: string
): { displayValue: string; numericValue: number } => {
  // Parse the current input to get numeric value
  const numericValue = parseInputPrice(inputValue, currency);

  // Format for display
  const displayValue = formatInputPrice(numericValue, currency);

  return { displayValue, numericValue };
};

/**
 * Gets the display price for a hotel based on selected currency with proper formatting
 * @param prices - Array of hotel prices
 * @param selectedCurrency - The preferred currency
 * @returns Formatted price string or empty string if no price available
 */
export const getDisplayPrice = (
  prices: Price[],
  selectedCurrency: string = "USD",
  isMarker: boolean = false
): string => {
  if (!prices || prices.length === 0) return "";

  // Find price in selected currency
  const selectedPrice = prices.find((p) => p.currency === selectedCurrency);

  // If selected currency is not available, use USD or the first available price
  const usdPrice = prices.find((p) => p.currency === "USD");
  const price = selectedPrice || usdPrice || prices[0];

  return formatPrice(price.amount, price.currency, isMarker);
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
