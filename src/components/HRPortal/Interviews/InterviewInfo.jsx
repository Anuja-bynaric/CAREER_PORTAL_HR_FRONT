import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Video, ArrowLeft, Loader2, 
  Edit3, CalendarClock, FileText, Hash
} from 'lucide-react';
import { api } from '../../../Api/api';
import toast from 'react-hot-toast';

const InterviewInfo = () => {
  const { Interview_id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await api.get(`/admin/interviews/${Interview_id}`);
        setInterview(response.data.data);
      } catch (error) {
        toast.error("Failed to load interview details");
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [Interview_id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-12 gap-3">
      <Loader2 className="animate-spin text-red-600" size={32} />
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Loading...</p>
    </div>
  );

  if (!interview) return (
    <div className="text-center p-20 uppercase font-black text-[9px] text-slate-400 tracking-widest">
      Not Found
    </div>
  );

  const statusStyles = {
    scheduled: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    completed: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    cancelled: "bg-slate-500/10 text-slate-500 border border-slate-500/20",
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/list_schedule_interview')} 
        className="flex items-center gap-2 text-slate-400 hover:text-red-600 mb-4 transition-all group"
      >
        <ArrowLeft size={10}/>
        <span className="font-black text-[7px] uppercase tracking-[0.2em]">Back</span>
      </button>

      <div className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <div className="space-y-1.5">
              <div className={`px-2 py-0.5 rounded-full text-[6px] font-black uppercase tracking-widest inline-block ${statusStyles[interview.status] || statusStyles.scheduled}`}>
                {interview.status || 'Unknown'}
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter leading-none">
                Interview <span className="text-red-500">Details</span>
              </h2>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Hash size={8} className="text-red-500"/>
                <span className="text-[8px] font-bold uppercase tracking-widest">Ref: {interview.id}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => navigate(`/Interview/edit/${interview.id}`)}
                className="p-2 bg-white/5 hover:bg-red-600 rounded-xl transition-all border border-white/10 shadow-lg"
              >
                <Edit3 size={14} className="text-white" />
              </button>
              
              {/* FIXED: Reschedule icon only shows if status is 'scheduled' */}
              {interview.status === 'scheduled' && (
                <button 
                  onClick={() => navigate(`/Reschedule/${interview.id}`)}
                  className="p-2 bg-white/5 hover:bg-red-600 rounded-xl transition-all border border-white/10 shadow-lg"
                >
                  <CalendarClock size={14} className="text-white" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-5">
          
          {/* Schedule Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={10} className="text-red-600"/>
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Date</span>
              </div>
              <p className="font-bold text-slate-800 text-xs">
                {new Date(interview.scheduledAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={10} className="text-red-600"/>
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Time</span>
              </div>
              <p className="font-bold text-slate-800 text-xs uppercase">
                {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
            </div>
          </div>

          {/* Meeting Link */}
          <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 rounded-lg text-red-600">
                <Video size={16}/>
              </div>
              <div>
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Meeting</p>
                <p className="font-bold text-slate-800 text-[10px]">Google Meet</p>
              </div>
            </div>
            
            {interview.meetingLink ? (
              <a 
                href={interview.meetingLink} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-slate-900 text-white px-4 py-2 rounded-lg font-black text-[8px] uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95"
              >
                Join
              </a>
            ) : (
              <span className="text-slate-300 text-[8px] font-black uppercase italic">No Link</span>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <FileText size={10} className="text-slate-400"/>
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Notes</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border-l-2 border-l-red-600">
              <p className="text-[10px] text-slate-600 leading-relaxed font-medium italic">
                {interview.notes ? `"${interview.notes}"` : "No internal remarks."}
              </p>
            </div>
          </div>

        </div>
      </div>

      <p className="text-center mt-6 text-[7px] font-black text-slate-300 uppercase tracking-[0.2em]">
        By naric System
      </p>
    </div>
  );
};

export default InterviewInfo;