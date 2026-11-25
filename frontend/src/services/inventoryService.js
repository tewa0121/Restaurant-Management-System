import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const inventoryService = {
  getSummary: async () => {
    const res = await api.get('/inventory/summary');
    return unwrapItem(res);
  },

  getLowStock: async () => {
    const res = await api.get('/inventory/ingredients/low');
    return unwrapList(res);
  },

  getInventory: async (params = {}) => {
    const res = await api.get('/inventory/ingredients', params);
    return unwrapList(res);
  },

  getIngredient: async (id) => {
    const res = await api.get(`/inventory/ingredients/${id}`);
    return unwrapItem(res);
  },

  createIngredient: async (data) => {
    const res = await api.post('/inventory/ingredients', data);
    return unwrapItem(res);
  },

  updateIngredient: async (id, data) => {
    const res = await api.put(`/inventory/ingredients/${id}`, data);
    return unwrapItem(res);
  },

  deleteIngredient: async (id) => {
    const res = await api.delete(`/inventory/ingredients/${id}`);
    return unwrapItem(res);
  },

  addMovement: async (ingredientId, movementData) => {
    const res = await api.post(`/inventory/ingredients/${ingredientId}/movements`, movementData);
    return unwrapItem(res);
  },

  updateStock: async (ingredientId, payload) => {
    const body =
      typeof payload === 'object' && payload !== null
        ? payload
        : { movementType: 'adjustment', quantity: payload };
    const res = await api.post(`/inventory/ingredients/${ingredientId}/movements`, body);
    return unwrapItem(res);
  },

  getMovements: async (params = {}) => {
    const res = await api.get('/inventory/movements', params);
    return unwrapList(res);
  },

  getItemRecipe: async (menuItemId) => {
    const res = await api.get(`/inventory/recipes/items/${menuItemId}`);
    return unwrapItem(res);
  },

  setItemRecipe: async (menuItemId, data) => {
    const res = await api.put(`/inventory/recipes/items/${menuItemId}`, data);
    return unwrapItem(res);
  },

  getModifierRecipe: async (modifierId) => {
    const res = await api.get(`/inventory/recipes/modifiers/${modifierId}`);
    return unwrapItem(res);
  },

  setModifierRecipe: async (modifierId, data) => {
    const res = await api.put(`/inventory/recipes/modifiers/${modifierId}`, data);
    return unwrapItem(res);
  },
};

export default inventoryService;