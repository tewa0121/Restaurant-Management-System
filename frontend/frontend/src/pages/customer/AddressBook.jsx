import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

export default function AddressBook() {
  const [addresses, setAddresses] = useState([
    { id: 1, title: 'Home', address: '123 Main Street, Apt 4B, New York, NY 10001', isDefault: true },
    { id: 2, title: 'Office', address: '456 Market St, Suite 200, New York, NY 10005', isDefault: false },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const setDefault = (id) => {
    setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: addr.id === id })));
  };

  const deleteAddress = (id) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newTitle || !newAddress) return;
    setAddresses(prev => [
      ...prev,
      { id: Date.now(), title: newTitle, address: newAddress, isDefault: prev.length === 0 }
    ]);
    setNewTitle('');
    setNewAddress('');
    setShowModal(false);
  };

  return (
    <div className="space-y-5 pb-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Address Book</h1>
          <p className="text-xs text-gray-400">Manage your saved delivery addresses</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus size={14} /> Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((item) => (
          <div 
            key={item.id} 
            className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between ${
              item.isDefault ? 'border-green-500 shadow-sm ring-1 ring-green-100' : 'border-gray-100'
            }`}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-green-600" />
                  <h3 className="font-bold text-xs text-gray-900">{item.title}</h3>
                </div>
                {item.isDefault && (
                  <span className="bg-green-50 text-green-600 border border-green-200 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10} /> Default
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 pl-6">{item.address}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4 pl-6">
              {!item.isDefault ? (
                <button 
                  onClick={() => setDefault(item.id)}
                  className="text-xs font-bold text-green-600 hover:text-green-700 cursor-pointer"
                >
                  Set as Default
                </button>
              ) : <span />}

              <button 
                onClick={() => deleteAddress(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddAddress} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-gray-900">Add Delivery Address</h3>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Label (e.g. Home, Office)</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-green-500 focus:outline-none"
                placeholder="Home"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Full Street Address</label>
              <textarea 
                rows="3"
                value={newAddress}
                onChange={e => setNewAddress(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-green-500 focus:outline-none"
                placeholder="123 Main St..."
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-green-600 text-white font-bold text-xs rounded-xl hover:bg-green-700"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}