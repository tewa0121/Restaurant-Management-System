import React from 'react';
import { HeadphonesIcon, MessageCircle, Mail, PhoneCall } from 'lucide-react';

export default function HelpSupport() {
  return (
    <div className="space-y-5 pb-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-xs text-gray-400">We are here 24/7 to assist you with your orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border text-center space-y-2">
          <PhoneCall size={24} className="mx-auto text-green-600" />
          <h3 className="font-bold text-xs">Call Support</h3>
          <p className="text-[10px] text-gray-400">+1 (800) 123-4567</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border text-center space-y-2">
          <Mail size={24} className="mx-auto text-green-600" />
          <h3 className="font-bold text-xs">Email Us</h3>
          <p className="text-[10px] text-gray-400">support@restodelight.com</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border text-center space-y-2">
          <MessageCircle size={24} className="mx-auto text-green-600" />
          <h3 className="font-bold text-xs">Live Chat</h3>
          <p className="text-[10px] text-gray-400">Available in app 24/7</p>
        </div>
      </div>
    </div>
  );
}