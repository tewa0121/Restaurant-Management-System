import React from 'react';

const OrderHistory = () => {
  const history = [
    { id: 'ORD-101', table: 'Table 2', items: 3, total: '$45.00', date: 'Oct 24, 2026 - 12:30 PM' },
    { id: 'ORD-100', table: 'Table 8', items: 5, total: '$82.50', date: 'Oct 24, 2026 - 11:45 AM' },
    { id: 'ORD-099', table: 'Table 1', items: 2, total: '$24.00', date: 'Oct 23, 2026 - 8:15 PM' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Order History</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 text-sm font-semibold text-gray-600">Order ID</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Table</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Items</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Total</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono text-indigo-600">{h.id}</td>
                <td className="p-4 text-gray-800">{h.table}</td>
                <td className="p-4 text-gray-600">{h.items}</td>
                <td className="p-4 font-semibold text-gray-800">{h.total}</td>
                <td className="p-4 text-sm text-gray-500">{h.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;