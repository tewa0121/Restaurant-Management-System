import api from './api';
import invoiceService from './invoiceService';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

const sanitizeParams = (params = {}) => {
  const clean = { ...params };
  if (clean.limit !== undefined && Number(clean.limit) > 50) {
    clean.limit = 50;
  }
  Object.keys(clean).forEach((k) => {
    if (clean[k] === '' || clean[k] === null || clean[k] === undefined) {
      delete clean[k];
    }
  });
  return clean;
};

async function resolveInvoiceId(paymentData) {
  if (paymentData.invoiceId) return Number(paymentData.invoiceId);
  if (paymentData.invoice_id) return Number(paymentData.invoice_id);

  const orderId = paymentData.orderId ?? paymentData.order_id;
  if (!orderId) return null;

  const existing = await invoiceService.getInvoiceByOrder(orderId, { generateIfMissing: false });
  if (existing?.id) return Number(existing.id);

  const generated = await invoiceService.generateInvoice(orderId);
  return generated?.id ? Number(generated.id) : null;
}

export const paymentService = {
  getPayments: async (params = {}) => {
    const cleanParams = sanitizeParams(params);
    const res = await api.get('/payments', cleanParams);
    return {
      rows: unwrapList(res),
      summary: res?.summary ?? res?.data?.summary ?? null,
    };
  },

  processPayment: async (paymentData) => {
    const invoiceId = await resolveInvoiceId(paymentData);
    if (!invoiceId) {
      throw new Error('Invoice ID or valid Order ID is required to process payment.');
    }

    const method =
      paymentData.method ?? paymentData.paymentMethod ?? paymentData.payment_method ?? 'cash';
    const transactionId =
      paymentData.transactionId ?? paymentData.transaction_id ?? paymentData.reference;

    const payload = {
      invoiceId,
      method,
      ...(paymentData.amount !== undefined ? { amount: Number(paymentData.amount) } : {}),
      ...(paymentData.tendered !== undefined ? { tendered: Number(paymentData.tendered) } : {}),
      ...(transactionId ? { transactionId: String(transactionId).trim() } : {}),
    };

    const res = await api.post('/payments', payload);
    return unwrapItem(res);
  },

  getInvoices: async (params = {}) => {
    const res = await api.get('/invoices', sanitizeParams(params));
    return unwrapList(res);
  },

  getRefunds: async (params = {}) => {
    const res = await api.get('/refunds', sanitizeParams(params));
    return unwrapList(res);
  },

  requestRefund: async (refundData) => {
    const res = await api.post('/refunds', refundData);
    return unwrapItem(res);
  },
};

export default paymentService;