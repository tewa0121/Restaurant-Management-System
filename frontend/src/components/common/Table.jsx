import React from 'react';

export default function Table({ headers, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left min-w-max">
          <thead className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-6 py-4 font-medium whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}