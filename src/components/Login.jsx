import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../redux/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/user/login', {
        email,
        password,
      });

      const { user, token } = response.data;
      dispatch(setLogin({ user, token }));
      navigate('/landing');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar / Logo Area */}
    

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 -mt-20">
        <div className="w-full max-w-[440px] p-12 rounded-[2.5rem] border border-gray-50 shadow-[0_10px_50px_rgba(0,0,0,0.04)]">
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">HR Login</h1>
            <p className="text-gray-400 text-sm">Enter your credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-500 text-xs font-medium text-center bg-red-50 py-2 rounded-lg">
                {error}
              </div>
            )}

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
              className="w-full bg-red-600 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-red-700 transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
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

      {/* Dark Footer */}
      <footer className="bg-black py-8 text-center">
        <p className="text-gray-400 text-xs tracking-wide">
          © 2022 Bynaric All Rights Reserved. <span className="text-gray-600 ml-1">[wps_visitor_counter]</span>
        </p>
      </footer>
    </div>
  );
};

export default Login;