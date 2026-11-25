import api from './api';

const unwrapData = (res) => res?.data ?? res;

export const reportService = {
  getSummary: async (params = {}) => {
    const res = await api.get('/reports/summary', params);
    return unwrapData(res);
  },

  getSalesReport: async (params = {}) => {
    const res = await api.get('/reports/sales', params);
    return unwrapData(res);
  },

  getPaymentMethodsReport: async (params = {}) => {
    const res = await api.get('/reports/payment-methods', params);
    return unwrapData(res);
  },

  getCategoriesReport: async (params = {}) => {
    const res = await api.get('/reports/categories', params);
    return unwrapData(res);
  },

  getTopItemsReport: async (params = {}) => {
    const res = await api.get('/reports/top-items', params);
    return unwrapData(res);
  },

  getStaffReport: async (params = {}) => {
    const res = await api.get('/reports/staff', params);
    return unwrapData(res);
  },

  getInventoryReport: async (params = {}) => {
    const res = await api.get('/reports/inventory', params);
    return unwrapData(res);
  },

  downloadCsv: async (reportType, params = {}, filename) => {
    const query = { ...params, format: 'csv' };
    const defaultName = `${reportType}-report.csv`;
    return api.download(`/reports/${reportType}`, query, filename || defaultName);
  },
};

export default reportService;