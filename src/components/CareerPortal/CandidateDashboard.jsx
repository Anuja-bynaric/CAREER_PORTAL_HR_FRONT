import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, Briefcase, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../Api/api';
import ApplicationStatus from './ApplicationStatus';
import JobCard from './JobCard';
import { useDispatch, useSelector } from 'react-redux';
import { clearApplicationSession } from '../../redux/ApplicationSlice';
import { setLogout } from '../../redux/authSlice'; // Assuming you have this to clear Redux

const CandidateDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 1. Get user from Redux - This is the "Source of Truth" that survives refresh if configured
    const { user: reduxUser, isAuthenticated } = useSelector((state) => state.auth);

    // Local States
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Memoized fetch function to prevent unnecessary re-renders
    const fetchDashboardData = useCallback(async (email) => {
        setLoading(true);
        setError(null);
        try {
            // Run both requests in parallel for better performance
            const [jobsRes, appsRes] = await Promise.all([
                api.get('/admin/all/jobs'),
                api.get(`/user/my-applications?email=${email}`)
            ]);

            if (jobsRes.data.success) {
                const openJobs = jobsRes.data.data.filter(job =>
                    job.status?.toLowerCase() === 'open'
                );
                setJobs(openJobs);
            }

            if (appsRes.data.success) {
                setApplications(appsRes.data.data || []);
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
            setError("Failed to sync dashboard data. Please check your connection.");
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. Navigation & Refresh Logic
    useEffect(() => {
        // If Redux says we aren't logged in, go to login
        if (!isAuthenticated || !reduxUser?.email) {
            navigate('/login');
        } else {
            // If we have a user, fetch their specific data
            fetchDashboardData(reduxUser.email);
        }
    }, [reduxUser?.email, isAuthenticated, navigate, fetchDashboardData]);

    const handleLogout = async () => {
        try {
            await api.post('/user/logout', {}, { withCredentials: true });
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            // Clear all states
            dispatch(clearApplicationSession());
            dispatch(setLogout());
            navigate('/career');
        }
    };

    const handleApplyMore = (job) => {
        // Pass the latest applications list to the job detail view
        navigate(`/job/${job.jobId}`, {
            state: { job, user: { ...reduxUser, applications }, view: 'form' }
        });
    };

    // Prevent rendering "Welcome back, undefined" while redirecting
    if (!reduxUser) return null;

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">B</div>
                        <span className="font-bold text-slate-800 tracking-tight">Candidate Hub</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold text-slate-900">{reduxUser.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{reduxUser.email}</p>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-600 transition-colors group">
                            <span className="text-[11px] font-bold uppercase tracking-wider">Logout</span>
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </nav> */}

            <main className="max-w-6xl mx-auto px-8 py-10">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-3">
                        <AlertCircle size={18} />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <div className="mb-10">
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        Welcome back, <span className="text-red-600">{reduxUser.name?.split(' ')[0]}!</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Track your active applications and discover new opportunities.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Applied</p>
                            <p className="text-xl font-bold text-slate-900">
                                {loading ? "..." : applications.length}
                            </p>
                        </div>
                    </div>
                </div>

                <section className="mb-16">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={18} className="text-red-600" />
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Your Application Status</h2>
                    </div>
                    {loading ? (
                        <div className="h-32 w-full bg-white rounded-2xl animate-pulse border border-slate-100" />
                    ) : (
                        <ApplicationStatus applications={applications} />
                    )}
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18} className="text-red-600" />
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Explore More Roles</h2>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">
                            {jobs.length} Available
                        </span>
                    </div>

                    <div className="grid gap-4">
                        {loading ? (
                            <div className="py-10 text-center text-slate-400 animate-pulse font-medium">Updating job list...</div>
                        ) : (
                            jobs.map(job => (
                                <JobCard
                                    key={job.jobId}
                                    {...job}
                                    onApply={() => handleApplyMore(job)}
                                    isApplied={applications.some(app => String(app.jobId) === String(job.jobId))}
                                />
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CandidateDashboard;