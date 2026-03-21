import React from 'react';
import { MapPin, Clock, ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const JobSelectionGate = () => {
    // 1. Grab the 'job' object from the navigation state
    const location = useLocation();
    const navigate = useNavigate();
    const job = location.state?.job;
    const { jobId } = useParams();

    // 2. Safety Check: If someone refreshes the page, state is lost. 
    // Redirect them back to avoid the "Cannot read properties of undefined" error.
    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <p className="text-slate-500 mb-4">No job data found. Please select a job again.</p>
                    <button
                        onClick={() => navigate('/career')}
                        className="text-red-600 font-bold uppercase text-xs tracking-widest"
                    >
                        Go to Career Portal
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200 py-10 px-8 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate('/career')}
                        className="flex items-center text-slate-500 hover:text-red-600 mb-4 transition-colors text-[11px] font-medium uppercase tracking-widest"
                    >
                        <ChevronLeft size={14} className="mr-1" /> Back to Job List
                    </button>

                    <h1 className="text-2xl font-bold mb-3 tracking-tight text-slate-800">{job.title}</h1>

                    <div className="flex gap-5 text-slate-500 text-xs font-normal">
                        <span className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-red-500" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock size={14} className="text-red-500" /> {job.jobType || job.type}
                        </span>
                    </div>
                </div>
            </div>

            {/* Selection Cards */}
            <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-6 flex-grow">
                {/* Sign In Card */}
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center group hover:border-red-100 transition-all">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-50 transition-colors">
                        <div className="w-2 h-2 bg-slate-400 rounded-full group-hover:bg-red-400"></div>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800 mb-2">Already have an account?</h2>
                    <p className="text-[13px] text-slate-500 mb-8 leading-relaxed">
                        Login to quickly apply using your saved profile and documents.
                    </p>
                    <button
                        onClick={() => navigate('/login', { state: { job } })}
                        className="w-full py-2.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:border-red-600 hover:text-red-600 transition-all text-xs uppercase tracking-wider">
                        SIGN IN
                    </button>
                </div>

                {/* New Candidate Card */}
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center group hover:border-red-100 transition-all">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-50 transition-colors">
                        <div className="w-2 h-2 bg-slate-400 rounded-full group-hover:bg-red-400"></div>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800 mb-2">New Candidate?</h2>
                    <p className="text-[13px] text-slate-500 mb-8 leading-relaxed">
                        Start a fresh application. It only takes a few minutes to get started.
                    </p>
                    <button
                        onClick={() => navigate(`/job/${job.id}`, { state: { job, view: 'form' } })}
                        className="w-full py-2.5 bg-red-600 text-white font-medium rounded-lg shadow-sm hover:bg-red-700 transition-all text-xs uppercase tracking-wider"
                    >
                        APPLY NOW
                    </button>
                </div>
            </div>
            <footer className="w-full bg-black text-white/70 py-12 mt-20 text-center">
                <p className="text-xs tracking-wider">© 2022 Bynaric All Rights Reserved. [wps_visitor_counter]</p>
            </footer>
        </div>
    );
};

export default JobSelectionGate;