import React from 'react';
import { Bell, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    { id: 1, title: 'Order Ready', desc: 'Order #ORD-1248 from Table 12 is ready to serve.', time: '2 min ago', type: 'success', read: false },
    { id: 2, title: 'New Customer Request', desc: 'Table 7 requested Extra Napkins.', time: '5 min ago', type: 'warning', read: false },
    { id: 3, title: 'Reservation Arrived', desc: 'Reservation for Table 8 at 7:00 PM has arrived.', time: '15 min ago', type: 'info', read: true },
    { id: 4, title: 'Shift Update', desc: 'Your shift ends in 30 minutes.', time: '1 hour ago', type: 'system', read: true },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="text-green-600" size={20} />;
      case 'warning': return <AlertTriangle className="text-orange-500" size={20} />;
      case 'info': return <Bell className="text-blue-600" size={20} />;
      default: return <Clock className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500 text-sm mt-1">Stay updated with your tables and orders.</p>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Recent Notifications</h3>
          <button className="text-sm text-green-600 font-medium hover:underline">Mark all as read</button>
        </div>
        
        <div className="divide-y divide-gray-50">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 flex items-start gap-4 transition-colors hover:bg-gray-50 ${!notif.read ? 'bg-green-50/30' : ''}`}
            >
              <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 shrink-0 mt-1">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-800 text-sm">{notif.title}</h4>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{notif.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notif.desc}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}