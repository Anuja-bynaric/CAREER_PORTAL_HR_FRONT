import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { setLogin, setCheckingAuth, setLogout } from '../redux/authSlice';
import { api } from '../Api/api';
import { Loader2 } from 'lucide-react';

const AuthWrapper = ({ allowedRoles = ['admin'] }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated, isCheckingAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    const verifyUser = async () => {
      // Only verify if we don't have a user OR if we just logged in
      try {
        const response = await api.get('/user/me');
        if (response.data.success) {
          dispatch(setLogin({ user: response.data.user }));
        } else {
          dispatch(setLogout());
        }
      } catch (error) {
        dispatch(setLogout());
      } finally {
        dispatch(setCheckingAuth(false));
      }
    };

    verifyUser();
  }, [dispatch]); // Only run on mount

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the location they were trying to go to
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const userRole = user?.role?.toLowerCase() || "";
  const hasAccess = allowedRoles.map(r => r.toLowerCase()).includes(userRole);

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center p-8 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">ACCESS DENIED</h1>
          <p className="text-gray-400 text-sm mb-6">Role "{user?.role}" does not have permission.</p>
          <button onClick={() => window.location.href='/'} className="text-red-600 font-bold uppercase text-xs">
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default AuthWrapper;