export const tableService = {
  getTables: async () => {
    return JSON.parse(localStorage.getItem('restaurantTables') || JSON.stringify([
      { id: 1, number: 'T-1', capacity: 4, status: 'Available' },
      { id: 2, number: 'T-2', capacity: 2, status: 'Occupied' },
      { id: 3, number: 'T-3', capacity: 6, status: 'Reserved' },
      { id: 4, number: 'T-4', capacity: 4, status: 'Available' },
    ]));
  },
  updateTableStatus: async (tableId, status) => {
    const tables = await tableService.getTables();
    const updated = tables.map(t => t.id === tableId ? { ...t, status } : t);
    localStorage.setItem('restaurantTables', JSON.stringify(updated));
    return updated;
  }
};