import React, { useState } from 'react';

const Customers = () => {
  const [customers] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', visits: 12, totalSpent: '$340.00' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', visits: 5, totalSpent: '$120.50' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', visits: 24, totalSpent: '$890.00' },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Customers Directory</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Email</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Total Visits</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{c.name}</td>
                <td className="p-4 text-gray-600">{c.email}</td>
                <td className="p-4 text-gray-600">{c.visits}</td>
                <td className="p-4 text-gray-800 font-semibold">{c.totalSpent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;