import React from 'react';

const Notifications = () => {
  const notifications = [
    { id: 1, title: 'New Reservation', message: 'Table 6 reserved for 7:30 PM.', time: '10 mins ago' },
    { id: 2, title: 'Order Ready', message: 'Order #102 for Table 3 is ready at the pass.', time: '15 mins ago' },
    { id: 3, title: 'Inventory Warning', message: 'Burger Buns are running low.', time: '1 hour ago' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((n) => (
          <div key={n.id} className="bg-white p-4 rounded-lg shadow border border-l-4 border-l-indigo-500">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold text-gray-800">{n.title}</h3>
              <span className="text-xs text-gray-400">{n.time}</span>
            </div>
            <p className="text-sm text-gray-600">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;