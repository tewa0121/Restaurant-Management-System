import api from './api';

const unwrapData = (res) => res?.data ?? res;

export const settingsService = {
  getPublicSettings: async () => {
    const res = await api.get('/settings/public', null, { auth: false });
    return unwrapData(res);
  },

  getSettings: async () => {
    const res = await api.get('/settings');
    return unwrapData(res);
  },

  updateSettings: async (data) => {
    const res = await api.put('/settings', data);
    return unwrapData(res);
  },
};

export default settingsService;