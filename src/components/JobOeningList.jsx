import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JobOpeningList = () => {
  const navigate = useNavigate();
  const [jobs] = useState([
    { id: "JOB101", title: "Jr. Software Developer", applicants: 12, status: "Active", postedDate: "2026-03-15" },
    { id: "JOB102", title: "React Developer", applicants: 8, status: "Active", postedDate: "2026-03-18" },
    { id: "JOB103", title: "UI/UX Designer", applicants: 5, status: "Closed", postedDate: "2026-03-10" },
  ]);

  const onViewCandidates = (jobId) => {
    navigate('/DisplayCandidate', { state: { jobId } });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">HR Recruitment Dashboard</h2>
            <p className="text-slate-500 text-xs font-medium italic mt-1">Manage your job openings and applicants efficiently.</p>
          </div>
          <button 
            onClick={() => navigate('/jobOpening')}
            className="bg-[#ff0000] hover:bg-red-700 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-100 active:scale-95"
          >
            + Post New Job
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Job Title</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Posted Date</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Applicants</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-red-50/30 transition-colors group">
                  <td className="px-6 py-6">
                    <span 
                      onClick={() => onViewCandidates(job.id)}
                      className="text-[#ff0000] font-black text-sm cursor-pointer hover:text-red-700 transition-colors uppercase tracking-tight"
                    >
                      {job.title}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-xs text-slate-500 font-bold">{job.postedDate}</td>
                  <td className="px-6 py-6">
                    <span className="bg-red-50 text-[#ff0000] px-4 py-1.5 rounded-lg text-[10px] font-black border border-red-100 uppercase tracking-tighter">
                      {job.applicants} Applied
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`text-[11px] font-black flex items-center gap-2 uppercase ${job.status === 'Active' ? 'text-green-600' : 'text-slate-400'}`}>
                      <span className={`w-2 h-2 rounded-full ${job.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span> 
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 flex gap-3">
                   <button 
  onClick={() => navigate('/editJob', { state: { job } })} 
  className="px-5 py-2 border-2 border-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all"
>
  Edit
</button>
                    <button 
                      onClick={() => onViewCandidates(job.id)}
                      className="px-5 py-2 bg-[#28a745] hover:bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-green-100 active:scale-95"
                    >
                      View Candidates
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Bynaric Career Portal v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default JobOpeningList;