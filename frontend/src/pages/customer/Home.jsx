


// import React, { useState } from 'react';
// import { useNavigate, useOutletContext } from 'react-router-dom';
// import {
//   ArrowRight,
//   Star,
//   Heart,
//   Plus,
//   ShoppingBag,
//   X,
//   Truck,
//   ShieldCheck,
//   Headphones,
//   Award,
// } from 'lucide-react';
// import { useCart } from '../../hooks/useCart';

// export default function CustomerHome() {
//   const navigate = useNavigate();
//   const { cart, addToCart } = useCart();

//   const outletContext = useOutletContext() || {};
//   const setIsCartOpen = outletContext.setIsCartOpen || (() => {});

//   const [addedToast, setAddedToast] = useState(null);

//   const categories = [
//     { id: 'breakfast', label: 'Breakfast', icon: '🥞' },
//     { id: 'lunch', label: 'Lunch', icon: '🥗' },
//     { id: 'dinner', label: 'Dinner', icon: '🍖' },
//     { id: 'appetizers', label: 'Appetizers', icon: '🧆' },
//     { id: 'drinks', label: 'Drinks', icon: '🍹' },
//     { id: 'desserts', label: 'Desserts', icon: '🍰' },
//     { id: 'salads', label: 'Salads', icon: '🥗' },
//   ];

//   const popularDishes = [
//     { id: 'dish-1', name: 'Grilled Chicken with Veggies', price: 12.99, rating: 4.7, reviews: 320, image: '/assets/food-placeholders/food-grilled-chicken.png' },
//     { id: 'dish-2', name: 'Beef Burger with Fries', price: 10.99, rating: 4.6, reviews: 280, image: '/assets/food-placeholders/food-burger-fries.png' },
//     { id: 'dish-3', name: 'Margherita Pizza', price: 11.99, rating: 4.8, reviews: 420, image: '/assets/food-placeholders/food-pizza.png' },
//     { id: 'dish-4', name: 'Pasta Alfredo', price: 11.49, rating: 4.6, reviews: 210, image: '/assets/food-placeholders/food-pasta-alfredo.png' },
//     { id: 'dish-5', name: 'Chicken Biryani', price: 13.49, rating: 4.7, reviews: 310, image: '/assets/food-placeholders/food-biryani.png' },
//   ];

//   const totalItemsCount = cart ? cart.reduce((sum, item) => sum + item.qty, 0) : 0;

//   const handleAddItem = (dish) => {
//     addToCart({ id: dish.id, name: dish.name, price: Number(dish.price), image: dish.image });

//     setAddedToast({
//       itemName: dish.name,
//       totalItems: totalItemsCount + 1,
//     });

//     setTimeout(() => {
//       setAddedToast(null);
//     }, 4000);
//   };

//   return (
//     <div className="p-6 space-y-8 max-w-[1700px] mx-auto relative font-sans text-gray-900 dark:text-white">

//       {/* ADDED ITEM TOAST */}
//       {addedToast && (
//         <div className="fixed top-20 right-6 z-40 bg-[#0B1426] text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-4 max-w-sm">
//           <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shrink-0">
//             <ShoppingBag size={20} />
//           </div>
//           <div className="flex-1 min-w-0">
//             <h5 className="font-extrabold text-xs text-white truncate">{addedToast.itemName} added!</h5>
//             <p className="text-[11px] text-emerald-400 font-bold">{addedToast.totalItems} items in cart</p>
//           </div>
//           <button
//             onClick={() => {
//               setIsCartOpen(true);
//               setAddedToast(null);
//             }}
//             className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs"
//           >
//             Go to My Cart
//           </button>
//           <button onClick={() => setAddedToast(null)} className="text-gray-400 hover:text-white cursor-pointer">
//             <X size={14} />
//           </button>
//         </div>
//       )}

//       {/* MAIN FEED CONTENT */}
//       <div className="space-y-8">

