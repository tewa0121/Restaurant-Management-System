import React, { useState } from 'react';
import { Bell, CheckCircle, Clock, Search } from 'lucide-react';

export default function CustomerRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for customer requests
  const [requests, setRequests] = useState([
    { id: 1, table: 'Table 7', request: 'Extra Napkins', time: '2 min ago', status: 'pending' },
    { id: 2, table: 'Table 12', request: 'More Water', time: '5 min ago', status: 'pending' },
    { id: 3, table: 'Table 3', request: 'Check on Order', time: '8 min ago', status: 'in-progress' },
    { id: 4, table: 'Table 5', request: 'Bring the Bill', time: '10 min ago', status: 'pending' },
    { id: 5, table: 'Table 9', request: 'Extra Cutlery', time: '15 min ago', status: 'resolved' },
  ]);

  // Handle Resolving a request
  const handleResolve = (id) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'resolved' } : req
    ));
  };

  // Filter requests by table or request type
  const filteredRequests = requests.filter(req => 
    req.table.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.request.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Manage live requests from your assigned tables.</p>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by table or request..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
          />
        </div>
      </div>

      {/* REQUESTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRequests.map((req) => (
          <div 
            key={req.id} 
            className={`bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-between ${
              req.status === 'resolved' ? 'border-gray-100 opacity-60' : 'border-orange-200'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${
                    req.status === 'resolved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    <Bell size={18} />
                  </div>
                  <h3 className="font-bold text-gray-800">{req.table}</h3>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> {req.time}
                </span>
              </div>
              <p className="text-gray-600 font-medium mb-4">{req.request}</p>
            </div>

            <div className="flex justify-between items-center border-t border-gray-50 pt-3">
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                req.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                req.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              }`}>
                {req.status.toUpperCase()}
              </span>

              {req.status !== 'resolved' && (
                <button 
                  onClick={() => handleResolve(req.id)}
                  className="flex items-center gap-1 text-xs font-bold text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <CheckCircle size={14} /> Resolve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100">
          No customer requests found.
        </div>
      )}

    </div>
  );
}