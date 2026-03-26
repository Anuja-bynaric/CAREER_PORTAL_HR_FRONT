import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, AlignLeft, ListChecks, Layers, ArrowLeft, Code2 } from 'lucide-react';
import { api } from '../../../Api/api';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const JobOpening = () => {
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        experience: '',
        jobType: 'Full-time',
       
        description: '',
        skills: '', // Renamed from requirements to skills for clarity
        responsibilities: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading("Posting new job...");
        setLoading(true);

        try {
            // Convert comma-separated strings into clean arrays
            const submissionData = {
                ...formData,
                // Send 'skills' array as 'requirements' to match your backend controller
                requirements: formData.skills
                    .split(',')
                    .map(item => item.trim())
                    .filter(i => i !== ""),
                responsibilities: formData.responsibilities
                    .split(',')
                    .map(item => item.trim())
                    .filter(i => i !== "")
            };

            // Remove the 'skills' field so it doesn't duplicate data in the request
            delete submissionData.skills;

            const response = await api.post('/admin/create/jobs', submissionData);

            if (response.data.success) {
                toast.success("Job posted successfully!", { id: loadingToast });
                navigate('/job_Openings');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to post job", { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    const labelStyle = "flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest";
    const inputStyle = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all placeholder:text-slate-300 text-[13px] text-slate-700 font-medium";

    return (
        <div className="min-h-screen bg-slate-50/30 font-sans text-slate-900 pb-20">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/job_Openings')}
                        className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-red-200 text-slate-400 hover:text-red-600 transition-all"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-[#0f172a] tracking-tight">
                            CREATE <span className="text-red-600">JOB OPENING</span>
                        </h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                            Post a new position to the Career Portal
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelStyle}><Briefcase size={14} className="text-red-500" /> Job Title</label>
                                    <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Frontend Developer" className={inputStyle} />
                                </div>
                              
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelStyle}><MapPin size={14} className="text-red-500" /> Location</label>
                                    <select name="location" value={formData.location} onChange={handleChange} required className={`${inputStyle} appearance-none cursor-pointer`}>
                                        <option value="">Select Location</option>
                                        <option value="Pune">Pune</option>
                                        <option value="Mumbai">Mumbai</option>
                                        <option value="Remote">Remote</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelStyle}><Clock size={14} className="text-red-500" /> Experience</label>
                                    <input required type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 0-2 years" className={inputStyle} />
                                </div>
                            </div>

                            <div>
                                <label className={labelStyle}>Job Type</label>
                                <div className="flex flex-wrap gap-6 mt-1">
                                    {['Full-time', 'Internship', 'Contract'].map((type) => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="jobType"
                                                value={type}
                                                checked={formData.jobType === type}
                                                onChange={handleChange}
                                                className="w-3.5 h-3.5 text-red-600 border-slate-300 focus:ring-red-500/20"
                                            />
                                            <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${formData.jobType === type ? 'text-slate-900' : 'text-slate-400'}`}>
                                                {type}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className={labelStyle}><AlignLeft size={14} className="text-red-500" /> Job Description</label>
                                <textarea required name="description" rows="3" value={formData.description} onChange={handleChange} placeholder="Brief summary..." className={`${inputStyle} resize-none`}></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelStyle}><Code2 size={14} className="text-red-500" /> Technical Skills</label>
                                    <textarea 
                                        name="skills" 
                                        rows="3" 
                                        value={formData.skills} 
                                        onChange={handleChange} 
                                        placeholder="React, Node.js, TypeScript (comma separated)..." 
                                        className={`${inputStyle} resize-none text-[12px]`}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className={labelStyle}><ListChecks size={14} className="text-red-500" /> Responsibilities</label>
                                    <textarea 
                                        name="responsibilities" 
                                        rows="3" 
                                        value={formData.responsibilities} 
                                        onChange={handleChange} 
                                        placeholder="Building UI, API Integration (comma separated)..." 
                                        className={`${inputStyle} resize-none text-[12px]`}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-2.5 bg-red-600 text-white rounded-lg font-bold uppercase text-[11px] tracking-widest hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg shadow-red-200 disabled:bg-slate-300 disabled:shadow-none"
                                >
                                    {loading ? "Processing..." : "Confirm & Post"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobOpening;