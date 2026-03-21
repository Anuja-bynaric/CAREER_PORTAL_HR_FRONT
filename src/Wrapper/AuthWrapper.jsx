import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { setLogin, setCheckingAuth } from '../redux/authSlice';
import { api } from '../Api/api';
import { Loader2 } from 'lucide-react';

const AuthWrapper = ({ allowedRoles = ['admin'] }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isCheckingAuth } = useSelector((state) => state.auth);

useEffect(() => {
  const verifyUser = async () => {
    // 1. If we already have a user in Redux, stop loading immediately
    if (isAuthenticated && user) {
      dispatch(setCheckingAuth(false));
      return;
    }

    try {
      const response = await api.get('/user/me');
      if (response.data.success) {
        // 2. IMPORTANT: Ensure your backend /user/me returns the token 
        // if your frontend logic depends on user.token
        dispatch(setLogin({ user: response.data.user }));
      } else {
        dispatch(setLogout()); // Clear state if response is unsuccessful
      }
    } catch (error) {
      console.error("Verification failed:", error);
      dispatch(setLogout()); // Force logout on 401/500 errors
    } finally {
      dispatch(setCheckingAuth(false));
    }
  };

  verifyUser();
}, [dispatch, isAuthenticated, user]);

  // 1. Show a loading spinner while checking the cookie/token
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  // 2. If not authenticated after the check, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Role-based access control
  const hasAccess = allowedRoles.includes(user?.role?.toLowerCase());

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center p-8 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 uppercase mb-2">Access Denied</h1>
          <p className="text-gray-400 text-sm mb-6">You do not have administrative privileges.</p>
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

  return <Outlet />;
};

export default AuthWrapper;