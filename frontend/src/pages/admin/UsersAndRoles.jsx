// src/pages/admin/UsersAndRoles.jsx
import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit, X, Search } from 'lucide-react';

export default function UsersAndRoles() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Tewachew Melaku', email: 'admin@resto.com', role: 'Super Administrator', status: 'Active' },
    { id: 2, name: 'John Doe', email: 'john@resto.com', role: 'Waiter', status: 'Active' },
    { id: 3, name: 'Sara Smith', email: 'sara@resto.com', role: 'Cashier', status: 'Active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = Create, object = Edit
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Waiter',
    status: 'Active',
  });

  // Open modal for Create New User
  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'Waiter', status: 'Active' });
    setIsModalOpen(true);
  };

  // Open modal for Edit User
  const handleOpenEdit = (usr) => {
    setEditingUser(usr);
    setFormData({
      name: usr.name,
      email: usr.email,
      role: usr.role,
      status: usr.status,
    });
    setIsModalOpen(true);
  };

  // Handle Form Submit (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      // Create new user
      const newUser = {
        id: Date.now(),
        ...formData,
      };
      setUsers([newUser, ...users]);
    }

    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Handle Delete with Confirmation
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(usr => {
    const matchesSearch = usr.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          usr.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || usr.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Section */}
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Users & Roles</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage staff accounts, access permissions, and role assignments.</p>
        </div>
        <button 
          onClick={handleOpenAdd} 
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-[#122448] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl text-xs outline-none text-gray-800 dark:text-gray-100"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Super Administrator', 'Manager', 'Cashier', 'Waiter'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedRole === role 
                  ? 'bg-gray-900 dark:bg-brand text-white shadow-md' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-[#122448] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/40 text-gray-400 uppercase font-extrabold text-[10px]">
                <th className="p-4">Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="p-4 font-bold flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center font-bold">👤</div>
                      <span>{usr.name}</span>
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{usr.email}</td>
                    <td className="p-4 font-semibold text-brand">{usr.role}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        usr.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' 
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'
                      }`}>
                        {usr.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenEdit(usr)} 
                        className="p-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer transition"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(usr.id, usr.name)} 
                        className="p-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#122448] w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs text-gray-800 dark:text-white animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="font-extrabold uppercase">{editingUser ? 'Edit User Account' : 'Register New User'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">FULL NAME</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Samuel Abebe"
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white" 
                />
              </div>

              <div>
                <label className="font-bold block mb-1">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  required 
                  placeholder="user@resto.com"
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">ROLE</label>
                  <select 
                    value={formData.role} 
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
                  >
                    <option value="Super Administrator">Super Administrator</option>
                    <option value="Manager">Manager</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Waiter">Waiter</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">STATUS</label>
                  <select 
                    value={formData.status} 
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold cursor-pointer text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg cursor-pointer"
                >
                  {editingUser ? 'Update User' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}