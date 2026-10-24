import React from 'react';

const Tables = () => {
  const tables = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    number: `Table ${i + 1}`,
    status: i % 3 === 0 ? 'Occupied' : 'Available',
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Floor Layout / Tables</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tables.map((t) => (
          <div
            key={t.id}
            className={`p-6 rounded-lg text-center font-bold border ${
              t.status === 'Occupied' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
            }`}
          >
            <div>{t.number}</div>
            <div className="text-xs font-normal mt-1">{t.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;