//         {/* Banner with Clear Image Positioning & High Contrast Overlay */}
//         <div className="relative bg-[#0D1813] text-white rounded-3xl p-8 overflow-hidden shadow-xl flex items-center min-h-[260px]">
//           <img
//             src="/assets/food-placeholders/food-banner-bowl.png"
//             alt="Food Bowl Banner"
//             className="absolute right-0 top-0 bottom-0 h-full w-full sm:w-[60%] object-cover object-center sm:object-right opacity-85 z-0 transition-transform duration-700 hover:scale-105"
//             onError={(e) => { e.target.style.display = 'none'; }}
//           />
//           {/* Subtle multi-stop gradient overlay ensuring text sharpness on the left while revealing the food photo on the right */}
//           <div className="absolute inset-0 bg-gradient-to-r from-[#0B1426] via-[#0B1426]/90 to-transparent z-10" />

//           <div className="relative z-20 max-w-lg space-y-4">
//             <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
//               Fresh & Tasty
//             </span>
//             <h2 className="text-3xl sm:text-4xl font-black leading-tight text-white drop-shadow-md">
//               Delicious food, delivered <span className="text-emerald-400 drop-shadow-sm">to you</span>
//             </h2>
//             <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed drop-shadow-xs max-w-md">
//               Order your favorite meals from our wide range of freshly prepared tasty dishes.
//             </p>
//             <div className="flex items-center gap-3 pt-2">
//               <button 
//                 onClick={() => navigate('/customer/menu')} 
//                 className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
//               >
//                 Order Now <ArrowRight size={14} />
//               </button>
//               <button 
//                 onClick={() => navigate('/customer/offers')} 
//                 className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer backdrop-blur-md active:scale-95 shadow-md"
//               >
//                 View Offers
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Categories */}
//         <div className="space-y-3">
//           <div className="flex justify-between items-center">
//             <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Categories</h3>
//             <button onClick={() => navigate('/customer/categories')} className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">View All</button>
//           </div>

//           <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
//             {categories.map((cat) => (
//               <div
//                 key={cat.id}
//                 onClick={() => navigate('/customer/menu')}
//                 className="bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl p-3 text-center space-y-2 hover:shadow-xs transition-shadow cursor-pointer group"
//               >
//                 <div className="w-12 h-12 mx-auto bg-amber-50/80 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
//                   {cat.icon}
//                 </div>
//                 <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block truncate">{cat.label}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Popular Dishes */}
//         <div className="space-y-3">
//           <div className="flex justify-between items-center">
//             <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Popular Dishes</h3>
//             <button onClick={() => navigate('/customer/menu')} className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">View All</button>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
//             {popularDishes.map((dish) => (
//               <div key={dish.id} className="bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl p-3.5 shadow-2xs space-y-3 relative group">
//                 <button className="absolute top-4 right-4 p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-400 hover:text-rose-500 transition-colors z-10 cursor-pointer">
//                   <Heart size={14} />
//                 </button>

//                 <img
//                   src={dish.image}
//                   alt={dish.name}
//                   className="w-full h-32 object-cover rounded-xl bg-gray-50"
//                   onError={(e) => { e.target.src = '/assets/food-placeholders/food-burger.png'; }}
//                 />

//                 <div>
//                   <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{dish.name}</h4>
//                   <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-1">
//                     <Star size={12} fill="currentColor" />
//                     <span>{dish.rating} ({dish.reviews})</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between pt-1">
//                   <span className="font-black text-sm text-gray-900 dark:text-white">${dish.price.toFixed(2)}</span>
//                   <button
//                     type="button"
//                     onClick={() => handleAddItem(dish)}
//                     className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
//                   >
//                     <span>Add</span> <Plus size={12} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Value Proposition Strip */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-xs">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><Truck size={18} /></div>
//             <div><h5 className="font-extrabold text-gray-900 dark:text-white">Fast Delivery</h5><p className="text-[10px] text-gray-400">Get your orders delivered fast</p></div>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><ShieldCheck size={18} /></div>
//             <div><h5 className="font-extrabold text-gray-900 dark:text-white">Secure Payment</h5><p className="text-[10px] text-gray-400">100% secure payment methods</p></div>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><Headphones size={18} /></div>
//             <div><h5 className="font-extrabold text-gray-900 dark:text-white">24/7 Support</h5><p className="text-[10px] text-gray-400">We're here to help you anytime</p></div>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><Award size={18} /></div>
//             <div><h5 className="font-extrabold text-gray-900 dark:text-white">Best Quality</h5><p className="text-[10px] text-gray-400">Fresh ingredients & hygienic cooking</p></div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }




