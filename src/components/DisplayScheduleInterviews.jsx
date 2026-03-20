import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Clock, User, Briefcase, Users } from 'lucide-react';

const DisplayScheduleInterviews = () => {
  const navigate = useNavigate();
  
  // Expanded Mock Data with Interviewers
  const [interviews] = useState([
    { id: 1, name: "Viraj Sawant", email: "viraj@example.com", panel: "Panel A", interviewer: "Dr. Smith", time: "10:00 AM", date: "2026-03-20", jobId: "JOB101" },
    { id: 2, name: "Manoj Gaikwad", email: "manoj@example.com", panel: "Panel B", interviewer: "Prof. Brown", time: "02:30 PM", date: "2026-03-18", jobId: "JOB102" },
    { id: 3, name: "Sanket Patil", email: "sanket@example.com", panel: "Panel A", interviewer: "Dr. Smith", time: "11:00 AM", date: "2026-03-25", jobId: "JOB101" },
  ]);

  // Filter State - Only Date remains
  const [selectedDate, setSelectedDate] = useState('');

  // Logic for filtering by date and automatic sorting
  const filteredInterviews = useMemo(() => {
    return interviews
      .filter(item => {
        return selectedDate === '' || item.date === selectedDate;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [interviews, selectedDate]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-slate-400 hover:text-red-600 mb-6 font-black text-[9px] uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={12}/> Back to Dashboard
        </button>

        <div className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          {/* Header & Controls */}
          <div className="p-6 border-b border-slate-50 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Scheduled Interviews</h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Manage Candidate Assessments</p>
              </div>
              
              {/* Filter Bar - Panel select removed */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input 
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/10 cursor-pointer"
                  />
                </div>
                {selectedDate && (
                  <button 
                    onClick={() => setSelectedDate('')}
                    className="text-[8px] font-black text-red-500 uppercase tracking-widest hover:underline"
                  >
                    Clear Date
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Candidate Info</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Interviewer</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Schedule</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Job ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInterviews.map((interview) => (
                  <tr key={interview.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                          <User size={14}/>
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase leading-none">{interview.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-1">{interview.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {/* Panel sub-name removed */}
                      <div className="flex items-center gap-1.5 text-slate-700 font-black text-[10px] uppercase">
                        <Users size={12} className="text-red-600"/> {interview.interviewer}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex flex-col items-start gap-1">
                        <div className="flex items-center gap-1 text-slate-700 font-bold text-[10px]">
                          <Calendar size={12} className="text-red-600"/> {interview.date}
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px]">
                          <Clock size={12}/> {interview.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-lg border border-red-100 font-black text-[9px]">
                        <Briefcase size={12}/> {interview.jobId}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredInterviews.length === 0 && (
            <div className="p-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              No results for the selected date
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayScheduleInterviews;