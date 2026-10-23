import React from 'react';
import { Utensils, Coffee, Pizza, Flame, IceCream } from 'lucide-react';

export default function CategoryList({ activeCategory = 'All', onSelectCategory }) {
  const categories = [
    { id: 'All', label: 'All Items', icon: Utensils },
    { id: 'Main Course', label: 'Main Course', icon: Pizza },
    { id: 'Starters', label: 'Starters', icon: Flame },
    { id: 'Beverages', label: 'Beverages', icon: Coffee },
    { id: 'Desserts', label: 'Desserts', icon: IceCream },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory && onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 border transition cursor-pointer ${
              isActive
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}