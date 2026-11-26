import React, { useEffect, useState } from 'react';
import { Utensils } from 'lucide-react';
import menuService from '../../services/menuService';

// Category pills built from the real /menu/categories endpoint.
export default function CategoryList({ activeCategory = 'All', onSelectCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;
    menuService
      .getCategories()
      .then((list) => {
        if (active) setCategories(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (active) setCategories([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const pills = [
    { id: 'All', label: 'All Items' },
    ...categories.map((c) => ({ id: c.name, label: c.name })),
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {pills.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory && onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 border transition cursor-pointer ${
              isActive
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat.id === 'All' && <Utensils className="w-3.5 h-3.5" />}
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
