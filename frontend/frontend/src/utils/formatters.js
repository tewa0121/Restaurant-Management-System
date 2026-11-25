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
// src/utils/format.js
export const formatStatus = (status) => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'preparing': return 'Preparing';
    case 'ready': return 'Ready';
    case 'completed': return 'Completed';
    default: return status;
  }
};