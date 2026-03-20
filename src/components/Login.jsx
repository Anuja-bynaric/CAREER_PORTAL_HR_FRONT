import React, { useState } from 'react';
import { Mail, Lock, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("HR Login:", { email, password });
    navigate('/job_Openings')
  };

  return (
    /* mt-8 or mt-12 controls the distance from Navbar */
    <div className="flex justify-center mt-10 px-4"> 
      <div className="bg-white w-full max-w-[360px] p-6 md:p-8 border border-slate-100 shadow-sm rounded-[2rem]">
        
        

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-0.5">HR Login</h1>
        <p className="text-slate-400 text-[11px] leading-tight mb-6">Enter your credentials.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-10 pr-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:ring-1 focus:ring-red-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••"
                className="w-full pl-10 pr-3 py-2 text-[13px] bg-slate-50 border border-transparent rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#f50000] text-white font-bold py-2.5 rounded-lg text-[13px] uppercase tracking-widest hover:bg-red-700 active:scale-95 transition-all">
            SIGN IN
          </button>

          <div className="text-center mt-3">
            <button type="button" className="text-slate-400 text-[11px] font-medium hover:text-slate-600 underline underline-offset-2">
              Forgot your password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;