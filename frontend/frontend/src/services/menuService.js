export const menuService = {
  getMenuItems: async () => {
    const custom = JSON.parse(localStorage.getItem('customMenuItems') || '[]');
    const defaultItems = [
      { id: 1, name: 'Margherita Pizza', category: 'Main Course', price: 14.99, status: 'Available' },
      { id: 2, name: 'Fresh Berry Smoothie', category: 'Beverages', price: 5.50, status: 'Available' },
      { id: 3, name: 'Caesar Salad', category: 'Starter', price: 8.99, status: 'Available' },
    ];
    return [...defaultItems, ...custom];
  },
  addMenuItem: async (item) => {
    const items = JSON.parse(localStorage.getItem('customMenuItems') || '[]');
    const newItem = { ...item, id: Date.now() };
    items.push(newItem);
    localStorage.setItem('customMenuItems', JSON.stringify(items));
    return newItem;
  },
  deleteMenuItem: async (id) => {
    let items = JSON.parse(localStorage.getItem('customMenuItems') || '[]');
    items = items.filter(i => i.id !== id);
    localStorage.setItem('customMenuItems', JSON.stringify(items));
    return true;
  }
};