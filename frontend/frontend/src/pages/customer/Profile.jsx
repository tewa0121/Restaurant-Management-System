import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

export default function CustomerProfile() {
  // Controlled component state storing profile fields
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 234-5678',
    address: '123 Main Street, Apt 4B, New York, NY 10001'
  });

  // Handle form submission and save action
  const handleSave = (e) => {
    e.preventDefault();
    alert('Profile and address updated successfully!');
  };

  return (
    <div className="space-y-5 pb-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Account Profile</h1>
        <p className="text-xs text-gray-400">Update your personal details and primary delivery address</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        
        {/* Input Field: Full Name */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              value={profile.name} 
              onChange={e => setProfile({...profile, name: e.target.value})}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Input Field: Email */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="email" 
              value={profile.email} 
              onChange={e => setProfile({...profile, email: e.target.value})}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Input Field: Phone */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number</label>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              value={profile.phone} 
              onChange={e => setProfile({...profile, phone: e.target.value})}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Textarea Field: Delivery Address */}
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Primary Delivery Address</label>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-2.5 text-gray-400" />
            <textarea 
              rows="2"
              value={profile.address} 
              onChange={e => setProfile({...profile, address: e.target.value})}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Save Button */}
        <button 
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
        >
          <Save size={14} /> Save Changes
        </button>
      </form>
    </div>
  );
}