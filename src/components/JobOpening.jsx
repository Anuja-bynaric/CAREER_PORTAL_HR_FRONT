import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, AlignLeft, Hash } from 'lucide-react'; // Added Hash icon
import { api } from '../Api/api';
import toast from 'react-hot-toast';

const JobOpening = () => {
    const [formData, setFormData] = useState({
        jobId: '', // Added Job ID field
        title: '',
        location: '',
        experience: '',
        jobType: 'Full-time',
        description: ''
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
            const response = await api.post('/admin/add', formData);

            if (response.data.success) {
                toast.success("Job posted successfully!", { id: loadingToast });
                setFormData({ 
                    jobId: '', 
                    title: '', 
                    location: '', 
                    experience: '', 
                    jobType: 'Full-time', 
                    description: '' 
                });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to post job", { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    const labelStyle = "flex items-center gap-2 text-xs font-bold text-gray-700 uppercase mb-2";
    const inputStyle = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all";

    return (
        <div className="max-w-3xl mx-auto my-8 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Create New <span className="text-red-600">Job Opening</span></h2>
                <p className="text-gray-500 text-sm">Fill in the details below to post a new position to the Career Portal.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Job ID & Job Title Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                    <div className="md:col-span-2">
                        <label className={labelStyle}>
                            <Briefcase size={14} className="text-red-600" /> Job Title
                        </label>
                        <input
                            required
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Frontend Developer"
                            className={inputStyle}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location */}
                    <div>
                        <label className={labelStyle}>
                            <MapPin size={14} className="text-red-600" /> Location
                        </label>
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className={`${inputStyle} cursor-pointer`}
                        >
                            <option value="">Select Location</option>
                            <option value="Pune">Pune</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>

                    {/* Experience */}
                    <div>
                        <label className={labelStyle}>
                            <Clock size={14} className="text-red-600" /> Experience
                        </label>
                        <input
                            required
                            type="text"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="e.g. 0-2 years"
                            className={inputStyle}
                        />
                    </div>
                </div>

                {/* Job Type */}
                <div>
                    <label className={labelStyle}>Job Type</label>
                    <div className="flex gap-4">
                        {['Full-time', 'Internship', 'Contract'].map((type) => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="jobType"
                                    value={type}
                                    checked={formData.jobType === type}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                />
                                <span className="text-sm text-gray-600">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className={labelStyle}>
                        <AlignLeft size={14} className="text-red-600" /> Job Description
                    </label>
                    <textarea
                        required
                        name="description"
                        rows="5"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the roles, responsibilities, and requirements..."
                        className={inputStyle}
                    ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center w-full mt-8">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-1/3 bg-red-600 text-white py-3 rounded-xl font-semibold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:bg-gray-400 disabled:shadow-none active:scale-95"
                    >
                        {loading ? "Posting..." : "Post Job Opening"}
                    </button>
                </div>
            </form >
        </div >
    );
};

export default JobOpening;