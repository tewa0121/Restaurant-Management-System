import React, { useState } from 'react';
import { Search, CreditCard, DollarSign, Printer, X, CheckCircle, Smartphone } from 'lucide-react';
import { mockDatabase } from '../../data/mockData';

import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';




export default function ActiveBills() {
  // 1. STATE MANAGEMENT
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState(null); // Controls Payment Modal
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isSuccess, setIsSuccess] = useState(false);

  // 2. DATA FETCHING (Get only unpaid or held invoices)
  const activeInvoices = mockDatabase.invoices.filter(inv => 
    inv.status === 'unpaid' || inv.status === 'held' || inv.status === 'partially_paid'
  ).map(inv => {
    // Join with order data to get table number
    const order = mockDatabase.orders.find(o => o.id === inv.order_id);
    const customer = order ? mockDatabase.customers.find(c => c.id === order.customer_id) : null;
    
    return {
      ...inv,
      tableNumber: order ? order.table_id : 'Takeaway',
      customerName: customer ? `${customer.first_name} ${customer.last_name}` : 'Walk-in'
    };
  });

  // 3. FILTER LOGIC
  const filteredBills = activeInvoices.filter(bill => 
    bill.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 4. HANDLE PAYMENT
  const handleProcessPayment = () => {
    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
      // In a real app, you would update the database here.
      // After 2 seconds, close the modal
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedBill(null);
      }, 2000);
    }, 500);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Active Bills</h1>
        <p className="text-gray-500 text-sm mt-1">Manage pending payments and process checkout.</p>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
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
      </div>

      {/* BILLS TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[700px]">
            <thead className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Bill No.</th>
                <th className="px-6 py-4 font-medium">Table</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Amount Due</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-[#6366F1] font-bold">#{bill.invoice_number}</td>
                  <td className="px-6 py-4 text-gray-600">Table {bill.tableNumber}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{bill.customerName}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">${bill.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bill.status === 'unpaid' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {bill.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedBill(bill)}
                      className="bg-green-50 text-green-600 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                      Receive Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBills.length === 0 && (
          <div className="text-center py-10 text-gray-500">No active bills found.</div>
        )}
      </div>

      {/* PAYMENT MODAL */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            
            {/* If payment is successful, show this screen */}
            {isSuccess ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-500">Bill #{selectedBill.invoice_number} has been paid.</p>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Process Payment</h3>
                  <button onClick={() => setSelectedBill(null)} className="text-gray-400 hover:text-gray-700">
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500 mb-1">Amount Due</p>
                    <h2 className="text-4xl font-bold text-gray-900">${selectedBill.total.toFixed(2)}</h2>
                    <p className="text-xs text-[#6366F1] font-medium mt-1">Bill #{selectedBill.invoice_number}</p>
                  </div>

                  <h4 className="text-sm font-medium text-gray-700 mb-3">Select Payment Method</h4>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <button 
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <DollarSign size={24} className={paymentMethod === 'cash' ? 'text-green-600' : 'text-gray-500'} />
                      <span className="font-semibold text-xs">Cash</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <CreditCard size={24} className={paymentMethod === 'card' ? 'text-green-600' : 'text-gray-500'} />
                      <span className="font-semibold text-xs">Card</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('telebirr')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'telebirr' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <Smartphone size={24} className={paymentMethod === 'telebirr' ? 'text-green-600' : 'text-gray-500'} />
                      <span className="font-semibold text-xs">Telebirr</span>
                    </button>
                  </div>

                  <button 
                    onClick={handleProcessPayment}
                    className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Confirm Payment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}