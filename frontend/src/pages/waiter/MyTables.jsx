import React, { useState } from 'react';

const MyTables = () => {
  const [assignedTables] = useState([
    { id: 1, number: 'Table 1', guests: 2, status: 'Occupied', server: 'You' },
    { id: 2, number: 'Table 4', guests: 4, status: 'Reserved', server: 'You' },
    { id: 3, number: 'Table 5', guests: 0, status: 'Available', server: 'You' },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Assigned Tables</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignedTables.map((t) => (
          <div key={t.id} className="bg-white p-5 rounded-lg shadow border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-800">{t.number}</h3>
              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                t.status === 'Occupied' ? 'bg-red-100 text-red-700' :
                t.status === 'Reserved' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
              }`}>
                {t.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Guests: <span className="font-semibold text-gray-800">{t.guests}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTables;