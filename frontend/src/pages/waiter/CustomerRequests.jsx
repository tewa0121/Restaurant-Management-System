import React, { useState } from 'react';

const CustomerRequests = () => {
  const [requests, setRequests] = useState([
    { id: 1, table: 'Table 4', type: 'Extra Napkins & Water', time: '5 mins ago', status: 'Pending' },
    { id: 2, table: 'Table 12', type: 'Bill / Check Request', time: '12 mins ago', status: 'Pending' },
    { id: 3, table: 'Table 2', type: 'Assistance Needed', time: '20 mins ago', status: 'Resolved' },
  ]);

  const markResolved = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Customer Requests</h1>
      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
            <div>
              <span className="font-semibold text-lg text-indigo-600">{req.table}</span>
              <p className="text-gray-700">{req.type}</p>
              <span className="text-xs text-gray-400">{req.time}</span>
            </div>
            <div>
              {req.status === 'Pending' ? (
                <button
                  onClick={() => markResolved(req.id)}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md font-medium"
                >
                  Mark Resolved
                </button>
              ) : (
                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">Resolved</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerRequests;