import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Clock, User, Briefcase, Users, CheckCircle, Timer, RefreshCw } from 'lucide-react';
import axios from 'axios'; // Ensure axios is installed

const DisplayScheduleInterviews = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch interviews from backend
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        // Replace with your actual base URL or environment variable
        const token = localStorage.getItem('token'); 
        const response = await axios.get('http://your-api-url.com/admin/interviews/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Assuming the backend response is an array of interview objects
        setInterviews(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching interviews:", err);
        setError("Failed to load interviews. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const handleNavigateToUpdate = (id) => {
    navigate(`/InterviewStatus/${id}`);
  };

  const filteredInterviews = useMemo(() => {
    return interviews
      .filter(item => selectedDate === '' || item.date === selectedDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [interviews, selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8 ml-1">
          <button 
            onClick={() => navigate('/landing')} 
            className="group flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-red-500 transition-all"
          >
            <ArrowLeft size={18} className="text-gray-400 group-hover:text-red-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight uppercase leading-none">Interview List</h2>
            <p className="text-gray-400 text-[10px] mt-1 font-bold uppercase tracking-[0.15em]">Back to Dashboard</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-bold">
            {error}
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_10px_50px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-10 border-b border-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Scheduled Interviews</h2>
              </div>
              
              <div className="flex items-center gap-4">
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 focus:ring-2 focus:ring-red-500/10 outline-none cursor-pointer transition-all"
                />
                {selectedDate && (
                  <button 
                    onClick={() => setSelectedDate('')}
                    className="text-[10px] font-bold text-red-600 uppercase tracking-widest hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Candidate Info</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interviewer</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Schedule</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Job ID</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredInterviews.map((interview) => (
                  <tr key={interview.id} className="hover:bg-gray-50/30 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-gray-200">
                          <User size={16}/>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{interview.name || interview.candidate_name}</p>
                          <p className="text-[11px] font-medium text-gray-400">{interview.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-700 font-bold text-xs">
                        <Users size={14} className="text-red-600"/> {interview.interviewer || interview.interviewer_name}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-700 font-bold text-xs">
                          <Calendar size={14} className="text-red-600"/> {interview.date || interview.scheduled_at?.split('T')[0]}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 font-bold text-[11px]">
                          <Clock size={14}/> {interview.time || new Date(interview.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100 font-bold text-[10px] uppercase tracking-wider">
                        <Briefcase size={12}/> {interview.jobId || interview.job_id}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {interview.status === "Completed" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 font-black text-[9px] uppercase tracking-tighter">
                          <CheckCircle size={12}/> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100 font-black text-[9px] uppercase tracking-tighter">
                          <Timer size={12}/> {interview.status}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => handleNavigateToUpdate(interview.id)}
                        className="group flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-red-500 hover:text-red-600 transition-all shadow-sm active:scale-95"
                      >
                        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Update Status</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {!loading && filteredInterviews.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em]">No scheduled interviews found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayScheduleInterviews;