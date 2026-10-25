// src/pages/manager/Employees.jsx
import React, { useState } from 'react';
import { Users, Plus, Search, Edit3, Trash2, X, Phone, Mail, Clock, AlertTriangle } from 'lucide-react';
import { mockDatabase } from '../../data/mockData';

export default function Employees() {
  const [employees, setEmployees] = useState(
    (mockDatabase.employees || []).map(emp => ({
      ...emp,
      shift_status: emp.shift_status || (Math.random() > 0.3 ? 'active' : 'off_duty')
    }))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShiftStatus, setSelectedShiftStatus] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentEmp, setCurrentEmp] = useState(null);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('Waiter');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shiftStatus, setShiftStatus] = useState('active');

  const roles = ['all', 'Waiter', 'Chef', 'Cashier', 'Manager', 'Delivery'];

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || (emp.role || '').toLowerCase() === selectedRole.toLowerCase();
    const matchesShift = selectedShiftStatus === 'all' || (emp.shift_status || 'active') === selectedShiftStatus;
    return matchesSearch && matchesRole && matchesShift;
  });

  const getShiftBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200';
      case 'on_break':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200';
      case 'off_duty':
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    const newEmp = {
      id: Date.now(),
      first_name: firstName,
      last_name: lastName,
      role,
      email: email || `${firstName.toLowerCase()}@restomanager.com`,
      phone: phone || '+1 (555) 019-2834',
      shift_status: shiftStatus
    };
    setEmployees([newEmp, ...employees]);
    setIsAddOpen(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
  };

  const handleOpenEdit = (emp) => {
    setCurrentEmp(emp);
    setFirstName(emp.first_name || '');
    setLastName(emp.last_name || '');
    setRole(emp.role || 'Waiter');
    setEmail(emp.email || '');
    setPhone(emp.phone || '');
    setShiftStatus(emp.shift_status || 'active');
    setIsEditOpen(true);
  };

  const handleEditEmployee = (e) => {
    e.preventDefault();
    if (!currentEmp) return;
    setEmployees(employees.map(emp => emp.id === currentEmp.id ? {
      ...emp,
      first_name: firstName,
      last_name: lastName,
      role,
      email,
      phone,
      shift_status: shiftStatus
    } : emp));
    setIsEditOpen(false);
    setCurrentEmp(null);
  };

  const confirmDelete = () => {
    if (!currentEmp) return;
    setEmployees(employees.filter(emp => emp.id !== currentEmp.id));
    setIsDeleteOpen(false);
    setCurrentEmp(null);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      {/* Top Banner & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-500" /> Employee & Shift Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor active staff shifts, track roles, and manage team schedules.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search staff..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            />
          </div>
          <select 
            value={selectedShiftStatus}
            onChange={(e) => setSelectedShiftStatus(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Shifts</option>
            <option value="active">Active (On Duty)</option>
            <option value="on_break">On Break</option>
            <option value="off_duty">Off Duty</option>
          </select>
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            {roles.map(r => (
              <option key={r} value={r}>{r === 'all' ? 'All Roles' : r}</option>
            ))}
          </select>
          <button 
            type="button"
            onClick={() => { setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setShiftStatus('active'); setIsAddOpen(true); }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/20 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      {/* Employees Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredEmployees.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            No employees found matching your criteria.
          </div>
        ) : (
          filteredEmployees.map((emp) => (
            <div 
              key={emp.id}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center text-sm shadow-inner">
                    {emp.first_name?.[0]}{emp.last_name?.[0]}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getShiftBadge(emp.shift_status)}`}>
                    {(emp.shift_status || 'active').replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                      {emp.first_name} {emp.last_name}
                    </h3>
                  </div>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                    {emp.role || 'Staff'}
                  </span>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-2 truncate">
                    <Mail className="w-3 h-3 shrink-0" /> {emp.email || 'No email provided'}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                    <Phone className="w-3 h-3 shrink-0" /> {emp.phone || 'No phone provided'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-500" /> Shift: 08:00 AM - 04:00 PM
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    type="button"
                    onClick={() => handleOpenEdit(emp)}
                    className="p-1.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Edit Employee & Shift"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setCurrentEmp(emp); setIsDeleteOpen(true); }}
                    className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Delete Employee"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && currentEmp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Delete {currentEmp.first_name} {currentEmp.last_name}?</h3>
            </div>
            <p className="text-slate-500">Are you sure you want to remove this employee record? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsDeleteOpen(false)} className="px-3 py-1.5 rounded-xl text-slate-500">Cancel</button>
              <button type="button" onClick={confirmDelete} className="px-4 py-1.5 bg-rose-600 text-white rounded-xl font-semibold cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Add New Employee</h3>
              <button type="button" onClick={() => setIsAddOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">First Name</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                    placeholder="John"
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    required 
                    placeholder="Doe"
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Role</label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="Waiter">Waiter</option>
                    <option value="Chef">Chef</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Manager">Manager</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Shift Status</label>
                  <select 
                    value={shiftStatus} 
                    onChange={(e) => setShiftStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="active">Active (On Duty)</option>
                    <option value="on_break">On Break</option>
                    <option value="off_duty">Off Duty</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="john.doe@restomanager.com"
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-2 rounded-xl text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold">Save Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee & Shift Modal */}
      {isEditOpen && currentEmp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Edit Employee & Shift Status</h3>
              <button type="button" onClick={() => setIsEditOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleEditEmployee} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">First Name</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    required 
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Role</label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="Waiter">Waiter</option>
                    <option value="Chef">Chef</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Manager">Manager</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Shift Status</label>
                  <select 
                    value={shiftStatus} 
                    onChange={(e) => setShiftStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="active">Active (On Duty)</option>
                    <option value="on_break">On Break</option>
                    <option value="off_duty">Off Duty</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-3 py-2 rounded-xl text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold">Update Shift & Details</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}