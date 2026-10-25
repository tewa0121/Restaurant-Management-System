import React from 'react';
import { CreditCard, DollarSign, Smartphone } from 'lucide-react';

export default function PaymentIconsGroup() {
  const icons = [
    { name: 'Visa / Mastercard', icon: CreditCard, color: 'text-blue-500' },
    { name: 'Cash on Hand', icon: DollarSign, color: 'text-emerald-500' },
    { name: 'Mobile Transfer', icon: Smartphone, color: 'text-purple-500' },
  ];

  return (
    <div className="flex items-center gap-2">
      {icons.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            title={item.name}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"
          >
            <Icon className={`w-4 h-4 ${item.color}`} />
          </div>
        );
      })}
    </div>
  );
}