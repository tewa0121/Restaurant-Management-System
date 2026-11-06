// import React, { useState } from 'react';
// import {
//   Search,
//   Star,
//   Heart,
//   Plus,
//   Filter,
//   SlidersHorizontal
// } from 'lucide-react';
// import { useCart } from '../../hooks/useCart';

// export default function BrowseMenu() {
//   const { addToCart } = useCart();
//   const [activeCategory, setActiveCategory] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');

//   // Category filter tabs
//   const categories = [
//     { id: 'all', label: 'All Items' },
//     { id: 'burgers', label: 'Burgers' },
//     { id: 'pizza', label: 'Pizza' },
//     { id: 'chicken', label: 'Chicken' },
//     { id: 'pasta', label: 'Pasta' },
//     { id: 'drinks', label: 'Drinks & Beverages' },
//     { id: 'desserts', label: 'Desserts' },
//   ];

//   // Complete Menu Items List
//   const menuItems = [
//     {
//       id: 'menu-1',
//       name: 'Classic Cheeseburger',
//       category: 'burgers',
//       price: 9.99,
//       rating: 4.8,
//       reviews: 140,
//       description: 'Juicy beef patty topped with melted cheddar cheese, lettuce, and pickles.',
//       image: '/assets/food-placeholders/food-burger.png'
//     },
//     {
//       id: 'menu-2',
//       name: 'Margherita Pizza',
//       category: 'pizza',
//       price: 11.99,
//       rating: 4.9,
//       reviews: 310,
//       description: 'Fresh mozzarella, basil, and signature tomato sauce on a thin crust.',
//       image: '/assets/food-placeholders/food-pizza.png'
//     },
//     {
//       id: 'menu-3',
//       name: 'Grilled Chicken Veggie Plate',
//       category: 'chicken',
//       price: 12.99,
//       rating: 4.7,
//       reviews: 220,
//       description: 'Tender grilled chicken breast served with steamed veggies.',
//       image: '/assets/food-placeholders/food-grilled-chicken.png'
//     },
//     {
//       id: 'menu-4',
//       name: 'Creamy Pasta Alfredo',
//       category: 'pasta',
//       price: 11.49,
//       rating: 4.6,
//       reviews: 180,
//       description: 'Fettuccine tossed in a rich parmesan cream sauce.',
//       image: '/assets/food-placeholders/food-pasta-alfredo.png'
//     },
//     {
//       id: 'menu-5',
//       name: 'Special Chicken Biryani',
//       category: 'chicken',
//       price: 13.49,
//       rating: 4.8,
//       reviews: 290,
//       description: 'Aromatic basmati rice cooked with spiced tender chicken.',
//       image: '/assets/food-placeholders/food-biryani.png'
//     },
//     {
//       id: 'menu-6',
//       name: 'Fresh Berry Smoothie',
//       category: 'drinks',
//       price: 5.99,
//       rating: 4.5,
//       reviews: 95,
//       description: 'Blended strawberries, blueberries, yogurt, and honey.',
//       image: '/assets/food-placeholders/food-berry-smoothie.png'
//     },
//     {
//       id: 'menu-7',
//       name: 'Chocolate Lava Cake',
//       category: 'desserts',
//       price: 6.99,
//       rating: 4.9,
//       reviews: 410,
//       description: 'Warm chocolate cake with a molten chocolate center.',
//       image: '/assets/food-placeholders/food-lava-cake.png'
//     }
//   ];

//   // Filter menu items by category and search query
//   const filteredItems = menuItems.filter((item) => {
//     const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
//     const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   return (
//     <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-gray-900 dark:text-white">
      
//       {/* Header Title & Filter Controls */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100 dark:border-gray-800">
//         <div>
//           <h1 className="text-2xl font-black text-gray-900 dark:text-white">Browse Full Menu</h1>
//           <p className="text-xs text-gray-500 dark:text-gray-400">Discover and customize your favorite dishes</p>
//         </div>

//         {/* Search Bar */}
//         <div className="relative w-full sm:w-80">
//           <input
//             type="text"
//             placeholder="Search in menu..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#0B1426] border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
//           />
//           <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//         </div>
//       </div>

//       {/* Category Pills */}
//       <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
//         {categories.map((cat) => (
//           <button
//             key={cat.id}
//             onClick={() => setActiveCategory(cat.id)}
//             className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
//               activeCategory === cat.id
//                 ? 'bg-emerald-600 text-white shadow-xs'
//                 : 'bg-white dark:bg-[#0B1426] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800'
//             }`}
//           >
//             {cat.label}
//           </button>
//         ))}
//       </div>

