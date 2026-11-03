const AppError = require('../utils/AppError');
const { todayString } = require('../utils/enums');

const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

function calculateDiscount(discount, subtotal) {
  if (!discount) return 0;
  if (subtotal < Number(discount.min_order_amount)) return 0;
  const value = Number(discount.value);
  const amount = discount.discount_type === 'percentage' ? (subtotal * Math.min(value, 100)) / 100 : value;
  return round2(Math.min(amount, subtotal));
}

function assertDiscountUsable(discount, { subtotal, customerId, hasPreviousOrders }) {
  if (!discount || !discount.is_active) throw new AppError('This promo code is not valid.', 422, 'INVALID_DISCOUNT');

  const today = todayString();
  if (today < discount.start_date) throw new AppError('This promo code is not active yet.', 422, 'INVALID_DISCOUNT');
  if (today > discount.end_date) throw new AppError('This promo code has expired.', 422, 'INVALID_DISCOUNT');

  if (discount.usage_limit && Number(discount.used_count) >= Number(discount.usage_limit)) {
    throw new AppError('This promo code has reached its usage limit.', 422, 'INVALID_DISCOUNT');
  }
  if (subtotal < Number(discount.min_order_amount)) {
    throw new AppError(`This promo code needs a minimum order of ${Number(discount.min_order_amount).toFixed(2)}.`, 422, 'INVALID_DISCOUNT');
  }
  if (discount.first_order_only) {
    if (!customerId) throw new AppError('This promo code is for registered customers only.', 422, 'INVALID_DISCOUNT');
    if (hasPreviousOrders) throw new AppError('This promo code is only valid on a first order.', 422, 'INVALID_DISCOUNT');
  }
}

function calculateTotals({ subtotal, discountAmount, taxRate, deliveryFee }) {
  const cleanSubtotal = round2(subtotal);
  const discount = round2(Math.min(discountAmount || 0, cleanSubtotal));
  const taxable = Math.max(0, cleanSubtotal - discount);
  const taxAmount = round2((taxable * (taxRate || 0)) / 100);
  const fee = round2(deliveryFee || 0);
  const total = round2(taxable + taxAmount + fee);
  return { subtotal: cleanSubtotal, discountAmount: discount, taxAmount, deliveryFee: fee, total };
}

module.exports = { round2, calculateDiscount, assertDiscountUsable, calculateTotals };