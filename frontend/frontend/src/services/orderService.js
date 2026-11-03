export const orderService = {
  getOrders: async () => {
    return JSON.parse(localStorage.getItem('restaurantOrders') || JSON.stringify([
      { id: '#ORD-1250', table: 'Table 5', customer: 'John Smith', items: '3 items', amount: '$45.50', status: 'Completed', time: '10:30 AM' },
      { id: '#ORD-1249', table: 'Table 12', customer: 'Sarah Johnson', items: '5 items', amount: '$78.20', status: 'Preparing', time: '10:25 AM' },
      { id: '#ORD-1248', table: 'Table 3', customer: 'Michael Brown', items: '2 items', amount: '$32.00', status: 'Preparing', time: '10:20 AM' },
    ]));
  },
  createOrder: async (orderData) => {
    const orders = JSON.parse(localStorage.getItem('restaurantOrders') || '[]');
    const newOrder = { id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`, ...orderData, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    orders.unshift(newOrder);
    localStorage.setItem('restaurantOrders', JSON.stringify(orders));
    return newOrder;
  },
  updateOrderStatus: async (orderId, status) => {
    const orders = JSON.parse(localStorage.getItem('restaurantOrders') || '[]');
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    localStorage.setItem('restaurantOrders', JSON.stringify(updated));
    return updated;
  }
};