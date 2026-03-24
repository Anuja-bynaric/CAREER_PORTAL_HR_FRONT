import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../../redux/authSlice';
import { api } from '../../../Api/api';
import toast from 'react-hot-toast';

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

    if (user) {
      // 1. Update Redux first
      dispatch(setLogin({ user, token: response.data.token || null }));
      
      // 2. Success message
      toast.success(`Welcome, ${user.name}`);

      // 3. Use replace: true to prevent "Back" button bugs
      navigate('/landing', { replace: true });
    }
  } catch (err) {
    const backendMessage = err.response?.data?.message || 'Invalid Credentials';
    toast.error(backendMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-[calc(100-80px)] bg-white flex flex-col font-sans">
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px] p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_50px_rgba(0,0,0,0.02)]">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">HR Login</h1>
            <p className="text-slate-400 text-sm">Enter your credentials to manage portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white font-bold py-4 rounded-xl text-[11px] uppercase tracking-[0.15em] hover:bg-red-700 transition-all active:scale-[0.98] shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:bg-red-400"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : ' Sign In'}
            </button>

            <div className="text-center pt-2">
              <button type="button" className="text-slate-400 text-[11px] hover:text-red-600 font-semibold transition-colors uppercase tracking-widest">
                Forgot your password?
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="bg-slate-900 py-10 text-center">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          © 2026 Bynaric All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default Login;