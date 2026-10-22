import React, { useState } from 'react';
import { Search, RotateCcw, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { mockDatabase } from '../../data/mockData';

export default function Refunds() {
  // 1. STATE MANAGEMENT
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('customer_complaint');
  const [isSuccess, setIsSuccess] = useState(false);

  // 2. DATA FETCHING
  // Get all paid invoices from mock data
  const paidInvoices = mockDatabase.invoices.filter(inv => inv.status === 'paid').map(inv => {
    const order = mockDatabase.orders.find(o => o.id === inv.order_id);
    const customer = order ? mockDatabase.customers.find(c => c.id === order.customer_id) : null;
    
    return {
      ...inv,
      tableNumber: order ? order.table_id : 'Takeaway',
      customerName: customer ? `${customer.first_name} ${customer.last_name}` : 'Walk-in',
      paidDate: new Date().toLocaleDateString() // Mocked
    };
  });

  // 3. FILTER LOGIC
  const filteredInvoices = paidInvoices.filter(bill => 
    bill.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 4. HANDLE REFUND SUBMIT
  const handleIssueRefund = (e) => {
    e.preventDefault();
    if (!refundAmount || Number(refundAmount) <= 0) return alert("Please enter a valid amount");
    if (Number(refundAmount) > selectedBill.total) return alert("Refund amount cannot exceed the bill total!");

    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
      // Reset after 2 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedBill(null);
        setRefundAmount('');
      }, 2000);
    }, 500);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Refunds</h1>
        <p className="text-gray-500 text-sm mt-1">Search for a paid bill to issue a refund.</p>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Bill Number or Customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
          />
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
                <th className="px-6 py-4 font-medium">Amount Paid</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInvoices.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-[#6366F1] font-bold">#{bill.invoice_number}</td>
                  <td className="px-6 py-4 text-gray-600">Table {bill.tableNumber}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{bill.customerName}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">${bill.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-500">{bill.paidDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedBill(bill)}
                      className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-end gap-1 ml-auto"
                    >
                      <RotateCcw size={14} /> Issue Refund
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredInvoices.length === 0 && (
          <div className="text-center py-10 text-gray-500">No paid bills found matching your search.</div>
        )}
      </div>

      {/* REFUND MODAL */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            
            {isSuccess ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Refund Processed!</h2>
                <p className="text-gray-500">${refundAmount} has been refunded for Bill #{selectedBill.invoice_number}.</p>
              </div>
            ) : (
              <form onSubmit={handleIssueRefund}>
                
                {/* Modal Header */}
                <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
                  <h3 className="font-bold text-red-700 flex items-center gap-2">
                    <AlertTriangle size={18} /> Issue Refund
                  </h3>
                  <button type="button" onClick={() => setSelectedBill(null)} className="text-red-400 hover:text-red-700">
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <div className="bg-gray-50 p-4 rounded-xl text-center mb-6 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Original Bill Amount</p>
                    <h2 className="text-2xl font-bold text-gray-900">${selectedBill.total.toFixed(2)}</h2>
                    <p className="text-xs text-gray-400 mt-1">Bill #{selectedBill.invoice_number} • {selectedBill.customerName}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount ($)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        max={selectedBill.total}
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg font-bold text-gray-900"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">Maximum: ${selectedBill.total.toFixed(2)}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Refund</label>
                      <select 
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                      >
                        <option value="customer_complaint">Customer Complaint</option>
                        <option value="wrong_order">Wrong Order Served</option>
                        <option value="double_charge">Double Charged</option>
                        <option value="food_quality">Food Quality Issue</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full mt-6 bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={18} /> Process Refund
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}