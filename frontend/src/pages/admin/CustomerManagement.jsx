// src/pages/admin/CustomerManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  Award, 
  X, 
  CheckCircle 
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/formatters';

const initialCustomers = [
  { id: 1, name: 'Abebe Bikila', email: 'abebe@example.com', phone: '+251911223344', visits: 12, totalSpent: 240.50, status: 'VIP' },
  { id: 2, name: 'Kebede Tassew', email: 'kebede@example.com', phone: '+251922334455', visits: 5, totalSpent: 85.00, status: 'Regular' },
  { id: 3, name: 'Marta Hailu', email: 'marta@example.com', phone: '+251933445566', visits: 1, totalSpent: 18.25, status: 'New' },
];

export default function CustomerManagement() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Regular',
  });

  const { showNotification } = useNotification();

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
      });
    } else {
      setEditingCustomer(null);
      setFormData({ name: '', email: '', phone: '', status: 'Regular' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id ? { ...c, ...formData } : c
        )
      );
      showNotification('Customer updated successfully!', 'success');
    } else {
      const newCustomer = {
        id: Date.now(),
        ...formData,
        visits: 0,
        totalSpent: 0,
      };
      setCustomers((prev) => [newCustomer, ...prev]);
      showNotification('New customer added successfully!', 'success');
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      showNotification('Customer deleted successfully!', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-600" /> Customer Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage restaurant customers, track visits, and view loyalty status.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Add New Customer
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <th className="p-4">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Visits</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-semibold text-slate-800 dark:text-white">
                      {customer.name}
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-xs">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-xs">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {customer.phone}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                      {customer.visits} visits
                    </td>
                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        customer.status === 'VIP'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          : customer.status === 'Regular'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(customer)}
                        className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-slate-500 dark:text-slate-400">
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {editingCustomer ? 'Edit Customer Details' : 'Add New Customer'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Status Level
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="New">New</option>
                  <option value="Regular">Regular</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-md"
                >
                  {editingCustomer ? 'Save Changes' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}