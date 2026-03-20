import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, AlignLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';

const JobOpening = () => {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        experience: '',
        jobType: 'Full-time',
        description: ''
    });

    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            
            const response = await axios.post('http://localhost:5000/admin/add', formData);

            if (response.data.success) {
                setStatus({ loading: false, success: true, error: null });
                setFormData({ title: '', location: '', experience: '', jobType: 'Full-time', description: '' });
            }
        } catch (err) {
            setStatus({ loading: false, success: false, error: "Failed to post job. Please try again." });
        }
    };

    return (
        <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Create New <span className="text-red-600">Job Opening</span></h2>
                <p className="text-gray-500 text-sm">Fill in the details below to post a new position to the Career Portal.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Job Title */}
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase mb-2">
                        <Briefcase size={14} className="text-red-600" /> Job Title
                    </label>
                    <input
                        required
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Frontend Developer"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase mb-2">
                            <MapPin size={14} className="text-red-600" /> Location
                        </label>
                        <select
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none cursor-pointer"
                        >
                            <option value="">Select Location</option>
                            <option value="Pune">Pune</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>

                    {/* Experience */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase mb-2">
                            <Clock size={14} className="text-red-600" /> Experience
                        </label>
                        <input
                            required
                            type="text"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="e.g. 0-2 years"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                        />
                    </div>
                </div>

                {/* Job Type */}
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase mb-2">
                        Job Type
                    </label>
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
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase mb-2">
                        <AlignLeft size={14} className="text-red-600" /> Job Description
                    </label>
                    <textarea
                        required
                        name="description"
                        rows="5"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the roles, responsibilities, and requirements..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                    ></textarea>
                </div>

                {/* Feedback Messages */}
                {status.success && (
                    <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                        <CheckCircle size={18} /> Job posted successfully!
                    </div>
                )}
                {status.error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                        {status.error}
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center w-full mt-8">
                    <button
                        type="submit"
                        disabled={status.loading}
                        className="w-1/2 bg-red-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:bg-gray-400 disabled:shadow-none"
                    >
                        {status.loading ? "Posting..." : "Post Job Opening"}
                    </button>
                </div>
            </form >
        </div >
    );
};

export default JobOpening;