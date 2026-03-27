import React, { useState } from 'react';
import { Mail, Lock, Loader2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../../redux/authSlice';
import { setApplicationSession } from '../../../redux/ApplicationSlice'; // IMPORT THIS
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
      const { user, token } = response.data;

      if (user && token) {
        // 1. Set Header so subsequent calls work
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 2. CRITICAL: Update BOTH slices
        // We update 'auth' because AuthWrapper reads 'user.role' from here
        dispatch(setLogin({ user, token }));

        // We update 'application' because your candidate logic uses this
        dispatch(setApplicationSession(token));

        const role = user.role?.toLowerCase();
        console.log("Logged in user role:", role); // DEBUG LINE

        if (role === 'candidate') {
          toast.success(`Welcome, ${user.name}`);
          // Navigate to dashboard
          navigate('/dashboard', { replace: true });
        } else if (role === 'admin' || role === 'hr') {
          navigate('/landing', { replace: true });
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  // ... (Keep your JSX exactly as it is)

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px] p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-red-600 font-bold mb-4 text-[12px] hover:underline"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Login</h1>
            <p className="text-slate-400 text-sm">Enter your credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl text-sm outline-none focus:border-red-500 transition-all" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl text-sm outline-none focus:border-red-500 transition-all" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white font-bold py-4 rounded-xl text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;