// // import React, { useEffect, useState } from 'react';
// // import { useNavigate, useOutletContext } from 'react-router-dom';
// // import {
// //   ArrowRight,
// //   Star,
// //   Heart,
// //   Plus,
// //   ShoppingBag,
// //   X,
// //   Truck,
// //   ShieldCheck,
// //   Headphones,
// //   Award,
// // } from 'lucide-react';
// // import { useCart } from '../../context/CartContext';
// // import apiService from '../../services/api';

// // // The database has no emoji column for categories, so the page picks one by name.
// // const CATEGORY_ICONS = {
// //   breakfast: '🥞',
// //   lunch: '🥗',
// //   dinner: '🍖',
// //   appetizers: '🧆',
// //   drinks: '🍹',
// //   desserts: '🍰',
// //   salads: '🥗',
// // };
// // const iconFor = (name) => CATEGORY_ICONS[String(name || '').toLowerCase()] || '🍽️';

// // const FALLBACK_IMAGE = '/assets/food-placeholders/food-burger.png';

// // export default function CustomerHome() {
// //   const navigate = useNavigate();
// //   const { cart, addToCart } = useCart();

// //   // Shared context from CustomerLayout (opens the layout's cart panel)
// //   const outletContext = useOutletContext() || {};
// //   const setIsCartOpen = outletContext.setIsCartOpen || (() => {});

// //   const [dishes, setDishes] = useState([]);
// //   const [categories, setCategories] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const [addedToast, setAddedToast] = useState(null);

// //   // Load the real menu once when the page opens
// //   useEffect(() => {
// //     let cancelled = false; // stops a late answer from updating a page that is already closed

// //     Promise.all([apiService.getMenuItems(), apiService.getMenuCategories()])
// //       .then(([items, cats]) => {
// //         if (cancelled) return;
// //         setDishes(Array.isArray(items) ? items : []);
// //         setCategories(Array.isArray(cats) ? cats : []);
// //       })
// //       .catch((err) => {
// //         if (!cancelled) setError(err.message || 'Could not load the menu.');
// //       })
// //       .finally(() => {
// //         if (!cancelled) setLoading(false);
// //       });

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, []);

// //   const totalItemsCount = cart ? cart.reduce((sum, item) => sum + item.qty, 0) : 0;
// //   const popularDishes = dishes.slice(0, 10);

// //   const handleAddItem = (dish) => {
// //     addToCart({
// //       id: dish.id,
// //       name: dish.name,
// //       price: Number(dish.price),
// //       image: dish.image || dish.image_url,
// //     });

// //     setAddedToast({
// //       itemName: dish.name,
// //       totalItems: totalItemsCount + 1,
// //     });

// //     setTimeout(() => {
// //       setAddedToast(null);
// //     }, 4000);
// //   };

// //   return (
// //     <div className="p-6 space-y-8 max-w-[1700px] mx-auto relative font-sans text-gray-900 dark:text-white">

// //       {/* ADDED ITEM TOAST */}
// //       {addedToast && (
// //         <div className="fixed top-20 right-6 z-40 bg-[#0B1426] text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-4 max-w-sm">
// //           <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shrink-0">
// //             <ShoppingBag size={20} />
// //           </div>
// //           <div className="flex-1 min-w-0">
// //             <h5 className="font-extrabold text-xs text-white truncate">{addedToast.itemName} added!</h5>
// //             <p className="text-[11px] text-emerald-400 font-bold">{addedToast.totalItems} items in cart</p>
// //           </div>
// //           <button
// //             onClick={() => {
// //               setIsCartOpen(true);
// //               setAddedToast(null);
// //             }}
// //             className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs"
// //           >
// //             Go to My Cart
// //           </button>
// //           <button onClick={() => setAddedToast(null)} className="text-gray-400 hover:text-white cursor-pointer">
// //             <X size={14} />
// //           </button>
// //         </div>
// //       )}

// //       {/* MAIN FEED CONTENT */}
// //       <div className="space-y-8">

// //         {/* Banner */}
// //         <div className="relative bg-[#0D1813] text-white rounded-3xl p-8 overflow-hidden shadow-sm flex items-center min-h-[220px]">
// //           <div className="relative z-10 max-w-xs space-y-3">
// //             <h2 className="text-2xl sm:text-3xl font-black leading-tight">
// //               Delicious food, delivered <span className="text-emerald-400">to you</span>
// //             </h2>
// //             <p className="text-xs text-gray-300">Order your favorite meals from our wide range of tasty dishes.</p>
// //             <div className="flex items-center gap-3 pt-2">
// //               <button onClick={() => navigate('/menu')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs">
// //                 Order Now <ArrowRight size={14} />
// //               </button>
// //               <button onClick={() => navigate('/offers')} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
// //                 View Offers
// //               </button>
// //             </div>
// //           </div>

// //           <img
// //             src="/assets/food-placeholders/food-banner-bowl.png"
// //             alt="Food Bowl Banner"
// //             className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 object-cover rounded-full opacity-95 hidden sm:block transform translate-x-8"
// //             onError={(e) => { e.target.style.display = 'none'; }}
// //           />
// //         </div>

// //         {/* Loading / error */}
// //         {loading && <p className="text-xs text-gray-400">Loading the menu...</p>}
// //         {error && (
// //           <div role="alert" className="bg-red-50 border border-red-200 p-3 text-xs text-red-600 rounded-xl">
// //             {error}
// //           </div>
// //         )}

// //         {/* Categories (from the database) */}
// //         {!loading && !error && categories.length > 0 && (
// //           <div className="space-y-3">
// //             <div className="flex justify-between items-center">
// //               <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Categories</h3>
// //               <button onClick={() => navigate('/categories')} className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">View All</button>
// //             </div>

// //             <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
// //               {categories.map((cat) => (
// //                 <div
// //                   key={cat.id}
// //                   onClick={() => navigate('/menu', { state: { categoryId: cat.id } })}
// //                   className="bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl p-3 text-center space-y-2 hover:shadow-xs transition-shadow cursor-pointer group"
// //                 >
// //                   <div className="w-12 h-12 mx-auto bg-amber-50/80 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
// //                     {iconFor(cat.name)}
// //                   </div>
// //                   <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block truncate">{cat.name}</span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         {/* Popular Dishes (from the database) */}
// //         {!loading && !error && (
// //           <div className="space-y-3">
// //             <div className="flex justify-between items-center">
// //               <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Popular Dishes</h3>
// //               <button onClick={() => navigate('/menu')} className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">View All</button>
// //             </div>

// //             {popularDishes.length === 0 ? (
// //               <p className="text-xs text-gray-400">No dishes are available right now. Please check back soon.</p>
// //             ) : (
// //               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
// //                 {popularDishes.map((dish) => (
// //                   <div key={dish.id} className="bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl p-3.5 shadow-2xs space-y-3 relative group">
// //                     <button className="absolute top-4 right-4 p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-400 hover:text-rose-500 transition-colors z-10 cursor-pointer">
// //                       <Heart size={14} />
// //                     </button>

// //                     <img
// //                       src={dish.image || dish.image_url || FALLBACK_IMAGE}
// //                       alt={dish.name}
// //                       className="w-full h-32 object-cover rounded-xl bg-gray-50"
// //                       onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
// //                     />

// //                     <div>
// //                       <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{dish.name}</h4>
// //                       {/* The database has no per-dish rating yet, so stars only show when a rating exists */}
// //                       {dish.rating ? (
// //                         <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-1">
// //                           <Star size={12} fill="currentColor" />
// //                           <span>{dish.rating}{dish.reviews ? ` (${dish.reviews})` : ''}</span>
// //                         </div>
// //                       ) : (
// //                         <p className="text-[10px] text-gray-400 mt-1 truncate">{dish.category || ''}</p>
// //                       )}
// //                     </div>

// //                     <div className="flex items-center justify-between pt-1">
// //                       <span className="font-black text-sm text-gray-900 dark:text-white">${Number(dish.price).toFixed(2)}</span>
// //                       <button
// //                         type="button"
// //                         onClick={() => handleAddItem(dish)}
// //                         className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
// //                       >
// //                         <span>Add</span> <Plus size={12} />
// //                       </button>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* Value Proposition Strip */}
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-xs">
// //           <div className="flex items-center gap-3">
// //             <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><Truck size={18} /></div>
// //             <div><h5 className="font-extrabold text-gray-900 dark:text-white">Fast Delivery</h5><p className="text-[10px] text-gray-400">Get your orders delivered fast</p></div>
// //           </div>
// //           <div className="flex items-center gap-3">
// //             <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><ShieldCheck size={18} /></div>
// //             <div><h5 className="font-extrabold text-gray-900 dark:text-white">Secure Payment</h5><p className="text-[10px] text-gray-400">100% secure payment methods</p></div>
// //           </div>
// //           <div className="flex items-center gap-3">
// //             <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><Headphones size={18} /></div>
// //             <div><h5 className="font-extrabold text-gray-900 dark:text-white">24/7 Support</h5><p className="text-[10px] text-gray-400">We're here to help you anytime</p></div>
// //           </div>
// //           <div className="flex items-center gap-3">
// //             <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><Award size={18} /></div>
// //             <div><h5 className="font-extrabold text-gray-900 dark:text-white">Best Quality</h5><p className="text-[10px] text-gray-400">Fresh ingredients & hygienic cooking</p></div>
// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }




// src/pages/customer/Home.jsx
// Customer home: real categories and dishes from the backend.
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  Plus,
  ShoppingBag,
  X,
  Truck,
  ShieldCheck,
  Headphones,
  Award,
  RefreshCw,
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import useCustomerMenu from '../../hooks/useCustomerMenu';
import { iconFor } from '../../utils/categoryIcons';

const FALLBACK_IMAGE = '/assets/food-placeholders/food-healthy-bowl.png';

