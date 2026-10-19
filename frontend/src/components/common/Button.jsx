// import React from 'react';

// export default function Button({ 
//   children, 
//   type = 'button', 
//   variant = 'primary', 
//   loading = false, 
//   disabled = false, 
//   onClick, 
//   className = '' 
// }) {
//   const baseStyles = "w-full py-3 px-4 font-bold rounded-lg shadow-md transition duration-200 text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
//   const variants = {
//     primary: "bg-green-600 hover:bg-green-700 text-white",
//     secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
//     outline: "border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm"
//   };

//   return (
//     <button
//       type={type}
//       disabled={disabled || loading}
//       onClick={onClick}
//       className={`${baseStyles} ${variants[variant]} ${className}`}
//     >
//       {loading ? (
//         <span className="flex items-center space-x-2">
//           <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
//           </svg>
//           <span>Loading...</span>
//         </span>
//       ) : children}
//     </button>
//   );
// }