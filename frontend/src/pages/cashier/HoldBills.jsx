import React, { useState } from 'react';
import { Search, Play, Trash2, X, AlertTriangle, Clock } from 'lucide-react';
import { mockDatabase } from '../../data/mockData';

export default function HoldBills() {
  // 1. STATE MANAGEMENT
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [actionType, setActionType] = useState(null); // 'resume' or 'cancel'
  const [isProcessing, setIsProcessing] = useState(false);

  // 2. DATA FETCHING
  // Filter invoices that have status 'held'
  const heldInvoices = mockDatabase.invoices.filter(inv => inv.status === 'held').map(inv => {
    const order = mockDatabase.orders.find(o => o.id === inv.order_id);
    const customer = order ? mockDatabase.customers.find(c => c.id === order.customer_id) : null;
    
    return {
      ...inv,
      tableNumber: order ? order.table_id : 'Takeaway',
      customerName: customer ? `${customer.first_name} ${customer.last_name}` : 'Walk-in',
      heldSince: "10 mins ago" // Mocked timestamp
    };
  });

  // 3. FILTER LOGIC
  const filteredBills = heldInvoices.filter(bill => 
    bill.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 4. HANDLE ACTION (Resume or Cancel)
  const handleConfirmAction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Simulate API call success
      setIsProcessing(false);
      setSelectedBill(null);
      setActionType(null);
      alert(`Bill #${selectedBill.invoice_number} has been ${actionType === 'resume' ? 'resumed' : 'cancelled'}.`);
    }, 1000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hold Bills</h1>
        <p className="text-gray-500 text-sm mt-1">Manage bills that are paused or waiting for customers.</p>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Bill Number..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
          />
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1.5 rounded-lg">
          <Clock size={16} /> {filteredBills.length} Bills on Hold
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[700px]">
            <thead className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Bill No.</th>
                <th className="px-6 py-4 font-medium">Table</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Held Since</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-[#6366F1] font-bold">#{bill.invoice_number}</td>
                  <td className="px-6 py-4 text-gray-600">Table {bill.tableNumber}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{bill.customerName}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">${bill.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-orange-600 font-medium">{bill.heldSince}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => { setSelectedBill(bill); setActionType('resume'); }}
                      className="bg-green-50 text-green-600 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                      Resume
                    </button>
                    <button 
                      onClick={() => { setSelectedBill(bill); setActionType('cancel'); }}
                      className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBills.length === 0 && (
          <div className="text-center py-10 text-gray-500">No held bills found.</div>
        )}
      </div>

      {/* CONFIRMATION MODAL */}
      {selectedBill && actionType && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center">
            
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              actionType === 'resume' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {actionType === 'resume' ? <Play size={32} /> : <AlertTriangle size={32} />}
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {actionType === 'resume' ? 'Resume Bill?' : 'Cancel Bill?'}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to {actionType} <strong>Bill #{selectedBill.invoice_number}</strong> for ${selectedBill.total.toFixed(2)}?
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => { setSelectedBill(null); setActionType(null); }}
                disabled={isProcessing}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Go Back
              </button>
              <button 
                onClick={handleConfirmAction}
                disabled={isProcessing}
                className={`flex-1 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 ${
                  actionType === 'resume' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isProcessing ? 'Processing...' : `Yes, ${actionType}`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}