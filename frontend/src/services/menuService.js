import api, { getStoredUser } from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

const getRole = () => {
  const user = getStoredUser();
  return String(user?.role || user?.primaryRole || '').trim().toLowerCase();
};

const isAuthOrForbidden = (err) => err?.status === 401 || err?.status === 403;

export const menuService = {
  getMenuItems: async (params = {}) => {
    const res = await api.get('/menu/items', params);
    return unwrapList(res);
  },

  getMenuItem: async (id) => {
    const res = await api.get(`/menu/items/${id}`);
    return unwrapItem(res);
  },

  createMenuItem: async (data) => {
    const res = await api.post('/menu/items', data);
    return unwrapItem(res);
  },

  addMenuItem: async (data) => {
    return menuService.createMenuItem(data);
  },

  updateMenuItem: async (id, data) => {
    const res = await api.put(`/menu/items/${id}`, data);
    return unwrapItem(res);
  },

  setAvailability: async (id, isAvailable) => {
    const flag = Boolean(isAvailable);
    const res = await api.patch(`/menu/items/${id}/availability`, {
      isAvailable: flag,
      available: flag,
    });
    return unwrapItem(res);
  },

  deleteMenuItem: async (id) => {
    const res = await api.delete(`/menu/items/${id}`);
    return unwrapItem(res);
  },

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

  getFavorites: async () => {
    if (getRole() !== 'customer') return [];
    try {
      const res = await api.get('/menu/favorites');
      return unwrapList(res);
    } catch (err) {
      if (isAuthOrForbidden(err)) return [];
      throw err;
    }
  },

    addFavorite: async (menuItemId) => {
    if (getRole() !== 'customer') return null;
    const res = await api.post(`/menu/favorites/${menuItemId}`);
    return unwrapItem(res);
  },

  removeFavorite: async (menuItemId) => {
    if (getRole() !== 'customer') return null;
    const res = await api.delete(`/menu/favorites/${menuItemId}`);
    return res;
  },

  // kept for older callers: the server only adds, removing needs removeFavorite
  toggleFavorite: async (menuItemId) => menuService.addFavorite(menuItemId),
};

export default menuService;