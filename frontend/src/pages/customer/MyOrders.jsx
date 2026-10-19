import React from 'react';
import { ShoppingBag, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function MyOrders() {
  const { addToCart } = useCart();

  const orders = [
    {
      id: 'ORD-8942',
      date: 'Oct 19, 2026',
      status: 'In Progress',
      total: 38.83,
      items: [
        { name: 'Margherita Pizza', price: 11.99, qty: 1, image: '/assets/food-placeholders/food-pizza.png' },
        { name: 'Fresh Orange Juice', price: 3.49, qty: 2, image: '/assets/food-placeholders/food-juice.png' }
      ]
    }
  ];

  return (
    <div className="space-y-5 pb-8">
      <h1 className="text-xl font-bold text-gray-900">Order History</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl p-4 border space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-bold text-xs">{order.id} - {order.date}</span>
              <span className="text-xs font-extrabold text-green-600">${order.total.toFixed(2)}</span>
            </div>
            <button onClick={() => order.items.forEach(i => addToCart({ name: i.name, price: i.price, image_url: i.image }))} className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold">
              <RotateCcw size={12} /> Reorder All
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}