export default function CustomerHome() {
  const navigate = useNavigate();
  const cartApi = useCart();

  // Shared context from CustomerLayout (opens the layout's cart panel)
  const outletContext = useOutletContext() || {};
  const setIsCartOpen = outletContext.setIsCartOpen || (() => {});

  const { items, categories, loading, error, reload } = useCustomerMenu();
  const [addedToast, setAddedToast] = useState(null);

  // Works with either cart shape (cartItems/quantity or cart/qty)
  const cartLines = cartApi.cartItems || cartApi.cart || [];
  const totalItemsCount = cartLines.reduce(
    (sum, i) => sum + (i.quantity ?? i.qty ?? 0),
    0,
  );

  // Hide the toast after 4 seconds. The cleanup stops the timer if the page closes first.
  useEffect(() => {
    if (!addedToast) return undefined;
    const timer = setTimeout(() => setAddedToast(null), 4000);
    return () => clearTimeout(timer);
  }, [addedToast]);

  // Categories that have at least one dish a customer can order
  const categoryCards = useMemo(() => {
    const used = new Set(items.map((d) => String(d.categoryId)));
    return categories.filter((c) => c.active !== false && used.has(String(c.id)));
  }, [items, categories]);

  // "Featured" is simply the first dishes for now. Real popularity (most ordered)
  // needs order history, so it comes with the Orders module.
  const featuredDishes = items.slice(0, 10);

  const handleAddItem = (dish) => {
    cartApi.addToCart({
      id: dish.id, // the REAL database id
      name: dish.name,
      price: Number(dish.price),
      image: dish.image,
      image_url: dish.image,
      categoryId: dish.categoryId,
    });
    setAddedToast({ itemName: dish.name });
  };

  return (
    <div className="p-6 space-y-8 max-w-[1700px] mx-auto relative font-sans text-gray-900 dark:text-white">

      {/* ADDED ITEM TOAST */}
      {addedToast && (
        <div
          role="status"
          className="fixed top-20 right-6 z-40 bg-[#0B1426] text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-4 max-w-sm"
        >
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shrink-0">
            <ShoppingBag size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-extrabold text-xs text-white truncate">{addedToast.itemName} added!</h5>
            <p className="text-[11px] text-emerald-400 font-bold">{totalItemsCount} items in cart</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsCartOpen(true);
              setAddedToast(null);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs"
          >
            Go to My Cart
          </button>
          <button
            type="button"
            onClick={() => setAddedToast(null)}
            className="text-gray-400 hover:text-white cursor-pointer"
            aria-label="Close message"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="space-y-8">

        {/* Banner */}
        <div className="relative bg-[#0D1813] text-white rounded-3xl p-8 overflow-hidden shadow-xl flex items-center min-h-[260px]">
          <img
            src="/assets/food-placeholders/food-banner-bowl.png"
            alt="Food Bowl Banner"
            className="absolute right-0 top-0 bottom-0 h-full w-full sm:w-[60%] object-cover object-center sm:object-right opacity-85 z-0 transition-transform duration-700 hover:scale-105"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1426] via-[#0B1426]/90 to-transparent z-10" />

          <div className="relative z-20 max-w-lg space-y-4">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Fresh & Tasty
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight text-white drop-shadow-md">
              Delicious food, delivered <span className="text-emerald-400 drop-shadow-sm">to you</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed max-w-md">
              Order your favorite meals from our wide range of freshly prepared tasty dishes.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/customer/menu')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
              >
                Order Now <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => navigate('/customer/offers')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer backdrop-blur-md active:scale-95 shadow-md"
              >
                View Offers
              </button>
            </div>
          </div>
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
          <div className="space-y-6">
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-56 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {/* Categories (from the database) */}
        {!loading && !error && categoryCards.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Categories</h3>
              <button
                type="button"
                onClick={() => navigate('/customer/categories')}
                className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {categoryCards.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => navigate('/customer/menu', { state: { categoryId: cat.id } })}
                  className="bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl p-3 text-center space-y-2 hover:shadow-xs transition-shadow cursor-pointer group"
                >
                  <div className="w-12 h-12 mx-auto bg-amber-50/80 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                    {iconFor(cat.name)}
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block truncate">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Featured dishes (from the database) */}
        {!loading && !error && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Popular Dishes</h3>
              <button
                type="button"
                onClick={() => navigate('/customer/menu')}
                className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            {featuredDishes.length === 0 ? (
              <p className="text-xs text-gray-400">
                No dishes are available right now. Please check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {featuredDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl p-3.5 shadow-2xs space-y-3 relative group"
                  >
                    <button
                      type="button"
                      className="absolute top-4 right-4 p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-400 hover:text-rose-500 transition-colors z-10 cursor-pointer"
                      aria-label="Add to favorites"
                    >
                      <Heart size={14} />
                    </button>

                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-32 object-cover rounded-xl bg-gray-50"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />

                    <div>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{dish.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 truncate">{dish.category}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-black text-sm text-gray-900 dark:text-white">
                        ${dish.price.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddItem(dish)}
                        className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <span>Add</span> <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Value Proposition Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><Truck size={18} /></div>
            <div><h5 className="font-extrabold text-gray-900 dark:text-white">Fast Delivery</h5><p className="text-[10px] text-gray-400">Get your orders delivered fast</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><ShieldCheck size={18} /></div>
            <div><h5 className="font-extrabold text-gray-900 dark:text-white">Secure Payment</h5><p className="text-[10px] text-gray-400">100% secure payment methods</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><Headphones size={18} /></div>
            <div><h5 className="font-extrabold text-gray-900 dark:text-white">24/7 Support</h5><p className="text-[10px] text-gray-400">We're here to help you anytime</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><Award size={18} /></div>
            <div><h5 className="font-extrabold text-gray-900 dark:text-white">Best Quality</h5><p className="text-[10px] text-gray-400">Fresh ingredients & hygienic cooking</p></div>
          </div>
        </div>

      </div>
    </div>
  );
}