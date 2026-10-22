import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Spinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 size={40} className="text-green-600 animate-spin mb-4" />
      <p className="text-gray-500 font-medium">{text}</p>
    </div>
  );
}