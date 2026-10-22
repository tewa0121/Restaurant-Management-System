import React, { useState } from 'react';
import { Users, Clock, ChevronRight, LayoutGrid, List } from 'lucide-react';

export default function Tables() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Mock Data for Tables
  const tables = [
    { id: 1, name: 'Table 1', status: 'available', seats: 4, time: null },
    { id: 2, name: 'Table 2', status: 'occupied', seats: 2, time: '12:30 PM', amount: '$45.50' },
    { id: 3, name: 'Table 3', status: 'attention', seats: 4, time: '12:15 PM', amount: '$32.00' },
    { id: 4, name: 'Table 4', status: 'available', seats: 6, time: null },
    { id: 5, name: 'Table 5', status: 'occupied', seats: 4, time: '1:00 PM', amount: '$78.20' },
    { id: 6, name: 'Table 6', status: 'reserved', seats: 2, time: '1:30 PM' },
    { id: 7, name: 'Table 7', status: 'available', seats: 2, time: null },
    { id: 8, name: 'Table 8', status: 'occupied', seats: 8, time: '12:45 PM', amount: '$120.00' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-50 border-green-200 text-green-700 hover:border-green-400';
      case 'occupied': return 'bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-400';
      case 'attention': return 'bg-red-50 border-red-200 text-red-700 hover:border-red-400 animate-pulse';
      case 'reserved': return 'bg-purple-50 border-purple-200 text-purple-700 hover:border-purple-400';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available': return <span className="bg-green-200 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Available</span>;
      case 'occupied': return <span className="bg-blue-200 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Occupied</span>;
      case 'attention': return <span className="bg-red-200 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Needs Help</span>;
      case 'reserved': return <span className="bg-purple-200 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Reserved</span>;
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      
      {/* Header & View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Floor Plan</h1>
          <p className="text-sm text-gray-500">Tap a table to manage the order</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border shadow-sm">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-gray-700'}`}
          >
            <LayoutGrid size={20} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-gray-700'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400"></span> Available</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-400"></span> Occupied</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></span> Needs Attention</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-400"></span> Reserved</div>
      </div>

      {/* Tables Grid/List */}
      <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}>
        {tables.map((table) => (
          <div 
            key={table.id}
            className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex ${viewMode === 'grid' ? 'flex-col justify-between min-h-[140px]' : 'flex-row items-center justify-between'} ${getStatusColor(table.status).split(' ')[0]} ${getStatusColor(table.status).split(' ')[1]} ${getStatusColor(table.status).split(' ')[2]}`}
          >
            <div className={`flex justify-between items-start ${viewMode === 'grid' ? 'w-full' : 'w-1/3'}`}>
              <div>
                <h3 className="font-bold text-lg text-gray-800">{table.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <Users size={14} /> {table.seats} Seats
                </div>
              </div>
              {viewMode === 'grid' && getStatusBadge(table.status)}
            </div>

            <div className={`flex-1 ${viewMode === 'grid' ? 'mt-4 pt-4 border-t border-black/5' : 'flex items-center justify-between px-6'}`}>
              {table.status === 'occupied' || table.status === 'attention' ? (
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="text-xs text-gray-500">Active Bill</p>
                    <p className="font-bold">{table.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Since</p>
                    <p className="text-sm font-medium flex items-center gap-1 justify-end"><Clock size={12}/> {table.time}</p>
                  </div>
                </div>
              ) : table.status === 'reserved' ? (
                <div>
                   <p className="text-xs text-gray-500">Reserved For</p>
                   <p className="text-sm font-medium">{table.time}</p>
                </div>
              ) : (
                <div className="text-sm font-medium flex items-center gap-1 opacity-70">
                  Tap to start order <ChevronRight size={16} />
                </div>
              )}
            </div>
            
            {viewMode === 'list' && (
               <div className="w-1/4 flex justify-end">
                 {getStatusBadge(table.status)}
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}