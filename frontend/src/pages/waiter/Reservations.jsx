import React from 'react';

const Reservations = () => {
  const reservations = [
    { id: 1, name: 'David Miller', partySize: 4, time: '7:00 PM', table: 'Table 6' },
    { id: 2, name: 'Sarah Connor', partySize: 2, time: '8:30 PM', table: 'Table 2' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Table Reservations</h1>
      <div className="space-y-4">
        {reservations.map((res) => (
          <div key={res.id} className="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">{res.name}</h3>
              <p className="text-sm text-gray-600">Party of {res.partySize} • Assigned: {res.table}</p>
            </div>
            <span className="text-indigo-600 font-semibold">{res.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservations;