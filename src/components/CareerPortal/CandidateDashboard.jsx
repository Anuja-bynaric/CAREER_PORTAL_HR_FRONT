import React, { useState, useEffect } from 'react';
import { LogOut, Briefcase, CheckCircle, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ApplicationStatus from './ApplicationStatus';
import JobCard from './JobCard';

const CandidateDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // States
    const [user, setUser] = useState(location.state?.user || null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Redirect if no user session is found
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchDashboardData();
        }
    }, [user, navigate]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch all jobs so the user can see more opportunities
            const response = await axios.get('http://localhost:5000/admin/all/jobs');
            if (response.data.success) {
                setJobs(response.data.data);
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Clear local storage/session if you use it
        setUser(null);
        navigate('/career');
    };

    const handleApplyMore = (job) => {
        navigate(`/job/${job.id}`, { state: { job, user, view: 'form' } });
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">B</div>
                        <span className="font-bold text-slate-800 tracking-tight">Candidate Hub</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold text-slate-900">{user.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-slate-400 hover:text-red-600 transition-colors group"
                        >
                            <span className="text-[11px] font-bold uppercase tracking-wider">Logout</span>
                            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-8 py-10">
                {/* Dashboard Header */}
                <div className="mb-10">
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        Welcome back, <span className="text-red-600">{user.name.split(' ')[0]}!</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Track your active applications and discover new opportunities.</p>
                </div>

                {/* Quick Stats (Optional) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Applied</p>
                            <p className="text-xl font-bold text-slate-900">{user.applications?.length || 0}</p>
                        </div>
                    </div>
                    {/* Add more stats here if needed */}
                </div>

                {/* SECTION: Application History Table */}
                <section className="mb-16">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={18} className="text-red-600" />
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Your Application Status</h2>
                    </div>
                    <ApplicationStatus applications={user.applications} />
                </section>

                {/* SECTION: Open Positions */}
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
                            <div className="py-10 text-center text-slate-400 animate-pulse">Updating job list...</div>
                        ) : (
                            jobs.map(job => (
                                <JobCard
                                    key={job.id}
                                    {...job}
                                    onApply={() => handleApplyMore(job)}
                                    // Highlight if already applied
                                    isApplied={user.appliedJobIds?.includes(job.id)}
                                />
                            ))
                        )}
                    </div>
                </section>
            </main>

            <footer className="w-full bg-black text-white/70 py-12 mt-20 text-center">
                <p className="text-xs tracking-wider">© 2022 Bynaric All Rights Reserved. [wps_visitor_counter]</p>
            </footer>
        </div>
    );
};

export default CandidateDashboard;