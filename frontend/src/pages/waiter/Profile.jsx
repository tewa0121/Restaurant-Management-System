import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Award, Edit2, Save, X } from 'lucide-react';

export default function Profile() {
  // Mock user data (In a real app, this would come from AuthContext or an API)
  const [user, setUser] = useState({
    name: 'David Waiter',
    email: 'waiter@resto.com',
    phone: '+251 911 234 567',
    address: 'Bole, Addis Ababa',
    joinedDate: 'January 2023',
    role: 'Senior Waiter',
    avatar: 'D',
    stats: {
      tablesServed: 142,
      ordersTaken: 385,
      rating: 4.8
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);

  // Handle saving the edited profile
  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your personal information.</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm"
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 flex items-center gap-2">
              <X size={16} /> Cancel
            </button>
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 shadow-sm">
              <Save size={16} /> Save
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT: Avatar & Stats */}
        <div className="md:col-span-1 space-y-6">
          {/* Avatar Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-md mb-4">
              {user.avatar}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full mt-2">{user.role}</p>
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1 justify-center">
              <Calendar size={12} /> Joined {user.joinedDate}
            </p>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tables Served</span>
                <span className="font-bold text-gray-900">{user.stats.tablesServed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Orders Taken</span>
                <span className="font-bold text-gray-900">{user.stats.ordersTaken}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Rating</span>
                <span className="font-bold text-yellow-600 flex items-center gap-1">
                  <Award size={14} /> {user.stats.rating}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Details Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h3 className="font-bold text-gray-800 mb-6 border-b pb-4">Personal Information</h3>
            
            <div className="space-y-5">
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium bg-gray-50 px-4 py-2.5 rounded-lg border border-transparent">{user.name}</p>
                )}
              </div>

              {/* Email (Not editable) */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                <p className="text-gray-900 font-medium bg-gray-50 px-4 py-2.5 rounded-lg border border-transparent flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" /> {user.email}
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium bg-gray-50 px-4 py-2.5 rounded-lg border border-transparent flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" /> {user.phone}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editForm.address}
                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium bg-gray-50 px-4 py-2.5 rounded-lg border border-transparent flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" /> {user.address}
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}