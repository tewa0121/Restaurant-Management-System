// src/utils/formatters.js

/**
 * Format a numeric price to currency format.
 * @param {number|string} amount 
 * @param {string} currencySymbol 
 * @returns {string}
 */
export const formatCurrency = (amount, currencySymbol = '$') => {
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) return `${currencySymbol}0.00`;
  return `${currencySymbol}${numericAmount.toFixed(2)}`;
};

/**
 * Format date string to readable format.
 * @param {string|Date} date 
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};