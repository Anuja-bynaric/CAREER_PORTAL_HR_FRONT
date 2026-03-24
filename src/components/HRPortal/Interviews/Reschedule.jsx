import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../Api/api';
import toast from 'react-hot-toast';
import { CalendarClock, ArrowLeft, Loader2, Save } from 'lucide-react';

const Reschedule = () => {
  const { Interview_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    scheduledAt: '',
    notes: ''
  });

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/admin/interviews/${Interview_id}`);
        const data = res.data.data;
        
        // Convert UTC/DB date to local datetime-local format
        const date = new Date(data.scheduledAt);
        const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        
        setFormData({
          scheduledAt: formattedDate,
          notes: '' // Start with fresh notes for the reschedule reason
        });
      } catch (error) {
        toast.error("Error loading interview details");
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [Interview_id]);

  const handleReschedule = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // NOTE: We match the backend expected body: { scheduledAt, notes, googleUserId }
      const payload = {
        scheduledAt: formData.scheduledAt,
        notes: formData.notes,
        googleUserId: 1, // Ensure this matches the ID in your google_tokens table
        durationMinutes: 30
      };

      const response = await api.patch(`/admin/interviews/${Interview_id}/reschedule`, payload);

      if (response.data.success) {
        toast.success("Interview rescheduled! New Meet link generated.");
        navigate(`/Interview/${Interview_id}`); 
      }
    } catch (error) {
      const errorData = error.response?.data;
      console.error("Reschedule Error:", errorData);

      // Handle the Google Refresh Token / Client ID error specifically
      if (errorData?.message?.includes("invalid_request")) {
        toast.error("Google Session Expired. Please Re-login to Google in Admin Settings.");
      } else {
        toast.error(errorData?.message || "Failed to reschedule interview.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <Loader2 className="animate-spin text-red-600" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Schedule...</p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6">
      <button 
        onClick={() => navigate(`/Interview/${Interview_id}`)} 
        className="flex items-center gap-1 text-slate-400 hover:text-red-600 mb-6 font-black text-[7px] uppercase tracking-widest transition-colors"
      >
        <ArrowLeft size={10}/> Cancel & Back
      </button>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-white flex items-center gap-4">
          <div className="bg-red-600 p-3 rounded-2xl">
            <CalendarClock size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-tight">Reschedule</h2>
            <p className="text-[8px] font-bold opacity-60 uppercase tracking-widest">Update Time & Google Meet</p>
          </div>
        </div>

        <form onSubmit={handleReschedule} className="p-8 space-y-6">
          <div>
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">
              New Interview Date & Time (IST)
            </label>
            <input 
              type="datetime-local"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none transition-all"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">
              Reason for Rescheduling
            </label>
            <textarea 
              rows="4"
              placeholder="e.g., Interviewer unavailable or candidate requested change..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium outline-none focus:border-slate-400 transition-all"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all ${
              submitting 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-red-600 text-white hover:bg-red-700 shadow-red-200'
            }`}
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <><Save size={16}/> Confirm & Update Meet</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reschedule;