export const paymentService = {
  processPayment: async (paymentData) => {
    const payments = JSON.parse(localStorage.getItem('restaurantPayments') || '[]');
    const record = { id: `PAY-${Date.now()}`, ...paymentData, timestamp: new Date().toISOString() };
    payments.unshift(record);
    localStorage.setItem('restaurantPayments', JSON.stringify(payments));
    return { success: true, record };
  },
  getPaymentHistory: async () => {
    return JSON.parse(localStorage.getItem('restaurantPayments') || '[]');
  }
};