import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../../../Api/api';
import { Loader2, CheckCircle, ArrowLeft, MessageSquare, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const UpdateInterviewStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: 'completed',
    remarks: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If your backend uses Cookies, you don't need to manually check for a token string
    // Just check if the user object exists from the AuthWrapper/Redux
    if (!user) {
      toast.error("Session expired. Please login again.");
      return;
    }

    const toastId = toast.loading("Updating interview status...");
    setLoading(true);

    try {
      const response = await api.patch(`/admin/interviews/${id}/status`,
        {
          status: formData.status,
          remarks: formData.remarks
        },
        {
          headers: {
            // Only include this if your user object definitely has a 'token' property
            ...(user.token && { 'Authorization': `Bearer ${user.token}` }),
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Status updated successfully!', { id: toastId });
        // Make sure this path matches your App.js route for the list
        navigate('/list_schedule_interview');
      }
    } catch (error) {
      console.error("Update Error:", error.response?.data);
      const serverMessage = error.response?.data?.message || "Failed to update status";
      toast.error(`Error: ${serverMessage}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
      <div className="max-w-2xl mx-auto">

        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:text-[#ff0000] hover:border-red-100 transition-all group"
            title="Go Back"
          >
            <ArrowLeft size={20} className="text-slate-500 group-hover:text-[#ff0000]" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#1a202c] uppercase tracking-tight">Update Interview Status</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">ID: {id}</p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Status Selection */}
              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Current Progress</label>
                <div className="relative">
                  <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#ff0000] w-4 h-4 transition-colors" />
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] text-xs font-semibold text-slate-700 appearance-none cursor-pointer transition-all"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Remarks Textarea */}
              <div className="group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Interview Remarks</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-4 text-slate-300 group-focus-within:text-[#ff0000] w-4 h-4 transition-colors" />
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Provide details about the candidate's performance..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#ff0000] text-xs font-medium min-h-[150px] transition-all resize-none"
                    required
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ff0000] disabled:bg-slate-200 text-white font-black py-3.5 rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-100 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {loading ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle size={14} />}
                  {loading ? 'Processing Update...' : 'Confirm Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateInterviewStatus;