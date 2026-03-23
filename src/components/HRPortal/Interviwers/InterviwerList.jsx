import React, { useState, useEffect } from 'react';
import { api } from '../../../Api/api'; // Reverted to your custom api instance
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const InterviewerList = () => {
    const [interviewers, setInterviewers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInterviewers();
    }, []);

    const fetchInterviewers = async () => {
        try {
            setLoading(true);
            // Tokens are now handled via cookies automatically by your api instance
            const response = await api.get('/admin/interviewers');
            
            /** * ERROR FIX: 
             * Your API likely returns { status: '...', data: [...] }.
             * We must extract 'data' specifically. We also add a fallback [] 
             * to ensure 'interviewers' is ALWAYS an array.
             */
            const result = response.data.data || []; 
            setInterviewers(Array.isArray(result) ? result : []);
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Could not fetch interviewers");
            setInterviewers([]); // Fallback to prevent .map() crash
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!id) return;
        
        const toastId = toast.loading("Processing delete...");
        try {
            await api.delete(`/admin/interviewers/${id}`);
            // Check for both id and _id depending on your DB schema
            setInterviewers(prev => prev.filter(item => (item.id || item._id) !== id));
            toast.success("Interviewer removed", { id: toastId });
        } catch (err) {
            toast.error("Delete failed", { id: toastId });
        }
    };

    const confirmDelete = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Are you sure you want to delete?</span>
                <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-xs font-bold hover:bg-gray-300">Cancel</button>
                    <button onClick={() => { toast.dismiss(t.id); handleDelete(id); }} className="px-3 py-1 bg-red-600 text-white rounded-md text-xs font-bold hover:bg-red-700">Delete</button>
                </div>
            </div>
        ), { duration: 5000, position: 'top-center' });
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/landing')} 
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Interviewer List</h2>
                </div>

                <button 
                    onClick={() => navigate('/addInterviwer')}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold flex items-center transition shadow-lg active:scale-95"
                >
                    <span className="mr-2 text-lg">+</span> Add Interviewer
                </button>
            </div>

            {/* Table UI */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">Name</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">Email</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] text-center">Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="4" className="p-16 text-center text-gray-300 italic">Fetching records...</td></tr>
                        ) : interviewers.length === 0 ? (
                            <tr><td colSpan="4" className="p-16 text-center text-gray-400 italic">No interviewers found.</td></tr>
                        ) : (
                            interviewers.map((person) => (
                                <tr key={person.id || person._id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {person.name}
                                        <div className="text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-tighter">
                                            ID: {person.id || person._id}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{person.email}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-100 uppercase">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span> Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <button 
                                            onClick={() => navigate(`/Interviwer/${person.id || person._id}`, { state: { person } })} 
                                            className="text-gray-400 hover:text-gray-900 font-bold text-xs uppercase transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => confirmDelete(person.id || person._id)} 
                                            className="px-4 py-1.5 bg-[#1e293b] text-white rounded-lg text-xs font-bold hover:bg-black transition-all shadow-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InterviewerList;