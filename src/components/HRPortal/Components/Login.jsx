import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../../redux/authSlice';
import { api } from '../../../Api/api';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/user/login', { email, password });
      const { user } = response.data;

      dispatch(setLogin({ user, token: null }));

      // Display only the backend success message
      toast.success(response.data.message || `Welcome, ${user.name}`);

      setTimeout(() => { navigate('/landing'); }, 500);

    } catch (err) {
      // Extract exact message from backend and fire only ONE toast
      const backendMessage = err.response?.data?.message || 'Invalid Credentials';
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">


      <div className="flex-grow flex items-center justify-center px-4 -mt-20">
        <div className="w-full max-w-[440px] p-12 rounded-[2.5rem] border border-gray-50 shadow-[0_10px_50px_rgba(0,0,0,0.04)]">
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">HR Login</h1>
            <p className="text-gray-400 text-sm">Enter your credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all placeholder:text-gray-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all placeholder:text-gray-300"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-red-700 transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-4 disabled:bg-red-400"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
            </button>

            <div className="text-center pt-2">
              <button type="button" className="text-gray-400 text-[11px] hover:text-red-600 transition-colors">
                Forgot your password?
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="bg-black py-8 text-center">
        <p className="text-gray-400 text-xs tracking-wide">
          © 2026 Bynaric All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Login;