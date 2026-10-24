import React from 'react';

const Profile = () => {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">User Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow border text-center">
        <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
          JD
        </div>
        <h2 className="text-xl font-bold text-gray-800">John Doe</h2>
        <p className="text-sm text-gray-500 mb-4">Head Server / Shift Supervisor</p>
        <div className="border-t pt-4 text-left space-y-2 text-sm text-gray-600">
          <p><strong>Email:</strong> john.doe@restaurant.com</p>
          <p><strong>Phone:</strong> +1 (555) 019-2834</p>
          <p><strong>Shift:</strong> Evening (4:00 PM - 11:00 PM)</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;