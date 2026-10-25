export const inventoryService = {
  getInventory: async () => {
    return JSON.parse(localStorage.getItem('restaurantInventory') || JSON.stringify([
      { id: 1, name: 'Tomato', qty: '2 kg left', threshold: '5 kg', status: 'Low' },
      { id: 2, name: 'Chicken Breast', qty: '1.5 kg left', threshold: '4 kg', status: 'Low' },
      { id: 3, name: 'Cooking Oil', qty: '1 L left', threshold: '3 L', status: 'Low' },
      { id: 4, name: 'Cheese', qty: '1.2 kg left', threshold: '2 kg', status: 'Adequate' },
    ]));
  },
  updateStock: async (id, qty) => {
    const items = await inventoryService.getInventory();
    const updated = items.map(i => i.id === id ? { ...i, qty } : i);
    localStorage.setItem('restaurantInventory', JSON.stringify(updated));
    return updated;
  }
};