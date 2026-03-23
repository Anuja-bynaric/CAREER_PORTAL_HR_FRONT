import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../Api/api';
import toast from 'react-hot-toast';
import { RefreshCcw, Save, Trash2 } from 'lucide-react';

const EditInterview = () => {
  const { Interview_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ scheduledAt: '', notes: '', status: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/admin/interviews/${Interview_id}`);
        const data = res.data.data;
        // Format date for datetime-local input
        const date = new Date(data.scheduledAt);
        const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        
        setFormData({ scheduledAt: formattedDate, notes: data.notes || '', status: data.status });
      } catch (error) {
        toast.error("Error loading interview");
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [Interview_id]);

const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    // 1. Try Reschedule
    await api.patch(`/admin/interviews/${Interview_id}/reschedule`, {
      scheduledAt: formData.scheduledAt,
      notes: formData.notes
    });

    // 2. Try Status Update
    await api.patch(`/admin/interviews/${Interview_id}/status`, {
      status: formData.status,
      remarks: formData.notes
    });

    toast.success("Interview updated successfully");
    navigate(-1);
  } catch (error) {
    // This will now show "invalid_request" or "Could not determine client ID"
    const errorMsg = error.response?.data?.message || "Update failed";
    console.error("Backend Error Response:", error.response?.data);
    toast.error(`Error: ${errorMsg}`); 
  }
};

  if (loading) return <div className="p-10 text-center animate-pulse">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-8">
        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-6">Edit Interview</h2>
        
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">New Schedule (IST)</label>
            <input 
              type="datetime-local"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Current Status</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Internal Notes / Remarks</label>
            <textarea 
              rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium outline-none"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-red-200 hover:bg-red-700"
            >
              <Save size={14}/> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInterview;