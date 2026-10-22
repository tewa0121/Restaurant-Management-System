import React, { useState } from 'react';
import { User, Lock, DollarSign, Save, CheckCircle, Smartphone, Bell } from 'lucide-react';

export default function Settings() {
  // 1. STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaved, setIsSaved] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState({
    name: 'Michael Cashier',
    email: 'michael@resto.com',
    phone: '+251 911 234 567'
  });

  // Shift Handover State
  const [cashDrawer, setCashDrawer] = useState({
    openingBalance: '500.00',
    expectedClosing: '2390.00',
    actualClosing: ''
  });

  // 2. HANDLE SAVE
  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account preferences and shift handover.</p>
      </div>

      {/* SUCCESS TOAST */}
      {isSaved && (
        <div className="fixed top-20 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-fade-in">
          <CheckCircle size={20} />
          <span className="font-semibold">Settings saved successfully!</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* SIDEBAR TABS */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2 flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <User size={18} /> Profile Settings
            </button>
            <button 
              onClick={() => setActiveTab('handover')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'handover' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <DollarSign size={18} /> Shift Handover
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Lock size={18} /> Security
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Bell size={18} /> Notifications
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
          
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Personal Information</h2>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">
                  {profile.name.charAt(0)}
                </div>
                <button type="button" className="text-sm font-medium text-green-600 hover:underline">
                  Change Avatar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    disabled
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2">
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SHIFT HANDOVER */}
          {activeTab === 'handover' && (
            <form onSubmit={handleSave} className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">End of Shift Handover</h2>
              <p className="text-sm text-gray-500 mb-4">Count the physical cash in your drawer and enter it below to close the shift.</p>

              <div className="bg-gray-50 p-4 rounded-xl space-y-3 mb-6 border border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Opening Balance</span>
                  <span className="font-medium text-gray-900">${cashDrawer.openingBalance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Expected Cash (from system)</span>
                  <span className="font-medium text-gray-900">${cashDrawer.expectedClosing}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Cash Counted ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="number" 
                    step="0.01"
                    value={cashDrawer.actualClosing}
                    onChange={(e) => setCashDrawer({...cashDrawer, actualClosing: e.target.value})}
                    placeholder="0.00"
                    className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              {cashDrawer.actualClosing && (
                <div className={`p-4 rounded-xl border ${
                  Number(cashDrawer.actualClosing) === Number(cashDrawer.expectedClosing) 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-orange-50 border-orange-200 text-orange-700'
                }`}>
                  <p className="font-bold text-sm">
                    {Number(cashDrawer.actualClosing) === Number(cashDrawer.expectedClosing) 
                      ? '✅ Cash count matches perfectly!' 
                      : `⚠️ Variance: $${(Number(cashDrawer.actualClosing) - Number(cashDrawer.expectedClosing)).toFixed(2)}`}
                  </p>
                  <p className="text-xs mt-1 opacity-80">This will be logged in the Daily Cash Report.</p>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2">
                  <CheckCircle size={18} /> Close Shift
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SECURITY */}
          {activeTab === 'security' && (
            <form onSubmit={handleSave} className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Change Password</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2">
                  <Lock size={18} /> Update Password
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Notification Preferences</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Smartphone className="text-gray-500" size={20} />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">SMS Alerts</p>
                      <p className="text-xs text-gray-500">Receive payment confirmations via SMS.</p>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Bell className="text-gray-500" size={20} />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">In-App Sounds</p>
                      <p className="text-xs text-gray-500">Play a sound when a new bill is generated.</p>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}