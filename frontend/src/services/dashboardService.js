import api from './api';

const unwrapData = (res) => res?.data ?? res;

export const dashboardService = {
  getCustomerDashboard: async () => {
    const res = await api.get('/dashboard/customer');
    return unwrapData(res);
  },

  getAdminDashboard: async (params = {}) => {
    const res = await api.get('/dashboard/admin', params);
    return unwrapData(res);
  },

  getManagerDashboard: async (params = {}) => {
    const res = await api.get('/dashboard/manager', params);
    return unwrapData(res);
  },

  getCashierDashboard: async (params = {}) => {
    const res = await api.get('/dashboard/cashier', params);
    return unwrapData(res);
  },

  getKitchenDashboard: async (params = {}) => {
    const res = await api.get('/dashboard/kitchen', params);
    return unwrapData(res);
  },

  getWaiterDashboard: async (params = {}) => {
    const res = await api.get('/dashboard/waiter', params);
    return unwrapData(res);
  },
};

export default dashboardService;