import React, { useState } from 'react';
import { Users, Clock, Plus, ChevronRight, LayoutGrid, List, Utensils } from 'lucide-react';

export default function MyTables() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Mock data representing the restaurant floor
  const tables = [
    { id: 1, name: 'Table 1', status: 'available', seats: 4, time: null, amount: null },
    { id: 2, name: 'Table 2', status: 'occupied', seats: 2, time: '12:30 PM', amount: '$45.50' },
    { id: 3, name: 'Table 3', status: 'attention', seats: 4, time: '12:15 PM', amount: '$32.00' },
    { id: 4, name: 'Table 4', status: 'available', seats: 6, time: null, amount: null },
    { id: 5, name: 'Table 5', status: 'occupied', seats: 4, time: '1:00 PM', amount: '$78.20' },
    { id: 6, name: 'Table 6', status: 'reserved', seats: 2, time: '1:30 PM', amount: null },
    { id: 7, name: 'Table 7', status: 'available', seats: 2, time: null, amount: null },
    { id: 8, name: 'Table 8', status: 'occupied', seats: 8, time: '12:45 PM', amount: '$120.00' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-white border-green-200 hover:border-green-400 text-gray-800';
      case 'occupied': return 'bg-blue-50 border-blue-200 hover:border-blue-400 text-gray-800';
      case 'attention': return 'bg-red-50 border-red-300 hover:border-red-500 text-gray-800 animate-pulse';
      case 'reserved': return 'bg-purple-50 border-purple-200 hover:border-purple-400 text-gray-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available': return <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Available</span>;
      case 'occupied': return <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Occupied</span>;
      case 'attention': return <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Needs Help</span>;
      case 'reserved': return <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Reserved</span>;
      default: return null;
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto pb-24">
      
      {/* Header & View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Floor Plan</h1>
          <p className="text-sm text-gray-500">Tap a table to manage orders or start a new one</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            <Plus size={16} /> New Order
          </button>
          
          <div className="flex bg-white rounded-lg p-1 border shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 bg-white p-3 rounded-lg border shadow-sm w-fit">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400"></span> Available</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-400"></span> Occupied</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></span> Needs Attention</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-400"></span> Reserved</div>
      </div>

      {/* Tables Container */}
      <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "flex flex-col gap-3"}>
        {tables.map((table) => (
          <div 
            key={table.id}
            className={`rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex ${viewMode === 'grid' ? 'flex-col justify-between min-h-[160px]' : 'flex-row items-center justify-between'} ${getStatusColor(table.status)}`}
          >
            {/* Top Row: Name & Seats */}
            <div className={`flex justify-between items-start ${viewMode === 'grid' ? 'w-full' : 'w-1/3'}`}>
              <div>
                <h3 className="font-bold text-lg">{table.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <Users size={14} /> {table.seats} Seats
                </div>
              </div>
              {viewMode === 'grid' && getStatusBadge(table.status)}
            </div>

            {/* Bottom Row: Status details */}
            <div className={`flex-1 ${viewMode === 'grid' ? 'mt-4 pt-3 border-t border-gray-200/50' : 'flex items-center justify-between px-6'}`}>
              {(table.status === 'occupied' || table.status === 'attention') ? (
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-semibold">Active Bill</p>
                    <p className="font-bold text-gray-800">{table.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-semibold">Since</p>
                    <p className="text-sm font-medium flex items-center gap-1 justify-end"><Clock size={12}/> {table.time}</p>
                  </div>
                </div>
              ) : table.status === 'reserved' ? (
                <div>
                   <p className="text-[10px] text-gray-500 uppercase font-semibold">Reserved For</p>
                   <p className="text-sm font-medium flex items-center gap-1"><Clock size={12}/> {table.time}</p>
                </div>
              ) : (
                <div className="text-sm font-semibold flex items-center justify-between gap-1 text-green-600 w-full">
                  <span className="flex items-center gap-1"><Utensils size={14}/> Tap to start</span>
                  <ChevronRight size={16} />
                </div>
              )}
            </div>
            
            {/* List View Status Badge */}
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