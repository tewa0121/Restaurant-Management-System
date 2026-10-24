import React, { useState } from 'react';

const menuItems = [
  { id: 1, name: 'Margherita Pizza', price: 12.99 },
  { id: 2, name: 'Cheeseburger', price: 10.50 },
  { id: 3, name: 'Caesar Salad', price: 8.99 },
  { id: 4, name: 'Iced Tea', price: 2.99 },
];

const NewOrder = () => {
  const [cart, setCart] = useState([]);
  const [table, setTable] = useState('Table 1');

  const addToOrder = (item) => {
    setCart([...cart, item]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Create New Order</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow border text-center">
              <h3 className="font-bold text-gray-800">{item.name}</h3>
              <p className="text-gray-500 mb-3">${item.price.toFixed(2)}</p>
              <button
                onClick={() => addToOrder(item)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-2 rounded-md font-medium"
              >
                + Add Item
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Table</label>
          <select value={table} onChange={(e) => setTable(e.target.value)} className="w-full border rounded-md p-2">
            <option>Table 1</option>
            <option>Table 2</option>
            <option>Table 3</option>
          </select>
        </div>
        <div className="border-t border-b py-4 space-y-2 max-h-60 overflow-y-auto">
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span className="font-semibold">${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-lg font-bold flex justify-between">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
          Send to Kitchen
        </button>
      </div>
    </div>
  );
};

export default NewOrder;