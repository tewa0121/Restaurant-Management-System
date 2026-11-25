import React from 'react';
import { Navigation, CheckCircle2, Phone } from 'lucide-react';

export default function CustomerTrackOrder() {
  // Order tracking progression steps data
  const steps = [
    { label: 'Order Confirmed', time: '2:15 PM', completed: true },
    { label: 'Preparing Food', time: '2:20 PM', completed: true },
    { label: 'Out for Delivery', time: '2:35 PM', completed: true },
    { label: 'Delivered', time: 'Estimated 2:50 PM', completed: false },
  ];

  return (
    <div className="space-y-5 pb-8 max-w-3xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Track Order #ORD-8942</h1>
        <p className="text-xs text-gray-400">Real-time update on your meal delivery</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
        
        {/* Banner highlighting active driver status & ETA */}
        <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
              <Navigation size={18} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-gray-900">Food is on the way!</h3>
              <p className="text-[10px] text-gray-500">Driver is 5 minutes away from your location</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-green-700 bg-white px-3 py-1 rounded-lg border border-green-200">
            ETA: 2:50 PM
          </span>
        </div>

        {/* Dynamic 4-Step Timeline Progress */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-1">
              {/* Step indicator circle: Green check icon if completed, Gray step number if pending */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step.completed ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400 border border-gray-200'
              }`}>
                {step.completed ? <CheckCircle2 size={16} /> : idx + 1}
              </div>
              <h4 className="font-bold text-xs text-gray-800">{step.label}</h4>
              <p className="text-[9px] text-gray-400">{step.time}</p>
            </div>
          ))}
        </div>

        {/* Assigned Delivery Driver Details & Phone Trigger */}
        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 font-bold text-xs flex items-center justify-center text-gray-700">
              JD
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-900">John Driver</h4>
              <p className="text-[10px] text-gray-400">Delivery Partner (Toyota Prius - ABC 1234)</p>
            </div>
          </div>
          <button 
            onClick={() => alert('Calling driver: +1 (555) 019-2834')}
            className="bg-green-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-green-700 transition-colors cursor-pointer"
          >
            <Phone size={12} /> Call
          </button>
        </div>

      </div>
    </div>
  );
}