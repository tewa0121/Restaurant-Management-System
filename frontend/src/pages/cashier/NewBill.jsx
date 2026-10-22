import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Minus, Trash2, Printer, CheckCircle, ArrowLeft } from 'lucide-react';
import { mockDatabase } from '../../data/mockData';

export default function NewBill() {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [selectedTable, setSelectedTable] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // --- DATA FETCHING ---
  // Only show tables that are currently 'occupied'
  const occupiedTables = mockDatabase.tables.filter(t => t.status === 'occupied');
  
  // Filter menu items by search
  const filteredMenu = mockDatabase.menu_items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- CART LOGIC ---
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, amount) => {
    setCart((prev) => prev.map(i => 
      i.id === id ? { ...i, quantity: Math.max(1, i.quantity + amount) } : i
    ));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter(i => i.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // --- SUBMIT BILL ---
  const handleGenerateBill = () => {
    if (!selectedTable) return alert('Please select a table first!');
    if (cart.length === 0) return alert('Please add items to the bill!');
    
    setIsSuccess(true);
    
    // After 2 seconds, reset the form and go back to active bills
    setTimeout(() => {
      setIsSuccess(false);
      setCart([]);
      setSelectedTable(null);
      navigate('/cashier/active-bills');
    }, 2000);
  };

  return (
    <div className="relative space-y-6 font-sans">
      
      {/* SUCCESS TOAST */}
      {isSuccess && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-green-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3">
          <CheckCircle size={24} />
          <span className="font-bold text-lg">Bill Generated Successfully!</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/cashier')} className="p-2 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Bill</h1>
          <p className="text-gray-500 text-sm mt-1">Select a table and add items to generate a bill.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-180px)]">
        
        {/* COLUMN 1: TABLE SELECTION */}
        <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">1. Select Table</h3>
          <div className="grid grid-cols-3 lg:grid-cols-2 gap-3 overflow-y-auto flex-1">
            {occupiedTables.map(table => (
              <button
                key={table.id}
                onClick={() => setSelectedTable(table)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  selectedTable?.id === table.id 
                    ? 'bg-green-50 border-green-500 text-green-700 shadow-sm ring-1 ring-green-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300'
                }`}
              >
                <p className="text-lg font-bold">T{table.table_number}</p>
                <p className="text-xs text-gray-500">{table.capacity} seats</p>
              </button>
            ))}
            {occupiedTables.length === 0 && (
              <p className="text-sm text-gray-500 col-span-full text-center mt-4">No occupied tables available.</p>
            )}
          </div>
        </div>

        {/* COLUMN 2: MENU ITEMS */}
        <div className="w-full lg:w-2/4 bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 border-b pb-2">
            <h3 className="font-bold text-gray-800">2. Select Items</h3>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search menu..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto flex-1">
            {filteredMenu.map(item => (
              <div 
                key={item.id} 
                onClick={() => addToCart(item)}
                className="p-3 border border-gray-100 rounded-xl cursor-pointer hover:shadow-md hover:border-green-400 transition-all flex flex-col justify-between bg-white"
              >
                <p className="font-bold text-gray-800 text-sm leading-tight">{item.name}</p>
                <p className="text-green-600 font-bold mt-2">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 3: CURRENT BILL */}
        <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="font-bold text-gray-800">3. Current Bill</h3>
            {selectedTable && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                T-{selectedTable.table_number}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px]">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm border-b pb-3">
                <div className="flex-1 pr-2">
                  <p className="font-bold text-gray-800 leading-tight">{item.name}</p>
                  <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                </div>
                
                <div className="flex items-center gap-1 bg-gray-50 border rounded-lg p-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-200 rounded"><Minus size={12} /></button>
                  <span className="font-bold w-6 text-center text-xs">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-200 rounded"><Plus size={12} /></button>
                </div>
                
                <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded ml-2"><Trash2 size={16} /></button>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                <Printer size={32} className="mb-2 opacity-30" />
                <p className="text-sm text-center">No items added yet.<br/>Select a table and click items.</p>
              </div>
            )}
          </div>

          <div className="border-t pt-4 mt-2">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span className="text-gray-600">Total</span>
              <span className="text-green-600">${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleGenerateBill}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-600/20"
            >
              <Printer size={18} /> Generate Bill
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}