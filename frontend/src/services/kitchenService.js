import api from './api';

const unwrapData = (res) => res?.data ?? res;

export const KITCHEN_REPORTS = ['output', 'speed', 'wastage', 'demand'];

export const kitchenService = {
  getPerformance: async (params = {}) => {
    const res = await api.get('/kitchen/performance', params);
    return unwrapData(res);
  },

  getReport: async (type, params = {}) => {
    const res = await api.get(`/kitchen/reports/${type}`, params);
    return unwrapData(res);
  },

  downloadReportCsv: (type, params = {}) =>
    api.download(
      `/kitchen/reports/${type}`,
      { ...params, format: 'csv' },
      `kitchen-${type}-${params.from || 'start'}-to-${params.to || 'today'}.csv`
    ),
};

export default kitchenService;
