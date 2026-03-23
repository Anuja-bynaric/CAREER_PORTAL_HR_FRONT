import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, Mail, KeyRound, LayoutDashboard } from 'lucide-react'; // Added LayoutDashboard
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setApplicationSession } from '../../redux/ApplicationSlice';
import { api } from '../../Api/api';
import axios from 'axios';

const Password = ({ token: propToken, onPasswordSuccess }) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const tokenFromUrl = searchParams.get('token');
    const token = propToken || tokenFromUrl;
    const email = searchParams.get('email');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (!token) {
            setError("Token missing. Please use the link sent to your email.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/user/finalize-application', {
                token: token,
                password: password
            });

            if (response.data.success) {
                // 1. Get the NEW login token and user data from the response
                const newUserToken = response.data.token; // Check if your backend sends this
                const userData = response.data.data;

                // 2. Save the NEW token to Redux
                // If the backend doesn't send a new one, use 'token' as fallback
                dispatch(setApplicationSession(newUserToken || token));

                // 3. Backup to localStorage so other tabs/refreshes see it
                localStorage.setItem('token', newUserToken || token);

                setIsSubmitted(true);

                setTimeout(() => {
                    if (onPasswordSuccess) {
                        // Pass the full data back to JobDetailView
                        onPasswordSuccess({
                            user: userData,
                            token: newUserToken || token
                        });
                    }
                    navigate('/dashboard');
                }, 3000);

            }
        } catch (err) {
            console.error("Backend Error Detail:", err.response?.data);
            setError(err.response?.data?.error || "Invalid token or session expired.");
        } finally {
            setLoading(false);
        }
    };

    // --- MODIFIED SUCCESS VIEW ---
    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl text-center animate-in fade-in zoom-in duration-500">
                    <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-green-500" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Application Submitted!</h2>
                    <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                        Your account is created successfully!
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-red-50 rounded-lg">
                        <KeyRound size={18} className="text-red-600" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Create Password</h2>
                </div>

                <div className="flex items-center gap-2 mb-6 p-2 bg-slate-50 rounded-lg">
                    <Mail size={14} className="text-slate-400" />
                    <span className="text-xs text-slate-600 font-medium truncate">{email || "User Account"}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            className="w-full pl-10 pr-10 p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="w-full pl-10 p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-2 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-red-500 text-[11px] font-bold text-center">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all active:scale-95 disabled:bg-gray-400"
                    >
                        {loading ? "SAVING..." : "CONFIRM & APPLY"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Password;