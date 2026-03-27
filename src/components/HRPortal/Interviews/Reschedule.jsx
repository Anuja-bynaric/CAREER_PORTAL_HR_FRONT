import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../Api/api';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { CalendarClock, ArrowLeft, Loader2, Save, Clock, ChevronRight } from 'lucide-react';

const Reschedule = () => {
  const { Interview_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/admin/interviews/${Interview_id}`);
        const data = res.data.data;
        if (data.scheduledAt) {
          setStartDate(new Date(data.scheduledAt));
        }
      } catch (error) {
        toast.error("Error loading interview details");
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [Interview_id]);

  const getDisplayDate = () => {
    return {
      day: startDate.getDate().toString().padStart(2, '0'),
      month: startDate.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      weekday: startDate.toLocaleString('en-US', { weekday: 'long' }),
      time: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  const display = getDisplayDate();

  const handleReschedule = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        scheduledAt: startDate.toISOString(),
        notes: notes,
        googleUserId: 1, 
        durationMinutes: 30
      };
      const response = await api.patch(`/admin/interviews/${Interview_id}/reschedule`, payload);
      if (response.data.success) {
        toast.success("Interview rescheduled successfully!");
        navigate(`/Interview/${Interview_id}`); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reschedule");
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
      {/* Custom Scoped Styles for DatePicker */}
      <style>{`
        .react-datepicker-popper { z-index: 50 !important; }
        .react-datepicker {
          border: none !important;
          font-family: inherit !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4) !important;
          border-radius: 24px !important;
          display: flex !important;
          overflow: hidden !important;
          background-color: #0f172a !important;
        }
        .react-datepicker__header {
          background-color: #0f172a !important;
          border-bottom: 1px solid #1e293b !important;
          padding: 15px !important;
        }
        .react-datepicker__current-month {
          color: white !important;
          text-transform: uppercase;
          font-size: 11px !important;
          letter-spacing: 2px !important;
          font-weight: 900 !important;
        }
        .react-datepicker__day-name { color: #64748b !important; font-size: 10px !important; font-weight: 800 !important; }
        .react-datepicker__day { color: #cbd5e1 !important; font-size: 11px !important; font-weight: 600 !important; }
        .react-datepicker__day:hover { background-color: #1e293b !important; border-radius: 8px !important; }
        .react-datepicker__day--selected { 
          background-color: #ef4444 !important; 
          color: white !important;
          border-radius: 8px !important; 
        }
        .react-datepicker__day--keyboard-selected { background-color: transparent !important; border: 1px solid #ef4444 !important; }
        
        .react-datepicker__time-container {
          background-color: #0f172a !important;
          border-left: 1px solid #1e293b !important;
          width: 90px !important;
        }
        .react-datepicker-time__header { color: white !important; font-size: 10px !important; text-transform: uppercase; letter-spacing: 1px; }
        .react-datepicker__time-list { background-color: #0f172a !important; }
        .react-datepicker__time-list-item { 
          color: #94a3b8 !important; 
          font-size: 10px !important;
          font-weight: 700 !important;
          padding: 10px 5px !important;
          transition: all 0.2s;
        }
        .react-datepicker__time-list-item:hover { background-color: #1e293b !important; color: white !important; }
        .react-datepicker__time-list-item--selected { background-color: #ef4444 !important; color: white !important; }
      `}</style>

      <button 
        onClick={() => navigate(`/Interview/${Interview_id}`)} 
        className="flex items-center gap-2 text-slate-400 hover:text-red-600 mb-6 font-black text-[9px] uppercase tracking-widest transition-all group"
      >
        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform"/> Cancel & Back
      </button>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="bg-[#1a202c] p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-900/20">
              <CalendarClock size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight">Reschedule</h2>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Google Meet Update</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
        </div>

        <form onSubmit={handleReschedule} className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
              Select New Schedule
            </label>
            
            <div className="relative group shadow-sm">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                dateFormat="Pp"
                customInput={
                  <div className="relative cursor-pointer bg-slate-50 border border-slate-200 rounded-[2.5rem] overflow-hidden flex hover:border-red-500 transition-all active:scale-[0.98]">
                    {/* Left Section */}
                    <div className="bg-red-600 w-28 p-6 flex flex-col items-center justify-center text-white">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{display.month}</span>
                      <span className="text-4xl font-black leading-none my-1">{display.day}</span>
                      <div className="w-6 h-1 bg-white/30 rounded-full mt-2" />
                    </div>
                    {/* Right Section */}
                    <div className="flex-1 p-6 flex flex-col justify-center bg-white">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{display.weekday}</span>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-red-600" />
                        <span className="text-xl font-black text-slate-800 tracking-tight">{display.time}</span>
                      </div>
                      <span className="text-[7px] font-bold text-slate-300 uppercase mt-2 tracking-widest flex items-center gap-1">
                         <div className="w-1 h-1 rounded-full bg-slate-300" /> Click to Change
                      </span>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 group-hover:text-red-500 transition-colors">
                        <ChevronRight size={24} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
              Reason for Rescheduling
            </label>
            <textarea 
              rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium outline-none focus:border-red-500 focus:bg-white transition-all resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              disabled={submitting}
              className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98] ${
                submitting 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700 shadow-red-200 hover:shadow-red-400'
              }`}
            >
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18}/> Update Schedule</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reschedule;