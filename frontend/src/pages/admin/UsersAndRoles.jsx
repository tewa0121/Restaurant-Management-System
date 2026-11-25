import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, X, Search } from 'lucide-react';
import userService from '../../services/userService';

const ROLES_LIST = ['admin', 'manager', 'cashier', 'kitchen', 'waiter', 'customer'];

export default function UsersAndRoles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tempPasswordNotice, setTempPasswordNotice] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'waiter',
    phone: '',
    status: 'active',
  });

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getUsers({ limit: 100 });
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      fullName: '',
      email: '',
      role: 'waiter',
      phone: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (usr) => {
    setEditingUser(usr);
    const primaryRole = Array.isArray(usr.roles) && usr.roles.length > 0
      ? usr.roles[0]
      : usr.role || 'waiter';
    setFormData({
      fullName: usr.fullName || usr.full_name || usr.name || '',
      email: usr.email || '',
      role: String(primaryRole).toLowerCase(),
      phone: usr.phone || '',
      status: String(usr.status || 'active').toLowerCase(),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) return;
    setSaving(true);
    setError('');
    setTempPasswordNotice('');
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        role: formData.role,
        phone: formData.phone.trim() || undefined,
        status: formData.status,
      };

      if (editingUser) {
        await userService.updateUser(editingUser.id, payload);
      } else {
        const res = await userService.addUser(payload);
        if (res?.temporaryPassword) {
          setTempPasswordNotice(
            `Created ${payload.email} with temporary password: ${res.temporaryPassword}`
          );
        }
      }

      setIsModalOpen(false);
      setEditingUser(null);
      await loadUsers();
    } catch (err) {
      setError(err.message || 'Failed to save user.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user ${name}?`)) return;
    setError('');
    try {
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete user.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const name = String(u.fullName || u.full_name || u.name || '').toLowerCase();
    const email = String(u.email || '').toLowerCase();
    const rolesArr = Array.isArray(u.roles) ? u.roles.map((r) => String(r).toLowerCase()) : [];
    const singleRole = String(u.role || '').toLowerCase();
    const q = searchTerm.trim().toLowerCase();

    const matchesSearch = !q || name.includes(q) || email.includes(q);
    const matchesRole =
      selectedRole === 'All' ||
      singleRole === selectedRole.toLowerCase() ||
      rolesArr.includes(selectedRole.toLowerCase());

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Users & Roles
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage system accounts, role assignments, and account status.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {tempPasswordNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold">
          {tempPasswordNotice}
        </div>
      )}

      <div className="bg-white dark:bg-[#122448] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl text-xs outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {['All', ...ROLES_LIST].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize cursor-pointer ${
                selectedRole === r
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#122448] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/40 text-gray-400 uppercase font-extrabold text-[10px]">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const displayName = u.fullName || u.full_name || u.name || 'User';
                  const roleDisplay =
                    Array.isArray(u.roles) && u.roles.length > 0
                      ? u.roles.join(', ')
                      : u.role || 'customer';
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                      <td className="p-4 font-bold text-gray-900 dark:text-white">{displayName}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4 capitalize font-semibold">{roleDisplay}</td>
                      <td className="p-4 capitalize font-bold">{u.status || 'active'}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(u.id, displayName)}
                          className="p-1.5 bg-rose-50 text-rose-600 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#122448] w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs text-gray-800 dark:text-white">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="font-extrabold uppercase">
                {editingUser ? 'Edit User' : 'Add User'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">FULL NAME</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">EMAIL</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">ROLE</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none capitalize"
                  >
                    {ROLES_LIST.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">STATUS</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">PHONE</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 disabled:opacity-60 text-white rounded-xl font-bold cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}