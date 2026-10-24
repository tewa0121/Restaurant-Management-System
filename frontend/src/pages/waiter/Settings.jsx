import React from 'react';

const Settings = () => {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">System Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow border space-y-6">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Notifications</h3>
          <label className="flex items-center space-x-2">
            <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
            <span className="text-sm text-gray-700">Sound alerts for new orders</span>
          </label>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Printer Setup</h3>
          <select className="border rounded p-2 text-sm w-full">
            <option>Kitchen Thermal Printer (Receipt-01)</option>
            <option>Bar Printer (Receipt-02)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Settings;