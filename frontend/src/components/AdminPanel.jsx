import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Counselling Session Manager</h1>
              <p className="text-sm text-gray-600 mt-1">Admin Panel for Location & Schedule Setup</p>
            </div>
            <nav className="flex space-x-4">
              <NavLink
                to="/admin/create-session"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`
                }
              >
                Create Session
              </NavLink>
              <NavLink
                to="/admin/sessions"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`
                }
              >
                View Sessions
              </NavLink>
              <NavLink
                to="/admin/analytics"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`
                }
              >
                Analytics
              </NavLink>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;