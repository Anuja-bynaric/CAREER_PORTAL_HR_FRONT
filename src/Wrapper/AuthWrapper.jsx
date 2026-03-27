import React, { useEffect, useState } from 'react'; // 1. Added useState
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { setLogin, setCheckingAuth, setLogout } from '../redux/authSlice';
import { api } from '../Api/api';
import { Loader2 } from 'lucide-react';

const AuthWrapper = ({ allowedRoles = ['admin'] }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  // 2. Local state to "pause" the redirect until the server check finishes
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);

  const { user, isAuthenticated, isCheckingAuth, token: hrToken } = useSelector((state) => state.auth);
  const { appToken } = useSelector((state) => state.application);

  const hasValidToken = !!(hrToken || appToken);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // 3. We attempt to hit /user/me withCredentials. 
        // If the browser has a cookie, the server will validate it even if Redux tokens are null.
        const response = await api.get('/user/me', { withCredentials: true });

        if (response.data.success) {
          dispatch(setLogin({
            user: response.data.user,
            token: response.data.token || hrToken || appToken // Recovery of token
          }));
        } else {
          dispatch(setLogout());
        }
      } catch (error) {
        console.error("Auth verification failed", error);
        // Only log out if it's a 401/Unauthorized
        if (error.response?.status === 401) {
          dispatch(setLogout());
        }
      } finally {
        // 4. Critical: We only stop the loading screen AFTER the API check is done.
        setIsVerifyingSession(false);
        dispatch(setCheckingAuth(false));
      }
    };

    verifyUser();
  }, [dispatch]);

  // 5. Updated Loading check: Stay on the loader if we are still verifying the session
  if (isVerifyingSession || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  // 6. Navigation Logic: Now this only runs after the API call finishes.
  if (!isAuthenticated && !hasValidToken) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Role check
  const userRole = user?.role?.toLowerCase() || "";
  const hasAccess = allowedRoles.map(r => r.toLowerCase()).includes(userRole);

  if (!hasAccess && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center p-8 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">ACCESS DENIED</h1>
          <p className="text-gray-400 text-sm mb-6">Role "{user?.role || 'Guest'}" does not have permission.</p>
          <button onClick={() => window.location.href = '/'} className="text-red-600 font-bold uppercase text-xs">
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default AuthWrapper;