//       {/* Food Items Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//         {filteredItems.length === 0 ? (
//           <div className="col-span-full py-16 text-center text-gray-400 text-xs">
//             No food items found matching your search. Try adjusting filters!
//           </div>
//         ) : (
//           filteredItems.map((dish) => (
//             <div
//               key={dish.id}
//               className="bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-2xs space-y-3 relative group flex flex-col justify-between"
//             >
//               <div className="space-y-3">
//                 <div className="relative">
//                   <button className="absolute top-3 right-3 p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-400 hover:text-rose-500 transition-colors z-10 cursor-pointer">
//                     <Heart size={14} />
//                   </button>
//                   <img
//                     src={dish.image}
//                     alt={dish.name}
//                     className="w-full h-36 object-cover rounded-xl bg-gray-50"
//                     onError={(e) => { e.target.src = '/assets/food-placeholders/food-burger.png'; }}
//                   />
//                 </div>

//                 <div>
//                   <div className="flex items-center justify-between">
//                     <h4 className="font-extrabold text-xs text-gray-900 dark:text-white truncate">{dish.name}</h4>
//                     <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold shrink-0">
//                       <Star size={11} fill="currentColor" />
//                       <span>{dish.rating}</span>
//                     </div>
//                   </div>
//                   <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">{dish.description}</p>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-800">
//                 <span className="font-black text-sm text-gray-900 dark:text-white">${dish.price.toFixed(2)}</span>
//                 <button
//                   type="button"
//                   onClick={() => addToCart({
//                     id: dish.id,
//                     name: dish.name,
//                     price: Number(dish.price),
//                     image: dish.image
//                   })}
//                   className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
//                 >
//                   <span>Add</span> <Plus size={12} />
//                 </button>
//               </div>

//             </div>
//           ))
//         )}
//       </div>

//     </div>
//   );
// }




// src/pages/customer/BrowseMenu.jsx
// Real dishes and categories from the backend (via useCustomerMenu).
import React, { useMemo } from 'react';
import { Search, Heart, Plus, RefreshCw } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import useCustomerMenu from '../../hooks/useCustomerMenu';

const FALLBACK_IMAGE = '/assets/food-placeholders/food-healthy-bowl.png';

export default function BrowseMenu() {
  const { addToCart } = useCart();
  const {
    items,
    filtered,
    categories,
    loading,
    error,
    reload,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
  } = useCustomerMenu();

  // Only show category tabs that have at least one available dish
  const tabs = useMemo(() => {
    const used = new Set(items.map((d) => String(d.categoryId)));
    return categories.filter((c) => c.active !== false && used.has(String(c.id)));
  }, [items, categories]);

  const handleAdd = (dish) =>
    addToCart({
      id: dish.id, // the REAL database id: Orders will send this to the backend
      name: dish.name,
      price: Number(dish.price),
      image: dish.image,
      image_url: dish.image,
      categoryId: dish.categoryId,
    });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-gray-900 dark:text-white">

      {/* Header Title & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Browse Full Menu</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Discover and customize your favorite dishes</p>
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search in menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#0B1426] border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
          />
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Category Pills (real categories) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[{ id: 'all', name: 'All Items' }, ...tabs].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              String(selectedCategory) === String(cat.id)
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#0B1426] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Could not load */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between p-3 rounded-xl text-xs font-semibold border bg-rose-50 text-rose-700 border-rose-100"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={reload}
            className="flex items-center gap-1 px-3 py-1 bg-rose-600 text-white rounded-lg cursor-pointer"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      )}

      {/* Food Items Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-400 text-xs">
              {items.length === 0
                ? 'The menu is empty right now. Please check back soon.'
                : 'No food items found matching your search. Try adjusting filters!'}
            </div>
          ) : (
            filtered.map((dish) => (
              <div
                key={dish.id}
                className="bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-2xs space-y-3 relative group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative">
                    <button
                      type="button"
                      className="absolute top-3 right-3 p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-400 hover:text-rose-500 transition-colors z-10 cursor-pointer"
                      aria-label="Add to favorites"
                    >
                      <Heart size={14} />
                    </button>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-36 object-cover rounded-xl bg-gray-50"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-extrabold text-xs text-gray-900 dark:text-white truncate">
                        {dish.name}
                      </h4>
                      {dish.category && (
                        <span className="text-[10px] font-bold text-emerald-600 shrink-0">
                          {dish.category}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">{dish.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-800">
                  <span className="font-black text-sm text-gray-900 dark:text-white">
                    ${dish.price.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdd(dish)}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>Add</span> <Plus size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}