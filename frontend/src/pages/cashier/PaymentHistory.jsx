import React, { useState } from 'react';
import { Search, Eye, Download, X, CheckCircle } from 'lucide-react';
import { mockDatabase } from '../../data/mockData';

export default function PaymentHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);

  // 1. SAFE DATA FETCHING
  const payments = mockDatabase?.payments || [];
  const invoices = mockDatabase?.invoices || [];

  // 2. MAP WITH SAFETY CHECKS
  const history = payments.map(payment => {
    const invoice = invoices.find(inv => inv.id === payment.invoice_id);
    return {
      ...payment,
      invoiceNumber: invoice?.invoice_number || 'N/A',
      date: payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : 'N/A'
    };
  });

  const filteredPayments = history.filter(p => 
    p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans p-4 md:p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-500 text-sm mt-1">View all received payments.</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm">
          <Download size={16} /> Export
        </button>
      </div>

      {/* SEARCH */}
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

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[700px]">
            <thead className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Bill No.</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">TXN-{payment.id}00{payment.id}</td>
                  <td className="px-6 py-4 text-[#6366F1] font-bold">#{payment.invoiceNumber}</td>
                  <td className="px-6 py-4 text-gray-600 capitalize">
                    {payment.payment_method ? payment.payment_method.replace('_', ' ') : 'Cash'}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">${Number(payment.amount || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-500">{payment.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedPayment(payment)}
                      className="text-gray-400 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
          <div className="text-center py-10 text-gray-500">No payments found.</div>
        )}
      </div>

      {/* MODAL */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">${Number(selectedPayment.amount || 0).toFixed(2)}</h2>
            <p className="text-gray-500 text-sm mb-6">Payment Successful</p>
            
            <button onClick={() => setSelectedPayment(null)} className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}