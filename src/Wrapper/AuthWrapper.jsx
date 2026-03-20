import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AuthWrapper = ({ allowedRoles = ['admin'] }) => {
  // Get auth state from Redux
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);

  // 1. Check if the user is even logged in
  if (!isAuthenticated || !token) {
    return <Navigate to="/" replace />;
  }

  // 2. Check if the user's role matches the allowed roles
  // Note: Ensure your backend/token provides the 'role' field in the user object
  const hasAccess = allowedRoles.includes(user?.role?.toLowerCase());

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center p-8 bg-white rounded-[2rem] shadow-xl border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight mb-2">Access Denied</h1>
          <p className="text-gray-400 text-sm mb-6">You do not have administrative privileges to view this page.</p>
          <button 
            onClick={() => window.history.back()}
            className="text-xs font-bold uppercase tracking-widest text-red-600 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // 3. If everything is fine, render the child routes
  return <Outlet />;
};

export default AuthWrapper;