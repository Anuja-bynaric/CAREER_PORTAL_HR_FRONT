import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Clock, User, Loader2, RefreshCw } from 'lucide-react';
import { api } from '../../../Api/api';
import toast from 'react-hot-toast';

const DisplayScheduleInterviews = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/interviews/');
        setInterviews(response.data.data || []);
      } catch (err) {
        toast.error("Failed to load interviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const filteredInterviews = useMemo(() => {
    return interviews
      .filter(item => {
        if (!selectedDate) return true;
        const interviewDate = new Date(item.scheduledAt).toISOString().split('T')[0];
        return interviewDate === selectedDate;
      })
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  }, [interviews, selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-red-600 mb-2" size={32} />
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Fetching Schedule</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
          {/* Compact Header */}
          <div className="p-5 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/landing')}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:border-red-500 transition-all shadow-sm"
              >
                <ArrowLeft size={14} className="text-gray-400 hover:text-red-600" />
              </button>
              <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">
                Schedule <span className="text-red-600">Interviews</span>
              </h2>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-[10px] font-black text-gray-600 outline-none cursor-pointer"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">Candidate</th>
                  <th className="px-6 py-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">Timing</th>
                  <th className="px-6 py-3 text-[8px] font-black text-gray-400 uppercase tracking-widest text-center">Type</th>
                  <th className="px-6 py-3 text-[8px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-3 text-[8px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredInterviews.length > 0 ? (
                  filteredInterviews.map((interview) => (
                    <tr key={interview.id} className="hover:bg-gray-50/30 transition-all">
                      <td className="px-6 py-4">
                        <div 
                          onClick={() => navigate(`/Interview/${interview.id}`)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white group-hover:bg-red-600 transition-colors">
                            <User size={12} />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-gray-900 group-hover:text-red-600 transition-colors uppercase">
                              App: #{interview.jobApplicationId}
                            </p>
                            <p className="text-[9px] font-bold text-gray-400 tracking-tighter">
                              INT-ID: {interview.interviewerId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-gray-700 font-black text-[10px]">
                            <Calendar size={10} className="text-red-600" />
                            {new Date(interview.scheduledAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[9px]">
                            <Clock size={10} />
                            {new Date(interview.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-md border border-red-100 font-black text-[8px] uppercase tracking-tighter">
                          {interview.interviewType || 'Online'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full border font-black text-[8px] uppercase tracking-tighter ${
                          interview.status === 'scheduled'
                            ? 'bg-amber-50 text-amber-600 border-amber-100'
                            : interview.status === 'cancelled'
                            ? 'bg-red-50 text-red-600 border-red-100'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {interview.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/Interview/edit/${interview.id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:border-red-500 hover:text-red-600 transition-all shadow-sm active:scale-95"
                        >
                          <RefreshCw size={10} />
                          <span className="text-[9px] font-black uppercase tracking-tighter">Update</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      No interviews scheduled for this date
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <p className="text-center mt-6 text-[7px] font-black text-slate-300 uppercase tracking-[0.3em]">
          naric interview management system
        </p>
      </div>
    </div>
  );
};

export default DisplayScheduleInterviews;