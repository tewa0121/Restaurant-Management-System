import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { PATHS } from '../../utils/paths';

// TEMPORARY demo data. Step 3 loads real orders from GET /api/orders/mine.
// Every item MUST have an id, otherwise the cart cannot tell items apart.
const DEMO_ORDERS = [
  {
    id: 'ORD-8942',
    date: 'Oct 19, 2026',
    status: 'In Progress',
    items: [
      { id: 'dish-3', name: 'Margherita Pizza', price: 11.99, qty: 1, image: '/assets/food-placeholders/food-pizza.png' },
      { id: 'drink-orange-juice', name: 'Fresh Orange Juice', price: 3.49, qty: 2, image: '/assets/food-placeholders/food-juice.png' },
    ],
  },
];

const STATUS_STYLES = {
  'In Progress': 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900',
  Delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900',
};

export default function MyOrders() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleReorder = (order) => {
    order.items.forEach((i) =>
      addToCart({ id: i.id, name: i.name, price: i.price, image: i.image }, i.qty)
    );
    navigate(PATHS.cart);
  };

  return (
    <div className="p-6 space-y-5 pb-8 text-gray-900 dark:text-white">
      <h1 className="text-xl font-bold">Order History</h1>

      <div className="space-y-4">
        {DEMO_ORDERS.map((order) => {
          const total = order.items.reduce((sum, i) => sum + i.price * i.qty, 0);

          return (
            <div
              key={order.id}
              className="bg-white dark:bg-[#0B1426] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 space-y-3"
            >
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs">{order.id} - {order.date}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      STATUS_STYLES[order.status] || 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-emerald-600">${total.toFixed(2)}</span>
              </div>

              <ul className="space-y-1.5">
                {order.items.map((i) => (
                  <li key={i.id} className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                    <span>{i.qty}x {i.name}</span>
                    <span>${(i.price * i.qty).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleReorder(order)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold cursor-pointer"
              >
                <RotateCcw size={12} /> Reorder All
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}