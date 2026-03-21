import React, { useState } from 'react';
import { ChevronLeft, Lock, Mail, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const LoginForm = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Get the job data passed from the Selection Gate (if any)
    const job = location.state?.job;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/user/login', {
                email: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                if (onLoginSuccess) onLoginSuccess(response.data.user);

                // FIXED: Redirect to /dashboard instead of /career
                // We pass the user data so the Dashboard knows who just logged in
                navigate('/dashboard', {
                    state: {
                        user: response.data.user,
                        previouslySelectedJob: job // Optional: keep track of the job they wanted
                    }
                });
            }
        } catch (error) {
            alert(error.response?.data?.message || "Invalid Email or Password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        /* 1. Change to flex-col and min-h-screen to ensure the footer hits the bottom */
        <div className="min-h-screen flex flex-col bg-slate-50">

            {/* 2. This div grows to fill space, keeping the footer at the bottom */}
            <div className="flex-grow flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-red-600 font-bold mb-4 text-[12px] hover:underline"
                    >
                        <ChevronLeft size={14} /> Back
                    </button>

                    <h2 className="text-xl font-bold text-slate-900 mb-1">Login</h2>
                    <p className="text-gray-400 mb-6 text-[11px]">
                        {job ? `Sign in to apply for ${job.title}` : "Please enter your details to sign in."}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-tight">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={14} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-9 p-2.5 text-[12px] border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-tight">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={14} />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-9 p-2.5 text-[12px] border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 active:scale-95 transition-all mt-3 shadow-lg shadow-red-100 text-[12px] tracking-wide flex justify-center items-center"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : "SIGN IN"}
                        </button>
                    </form>
                </div>
            </div>

            {/* 3. Footer now sits outside the centering div */}
            <footer className="w-full bg-black text-white/70 py-10 text-center">
                <p className="text-xs tracking-wider">© 2022 Bynaric All Rights Reserved. [wps_visitor_counter]</p>
            </footer>
        </div>
    );
}

export default LoginForm;