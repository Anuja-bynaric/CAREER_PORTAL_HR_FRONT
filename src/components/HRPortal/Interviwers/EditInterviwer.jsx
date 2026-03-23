import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../../Api/api';
import toast from 'react-hot-toast';

const EditInterviwer = () => {
    const { Interviwer_Id } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); 
    
    const [submitting, setSubmitting] = useState(false);
    
    // Standardized to phoneNumber (CamelCase) to match your Backend Controller
    const [formData, setFormData] = useState({ 
        name: location.state?.person?.name || '', 
        email: location.state?.person?.email || '',
        phoneNumber: location.state?.person?.phoneNumber || '' 
    });

    useEffect(() => {
        if (!location.state?.person) {
            const fetchOne = async () => {
                try {
                    const res = await api.get(`/admin/interviewers/${Interviwer_Id}`);
                    // Use the standardized key here too
                    const data = res.data.data || res.data.user;
                    setFormData({
                        name: data.name,
                        email: data.email,
                        phoneNumber: data.phoneNumber
                    });
                } catch (err) {
                    toast.error("Interviewer data not found");
                    navigate('/InterviewerList');
                }
            };
            fetchOne();
        }
    }, [Interviwer_Id, location.state, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const toastId = toast.loading("Updating...");

        try {
            await api.put(`/admin/interviewers/${Interviwer_Id}`, formData);
            toast.success("Details updated successfully", { id: toastId });
            navigate('/InterviewerList');
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed", { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen flex justify-center items-start">
            <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 w-full max-w-md mt-6">
                <div className="mb-4">
                    <button type="button" onClick={() => navigate('/InterviewerList')} className="text-gray-400 hover:text-red-600 font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1">
                        <span>←</span> Back to list
                    </button>
                </div>

                <header className="mb-6">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter leading-tight">Edit Details</h2>
                    <p className="text-gray-400 text-[10px] font-bold uppercase mt-1 tracking-widest">ID: {Interviwer_Id}</p>
                </header>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Full Name</label>
                        <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all font-medium text-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Email Address</label>
                        <input type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all font-medium text-sm" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 ml-1">Phone Number</label>
                        {/* FIXED: value and onChange now use the same key: phoneNumber */}
                        <input type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all font-medium text-sm" value={formData.phoneNumber} placeholder="+91 00000 00000" onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
                    </div>

                    <div className="pt-2">
                        <button type="submit" disabled={submitting} className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-red-100 disabled:opacity-50 transition-all active:scale-[0.98]">
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditInterviwer;