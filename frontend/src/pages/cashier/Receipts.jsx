import React, { useState } from 'react';
import { Search, Printer, X, FileText } from 'lucide-react';
import { mockDatabase } from '../../data/mockData';

export default function Receipts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // 1. SAFE DATA FETCHING
  const payments = mockDatabase?.payments || [];
  const invoices = mockDatabase?.invoices || [];
  const orders = mockDatabase?.orders || [];
  const customers = mockDatabase?.customers || [];

  // 2. MAP WITH SAFETY CHECKS
  const receipts = payments.map(payment => {
    const invoice = invoices.find(inv => inv.id === payment.invoice_id);
    const order = invoice ? orders.find(o => o.id === invoice.order_id) : null;
    const customer = order ? customers.find(c => c.id === order.customer_id) : null;
    
    return {
      ...payment,
      invoiceNumber: invoice?.invoice_number || 'N/A',
      customerName: customer ? `${customer.first_name} ${customer.last_name}` : 'Walk-in',
      total: invoice?.total || payment.amount || 0,
      date: payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : 'N/A'
    };
  });

  const filteredReceipts = receipts.filter(r => 
    r.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans p-4 md:p-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Receipts</h1>
        <p className="text-gray-500 text-sm mt-1">View and reprint receipts for completed orders.</p>
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
          <table className="w-full text-sm text-left min-w-[600px]">
            <thead className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Bill No.</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredReceipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-[#6366F1] font-bold">#{receipt.invoiceNumber}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{receipt.customerName}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">${Number(receipt.total).toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-500">{receipt.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedReceipt(receipt)}
                      className="bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <Printer size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredReceipts.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <FileText size={40} className="mx-auto text-gray-300 mb-3" />
            No receipts found.
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center">
            <FileText size={40} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Receipt Preview</h2>
            <p className="text-gray-500 text-sm mb-6">Bill #{selectedReceipt.invoiceNumber}</p>
            
            <button onClick={() => setSelectedReceipt(null)} className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}