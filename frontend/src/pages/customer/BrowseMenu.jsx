import React, { useState } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

// Sample/Fallback Menu Data
const SAMPLE_MENU_ITEMS = [
  {
    id: 1,
    name: 'Garden Fresh Salad',
    category: 'Salads', // Matches 'Salads' / 'Salad'
    price: 8.99,
    description: 'Crisp lettuce, cherry tomatoes, cucumbers, and house dressing.',
    image: '/assets/food-placeholders/salad.jpg'
  },
  {
    id: 2,
    name: 'Caesar Salad',
    category: 'Salads',
    price: 9.50,
    description: 'Romaine lettuce, parmesan cheese, croutons, and creamy Caesar dressing.',
    image: '/assets/food-placeholders/caesar-salad.jpg'
  },
  {
    id: 3,
    name: 'Pancake Stack',
    category: 'Breakfast',
    price: 7.99,
    description: 'Fluffy pancakes served with maple syrup and fresh berries.',
    image: '/assets/food-placeholders/pancakes.jpg'
  },
  {
    id: 4,
    name: 'Grilled Salmon',
    category: 'Lunch',
    price: 15.99,
    description: 'Fresh salmon served with steamed vegetables and lemon butter sauce.',
    image: '/assets/food-placeholders/salmon.jpg'
  },
  {
    id: 5,
    name: 'Ribeye Steak',
    category: 'Dinner',
    price: 22.50,
    description: 'Juicy ribeye steak cooked to perfection with garlic butter.',
    image: '/assets/food-placeholders/steak.jpg'
  },
  {
    id: 6,
    name: 'Garlic Bread',
    category: 'Appetizers',
    price: 4.99,
    description: 'Toasted baguette topped with garlic butter and herbs.',
    image: '/assets/food-placeholders/garlic-bread.jpg'
  },
  {
    id: 7,
    name: 'Iced Latte',
    category: 'Drinks',
    price: 3.99,
    description: 'Espresso with cold milk and syrup over ice.',
    image: '/assets/food-placeholders/iced-latte.jpg'
  },
  {
    id: 8,
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    price: 6.50,
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream.',
    image: '/assets/food-placeholders/lava-cake.jpg'
  }
];

const CATEGORIES = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Appetizers',
  'Drinks',
  'Desserts',
  'Salads'
];

export default function BrowseMenu({ menuItems = SAMPLE_MENU_ITEMS }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemIds, setAddedItemIds] = useState([]);
  const { addToCart } = useCart();

  // Robust Case-Insensitive Filter (Fixes empty state when clicking category buttons)
  const filteredItems = menuItems.filter((item) => {
    // 1. Filter by Category
    const categoryMatch = (() => {
      if (selectedCategory === 'All') return true;
      if (!item.category) return false;

      const selected = selectedCategory.toLowerCase().trim();
      const itemCat = item.category.toLowerCase().trim();

      // Flexible matching for singular/plural differences (e.g., "Salads" vs "Salad")
      return (
        itemCat === selected ||
        selected.startsWith(itemCat) ||
        itemCat.startsWith(selected)
      );
    })();

    // 2. Filter by Search Query
    const searchMatch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase().trim()))
      : true;

    return categoryMatch && searchMatch;
  });

  const handleAddToCart = (item) => {
    addToCart(item);
    
    // Quick visual feedback on button
    setAddedItemIds((prev) => [...prev, item.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== item.id));
    }, 1200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Title & Inner Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Full Menu</h1>
          <p className="text-xs text-gray-500 mt-1">Explore all our handcrafted dishes and drinks</p>
        </div>

        {/* Local Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu items..."
            className="w-full bg-white border border-gray-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Category Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Menu Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const isAdded = addedItemIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 bg-gray-100 relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback image if local path is missing
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
                      }}
                    />
                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-700 shadow-xs">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between mt-2">
                  <span className="text-sm font-extrabold text-gray-900">
                    ${Number(item.price).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} /> Added
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <Search size={20} />
          </div>
          <h3 className="text-sm font-bold text-gray-800">No items found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            There are no dishes under "{selectedCategory}"{searchQuery ? ` matching "${searchQuery}"` : ''}.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer pt-2 block mx-auto"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}