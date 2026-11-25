import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const menuService = {
  getCategories: async (params = {}) => {
    const res = await api.get('/menu/categories', params);
    return unwrapList(res);
  },

  createCategory: async (data) => {
    const res = await api.post('/menu/categories', data);
    return unwrapItem(res);
  },

  updateCategory: async (id, data) => {
    const res = await api.put(`/menu/categories/${id}`, data);
    return unwrapItem(res);
  },

  deleteCategory: async (id) => {
    const res = await api.delete(`/menu/categories/${id}`);
    return unwrapItem(res);
  },

  getMenuItems: async (params = {}) => {
    const res = await api.get('/menu/items', params);
    return unwrapList(res);
  },

  getMenuItem: async (id) => {
    const res = await api.get(`/menu/items/${id}`);
    return unwrapItem(res);
  },

  addMenuItem: async (item) => {
    const res = await api.post('/menu/items', item);
    return unwrapItem(res);
  },

  updateMenuItem: async (id, item) => {
    const res = await api.put(`/menu/items/${id}`, item);
    return unwrapItem(res);
  },

  setAvailability: async (id, isAvailable) => {
    const res = await api.patch(`/menu/items/${id}/availability`, {
      isAvailable,
      available: isAvailable,
    });
    return unwrapItem(res);
  },

  deleteMenuItem: async (id) => {
    const res = await api.delete(`/menu/items/${id}`);
    return unwrapItem(res);
  },

  getModifiers: async (itemId) => {
    const res = await api.get(`/menu/items/${itemId}/modifiers`);
    return unwrapList(res);
  },

  addModifier: async (itemId, modifier) => {
    const res = await api.post(`/menu/items/${itemId}/modifiers`, modifier);
    return unwrapItem(res);
  },

  updateModifier: async (modifierId, modifier) => {
    const res = await api.put(`/menu/modifiers/${modifierId}`, modifier);
    return unwrapItem(res);
  },

  deleteModifier: async (modifierId) => {
    const res = await api.delete(`/menu/modifiers/${modifierId}`);
    return unwrapItem(res);
  },

  getFavorites: async () => {
    const res = await api.get('/menu/favorites');
    return unwrapList(res);
  },

  addFavorite: async (itemId) => {
    const res = await api.post(`/menu/favorites/${itemId}`);
    return unwrapItem(res);
  },

  removeFavorite: async (itemId) => {
    const res = await api.delete(`/menu/favorites/${itemId}`);
    return unwrapItem(res);
  },
};

export default menuService;